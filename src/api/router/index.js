const path = require("path")
const { errorHandler, notFoundResponse } = require("../helper/responseHandler")
const { isAuthenticate } = require("../middleware/athentication")
//#region import routers
const { userRouter } = require("./user")
const { taskRouter } = require("./task")
//#endregion
module.exports.registerRoutes = (app) => {
  //#region add routes
  app.use("/api/user", userRouter)
  app.use("/api/task", isAuthenticate, taskRouter)
  //#endregion
  app.use("*", notFoundResponse)
  app.use(errorHandler)
}
