const { defaultEMessageHelper, eMessageBuilder } = require("../../helpers");

function str({ req, body, field, validationObj }) {
  const val = body[field];

  if (typeof val !== "string") {
    throw { custom: true, _message: `${field} must be` };
  }
}
