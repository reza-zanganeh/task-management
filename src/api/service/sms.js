const axios = require("axios")
const projectConfig = require("../../config/index")
const { farazSMS } = projectConfig

module.exports.sendOtpCode = async (phonenumber, code) => {
  try {
    const response = await axios.post(farazSMS.sendSMSWithPaternURL, {
      op: "pattern",
      user: farazSMS.user,
      pass: farazSMS.password,
      fromNum: farazSMS.fromNumber,
      toNum: phonenumber,
      patternCode: "cw9fgxa69yrmey2",
      inputData: [{ "otp-code": code }],
    })
    if (Number.isFinite(response.data)) return true
    else return false
  } catch (error) {
    throw error
  }
}

module.exports.sendNewRandomPassword = async (
  phonenumber,
  NewRandomPassword
) => {
  try {
    const response = await axios.post(farazSMS.sendSMSWithPaternURL, {
      op: "pattern",
      user: farazSMS.user,
      pass: farazSMS.password,
      fromNum: farazSMS.fromNumber,
      toNum: phonenumber,
      patternCode: "x1xydjhlkifvecr",
      inputData: [{ password: NewRandomPassword }],
    })

    if (Number.isFinite(response.data)) return true
    else return false
  } catch (error) {
    throw error
  }
}
