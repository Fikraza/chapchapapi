const { defaultEMessageHelper, eMessageBuilder } = require("../../helpers");

function str({ req, body, field, validationObj }) {
  const val = body[field];

  if (typeof val !== "string") {
    throw { custom: true, _message: `${field} is required` };
  }

  const minLength =
    parseInt(validationObj.minLength) ||
    parseInt(validationObj?.minLength?.length) ||
    0;
  const minLengthMessageValue = validationObj.minLength?._message;
  const minLengthMessage =
    minLengthMessageValue && typeof minLengthMessageValue === "string"
      ? minLengthMessageValue
      : `Field ${field} must be at least ${minLength} characters long. Provided value is ${val.length} characters long.`;

  if (val.length < minLength) {
    throw { custom: true, _message: minLengthMessage };
  }

  const maxLength =
    parseInt(validationObj.maxLength) ||
    parseInt(validationObj?.maxLength?.length) ||
    val?.length + 1;

  const maxLengthMessageValue = validationObj.maxLength?._message;
  const maxLengthMessage =
    maxLengthMessageValue && typeof maxLengthMessageValue === "string"
      ? maxLengthMessageValue
      : `Field ${field} must be at most ${maxLength} characters long. Provided value is ${val.length} characters long.`;

  if (val.length > maxLength) {
    throw { custom: true, _message: maxLengthMessage };
  }
}

module.exports = str;
