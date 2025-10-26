function phone({ body = {}, field = "", capField = "" }) {
  const val = body[field];

  if (typeof val !== "string") {
    throw {
      custom: true,
      message: `Invalid Phone number. ${capField} must be a string`,
    };
  }

  // Ensure format is 'code-number'
  const parts = val.split("-");
  if (parts.length !== 2) {
    throw {
      custom: true,
      message: `Invalid Phone number. ${capField} must follow the format 'code-number' (e.g. 254-7288829146)`,
    };
  }

  const [countryCode, localNumber] = parts;

  if (!/^\d+$/.test(countryCode)) {
    throw {
      custom: true,
      message: `Invalid Phone number. ${capField} country code must contain only digits`,
    };
  }

  if (!/^\d+$/.test(localNumber)) {
    throw {
      custom: true,
      message: `Invalid Phone number. ${capField} local number must contain only digits`,
    };
  }

  if (localNumber.length <= 5) {
    throw {
      custom: true,
      message: `Invalid Phone number. ${capField} local number must be more than 5 digits`,
    };
  }

  if (localNumber.startsWith("0")) {
    throw {
      custom: true,
      message: `Invalid Phone number. ${capField} local number must not start with '0'`,
    };
  }

  return true;
}

module.exports = phone;
