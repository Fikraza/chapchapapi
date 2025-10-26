const validationFuncs = require("./../validate");
const safeCap = require("./safeCap");

async function doValidate({
  validations,
  required,
  body,
  field,
  model,
  excludeInValidation = [],
}) {
  if (typeof validations !== "object" || Array.isArray(validations)) {
    return;
  }

  if (
    Array.isArray(excludeInValidation) &&
    excludeInValidation.includes(field)
  ) {
    return;
  }

  const capField = safeCap(field);

  const validationKeys = Object.keys(validations);

  const data = body[field];

  for (let i = 0; i < validationKeys.length; i++) {
    const validationKey = validationKeys[i];
    const validationObj = validations[validationKey];
    const validationFunc = validationFuncs[validationKey];

    if (required === false && data === undefined) {
      continue;
    }

    if (data === undefined) {
      throw { custom: true, message: `${capField} is required` };
    }

    if (typeof validationFunc === "function") {
      await validationFunc({
        body,
        field,
        capField,
        model,
        excludeInValidation,
        validationObj,
      });
    }
  }
}

module.exports = doValidate;
