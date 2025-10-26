const prisma = require("../../../../../Prisma");

async function unique({
  body = {},
  field = "",
  validationObj = {},
  capField = "",
  model = "",
  excludeInValidation = [],
}) {
  const val = body[field];

  if (!val) {
    throw { custom: true, message: `${field} is required` };
  }

  if (
    Array.isArray(excludeInValidation) &&
    excludeInValidation.includes("unique")
  ) {
    return;
  }

  const where = {};

  where[field] = val;

  // console.log(`Model ${model}, where=${where}`);
  // console.log(where);

  const doc = await prisma[model].findUnique({
    where,
  });

  if (doc) {
    throw { custom: true, message: `${field} must be unique` };
  }
}

module.exports = unique;
