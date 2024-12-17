const {
  internalServerErrorHandler,
  resposeHandler,
} = require("../helper/responseHandler")
const { modelName } = require("../../config/constant")
const { userModelName } = modelName
const { PrismaClient } = require("@prisma/client")
const { Ok } = require("../helper/HttpResponse")
const { task } = new PrismaClient()

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

    if (deadline) {
      if (deadline.gte) where["deadline"] = { lte: deadline.lte }
      if (deadline.lte) where["deadline"] = { gte: deadline.gte }
    }

    if (sortKey && order) orderBy[`${sortKey}`] = order

    const skip = (page - 1) * limit

    const selectedTasks = await task.findMany({
      where: {
        status,
        deadline: { gte: deadline.gte, lte: deadline.lte },
      },
      orderBy: { deadline: "asc" },
      take: limit,
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
