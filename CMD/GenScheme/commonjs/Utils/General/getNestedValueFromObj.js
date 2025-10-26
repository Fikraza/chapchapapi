function getNestedValueFromObj({ obj, fieldPath }) {
  try {
    // console.log("Field path");
    // console.log(fieldPath);

    // console.log("");

    // console.log("Object");
    // console.log(obj);

    if (!obj || typeof obj !== "object") {
      return "-";
    }

    if (!fieldPath || typeof fieldPath !== "string") {
      return "-";
    }

    let fieldArray = fieldPath?.split(".");

    let doc = obj;

    for (let field of fieldArray) {
      let value = doc[field];
      doc = value;
      if (typeof value === "undefined") {
        return undefined;
      }
    }

    return doc;
  } catch (e) {
    return "-";
  }
}

module.exports = getNestedValueFromObj;
