const crypto = require("crypto")
const projectConfig = require("../../config/index")
const { modelName } = require("../../config/constant")
const { readOne, create, update } = require("../helper/prisma")
const {
  internalServerErrorHandler,
  resposeHandler,
} = require("../helper/responseHandler")
const { userModelName } = modelName
const {
  getOtpCodeFromRedis,
  getOtpCodeTtlFromRedis,
  setOtpCodeOnRedis,
  deleteOtpCodeFromRedis,
  getForgetPasswordRequestTtlFromRedis,
  setForgetPasswordRequestOnRedis,
  getRequestToLoginTtlFromRedis,
  setRequestToLoginOnRedis,
  setInvalidPasswordCountOnRedis,
  getInvalidPasswordCountFromRedis,
  getInvalidPasswordCountTtlFromRedis,
} = require("../service/redis")
const {
  convertSecondToMinAndScond,
  createError,
  createOtpCodeToken,
  createRandomNumber,
  hashUserPassword,
  createAuthenticationToken,
  compareUserPassword,
} = require("../helper/Functions")
const { BadRequest, Ok, Created } = require("../helper/HttpResponse")
const { sendOtpCode, sendNewRandomPassword } = require("../service/sms")

module.exports.requestToLoginOrRegister = async (req, res, next) => {
  try {
    const { phonenumber } = req.body

    const user = await readOne(userModelName.english, { phonenumber })

    let otpToken

    if (user) {
      // request to login
      const requestToLoginRemainingTime = await getRequestToLoginTtlFromRedis(
        phonenumber
      )

      const userHasActiveRequstToLogin = requestToLoginRemainingTime !== -2

      if (userHasActiveRequstToLogin) {
        const { minute, second } = convertSecondToMinAndScond(
          requestToLoginRemainingTime
        )
        return next(
          createError(
            BadRequest(
              `شما درخواست ورود فعال دارید لطفا ${minute} دقیقه و ${second} ثانیه صبر کنید`
            )
          )
        )
      }

      await setRequestToLoginOnRedis(phonenumber)

      otpToken = createOtpCodeToken(phonenumber)
    } else {
      const requestToRegisterRemainingTime = await getOtpCodeTtlFromRedis(
        phonenumber
      )
      const userHasActiveRequestToRegister =
        requestToRegisterRemainingTime !== -2
      if (userHasActiveRequestToRegister) {
        const { minute, second } = convertSecondToMinAndScond(
          requestToRegisterRemainingTime
        )
        return next(
          createError(
            BadRequest(
              `شما درخواست رمز اعتبار سنجی فعال دارید لطفا ${minute} دقیقه و ${second} ثانیه صبر کنید`
            )
          )
        )
      }

      const randomNumber = createRandomNumber(
        projectConfig.otpCode.minimum,
        projectConfig.otpCode.maximum
      )

      let resultOfSendOtpCodeWithSms = true

      resultOfSendOtpCodeWithSms = await sendOtpCode(phonenumber, randomNumber)

      if (!resultOfSendOtpCodeWithSms) {
        return next(
          createError(BadRequest("شماره تلفن ارسال شده معتبر نمی باشد"))
        )
      }
      await setOtpCodeOnRedis(phonenumber, randomNumber)
      otpToken = createOtpCodeToken(phonenumber)
    }

    resposeHandler(
      res,
      {
        otpToken,
        expiresTimeInMinutes:
          projectConfig.authentication.otpCodeExpiresTimeInMinutes,
        ...(user && { fullname: user.fullname }),
      },
      Ok({
        message: user
          ? "درخواست ورود با موفقیت انجام شد"
          : "کد اعتبار سنجی با موفقیت به تلفن همراه شما ارسال شد",
      })
    )
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}

module.exports.register = async (req, res, next) => {
  try {
    const { fullname, password, otpCode } = req.body
    const { phonenumber } = req.otpData

    const isUserExists = await readOne(userModelName.english, { phonenumber })

    if (isUserExists)
      return next(
        createError(
          BadRequest(
            "این اطلاعات قبلا ثبت شده است لطفا در صورتی که رمز عبور خود را فراموش کرده اید از قسمت فراموشی رمز عبور ان را بازیابی کنید"
          )
        )
      )

    const code = await getOtpCodeFromRedis(phonenumber)

    if (!code)
      return next(
        createError(BadRequest("مدت اعتبار کد اعتبار سنجی به پایان رسیده است"))
      )

    if (otpCode != code)
      return next(createError(BadRequest("کد اعتبار سنجی صحیح نمی باشد")))

    const hashedPass = await hashUserPassword(password)

    const createdUser = await create(userModelName.english, {
      phonenumber,
      fullname,
      password: hashedPass,
    })

    const accesstoken = createAuthenticationToken({
      userId: createdUser.id,
      fullname,
      phonenumber,
    })

    deleteOtpCodeFromRedis(phonenumber)
    resposeHandler(
      res,
      {
        accesstoken,
        expiresTime:
          projectConfig.authentication
            .authenticationTokenExpiresTimeInMilisecond,
        fullname,
      },
      Created("کاربر")
    )
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}

module.exports.login = async (req, res, next) => {
  try {
    const { password: inputPassword } = req.body
    const { phonenumber } = req.otpData
    const user = await readOne(userModelName.english, {
      phonenumber,
    })

    if (!user) return next(createError(BadRequest("حساب کاربری شما یافت نشد")))

    const enterInvalidPasswordCount =
      +(await getInvalidPasswordCountFromRedis(phonenumber)) || 0

    if (
      enterInvalidPasswordCount >
      projectConfig.invalidPasswordOrCode
        .numberOfOpportunitiesToEnterTheWrongPasswordOrCode
    ) {
      const { minute, second } = convertSecondToMinAndScond(
        await getInvalidPasswordCountTtlFromRedis(phonenumber)
      )
      return next(
        createError(
          BadRequest(
            `حساب کاربری شما مسدود است لطفا ${minute} دقیقه و ${second} ثانیه صبر کنید`
          )
        )
      )
    }

    const password = user.password

    const resultOfcomparePassword = await compareUserPassword(
      inputPassword,
      password
    )

    if (!resultOfcomparePassword) {
      await setInvalidPasswordCountOnRedis(
        phonenumber,
        enterInvalidPasswordCount + 1
      )
      return next(
        createError(
          BadRequest(
            enterInvalidPasswordCount ===
              projectConfig.invalidPasswordOrCode
                .numberOfOpportunitiesToEnterTheWrongPasswordOrCode
              ? "کاربر گرامی حساب شما مسدود گردید"
              : `کاربرگرامی درصورت وارد کردن ${
                  projectConfig.invalidPasswordOrCode
                    .numberOfOpportunitiesToEnterTheWrongPasswordOrCode -
                  enterInvalidPasswordCount
                } رمز اشتباه دیگر حساب شما به مدت ${
                  projectConfig.invalidPasswordOrCode.expiresTimeInMinutes
                } دقیقه مسدود خواهد شد لطفا دقت کنید`
          )
        )
      )
    }
    // if true create and send token
    const accesstoken = createAuthenticationToken({
      userId: user.id,
      fullname: user.fullname,
      phonenumber,
    })
    // 7. send token in response
    resposeHandler(
      res,
      {
        accesstoken,
        expiresTime:
          projectConfig.authentication
            .authenticationTokenExpiresTimeInMilisecond,
        fullname: user.fullname,
      },
      Ok({ operationName: "ورود" })
    )
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}

module.exports.forgetPassword = async (req, res, next) => {
  try {
    const { phonenumber } = req.otpData
    // Checking if there is a user with this phone number or not
    const user = await readOne(userModelName.english, { phonenumber })
    if (!user)
      return next(
        createError(BadRequest("کاربری با این شماره تلفن ثبت نام نکرده است"))
      )

    const userId = user.id

    const requestRemainTime = await getForgetPasswordRequestTtlFromRedis(
      phonenumber
    )

    const forgetPasswordRequestIsActiveForUser = requestRemainTime !== -2

    if (forgetPasswordRequestIsActiveForUser) {
      const { minute, second } = convertSecondToMinAndScond(requestRemainTime)
      return next(
        createError(
          BadRequest(
            `شما درخواست بازیابی رمز عبور فعال دارید لطفا ${minute} دقیقه و ${second} ثانیه صبر کنید`
          )
        )
      )
    }

    const saveForgetPsswordReqOnRedisResult =
      await setForgetPasswordRequestOnRedis(phonenumber)
    if (!saveForgetPsswordReqOnRedisResult)
      return next(createError(InternalServerError()))

    const randomNewPassword = crypto.randomBytes(6).toString("hex").slice(0, 6)

    const hashedPass = await hashUserPassword(randomNewPassword)

    await update(
      userModelName.english,
      { id: userId },
      { password: hashedPass }
    )

    let resultOfSendRandomNewPasswordWithSms = true

    resultOfSendRandomNewPasswordWithSms = await sendNewRandomPassword(
      phonenumber,
      randomNewPassword
    )

    if (!resultOfSendRandomNewPasswordWithSms) {
      return next(createError(BadRequest("لطفا دقایقی دیگر مجددا تلاش کنید")))
    }

    resposeHandler(
      res,
      {},
      Ok({
        message:
          "رمز عبور جدید برای شما ارسال شد لطفا بعد از ورود برای تغییر رمز عبور از قسمت تنظیمات حساب کاربری اقدام کنید",
      })
    )
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}

module.exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { newPassword } = req.body

    const newHashedPassword = await hashUserPassword(newPassword)

    await update(
      userModelName.english,
      { id: userId },
      { password: newHashedPassword }
    )

    resposeHandler(
      res,
      {},
      Ok({ operationName: "رمز عبور شما با موفقیت تغییر کرد" })
    )
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}
