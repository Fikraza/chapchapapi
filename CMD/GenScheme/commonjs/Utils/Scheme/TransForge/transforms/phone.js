function phone({ body = {}, field = "" }) {
  try {
    let val = body[field];

    if (typeof val !== "string" || val.length === 0) {
      return;
    }

    // If there's a hyphen, remove the first '0' after it
    const hyphenIndex = val.indexOf("-");
    if (hyphenIndex !== -1 && val[hyphenIndex + 1] === "0") {
      val = val.slice(0, hyphenIndex + 1) + val.slice(hyphenIndex + 2);
    }

    // Remove all non-digit characters
    val = val.replace(/\D+/g, "");

    body[field] = val;
    return val;
  } catch (e) {
    console.error("Error during phone transform");
    console.error(e);
  }
}

module.exports = phone;
