const Fuse = require("fuse.js");

function Search({
  search = "",
  items = [],
  options = {
    isCaseSensitive: false,
    includeScore: false,
    minMatchCharLength: 3,
  },
  keys = [],
}) {
  const fuse = new Fuse(items, {
    ...options,
    keys,
  });

  let results = fuse.search(search);
  //return results;
  let arr = [];

  for (let doc of results) {
    arr.push(doc.item);
  }
  return arr;
}

module.exports = Search;
