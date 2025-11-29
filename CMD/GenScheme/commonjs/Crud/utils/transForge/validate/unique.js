const prisma = require("../../../../../Prisma");
const { defaultEMessageHelper, eMessageBuilder } = require("../../helpers");

async function unique({ req, body, field, validationObj, model }) {
  const val = body[field];

  const whereObj = {};
  whereObj[field] = val;
  console.log(model);

  const record = await prisma[model].findUnique({
    where: whereObj,
  });

  let uniqueErrorMessage =
    typeof validationObj?._message === "string"
      ? validationObj?._message
      : `For ${field} a unique value is required. ${val} already in use`;

  if (record) {
    throw { custom: true, _message: uniqueErrorMessage, status: 400 };
  }
}

module.exports = unique;
