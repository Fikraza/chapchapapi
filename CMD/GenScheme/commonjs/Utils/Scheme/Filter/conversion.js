const conversions = {
  int: (val) => parseInt(val),
  date: (val) => {
    let date = new Date(val);
    return date.toISOString();
  },
  float: (val) => parseFloat(val),
  str: (val) => val?.toString(),
  bool: (val) => Boolean(val),
  smartConv: (val) => {
    if (val === null || val === undefined) return val;

    const strVal = val.toString().toLowerCase().trim();

    if (strVal === "true") return true;
    if (strVal === "false") return false;

    if (strVal !== "" && !isNaN(strVal)) return Number(strVal);

    return val;
  },
};

module.exports = conversions;
