function bool({ body = {}, field = "" }) {
  try {
    console.log("bool transform");
    const val = body[field];

    if (typeof val === "boolean") {
      return;
    }

    const new_val = Boolean(val);

    body[field] = new_val;
    return new_val;
  } catch (e) {
    console.error("Error during boolean transformation");
    console.error(e);
  }
}

module.exports = bool;
