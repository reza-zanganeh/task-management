const { appendFile } = require("fs")
const { join } = require("path")
const persianDate = require("persian-date").toLocale("fa")
const projectConfig = require("../../config/index")
const { validationResult } = require("express-validator")
const {
  InternalServerError,
  Ok,
  NotFound,
  BadRequest,
} = require("./HttpResponse")
const { createError } = require("./Functions")
module.exports.errorHandler = (err, req, res, next) => {
  const { statusCode, message } = err
  res.status(statusCode || 500).json({ message })
}

module.exports.internalServerErrorHandler = (next, error) => {
  const date = new persianDate().format()
  appendFile(
    join(__dirname, "..", "log", "internalServerError.log"),
    `\n ================== ${date} ================== \n` + error.message ||
      JSON.stringify(error),
    (error) => {
      if (error) console.log(error)
    }
  )
  if (next) next(createError(InternalServerError()))
}

module.exports.resposeHandler = (res, data, { statusCode, message }) => {
  const { message: okMessage, statusCode: okStatusCode } = Ok({
    operationName: "عملیات مورد نظر",
  })
  res.status(statusCode || okStatusCode).json({
    data: data || {},
    message: message || okMessage,
    displayMessage: message ? true : false,
  })
}

module.exports.notFoundResponse = (req, res, next) => {
  const { message: notFoundMessage, statusCode: notFoundStatusCode } =
    NotFound()
  this.resposeHandler(
    res,
    {},
    { statusCode: notFoundStatusCode, message: notFoundMessage }
  )
}

module.exports.expressValidationResultHandler = (req, res, next) => {
  const { statusCode: badRequestStatusCode } = BadRequest()
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(badRequestStatusCode).json({ errors: errors.array() })
  }
  next()
}
