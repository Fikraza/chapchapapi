function isPlainObject(obj) {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

function mergeIfObject(base, addition) {
  return isPlainObject(addition) ? { ...base, ...addition } : base;
}

module.exports = { isPlainObject, mergeIfObject };
