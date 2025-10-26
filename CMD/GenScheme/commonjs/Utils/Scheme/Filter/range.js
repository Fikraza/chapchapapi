const conversions = require("./conversion");

function RangeFilter(props) {
  const { where = {}, exclude = [], query = {} } = props;

  let keys = Object.keys(query);

  for (let i = 0; i < keys.length; i++) {
    try {
      const originKey = keys[i];
      const key = originKey.toLowerCase();
      const value = query[originKey];
      if (exclude.includes(key)) {
        continue;
      }
      //min-age-int
      const arr = key.split("-");

      let term1 = arr[0]; //min
      const term2 = arr[1]; // age
      const term3 = arr[2] || "str"; //int

      if (exclude.includes(`${term1}-${term2}`)) {
        continue;
      }

      if (term1 === "min" && term3 && value) {
        const func = conversions[term3] || conversions["str"];
        let obj = where[term2] || {};
        obj.gte = func(value);
        where[term2] = obj;
      }

      if (term1 === "max" && term3 && value) {
        const func = conversions[term3] || conversions["str"];
        let obj = where[term2] || {};
        obj.lte = func(value);
        where[term2] = obj;
      }
    } catch (e) {
      continue;
    }
  }

  return where;
}
module.exports = RangeFilter;
