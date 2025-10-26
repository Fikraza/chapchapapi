const prisma = require("../../../../../Prisma");

async function model({ body = {}, field = "", capField = "", validationObj }) {
  const val = body[field];

  if (!val) {
    throw { custom: true, message: `${capField} required` };
  }

  let name = null;
  let key = "id";

  if (typeof validationObj === "string") {
    name = validationObj;
    key = "id";
  } else {
    name = validationObj?.name;
    key = validationObj?.key || "id";
  }

  if (!name) {
    throw {
      custom: true,
      message: "Model name required for model validation",
      status: 500,
    };
  }

  const where = {};

  where[key] = val;
  // console.log("model validation");
  // console.log(where);
  // console.log(name);

  const record = await prisma[name].findFirst({ where });

  if (!record) {
    throw { custom: true, message: `${name} record not found` };
  }

  return true;
}

module.exports = model;
