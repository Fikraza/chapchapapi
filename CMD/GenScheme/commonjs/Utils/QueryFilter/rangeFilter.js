const filterTransforms = require("./filterTransforms");

function rangeTransform({ queryFieldName, where, queryFieldValue }) {
  const queryFieldNameArray = queryFieldName?.split("-");
  const minOrMax = queryFieldNameArray[0];
  const filterName = queryFieldNameArray[1];
  const filterType = queryFieldNameArray[2] || "str";

  const transFormFunction = filterTransforms[filterType];
  if (typeof transFormFunction !== "function") {
    return;
  }
  const transFormValue = transFormFunction(queryFieldValue);

  if (!where[filterName]) {
    where[filterName] = {};
  }

  if (minOrMax === "_min") {
    where[filterName].gte = transFormValue;
    return;
  }
  where[filterName].lte = transFormValue;
}

module.exports = rangeTransform;
