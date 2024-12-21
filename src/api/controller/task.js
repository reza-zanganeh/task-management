const {
  internalServerErrorHandler,
  resposeHandler,
} = require("../helper/responseHandler")
const { modelName } = require("../../config/constant")
const { userModelName, taskModelName } = modelName
const { Ok } = require("../helper/HttpResponse")
const { readAll } = require("../helper/prisma")

module.exports.readTasks = async (req, res, next) => {
  try {
    const { id: userId } = req[userModelName.english]

    const {
      status,
      deadline,
      sortKey = "created_at",
      order = "asc",
      page = 1,
      limit = 10,
    } = req.query

    const where = { userId: +userId }
    const orderBy = {}

    if (status) where["status"] = status

    if (deadline?.gte && deadline?.lte)
      where["deadline"] = {
        gte: new Date(deadline.gte),
        lte: new Date(deadline.lte),
      }
    else if (deadline?.gte) where["deadline"] = { gte: new Date(deadline.gte) }
    else if (deadline?.lte) where["deadline"] = { lte: new Date(deadline.lte) }

    if (sortKey && order) orderBy[`${sortKey}`] = order

    const skip = (page - 1) * limit

    const selectedTasks = await readAll(taskModelName.english, {
      where,
      orderBy,
      take: +limit,
      skip,
    })

    resposeHandler(
      res,
      selectedTasks,
      Ok({ operationName: "خواندن اطلاعات تسک ها" })
    )
  } catch (error) {
    internalServerErrorHandler(next, error)
  }
}
