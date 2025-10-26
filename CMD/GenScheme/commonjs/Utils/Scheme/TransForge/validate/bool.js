function bool({ body = {}, field = "", validationObj = {}, capField = "" }) {
  const val = body[field];

  if (typeof val !== "boolean") {
    throw { custom: true, message: `${capField} must be True or False` };
  }
}

module.exports = bool;
