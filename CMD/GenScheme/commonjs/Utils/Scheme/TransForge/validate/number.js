function number({ body = {}, field = "", validationObj = {}, capField = "" }) {
  const val = body[field];

  if (typeof val !== "number" || isNaN(val)) {
    throw { custom: true, message: `${capField} must be a valid number` };
  }

  if (typeof validationObj.min === "number" && val < validationObj.min) {
    throw {
      custom: true,
      message: `${capField} must be greater than or equal to ${validationObj.min}`,
    };
  }

  if (typeof validationObj.max === "number" && val > validationObj.max) {
    throw {
      custom: true,
      message: `${capField} must be less than or equal to ${validationObj.max}`,
    };
  }

  if (typeof validationObj.equal === "number" && val !== validationObj.equal) {
    throw {
      custom: true,
      message: `${capField} must be exactly ${validationObj.equal}`,
    };
  }
}

module.exports = number;
