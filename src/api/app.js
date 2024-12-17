//#region require third party packages
const express = require("express")
const compression = require("compression")
const cors = require("cors")
require("dotenv").config()
//#endregion
//#region global app configuration
const projectConfig = require("../config/index")
const { registerRoutes } = require("./router/index")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(cors(projectConfig.server.httpServer.cors))

registerRoutes(app)
//#endregion

const { internalServerErrorHandler } = require("./helper/responseHandler")

const PORT = projectConfig.server.httpServer.port
app.listen(PORT, async () => {
  try {
    console.log(`server is running on ${PORT}`)
  } catch (error) {
    internalServerErrorHandler(null, error)
  }
})
