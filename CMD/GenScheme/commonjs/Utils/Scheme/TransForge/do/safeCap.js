const safeCap = (val) => {
  try {
    return val
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  } catch (e) {
    return val;
  }
};

module.exports = safeCap;
