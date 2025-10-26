function password({
  body = {},
  field = "",
  validationObj = {},
  capField = "",
}) {
  const val = body[field];

  if (typeof val !== "string") {
    throw {
      custom: true,
      message: `${capField} must be a string`,
    };
  }

  const minLength = validationObj.minLength || 8;

  if (val.length < minLength) {
    throw {
      custom: true,
      message: `${capField} must be at least ${minLength} characters long`,
    };
  }

  // Stage-by-stage checks for password complexity
  if (!/[A-Z]/.test(val)) {
    throw {
      custom: true,
      message: `${capField} must include at least one uppercase letter`,
    };
  }

  if (!/[a-z]/.test(val)) {
    throw {
      custom: true,
      message: `${capField} must include at least one lowercase letter`,
    };
  }

  if (!/[0-9]/.test(val)) {
    throw {
      custom: true,
      message: `${capField} must include at least one number`,
    };
  }

  if (!/[@$!%*?&]/.test(val)) {
    throw {
      custom: true,
      message: `${capField} must include at least one special character (@, $, !, %, *, ?, &)`,
    };
  }

  return true;
}

module.exports = password;
