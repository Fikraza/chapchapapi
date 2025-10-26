function int({ body = {}, field = "" }) {
  try {
    const val = body[field];

    if (Number.isInteger(val)) {
      return;
    }

    const new_val = parseInt(val, 10);

    if (isNaN(new_val)) {
      throw new Error(`Invalid integer value for field: ${field}`);
    }

    body[field] = new_val;
    return new_val;
  } catch (e) {
    console.error("Error during integer transformation");
    console.error(e);
  }
}

module.exports = int;
