const jwt = require("jsonwebtoken")
const { createError } = require("../helpers/Functions")
const { BadRequest } = require("../helpers/HttpResponse")
const projectConfig = require("../../config/index")
module.exports.checkCaptcha = (req, res, next) => {
  try {
    const { captchaText, captchaToken } = req.body
    if (!captchaText)
      return next(createError(BadRequest("لطفا کد کپچا را ارسال کنید")))

    if (!captchaToken)
      return next(createError(BadRequest("لطفا توکن کپچا را ارسال کنید")))

    const { text: textInToken } = jwt.verify(
      captchaToken,
      projectConfig.captcha.tokenKey
    )

    if (captchaText.toLowerCase() !== textInToken.toLowerCase())
      return next(createError(BadRequest("لطفا کد کپچا را به درستی وارد کنید")))

    next()
  } catch (error) {
    next(
      createError(
        BadRequest(
          "کد کپچا به درستی وارد نشده است یا اعتبار ان به پایان رسیده است"
        )
      )
    )
  }
}
