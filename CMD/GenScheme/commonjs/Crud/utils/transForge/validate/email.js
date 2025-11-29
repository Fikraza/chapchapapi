const { defaultEMessageHelper, eMessageBuilder } = require("../../helpers");

function email({ req, body, field, validationObj, model }) {
  const val = body[field];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let default_e_message = defaultEMessageHelper({
    field,
    model,
    val,
    preferedValue: "email string",
  });

  if (typeof val !== "string" || !emailRegex.test(val)) {
    const { e_message } = validationObj;

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
}

module.exports = email;
