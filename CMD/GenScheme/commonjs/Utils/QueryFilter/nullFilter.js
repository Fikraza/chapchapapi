function nullFilter({ queryFieldName, where, queryFieldValue }) {
  const queryFieldNameArray = queryFieldName?.split("-");
  const isNullFilter = queryFieldNameArray[0];
  const filterName = queryFieldName[1];

  if (isNullFilter?.toLowerCase() !== "_null") {
    return;
  }

  if (queryFieldValue?.toLowerCase()?.trim().replace(/\s+/g, "") === "true") {
    where[filterName] = null;
  } else {
    where[filterName] = {
      not: null,
    };
  }
}

module.exports = nullFilter;
