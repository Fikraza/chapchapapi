function int({ req, body, field }) {
  try {
    const val = body[field];
    if (val === null || val === undefined || val === "") {
      return;
    }

    const parsed = BigInt(val, 10);

    if (!isNaN(parsed) && isFinite(parsed)) {
      body[field] = parsed;
    }
  } catch (e) {
    console.log("Error during bigint transformation");
    console.log(e);
  }
}

module.exports = int;
