function lowercase({ body = {}, field = "" }) {
  try {
    const val = body[field];
    if (typeof val !== "string" || val.length === 0) {
      throw { message: "Not a valid string" };
    }
    const new_val = val?.toLowerCase();
    body[field] = new_val;
    return new_val;
  } catch (e) {
    console.error("Error during lower_case transform");
    console.error(e);
  }
}

module.exports = lowercase;
