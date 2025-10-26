const conversions = require("./conversion");

function modelFilter(props) {
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

      //age-int
      const arr = key.split("-");

      let term1 = arr[0]; //age
      const term2 = arr[1] || "smartConv"; // int

      if (term1.includes("min") || term1.includes("max")) {
        continue;
      }

      const func = conversions[term2];

      let values = value.split(",");

      values = values.map((value) => func(value));

      let obj = { in: values };

      where[term1] = obj;
    } catch (e) {
      console.log(e);
      continue;
    }
  }

  return where;
}

module.exports = modelFilter;
