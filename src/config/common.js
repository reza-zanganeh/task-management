const authentication = {
  tokenKey: "b0a74aa9ef623381e32f9a4579655ad8458f2124b25d704b3ab7aaba96dd8aca",
  salt: "f8eae0e5536f33650bc5",
  authenticationTokenExpiresTimeInMinute: 1440,
  authenticationTokenExpiresTimeInMilisecond: 86400000,
  otpCodeExpiresTimeInMinutes: 4,
}

const captcha = {
  length: 6,
  tokenKey: "a04beb0937024a0428c8956ed6f77a64040687ee1f6998604d9d27cef962319e",
}

const otpCode = {
  minimum: 10000,
  maximum: 100000,
  tokenKey: "f4ef94e8d97efd031f49470971b5d01aad4946c4ea5fdd5713c396f977293248",
}

const invalidPasswordOrCode = {
  numberOfOpportunitiesToEnterTheWrongPasswordOrCode: 5,
  expiresTimeInMinutes: 5,
}

module.exports = {
  authentication,
  captcha,
  otpCode,
  invalidPasswordOrCode,
}
