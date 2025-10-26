function obj({ body = {}, field = "", capField = "", validationObj = {} }) {
  const val = body[field];

  if (typeof val !== "object") {
    throw { custom: true, message: `${capField} must be an json object` };
  }

  return true; // Validation successful
}

module.exports = obj;
