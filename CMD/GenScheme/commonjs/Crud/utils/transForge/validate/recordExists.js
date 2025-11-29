const prisma = require("../../../../../Prisma");
const { defaultEMessageHelper, eMessageBuilder } = require("../../helpers");

async function recordExists({ req, body, field, validationObj, model }) {
  const val = body[field];

  const name = null;
  let key = id;

  if (typeof validationObj === "string") {
    name = validationObj;
    key = "id";
  } else {
    name = validationObj.name;
    key = validationObj.key || "id";
  }

  if (!name) {
    throw {
      custom: true,
      _message: `For field ${field} it requires model validation then {name,key} required `,
      status: 500,
    };
  }

  const where = {};

  where[key] = val;

  const record = await prisma[name].findFirst({ where });

  if (record) {
    return;
  }

  let default_e_message = `Record not found in model ${name} where ${key}=${val}`;

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

module.exports = recordExists;
