function password({ req, body, field, validationObj, model }) {
  const val = body[field];

  if (typeof val !== "string") {
    throw {
      custom: true,
      _message: `Field ${field} of model ${model} must be a string value.`,
    };
  }

  const minLength =
    parseInt(validationObj.minLength) ||
    parseInt(validationObj?.minLength?.length) ||
    8;

  const minLengthMessageValue = validationObj?.minLength?._message;
  const minLengthMessage =
    minLengthMessageValue && typeof minLengthMessageValue === "string"
      ? minLengthMessageValue
      : `Field ${field} must be atleast ${minLength} charcters long`;

  if (val.length < minLength) {
    throw {
      custom: true,
      _message: minLengthMessage,
    };
  }

  if (!/[A-Z]/.test(val)) {
    throw {
      custom: true,
      message: `${field} must include at least one uppercase letter`,
    };
  }

  if (!/[a-z]/.test(val)) {
    throw {
      custom: true,
      message: `${field} must include at least one lowercase letter`,
    };
  }

  if (!/[0-9]/.test(val)) {
    throw {
      custom: true,
      message: `${field} must include at least one number`,
    };
  }

  if (!/[@$!%*?&]/.test(val)) {
    throw {
      custom: true,
      message: `${field} must include at least one special character (@, $, !, %, *, ?, &)`,
    };
  }
}

module.exports = password;
