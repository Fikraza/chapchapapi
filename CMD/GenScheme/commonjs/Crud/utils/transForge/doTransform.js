const transformFuncs = require("./transform");

async function doTransform(obj) {
  try {
    const { transforms, req, body, field } = obj;

    if (!Array.isArray(transforms)) {
      return;
    }

    for (let i = 0; i < transforms.length; i++) {
      const transformName = transforms[i];

      const transformFunc = transformFuncs[transformName];

      if (typeof transformFunc !== "function") {
        continue;
      }

      await transformFunc({ req, body, field });
    }
  } catch (e) {
    console.log("Error during data transformation");
    console.log(e);
  }
}

module.exports = doTransform;
