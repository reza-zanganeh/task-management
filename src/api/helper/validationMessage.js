module.exports.empty = (fieldName) => `مقدار ${fieldName} ارسال نشده است`
module.exports.invalid = (fieldName) => `مقدار ${fieldName} اشتباه است`
module.exports.limitLegth = (fieldName, min, max) => {
  if (min && max)
    return `تعداد کاراکتر ${fieldName} باید بین ${min} و ${max} باشد`
  if (min) return `تعداد کاراکتر ${fieldName} باید بیشتر از ${min} باشد`
  else return `تعداد کاراکتر ${fieldName} باید کمتر از ${max} باشد`
}
