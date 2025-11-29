const filterTransforms = require("./filterTransforms");

function inFilter({ queryFieldName, where, queryFieldValue }) {
  const queryFieldNameArray = queryFieldName?.split("-");
  const filterName = queryFieldNameArray[0];
  const filterType = queryFieldNameArray[1] || "str";
  const fieldValues = queryFieldValue?.split(",");
  const transFormFunction = filterTransforms[filterType];

  if (typeof transFormFunction === "function" && Array.isArray(fieldValues)) {
    const transFormedValues = [];

    for (let i = 0; i < fieldValues.length; i++) {
      let singleValue = fieldValues[i];
      let transFormedFieldValue = transFormFunction(singleValue);
      if (transFormedFieldValue === null) {
        continue;
      }
      transFormedValues.push(transFormedFieldValue);
    }

    where[filterName] = {
      in: transFormedValues,
    };
  }
}

module.exports = inFilter;
