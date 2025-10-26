const tweakFuncs = require("./../tweak");
const safeCap = require("./safeCap");

async function doTweak({ body, field, tweaks, req }) {
  if (!tweaks) {
    return;
  }

  const capField = safeCap(field);

  const tweakKeys = Object.keys(tweaks);

  for (let i = 0; i < tweakKeys.length; i++) {
    const tweakKey = tweakKeys[i];

    const tweakObj = tweaks[tweakKey];

    const tweakFunc = tweakFuncs[tweakKey];

    if (!tweakFunc) {
      continue;
    }

    await tweakFunc({ req, body, field, tweakObj, capField });
  }
}

module.exports = doTweak;
