const redis = require("redis")
const projectConfig = require("../../config/index")
let client

if (process.env.NODE_ENV == "production") {
  client = redis.createClient({
    url: process.env.REDIS_URL,
  })
} else {
  client = redis.createClient(process.env.REDIS_HOST, process.env.REDIS_PORT)
}

client.on("error", (err) => {
  console.log(
    "Please check that the Redis server is running\n",
    "redis error :>> \n",
    err
  )
  process.exit()
})

client.connect()

const OTPCODEKEY = "OTPCODE"
const REQUESTTOLOGIN = "REQUESTTOLOGIN"
const FORGETPASSWORD = "FORGETPASSWORD"
const INVALIDPASSWORD = "INVALIPASSWORD"

const setOnRedis = async (key, value, expiresIn) => {
  return await client.set(key, value, expiresIn ? { EX: expiresIn * 60 } : {})
}

const getFromRedis = async (key) => {
  return await client.get(key)
}

const deleteFromRedis = async (key) => {
  return await client.del(key)
}

const getTtlFromRedis = async (key) => {
  return await client.ttl(key)
}

module.exports.setRequestToLoginOnRedis = async (phonenumber) => {
  return await setOnRedis(
    `${REQUESTTOLOGIN}_${phonenumber}`,
    "",
    projectConfig.authentication.otpCodeExpiresTimeInMinutes
  )
}

module.exports.getRequestToLoginTtlFromRedis = async (phonenumber) => {
  return await getTtlFromRedis(`${REQUESTTOLOGIN}_${phonenumber}`)
}

module.exports.setOtpCodeOnRedis = async (phonenumber, code) => {
  return await setOnRedis(
    `${OTPCODEKEY}_${phonenumber}`,
    code,
    projectConfig.authentication.otpCodeExpiresTimeInMinutes
  )
}

module.exports.getOtpCodeFromRedis = async (phonenumber) => {
  return await getFromRedis(`${OTPCODEKEY}_${phonenumber}`)
}

module.exports.deleteOtpCodeFromRedis = async (phonenumber) => {
  return await deleteFromRedis(`${OTPCODEKEY}_${phonenumber}`)
}

module.exports.getOtpCodeTtlFromRedis = async (phonenumber) => {
  return await getTtlFromRedis(`${OTPCODEKEY}_${phonenumber}`)
}

module.exports.setInvalidPasswordCountOnRedis = async (
  phonenumber,
  invalidCount
) => {
  return await setOnRedis(
    `${INVALIDPASSWORD}_${phonenumber}`,
    invalidCount,
    projectConfig.invalidPasswordOrCode.expiresTimeInMinutes
  )
}

module.exports.getInvalidPasswordCountFromRedis = async (phonenumber) => {
  return await getFromRedis(`${INVALIDPASSWORD}_${phonenumber}`)
}

module.exports.getInvalidPasswordCountTtlFromRedis = async (phonenumber) => {
  return await getTtlFromRedis(`${INVALIDPASSWORD}_${phonenumber}`)
}

module.exports.setForgetPasswordRequestOnRedis = async (phonenumber) => {
  return await setOnRedis(
    `${FORGETPASSWORD}_${phonenumber}`,
    "",
    projectConfig.authentication.otpCodeExpiresTimeInMinutes
  )
}

module.exports.getForgetPasswordRequestTtlFromRedis = async (phonenumber) => {
  return await getTtlFromRedis(`${FORGETPASSWORD}_${phonenumber}`)
}
