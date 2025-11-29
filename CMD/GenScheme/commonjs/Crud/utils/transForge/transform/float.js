function float({ req, body, field }) {
  try {
    const val = body[field];

    if (val === null || val === undefined || val === "") {
      return;
    }

    const parsed = parseFloat(val);

    if (!isNaN(parsed) && isFinite(parsed)) {
      body[field] = parsed;
    }
  } catch (e) {
    console.log("Error during float transformation");
    console.log(e);
  }
}

module.exports = float;
