const { phonenumber, required, password } = require("../helper/inputValidation")

module.exports.phonenumberInBodySV = {
  phonenumber: phonenumber("body"),
}

module.exports.registerSV = {
  fullname: required("نام و نام خانوادگی", "body"),
  password: password("body"),
}

module.exports.loginSV = {
  password: required("body"),
}

module.exports.changePasswordSV = {
  newPassword: password("body"),
}
