const { defaultEMessageHelper, eMessageBuilder } = require("../../helpers");

function bool({ req, body, field, validationObj, model }) {
  const val = body[field];

  if (typeof val !== "boolean") {
    const { e_message } = validationObj;

    let default_e_message = defaultEMessageHelper({
      field,
      model,
      val,
      preferedValue: "boolean",
    });

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

module.exports = bool;
