function createCollectionSubFolders({ field, collection }) {
  let fieldArray = field.split("/");

  // inventory/inventory_items

  let subCollection = collection;

  for (let field of fieldArray) {
    // console.log(field);
    let found = subCollection.find((obj) => obj?.name === field);

    if (found && Array.isArray(found?.item)) {
      subCollection = found.item;
      continue;
    }

    let item = [];
    let node = { name: field, item };
    subCollection.push(node);
    subCollection = item;
  }

  return subCollection;
}

module.exports = createCollectionSubFolders;
