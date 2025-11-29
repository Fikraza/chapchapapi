const inFilter = require("./InFilter");
const nullFilter = require("./nullFilter");
const rangeFilter = require("./rangeFilter");

function QueryFilter({ where, query, ignoreInFilters }) {
  try {
    //
    if (typeof where !== "object" || where === null) {
      throw "where value provided is null";
    }

    if (typeof query !== "object" || query === null) {
      throw "query value provided is null";
    }

    const letQueryFields = Object.keys(query);

    //min-age-int
    //max-age-bool
    //--->
    for (let i = 0; i < letQueryFields?.length; i++) {
      const originalQueryFieldName = letQueryFields[i];
      const queryFieldName = originalQueryFieldName
        ?.trim()
        ?.toLowerCase()
        ?.replace(/\s+/g, "");

      const queryFieldValue = query[originalQueryFieldName];

      if (
        Array.isArray(ignoreInFilters) &&
        ignoreInFilters.includes(queryFieldName)
      ) {
        continue;
      }

      if (
        queryFieldName.startsWith("_min-") ||
        queryFieldName.startsWith("_max-")
      ) {
        rangeFilter({ queryFieldName, where, queryFieldValue });
        continue;
      }

      if (queryFieldName.startsWith("_null-")) {
        nullFilter({ queryFieldName, where, queryFieldValue });
        continue;
      }

      inFilter({ queryFieldName, where, queryFieldValue });
    }
  } catch (e) {
    console.log("Failed to do filter");
    console.log(e);
  }
}

module.exports = QueryFilter;
