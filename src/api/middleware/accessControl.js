const { internalServerErrorHandler } = require("../helper/responseHandler")
const { modelName } = require("../../config/constant")
const { createError } = require("../helper/Functions")
const { BadRequest } = require("../helper/HttpResponse")
const { readOne } = require("../helper/prisma")
const { taskModelName } = modelName

module.exports.hasAccessToTask = async (req, res, next) => {
  try {
    const { id: userId } = req.user

    const taskId = req.body?.taskId || req.params?.id || req.query?.id

    if (!taskId) return next(createError(BadRequest("تسک مورد نظر یافت نشد")))

    const task = await readOne(taskModelName.english, {
      id: +taskId,
    })

    if (!task) return next(createError(BadRequest("تسک مورد نظر یافت نشد")))

    if (task.authorId !== userId) next(createError(Forbidden()))

    req[taskModelName.english] = task

    next()
  } catch (error) {
    next(createError(Forbidden()))
  }
}