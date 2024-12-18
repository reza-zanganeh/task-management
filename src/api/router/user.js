const express = require("express")
const { checkSchema } = require("express-validator")
const { expressValidationResultHandler } = require("../helper/responseHandler")

const {
  requestToLoginOrRegister,
  login,
  register,
  forgetPassword,
  changePassword,
} = require("../controller/user")

const {
  changePasswordSV,
  loginSV,
  phonenumberInBodySV,
  registerSV,
} = require("../validation/user")

const { isValidVerifyOtpToken } = require("../middleware/isValidVerifyOtpToken")
const { isAuthenticate } = require("../middleware/athentication")

const userRouter = express.Router()

userRouter.post(
  "/login_or_register",
  checkSchema(phonenumberInBodySV),
  expressValidationResultHandler,
  requestToLoginOrRegister
)

userRouter.post(
  "/register",
  isValidVerifyOtpToken,
  checkSchema(registerSV),
  expressValidationResultHandler,
  register
)

userRouter.post(
  "/login",
  isValidVerifyOtpToken,
  checkSchema(loginSV),
  expressValidationResultHandler,
  login
)

userRouter.post("/forget-password", isValidVerifyOtpToken, forgetPassword)

userRouter.patch(
  "/change-password",
  isAuthenticate,
  checkSchema(changePasswordSV),
  changePassword
)

module.exports.userRouter = userRouter
