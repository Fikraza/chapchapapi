function getValueFromPathAndObject({ pathStr, object }) {
  try {
    if (!pathStr || typeof pathStr !== "string") return null;

    if (object === null || typeof object !== "object") return null;

    let pathArray = pathStr.split(".");

    let currentObject = object;

    for (let i = 0; i < pathArray.length; i++) {
      const key = pathArray[i];
      let newValueOrObject = currentObject[key];
      if (newValueOrObject === undefined) {
        return null;
      }
      currentObject = newValueOrObject;
    }

    return currentObject;
  } catch (e) {
    console.log("Error in getValueFromPathAndObject");
    console.log(e);
    return null;
  }
}

function defaultEMessageHelper({ field, model, val, preferedValue }) {
  return `Field ${field} of model ${model} must be a ${preferedValue} but the value received was: ${typeof val}`;
}

function eMessageBuilder({ req = {}, body = {}, e_message = "" }) {
  try {
    if (typeof e_message !== "string" || e_message.trim() === "") return "";

    return e_message.replace(
      /\[(req|body)\.([\w.]+)\]/g,
      (_, root, pathStr) => {
        const source = root === "req" ? req : body;
        const value = getValueFromPathAndObject({ pathStr, object: source });
        return value ?? "";
      }
    );
  } catch (e) {
    console.log("Error in eMessageBuilder");
    console.error(e);
    return "";
  }
}

function isValidDate(value) {
  return (
    Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value)
  );
}

function isUUID(uuid) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return typeof uuid === "string" && uuidRegex.test(uuid);
}

function pruneBodyByFields({ body, field, pruneSkipUpdate }) {
  if (
    body === null ||
    typeof body !== "object" ||
    field === null ||
    typeof field !== "object"
  ) {
    return;
  }

  let bodyKeys = Object.keys(body);
  let fieldKeys = Object.keys(field);

  for (let i = 0; i < bodyKeys.length; i++) {
    let bodyKey = bodyKeys[i];
    if (!fieldKeys.includes(bodyKey)) {
      delete body[bodyKey];
    }
    let fieldObject = field[bodyKey];
    let val = body[bodyKey];

    if (pruneSkipUpdate === true && fieldObject?.skip_update === true) {
      delete body[bodyKey];
      continue;
    }

    if (fieldObject?.is_skipped && val === undefined) {
      delete body[bodyKey];
    }
  }
}

module.exports = {
  getValueFromPathAndObject,
  defaultEMessageHelper,
  eMessageBuilder,
  isValidDate,
  isUUID,
  pruneBodyByFields,
};
