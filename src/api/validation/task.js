const {
  required,
  inArray,
  isDate,
  isForwardDate,
  checkExistsObjectWithIdInDb,
  isGreateThan,
  isString,
} = require("../helper/inputValidation")
const { modelName } = require("../../config/constant")
const { taskModelName } = modelName
// create task
module.exports.createTaskSV = {
  title: isString("عنوان تسک", "body"),
  description: isString("توضیحات تسک", "body"),
  status: inArray("وضعیت تسک", "body", ["Pending", "InProgress", "Completed"]),
  deadline: isForwardDate("زمان پایان انجام تسک", "body"),
}

module.exports.readTaskSV = {
  status: inArray(
    "وضعیت تسک",
    "query",
    ["Pending", "InProgress", "Completed"],
    false
  ),
  "deadline[lte]": isDate(
    "تاریخ شروع بازه زمان به اتمام رساندن تسک",
    "query",
    false
  ),
  "deadline[gte]": isDate(
    "تاریخ پایان بازه زمان به اتمام رساندن تسک",
    "query",
    false
  ),
  sortKey: inArray(
    "مبنای مرتب سازی",
    "query",
    ["title", "description", "status", "deadline", "created_at"],
    false
  ),
  order: inArray("ترتیب مرتب سازی", "query", ["asc", "desc"], false),
  limit: isGreateThan("تعداد تسک", "query", 0, false),
  page: isGreateThan("شماره صفحه", "query", 0, false),
}

// update
// status
// title
// descrition
// deadline
// remove task
module.exports.deleteTaskSV = {
  id: checkExistsObjectWithIdInDb(taskModelName, "params"),
}
