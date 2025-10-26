function date({ body = {}, field }) {
  try {
    const val = body[field];

    if (typeof val !== "string" || !val.trim()) {
      throw { custom: true, message: "val is not string" };
    }

    let dateval;

    // Check if the val is in HTML date input format (YYYY-MM-DD)
    if (val.match(/^\d{4}-\d{2}-\d{2}$/)) {
      dateval = new Date(val);
    } else {
      // Try parsing common date formats like MM/DD/YYYY or DD/MM/YYYY
      dateval = new Date(val.replace(/-/g, "/")); // Replace hyphen with slash for compatibility
    }

    // Validate if the date is a valid date
    if (isNaN(dateval.getTime())) {
      throw { custom: true, message: "valid date" };
    }
    console.log("dateval-->", dateval);
    body[field] = dateval;

    return dateval;
  } catch (e) {
    console.error("Error during date transform");
    console.error(e);
  }
}

module.exports = date;
