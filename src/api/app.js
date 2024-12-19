//#region require third party packages
const express = require("express")
const compression = require("compression")
const cors = require("cors")
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

require("dotenv").config()

//#endregion
//#region global app configuration
const projectConfig = require("../config/index")
const { registerRoutes } = require("./router/index")
const { internalServerErrorHandler } = require("./helper/responseHandler")
const { options } = require("./swagger")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression())
app.use(cors(projectConfig.server.httpServer.cors))

//#region swagger config
const specs = swaggerJSDoc(options)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))
//#endregion
registerRoutes(app)
//#endregion

const PORT = projectConfig.server.httpServer.port
app.listen(PORT, async () => {
  try {
    console.log(`server is running on ${PORT}`)
  } catch (error) {
    internalServerErrorHandler(null, error)
  }
})
