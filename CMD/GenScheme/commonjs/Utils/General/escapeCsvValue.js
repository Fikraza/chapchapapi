function escapeCsvValue(value) {
  if (value == null) return ""; // handle null/undefined
  let str = String(value);

  // Escape double quotes by doubling them
  if (/[",\n]/.test(str)) {
    str = '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

module.exports = escapeCsvValue;
