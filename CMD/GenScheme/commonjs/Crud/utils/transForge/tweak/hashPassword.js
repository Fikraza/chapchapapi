const bcrypt = require("bcrypt");

async function hashPassword({ req, body, field }) {
  try {
    let val = body[field];

    if (val === null || val === undefined || val === "") {
      return;
    }

    val = val?.toString();

    const hashed = await bcrypt.hash(val, 10);

    body[field] = hashed;
  } catch (e) {
    console.log("Error during password hashing transformation");
    console.log(e);
  }
}

module.exports = hashPassword;
