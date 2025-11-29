function bool({ req, body, field }) {
  try {
    const val = body[field];

    if (typeof val === "boolean") {
      return;
    }

    if (val === "true" || val === "1" || val === 1) {
      body[field] = true;
    }
    if (val === "false" || val === "0" || val === 0) {
      body[field] = false;
    }
  } catch (e) {
    console.error("Error during boolean transformation");
    console.error(e);
  }
}

module.exports;
