function isUUID(uuid) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return typeof uuid === "string" && uuidRegex.test(uuid);
}

function uuid({ body = {}, field = "", capField = "" }) {
  const val = body[field];

  console.log("FIELD:", field);
  console.log("VALUE:", val);

  if (!isUUID(val)) {
    throw { custom: true, message: `${capField} must be a valid UUID` };
  }

  return true;
}

module.exports = uuid;
