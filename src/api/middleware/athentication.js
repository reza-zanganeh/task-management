const jwt = require("jsonwebtoken")
const projectConfig = require("../../config/index")
const { Unauthorized } = require("../helpers/HttpResponse")
const { createError } = require("../helpers/Functions")

module.exports.isAuthenticate = async (req, res, next) => {
  const token = req.headers?.accesstoken
  try {
    const user = jwt.verify(token, projectConfig.authentication.tokenKey)
    req.user = user
    req.body.userId = user.id
    next()
  } catch (error) {
    next(createError(Unauthorized()))
  }
}
