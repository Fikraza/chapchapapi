function date({ req, body, field }) {
  try {
    const val = body[field];

    if (typeof val !== "string" || !val.trim()) {
      return;
    }

    const parsedDate = new Date(val);

    if (isNaN(parsedDate.getTime())) {
      console.warn(`Invalid date format for field "${field}":`, val);
      return;
    }

    parsedDate.setHours(0, 0, 0, 0);

    body[field] = parsedDate;
  } catch (e) {
    console.log("Error during date transformation");
    console.log(e);
  }
}

module.exports = date;
