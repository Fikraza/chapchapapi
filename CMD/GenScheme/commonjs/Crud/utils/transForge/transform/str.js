function str({ req, body, field }) {
  try {
    let val = body[field];

    if (val === null || val === undefined || val === "") {
      return;
    }

    const newVal = String(val);
    body[field] = newVal;
  } catch (e) {
    console.log("Error during str transformation");
    console.log(e);
  }
}

module.exports = str;
