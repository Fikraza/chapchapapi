const { getUrlObj } = require("./../util");

function search({ collection, model }) {
  const item = [];
  const folder = {
    name: "search",
    item,
  };

  item.push({
    name: "Search PG",
    request: {
      method: "GET",
      url: getUrlObj({
        url: `search-pg/${model}`,
        params: { search: "" },
      }),
    },
  });

  item.push({
    name: "Fuse Search",
    request: {
      method: "GET",
      url: getUrlObj({
        url: `search-fuse/${model}`,
        params: { search: "" },
      }),
    },
  });

  collection.push(folder);
}

module.exports = search;
