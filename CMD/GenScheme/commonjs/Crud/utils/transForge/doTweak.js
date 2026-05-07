const tweakFunctions = require("./tweak");

async function doTweak({ tweaks, req, body, field, model }) {
  if (typeof tweaks !== "object" || tweaks === null) {
    return;
  }

  const tweakKeys = Object.keys(tweaks);

  for (let i = 0; i < tweakKeys.length; i++) {
    const tweakName = tweakKeys[i];
    const tweakFunc = tweakFunctions[tweakName];
    const tweakObj = tweaks[tweakName];
    if (typeof tweakFunc !== "function") {
      continue;
    }
    await tweakFunc({ req, body, field, tweakObj, model });
  }
}

module.exports = doTweak;
