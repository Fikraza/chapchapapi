const { getUrlObj } = require("./../util");

function search(item) {
  const newItem = [];
  const folder = {
    name: "Search",
    item: newItem,
  };

  newItem.push({
    name: "Search PG",
    request: {
      method: "GET",
      url: getUrlObj({
        url: "search-pg/model_name",
        params: { search: "" },
      }),
    },
  });

  newItem.push({
    name: "Fuse Search",
    request: {
      method: "GET",
      url: getUrlObj({
        url: "search-fuse/model_name",
        params: { search: "" },
      }),
    },
  });

  item.push(folder);
}

module.exports = search;
