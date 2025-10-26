function str({ body = {}, field = "", validationObj = {}, capField = "" }) {
  const val = body[field];

  if (typeof val !== "string") {
    throw { custom: true, message: `${capField} must be a string` };
  }

  if (
    typeof validationObj.minLength === "number" &&
    val.length < validationObj.minLength
  ) {
    throw {
      custom: true,
      message: `${capField} length must be at least ${validationObj.minLength} characters`,
    };
  }

  if (
    typeof validationObj.maxLength === "number" &&
    val.length > validationObj.maxLength
  ) {
    throw {
      custom: true,
      message: `${capField} length must be at most ${validationObj.maxLength} characters`,
    };
  }

  return true; // Validation successful
}

module.exports = str;
