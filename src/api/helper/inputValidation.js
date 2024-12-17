const { empty, invalid, limitLegth } = require("./validationMessage")
const { readOne } = require("../helpers/prisma")

module.exports.email = (location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: empty("ادرس الکترونیک"),
  },
  isEmail: {
    bail: true,
    errorMessage: invalid("ادرس الکترونیک"),
  },
})

module.exports.phonenumber = (location) => ({
  in: ["body"],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: empty("شماره همراه"),
  },
  custom: {
    options: (value) => {
      return /^0[0-9]{10}$/i.test(value)
    },
    errorMessage: invalid("شماره همراه"),
  },
})

// TODO strong password regex
module.exports.password = (location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: empty("رمز عبور"),
  },
  isLength: {
    errorMessage: limitLegth("رمز عبور", 6),
    options: { min: 6 },
  },
})

module.exports.required = (fieldName, location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: empty(fieldName),
    checkNull: true,
  },
})

module.exports.isBoolean = (fieldName, location, notExistsErrormsg = null) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkNull: true,
    },
    errorMessage: notExistsErrormsg ? notExistsErrormsg : empty(fieldName),
    checkNull: true,
  },
  isBoolean: {
    bail: true,
    errorMessage: invalid(fieldName),
    options: {
      strict: true,
    },
  },
})

module.exports.isDecimal = (fieldName, location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkNull: true,
    },
    errorMessage: empty(fieldName),
    checkNull: true,
  },

  isDecimal: {
    bail: true,
    errorMessage: invalid(fieldName),
    options: {
      strict: true,
    },
  },
})

module.exports.fileType = (location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: empty("نوع فایل"),
  },
  custom: {
    options: (value) => {
      return value === "jpeg" || value === "png"
    },
    errorMessage: "فقط از فایل با نوع jpeg | png پشتیبانی می کنیم",
  },
})

module.exports.fileSize = (location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: empty("سایز فایل"),
  },
  custom: {
    options: (value) => {
      return value < 128
    },
    errorMessage: "سایز فایل حداکثر باید 128 کیلوبایت باشد",
  },
})

module.exports.fileName = (location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: empty("نام فایل"),
  },
  custom: {
    options: (value, { req }) => {
      if (
        (req.body.fileType === "jpeg" || req.body.fileType === "png") &&
        value.endsWith("." + req.body.fileType)
      )
        return true
      else return false
    },
    errorMessage: "( jpeg || png ) نام فایل باید بهمراه نوع ان باشد",
  },
})

module.exports.inArray = (fieldName, location, array) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkNull: true,
    },
    errorMessage: empty(fieldName),
    checkNull: true,
  },
  custom: {
    options: (value) => array.includes(value),
    errorMessage: `باشد [ ${array.join(" , ")} ] ${fieldName} باید جزو `,
  },
})

module.exports.between = (fieldName, location, min, max) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkNull: true,
    },
    errorMessage: empty(fieldName),
    checkNull: true,
  },
  custom: {
    options: (value) => value >= min && value <= max,
    errorMessage: `مقدار ${fieldName} باید بین ${min} و ${max} باشد`,
  },
})

module.exports.stringLengthBetween = (fieldName, location, min, max) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkNull: true,
    },
    errorMessage: empty(fieldName),
    checkNull: true,
  },
  custom: {
    options: (value) => value.length >= min && value.length <= max,
    errorMessage: `مقدار ${fieldName} باید بین ${min} و ${max} باشد`,
  },
})

module.exports.checkExistsObjectWithIdInDb = (
  MODELNAME,
  location,
  addDataToBody,
  select = {}
) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkFalsy: true,
      checkNull: true,
    },
    errorMessage: empty(MODELNAME.persian),
  },
  custom: {
    options: async (id, { req }) => {
      const object = await readOne(
        MODELNAME.english,
        { id: +id },
        { id: true, ...select }
      )
      if (!object)
        return Promise.reject(`${MODELNAME.persian} انتخابی شما معتبر نمی باشد`)
      if (addDataToBody) req[MODELNAME.english] = object
    },
  },
})

// TODO
module.exports.isBirthday = (fieldName, location) => ({
  in: [location],
  exists: {
    bail: true,
    options: {
      checkNull: true,
    },
    errorMessage: empty(fieldName),
    checkNull: true,
  },
  custom: {
    options: (date) => {
      if (isNaN(+date)) {
        return false
      }
      const diffYearsInputDateAndNow =
        (new Date().getTime() - date) / 31536000000
      if (diffYearsInputDateAndNow <= 2) return false
      return true
    },
    errorMessage: `timestamp وارد شده برای ${fieldName} معتبر نمی باشد`,
  },
})
