const {
  defaultEMessageHelper,
  eMessageBuilder,
  isValidDate,
} = require("../../helpers");
const dateTransform = require("../transform/date");

function date({ req, body, field, validationObj, model }) {
  const val = body[field];

  dateTransform({ req, body, field });

  if (!isValidDate(val)) {
    return;
  }

  const { e_message } = validationObj;

  let default_e_message = `Field ${field} of model ${model} must be a date value.Provided  value is${typeof val}`;

  if (!e_message) {
    throw {
      custom: true,
      _message: default_e_message,
      status: 400,
    };
  }

  let new_e_message = eMessageBuilder({ req, body, e_message });

  throw {
    custom: true,
    _message: new_e_message || default_e_message,
    status: 400,
  };
}

module.exports = date;
