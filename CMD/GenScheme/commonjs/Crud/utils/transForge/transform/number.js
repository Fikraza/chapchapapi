function number({ req, body, field }) {
  try {
    const val = body[field];
    if (val === null || val === undefined || val === "") {
      return;
    }

    const parsed = Number(val);

    if (!isNaN(parsed) && isFinite(parsed)) {
      body[field] = parsed;
    }
  } catch (e) {
    console.log("Error during int transformation");
    console.log(e);
  }
}

module.exports = number;
