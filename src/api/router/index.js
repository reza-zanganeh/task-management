const path = require("path")
const { errorHandler, notFoundResponse } = require("../helper/responseHandler")
//#region import routers
//#endregion
module.exports.registerRoutes = (app) => {
  //#region add routes
  //#endregion
  app.use("*", notFoundResponse)
  app.use(errorHandler)
}
