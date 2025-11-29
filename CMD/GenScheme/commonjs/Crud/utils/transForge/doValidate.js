const validationFunctions = require("./validate");

async function doValidate({ validation, req, body, field, model }) {
  if (typeof validation !== "object" || validation === null) {
    return;
  }

  let validationKeys = Object.keys(validation);

  for (let i = 0; i < validationKeys.length; i++) {
    const validationName = validationKeys[i];

    const validationFunction = validationFunctions[validationName];

    if (typeof validationFunction !== "function") {
      continue;
    }

    const validationObj = validation[validationName];

    await validationFunction({ req, body, field, validationObj, model });
  }
}

module.exports = doValidate;
