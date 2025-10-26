function genBody({ body, field, skipUndefined = false, skipFields = [] }) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw { custom: true, message: "Body must be an object", status: 500 };
  }

  if (typeof field !== "object" || Array.isArray(field)) {
    throw { custom: true, message: "Fields must be an object", status: 500 };
  }

  const data = {};

  const keys = Object.keys(field);

  for (let i = 0; i < keys?.length; i++) {
    const key = keys[i];
    const { required } = field[key];
    const value = body[key];

    if (Array.isArray(skipFields) && skipFields.includes(key)) {
      continue;
    }

    if (skipUndefined && value === undefined) {
      continue;
    }

    if (value === undefined && required === true) {
      throw { custom: true, message: `${key} is required` };
    }

    // if ((value === undefined && required === undefined) || required === true) {
    //   throw { custom: true, message: `${key} is required` };
    // }

    data[key] = value === undefined ? value : null || value;
  }

  return data;
}

module.exports = genBody;
