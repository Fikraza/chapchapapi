function toStr(val) {
  try {
    if (val === null || val === undefined) return null;
    return String(val);
  } catch (e) {
    return null;
  }
}

function toInt(val) {
  try {
    const num = parseInt(val);
    return isNaN(num) ? null : num;
  } catch (e) {
    return null;
  }
}

function toFloat(val) {
  try {
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  } catch (e) {
    return null;
  }
}

function toBool(val) {
  try {
    if (val === null || val === undefined) return null;

    const cleaned = String(val).trim().toLowerCase();

    if (cleaned === "true" || cleaned === "1") return true;
    if (cleaned === "false" || cleaned === "0") return false;

    return null; // invalid boolean string
  } catch (e) {
    return null;
  }
}

function toDateISO(val) {
  try {
    if (!val) return null;

    const d = new Date(val);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}T00:00:00.000Z`;
  } catch (e) {
    return null;
  }
}

function toTimestampISO(val) {
  try {
    if (!val) return null;

    const d = new Date(val);
    if (isNaN(d.getTime())) return null;

    return d.toISOString();
  } catch (e) {
    return null;
  }
}

const filterTransforms = {
  str: toStr,
  int: toInt,
  float: toFloat,
  bool: toBool,
  date: toDateISO,
  ts: toTimestampISO,
};

module.exports = filterTransforms;
