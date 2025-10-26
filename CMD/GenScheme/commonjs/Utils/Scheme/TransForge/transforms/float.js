function float({ body = {}, field = "" }) {
  try {
    // console.log("float transform");
    const val = body[field];

    if (typeof val === "number" && !isNaN(val)) {
      return;
    }

    const new_val = parseFloat(val);

    if (isNaN(new_val)) {
      throw new Error(`Invalid float value for field: ${field}`);
    }

    body[field] = new_val;
    return new_val;
  } catch (e) {
    console.error("Error during float transformation");
    console.error(e);
  }
}

module.exports = float;
