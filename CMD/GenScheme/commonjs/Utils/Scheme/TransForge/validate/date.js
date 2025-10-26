function date({ body = {}, field = "", validationObj = {}, capField = "" }) {
  const val = body[field];

  console.log("DATE IS:", val, "TYPE:", typeof val);

  // Try to get an ISO string version of the date
  const isoString =
    typeof val === "string"
      ? val
      : val instanceof Date
      ? val.toISOString()
      : "";

  if (!isoString || isNaN(Date.parse(isoString))) {
    throw { custom: true, message: `${capField} must be a valid ISO date` };
  }

  const dateValue = new Date(isoString);

  // Minimum date check
  if (
    typeof validationObj.minDate === "string" &&
    !isNaN(Date.parse(validationObj.minDate))
  ) {
    const minDate = new Date(validationObj.minDate);
    if (dateValue < minDate) {
      throw {
        custom: true,
        message: `${capField} must be on or after ${validationObj.minDate}`,
      };
    }
  }

  // Maximum date check
  if (
    typeof validationObj.maxDate === "string" &&
    !isNaN(Date.parse(validationObj.maxDate))
  ) {
    const maxDate = new Date(validationObj.maxDate);
    if (dateValue > maxDate) {
      throw {
        custom: true,
        message: `${capField} must be on or before ${validationObj.maxDate}`,
      };
    }
  }

  // Exact date match check
  if (
    typeof validationObj.equalDate === "string" &&
    !isNaN(Date.parse(validationObj.equalDate))
  ) {
    const equalDate = new Date(validationObj.equalDate);
    if (dateValue.getTime() !== equalDate.getTime()) {
      throw {
        custom: true,
        message: `${capField} must be exactly ${validationObj.equalDate}`,
      };
    }
  }

  return true; // ✅ Validation successful
}

module.exports = date;
