const { internalServerErrorHandler } = require("../helper/responseHandler")
const { modelName } = require("../../config/constant")
const { createError } = require("../helper/Functions")
const { BadRequest, Forbidden } = require("../helper/HttpResponse")
const { readOne } = require("../helper/prisma")
const { taskModelName, userModelName } = modelName

module.exports.hasAccessToTask = async (req, res, next) => {
  try {
    const { id: userId } = req[userModelName.english]

    const taskId = req.body?.taskId || req.params?.id || req.query?.id

    if (!taskId) return next(createError(BadRequest("تسک مورد نظر یافت نشد")))

    const task = await readOne(taskModelName.english, {
      id: +taskId,
    })

    if (!task) return next(createError(BadRequest("تسک مورد نظر یافت نشد")))

    if (task.userId !== userId) next(createError(Forbidden()))

    req[taskModelName.english] = task

    next()
  } catch (error) {
    next(createError(Forbidden()))
  }
}
