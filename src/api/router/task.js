const express = require("express")
const { checkSchema } = require("express-validator")
const { expressValidationResultHandler } = require("../helper/responseHandler")
const { modelName } = require("../../config/constant")
const { taskModelName } = modelName
const {
  createController: createTask,
  deleteController: deleteTask,
  readByIdController: readTaskById,
} = require("../helper/controllerCRUDoperation")(taskModelName)
const { hasAccessToTask } = require("../middleware/accessControl")
const { createTaskSV, readTaskSV, deleteTaskSV } = require("../validation/task")
const { readTasks } = require("../controller/task")

const taskRouter = express.Router()

taskRouter.get(
  "/",
  checkSchema(readTaskSV),
  expressValidationResultHandler,
  readTasks
)

taskRouter.get("/:id", hasAccessToTask, readTaskById)

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

taskRouter.delete(
  "/",
  hasAccessToTask,
  checkSchema(deleteTaskSV),
  expressValidationResultHandler,
  deleteTask
)

module.exports.taskRouter = taskRouter

// update
// status
// title
// descrition
// deadline
