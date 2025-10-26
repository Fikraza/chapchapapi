const { doTransform, doTweak, doValidate } = require("./do");

async function TransForge({
  field,
  model,
  body = {},
  excludeInValidation = [],
  isPatch,
  req = {},
  skipTweak,
}) {
  if (typeof field !== "object") {
    throw { custom: true, message: "field required" };
  }

  if (typeof body !== "object" || Array.isArray(body)) {
    throw { custom: true, message: "Body must be an object" };
  }

  if (typeof model !== "string") {
    throw {
      custom: true,
      message: "Model must be provided and must be string",
    };
  }

  const fieldKeys = Object.keys(field);

  for (let i = 0; i < fieldKeys.length; i++) {
    const field = fieldKeys[i];
    const value = body[field];

    // when patching skip undefined values
    if (isPatch === true && value === undefined) {
      continue;
    }

    // get required property
    const required = field[field]?.required;

    // tweaks first

    if (skipTweak === true) {
    } else {
      const tweaks = field[field]?.tweaks;
      if (tweaks) {
        await doTweak({ body, field, tweaks, req });
      }
    }

    //transform dnext
    const transforms = field[field]?.transform;

    await doTransform({
      transforms,
      body,
      field,
      required,
    });

    // validations should be next
    const validations = field[field]?.validation;

    await doValidate({
      validations,
      body,
      field,
      model,
      required,
      excludeInValidation,
    });

    //converison come next
    const conversions = field[field]?.conversion;
    await doTransform({ transforms: conversions, body, field });
  }
}

module.exports = TransForge;
