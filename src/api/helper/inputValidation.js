const { empty, invalid, limitLegth } = require("./validationMessage")
const { readOne } = require("../helper/prisma")
const { isValidDate } = require("./Functions")

module.exports.phonenumber = (location) => ({
  in: [location],
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

module.exports.isString = (fieldName, location, checkIsExists = true) => ({
  in: [location],
  ...(checkIsExists && {
    exists: {
      bail: true,
      options: {
        checkNull: true,
      },
      errorMessage: empty(fieldName),
      checkNull: true,
    },
  }),
  custom: {
    options: (value) => typeof value === "string" || (!checkIsExists && !value),
    errorMessage: invalid(fieldName),
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

module.exports.inArray = (
  fieldName,
  location,
  array,
  checkIsExists = true
) => ({
  in: [location],
  ...(checkIsExists && {
    exists: {
      bail: true,
      options: {
        checkNull: true,
      },
      errorMessage: empty(fieldName),
      checkNull: true,
    },
  }),
  custom: {
    options: (value) => array.includes(value) || (!checkIsExists && !value),
    errorMessage: `باشد [ ${array.join(" , ")} ] ${fieldName} باید جزو `,
  },
})

module.exports.between = (
  fieldName,
  location,
  min,
  max,
  checkIsExists = true
) => ({
  in: [location],
  ...(checkIsExists && {
    exists: {
      bail: true,
      options: {
        checkNull: true,
      },
      errorMessage: empty(fieldName),
      checkNull: true,
    },
  }),
  custom: {
    options: (value) =>
      (value >= min && value <= max) || (!checkIsExists && !value),
    errorMessage: `مقدار ${fieldName} باید بین ${min} و ${max} باشد`,
  },
})

module.exports.isGreateThan = (
  fieldName,
  location,
  min,
  checkIsExists = true
) => ({
  in: [location],
  ...(checkIsExists && {
    exists: {
      bail: true,
      options: {
        checkNull: true,
      },
      errorMessage: empty(fieldName),
      checkNull: true,
    },
  }),
  custom: {
    options: (value) => value >= min || (!checkIsExists && !value),
    errorMessage: `مقدار ${fieldName} باید بزرگتر از ${min} باشد`,
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

module.exports.isForwardDate = (fieldName, location, checkIsExists = true) => ({
  in: [location],
  ...(checkIsExists && {
    exists: {
      bail: true,
      options: {
        checkNull: true,
      },
      errorMessage: empty(fieldName),
      checkNull: true,
    },
  }),
  custom: {
    options: (date) => {
      if (!checkIsExists && !date) return true
      if (!isValidDate(date))
        return Promise.reject(" تاریخ وارد شده معتبر نمی باشد")
      const now = new Date()
      if (new Date(date) <= now)
        return Promise.reject("تاریخ وارد شده برای گذشته می باشد")
      return true
    },
  },
})

module.exports.isDate = (fieldName, location, checkIsExists = true) => ({
  in: [location],
  ...(!checkIsExists && {
    optional: {
      options: { nullable: true, checkFalsy: true },
    },
  }),
  custom: {
    options: (date) => {
      if (!isValidDate(date))
        return Promise.reject(" تاریخ وارد شده معتبر نمی باشد")
      return true
    },
  },
})
