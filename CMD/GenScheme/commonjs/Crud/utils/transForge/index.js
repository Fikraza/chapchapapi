const doTransform = require("./doTransform");
const doValidate = require("./doValidate");
const doTweak = require("./doTweak");

async function transForge(obj) {
  const { fields, req, body, skipUndefined, model } = obj;
  if (typeof fields !== "object" || fields === null) {
    console.warn("Fields is not an object in transForge");
    return;
  }

  const fieldKeys = Object.keys(fields);

  for (let i = 0; i < fieldKeys.length; i++) {
    const fieldName = fieldKeys[i];
    const fieldObject = fields[fieldName];

    if (typeof fieldObject !== "object" || fieldObject === null) {
      continue;
    }

    const isRequired = fieldObject?.required;
    const skipCheck = fieldObject?.skip_check;
    const val = body[fieldName];

    if (skipUndefined === true && val === undefined) {
      continue;
    }

    const transforms = fieldObject?.transform;

    const validation = fieldObject?.validation;

    const tweaks = fieldObject?.tweak;

    await doTransform({ transforms, req, body, field: fieldName });

    if ((val == undefined && isRequired === false) || skipCheck === true) {
    } else {
      await doValidate({ validation, req, body, field: fieldName, model });
    }
    await doTweak({ tweaks, req, body, field: fieldName });
  }
}

module.exports = transForge;
