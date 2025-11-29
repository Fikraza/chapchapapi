function capitalize({ req, body, field }) {
  try {
    const val = body[field];

    if (typeof val === "boolean") {
      return;
    }

    if (typeof val !== "string" || val.length === 0) {
      throw { message: "Not a valid string" };
    }

    const new_val = val
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    body[field] = new_val;
  } catch (e) {
    console.log("Error during capitalize transformation");
    console.log(e);
  }
}

module.exports = capitalize;
