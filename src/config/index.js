const envMode =
  process.env.NODE_ENV || process.env.mode || process.env.MODE || "dev"
const projectConfig = require(`./${envMode}.js`)
const commonConfig = require("./common.js")

module.exports = {
  ...projectConfig,
  ...commonConfig,
  envMode,
}
