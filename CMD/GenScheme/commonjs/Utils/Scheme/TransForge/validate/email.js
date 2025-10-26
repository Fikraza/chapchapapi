function email({ body = {}, field = "", validationObj = {}, capField = "" }) {
  const val = body[field];

  if (typeof val !== "string") {
    throw {
      custom: true,
      message: `${capField} must be a valid email address`,
    };
  }

  if (val.length <= 3) {
    throw {
      custom: true,
      message: `${capField} must be a valid email address`,
    };
  }

  // Email validation regex (standard pattern)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(val)) {
    throw {
      custom: true,
      message: `${capField} must be a valid email address`,
    };
  }

  return true; // ✅ Validation successful
}

module.exports = email;
