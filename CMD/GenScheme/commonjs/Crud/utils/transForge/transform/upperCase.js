function toUpperCase({ req, body, field }) {
  try {
    let val = body[field];

    // Skip if the value is nullish or empty
    if (val === null || val === undefined || val === "") {
      return;
    }

    // Convert to string and transform
    const newVal = String(val).toUpperCase();

    body[field] = newVal;
  } catch (e) {
    console.log("Error during upperCase transformation");
    console.error(e);
  }
}

module.exports = toUpperCase;
