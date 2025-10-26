function arr({ body = {}, field = "", capField = "", validationObj = {} }) {
  const val = body[field];

  if (!Array.isArray(val)) {
    throw { custom: true, message: `${capField} must be an json array` };
  }

  if (
    typeof validationObj.minLength === "number" &&
    val.length < validationObj.minLength
  ) {
    throw {
      custom: true,
      message: `${capField} must have at least ${validationObj.minLength} items`,
    };
  }

  if (
    typeof validationObj.maxLength === "number" &&
    val.length > validationObj.maxLength
  ) {
    throw {
      custom: true,
      message: `${capField} must have at most ${validationObj.maxLength} items`,
    };
  }

  if (
    typeof validationObj.equalLength === "number" &&
    val.length !== validationObj.equalLength
  ) {
    throw {
      custom: true,
      message: `${capField} must have exactly ${validationObj.equalLength} items`,
    };
  }

  return true; // Validation successful
}

module.exports = arr;
