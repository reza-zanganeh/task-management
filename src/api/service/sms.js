const projectConfig = require("../../config/index")
const { envMode } = projectConfig
const { getPersianNumber } = require("../helpers/Functions")
const axios = require("axios")

// fromNum: "10007557338294",
// +983000505
module.exports.sendOtpCode = async (phonenumber, code) => {
  try {
    const response = await axios.post("http://ippanel.com/api/select", {
      op: "pattern",
      user: "u09391825987",
      pass: "Faraz@1819970925667412",
      fromNum: "3000505",
      toNum: phonenumber,
      patternCode: "cw9fgxa69yrmey2",
      inputData: [{ "otp-code": code }],
    })
    console.log(response.data)
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
    const response = await axios.post("http://ippanel.com/api/select", {
      op: "pattern",
      user: "u09391825987",
      pass: "Faraz@1819970925667412",
      fromNum: "10007557338294",
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

// // use pattern
// module.exports.sendPriceToPayAndAccountNumber = async ({
//   phonenumber,
//   price,
//   owner,
//   accountNumber,
// }) => {
//   try {
//     console.log(envMode)
//     const response = await axios.post("http://ippanel.com/api/select", {
//       op: "pattern",
//       user: "u09391825987",
//       pass: "Faraz@1819970925667412",
//       fromNum: "10007557338294",
//       toNum: phonenumber,
//       patternCode: "69mrdk0y9iy8zy7",
//       inputData: [
//         {
//           price,
//           owner,
//           "account-number": accountNumber,
//           "supporter-phonenumber": `${getPersianNumber(9152426605)}`,
//         },
//       ],
//     })
//     console.log(response)
//     if (Number.isFinite(response.data)) return true
//     else return false
//   } catch (error) {
//     throw error
//   }
// }
