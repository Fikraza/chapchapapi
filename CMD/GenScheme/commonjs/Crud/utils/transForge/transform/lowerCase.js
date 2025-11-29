function toLowerCase({ req, body, field }) {
  try {
    let val = body[field];

    // Skip if value is missing or empty
    if (val === null || val === undefined || val === "") {
      return;
    }

    // Convert safely to string and lowercase it
    const newVal = String(val).toLowerCase();

    body[field] = newVal;
  } catch (e) {
    console.log("Error during lowerCase transformation");
    console.error(e);
  }
}

module.exports = toLowerCase;
