const bcrypt = require("bcrypt");

async function password({ body = {}, field = "" }) {
  try {
    const val = body[field];
    const hashed = await bcrypt.hash(val, 10);

    body[field] = hashed;
    return hashed;
  } catch (e) {
    console.error("Error during password hash");
    console.log(e);
  }
}

module.exports = password;
