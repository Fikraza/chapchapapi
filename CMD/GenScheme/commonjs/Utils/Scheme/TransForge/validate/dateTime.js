function dateTime({
  body = {},
  field = "",
  validationObj = {},
  capField = "",
}) {
  const val = body[field];

  if (!val) {
    throw { custom: true, message: `${capField} is required` };
  }

  if (typeof val !== "string" || isNaN(Date.parse(val))) {
    throw {
      custom: true,
      message: `${capField} must be a valid ISO 8601 DateTime`,
    };
  }

  const dateTimeValue = new Date(val);

  if (
    typeof validationObj.minDateTime === "string" &&
    !isNaN(Date.parse(validationObj.minDateTime))
  ) {
    const minDateTime = new Date(validationObj.minDateTime);
    if (dateTimeValue < minDateTime) {
      throw {
        custom: true,
        message: `${capField} must be on or after ${validationObj.minDateTime}`,
      };
    }
  }

  if (
    typeof validationObj.maxDateTime === "string" &&
    !isNaN(Date.parse(validationObj.maxDateTime))
  ) {
    const maxDateTime = new Date(validationObj.maxDateTime);
    if (dateTimeValue > maxDateTime) {
      throw {
        custom: true,
        message: `${capField} must be on or before ${validationObj.maxDateTime}`,
      };
    }
  }

  if (
    typeof validationObj.equalDateTime === "string" &&
    !isNaN(Date.parse(validationObj.equalDateTime))
  ) {
    const equalDateTime = new Date(validationObj.equalDateTime);
    if (dateTimeValue.getTime() !== equalDateTime.getTime()) {
      throw {
        custom: true,
        message: `${capField} must be exactly ${validationObj.equalDateTime}`,
      };
    }
  }

  return true; // Validation successful
}

module.exports = dateTime;
