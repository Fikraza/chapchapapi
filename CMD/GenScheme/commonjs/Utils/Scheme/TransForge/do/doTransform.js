const transformFuncs = require("./../transforms");

async function doTransform({ transforms, body, field, excludeInValidation }) {
  if (!transforms) {
    return;
  }

  if (Array.isArray(transforms)) {
    for (let i = 0; i < transforms.length; i++) {
      const transform = transforms[i];
      const transFunc = transformFuncs[transform];

      if (transFunc) {
        await transFunc({ body, field, excludeInValidation });
      }
    }

    return;
  }

  if (typeof transforms === "object") {
    throw {
      custom: true,
      message: "Transforam can only be a string or array",
      status: 500,
    };
  }

  const transFunc = transformFuncs[transforms];

  await transFunc({ body, field });
}

module.exports = doTransform;
