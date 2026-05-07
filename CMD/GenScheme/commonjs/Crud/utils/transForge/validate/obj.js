function obj(props) {
  const { body, field, validationObj } = props;
  const val = body[field];

  let _message = validationObj?.message || `${field} is required`;
  if (!val || typeof val !== "object" || Array.isArray(val)) {
    throw { custom: true, _message };
  }
}

module.exports = obj;
