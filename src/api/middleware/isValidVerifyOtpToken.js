const jwt = require("jsonwebtoken")
const projectConfig = require("../../config/index")
const { createError } = require("../helper/Functions")
const { BadRequest } = require("../helper/HttpResponse")
module.exports.isValidVerifyOtpToken = async (req, res, next) => {
  try {
    const token = req.headers?.otptoken
    req.otpData = jwt.verify(token, projectConfig.otpCode.tokenKey)
    next()
  } catch (error) {
    return next(
      createError(
        BadRequest(
          "توکن اعتبار سنجی صحیح نمی باشد ( لطفا درخواست کد اعتبار سنجی بدهید )"
        )
      )
    )
  }
}
