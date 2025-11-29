function joinUrl(base, sub) {
  return [base, sub]
    .filter(Boolean) // remove empty parts
    .map((x) => x.replace(/^\/+|\/+$/g, "")) // remove leading + trailing slashes
    .join("/"); // join with ONE slash
}
function getUrlObj(param) {
  // If host is not provided, extract from baseUrl
  const { baseUrl = "{{url}}/scheme", host, url = "", params = {} } = param;

  const variable = [];
  const pathArray = [];
  const query = [];

  const fullUrl = joinUrl(baseUrl, url);
  const paths = fullUrl.split("/");

  const urlObj = {
    host: host || ["{{url}}"],
    path: pathArray,
    variable,
    query,
  };

  for (let i = 0; i < paths.length; i++) {
    const pathName = paths[i];

    // skip empty or template placeholders like "{id}"
    if (!pathName || pathName.includes("{")) continue;

    // Add to path array
    pathArray.push(pathName);

    // Handle Postman variable e.g. ":model_name"
    if (pathName.startsWith(":")) {
      variable.push({
        key: pathName.slice(1),
        value: "",
      });
    }
  }

  for (const key in params) {
    query.push({
      key,
      value: params[key],
    });
  }

  return urlObj;
}

function createItemFromPath({ item, structurePath }) {
  let structureArray = structurePath.split("/");
  let initialItem = item;
  for (let i = 0; i < structureArray.length; i++) {
    let folderName = structureArray[i];
    initialItem = createFolderAndItemIfNotExist({
      item: initialItem,
      folderName,
    });
  }
  return initialItem;
}

function createFolderAndItemIfNotExist({ item, folderName }) {
  for (let i = 0; i < item.length; i++) {
    const itemObj = item[i];
    if (itemObj?.name === folderName && Array.isArray(itemObj?.item)) {
      return itemObj?.item;
    }
  }
  let folder = {
    name: folderName,
    item: [],
  };
  item?.push(folder);
  return folder?.item;
}

module.exports = { getUrlObj, createItemFromPath };
