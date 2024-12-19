const express = require("express")
const { checkSchema } = require("express-validator")
const { expressValidationResultHandler } = require("../helper/responseHandler")
const { modelName } = require("../../config/constant")
const { taskModelName } = modelName
const {
  createController: createTask,
  deleteController: deleteTask,
  readByIdController: readTaskById,
  updateConrtoller: updateTaskById,
} = require("../helper/controllerCRUDoperation")(taskModelName)
const { hasAccessToTask } = require("../middleware/accessControl")
const {
  createTaskSV,
  readTaskSV,
  deleteTaskSV,
  updateTaskSV,
} = require("../validation/task")
const { readTasks } = require("../controller/task")

const taskRouter = express.Router()

taskRouter.post(
  "/",
  checkSchema(createTaskSV),
  expressValidationResultHandler,
  createTask.bind(
    null,
    ["userId", "title", "description", "status", "deadline"],
    true
  )
)

taskRouter.get(
  "/",
  checkSchema(readTaskSV),
  expressValidationResultHandler,
  readTasks
)

taskRouter.get("/:id", hasAccessToTask, readTaskById)

taskRouter.delete(
  "/:id",
  hasAccessToTask,
  checkSchema(deleteTaskSV),
  expressValidationResultHandler,
  deleteTask
)

taskRouter.patch(
  "/:id",
  hasAccessToTask,
  checkSchema(updateTaskSV),
  expressValidationResultHandler,
  updateTaskById.bind(null, ["title", "description", "status", "deadline"])
)

module.exports.taskRouter = taskRouter
