function dateTime({ body = {}, field }) {
  try {
    const val = body[field];

    if (typeof val !== "string" || !val.trim()) {
      throw { custom: true, message: "val is not string" };
    }

    let dateTimeVal;

    // Check if the val is in HTML datetime-local format (YYYY-MM-DDTHH:MM)
    if (val.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
      dateTimeVal = new Date(val);
    } else {
      // Try parsing common date-time formats like MM/DD/YYYY HH:MM or DD/MM/YYYY HH:MM
      dateTimeVal = new Date(val.replace(/-/g, "/")); // Replace hyphen with slash for compatibility
    }

    // Validate if the date-time is a valid DateTime
    if (isNaN(dateTimeVal.getTime())) {
      throw { custom: true, message: "dateTime not valid" };
    }

    // Update body with transformed ISO DateTime format (YYYY-MM-DDTHH:MM:SS.ZZZZ)
    body[field] = dateTimeVal.toISOString();

    return dateTimeVal.toISOString();
  } catch (e) {
    console.error("Error during DateTime transform");
    console.error(e);
  }
}

module.exports = dateTime;
