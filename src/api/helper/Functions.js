const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const projectConfig = require("../../config/index")

module.exports.createRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports.createError = ({ statusCode, message }) => {
  const error = new Error()
  error.statusCode = statusCode
  error.message = message
  return error
}

module.exports.createOtpCodeToken = (phonenumber) => {
  const token = jwt.sign({ phonenumber }, projectConfig.otpCode.tokenKey, {
    expiresIn: `${projectConfig.authentication.otpCodeExpiresTimeInMinutes}m`,
  })
  return token
}

module.exports.createAuthenticationToken = ({
  userId,
  role,
  fullname,
  phonenumber,
}) => {
  const token = jwt.sign(
    { id: userId, role, fullname, phonenumber },
    projectConfig.authentication.tokenKey,
    {
      expiresIn: `${projectConfig.authentication.authenticationTokenExpiresTimeInMinute}m`,
    }
  )
  return token
}

module.exports.convertSecondToMinAndScond = (time) => {
  const minute = Math.floor(time / 60)
  const second = time - minute * 60
  return {
    minute,
    second,
  }
}

module.exports.sumOfArrayElements = (numbers) => {
  return numbers.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  )
}

module.exports.hashUserPassword = async (password) => {
  try {
    const hashedPass = await bcrypt.hash(password, 10)
    return hashedPass
  } catch (error) {
    throw error
  }
}

module.exports.compareUserPassword = async (passOne, passTwo) => {
  try {
    const resultOfcomparePassword = await bcrypt.compare(passOne, passTwo)
    return resultOfcomparePassword
  } catch (error) {
    throw error
  }
}

module.exports.isValidDate = (dateString) => {
  const isoFormatRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}\.\d{3}Z)?$/
  if (!isoFormatRegex.test(dateString)) {
    return false // اگر فرمت معتبر نیست
  }

  // بررسی معتبر بودن تاریخ با Date
  const date = new Date(dateString)
  // اگر تاریخ نامعتبر باشد (مثلاً 2024-02-30)
  if (isNaN(date.getTime())) {
    return false
  }

  // بررسی سازگاری فرمت کامل برای جلوگیری از تغییرات غیرمنتظره
  if (dateString.includes("T")) {
    return date.toISOString() === dateString // اگر فرمت زمان دارد، باید دقیقاً مطابق باشد
  } else {
    // اگر فقط تاریخ است، بررسی کنیم که تاریخ معتبر باشد و با فرمت YYYY-MM-DD سازگار باشد
    const [year, month, day] = dateString.split("-").map(Number)
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    )
  }
}
