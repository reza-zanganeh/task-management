const { createError } = require("./Functions")
const {
  resposeHandler,
  internalServerErrorHandler,
} = require("./responseHandler")
const { Created, BadRequest, Ok } = require("./HttpResponse")

const { create, update, remove, readOne } = require("./prisma")

const createController = async (
  MODELNAME,
  dataSchema,
  strNumberToIntNumber,
  req,
  res,
  next
) => {
  try {
    const data = {}
    dataSchema.forEach((item) => {
      if (!req.body[item]) return
      if (strNumberToIntNumber && isFinite(req.body[item]))
        data[item] = +req.body[item]
      else if (typeof req.body[item] === "string")
        data[item] = req.body[item].trim()
      else data[item] = req.body[item]
    })
    const newRecord = await create(MODELNAME.english, data)
    resposeHandler(res, newRecord, Created(MODELNAME.persian))
  } catch (error) {
    if (error.code === "P2002") {
      return next(
        createError(
          BadRequest(`مقدار ${error.meta.target[0]} نمی تواند تکراری باشد`)
        )
      )
    }
    internalServerErrorHandler(next, error)
  }
}

const updateConrtoller = async (MODELNAME, dataSchema, req, res, next) => {
  try {
    const { id } = req.params
    const reqBody = req.body
    const data = {}
    for (const [key, value] of Object.entries(reqBody)) {
      if (dataSchema.includes(key)) data[key] = value
    }
    const updatedRecord = await update(MODELNAME.english, { id: +id }, data)
    resposeHandler(
      res,
      updatedRecord,
      Created(`بروزرسانی ${MODELNAME.persian}`)
    )
  } catch (error) {
    if (error.code === "P2025")
      next(
        createError(BadRequest(`${MODELNAME.persian} با این شناسه وجود ندارد`))
      )
    else internalServerErrorHandler(next, error)
  }
}

const deleteController = async (MODELNAME, req, res, next) => {
  try {
    const { id } = req.params
    const deletedRecord = await remove(MODELNAME.english, { id: +id })
    resposeHandler(
      res,
      deletedRecord,
      Ok({ operationName: `حذف ${MODELNAME.persian}` })
    )
  } catch (error) {
    if (error.code === "P2025")
      return next(
        createError(BadRequest(`${MODELNAME.persian} با این شناسه وجود ندارد`))
      )
    if (error.code === "P2003")
      return next(
        createError(BadRequest(`${MODELNAME.persian} درحال استفاده است`))
      )
    else internalServerErrorHandler(next, error)
  }
}

const readByIdController = async (MODELNAME, req, res, next) => {
  try {
    const id = +req.params.id
    const record = Number.isInteger(id)
      ? await readOne(MODELNAME.english, { id: +id })
      : null
    if (!record)
      return resposeHandler(
        res,
        record,
        Ok({
          message: `${MODELNAME.persian} مورد نظر با آیدی ارسال شده یافت نشد`,
        })
      )

    resposeHandler(
      res,
      record,
      Ok({ operationName: `خواندن ${MODELNAME.persian}` })
    )
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}

module.exports = (MODELNAME) => ({
  createController: createController.bind(null, MODELNAME),
  updateConrtoller: updateConrtoller.bind(null, MODELNAME),
  deleteController: deleteController.bind(null, MODELNAME),
  readByIdController: readByIdController.bind(null, MODELNAME),
})
