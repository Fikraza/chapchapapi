const { getUrlObj } = require("./../util");
function list(item) {
  const newItem = [];
  const folder = {
    name: "List",
    item: newItem,
  };

  newItem.push({
    name: "List Single Model",
    request: {
      method: "GET",
      url: getUrlObj({ url: `list/model_name` }),
    },
  });
  newItem.push({
    name: "List Multi models",
    request: {
      method: "GET",
      url: getUrlObj({
        url: `/list-multi-models`,
        params: { models: "abc,qert" },
      }),
    },
  });

  item.push(folder);
}
module.exports = list;
