const path = require("path")
const { errorHandler, notFoundResponse } = require("../helper/responseHandler")
const { userRouter } = require("./user")
//#region import routers
//#endregion
module.exports.registerRoutes = (app) => {
  //#region add routes
  app.use("/api/user", userRouter)
  //#endregion
  app.use("*", notFoundResponse)
  app.use(errorHandler)
}
