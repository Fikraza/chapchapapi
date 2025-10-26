async function handleAfterPermission({ req, permission, data }) {
  let methodObj = {
    get: "afterGet",
    post: "afterPost",
    put: "afterPut",
    delete: "afterDelete",
  };

  if (!req || !permission) {
    return;
  }

  let method = req?.method?.toLowerCase();

  let permissionStr = methodObj[method];

  let methodArray = permission[permissionStr];

  let beforeArray = permission?.afterOperation;
  let doc = null;

  if (Array.isArray(methodArray)) {
    for (let i = 0; i < methodArray?.length; i++) {
      let func = methodArray[i];
      if (typeof func !== "function") {
        continue;
      }
      doc = await func(req, data);
    }
  }

  if (Array.isArray(beforeArray)) {
    for (let i = 0; i < beforeArray?.length; i++) {
      let func = beforeArray[i];
      if (typeof func !== "function") {
        continue;
      }
      doc = await func({ req, data });
    }
  }

  return doc;
}

module.exports = handleAfterPermission;
