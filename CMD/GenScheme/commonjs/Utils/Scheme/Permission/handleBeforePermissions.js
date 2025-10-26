async function handleBeforePermission({ req, permission }) {
  let methodObj = {
    get: "beforeGet",
    post: "beforePost",
    put: "beforePut",
    delete: "beforeDelete",
  };

  if (!req || !permission) {
    return;
  }

  let method = req?.method?.toLowerCase();

  let permissionStr = methodObj[method] || "";

  let methodArray = permission[permissionStr] || [];

  let beforeArray = permission?.beforeOperation;

  if (Array.isArray(beforeArray)) {
    for (let i = 0; i < beforeArray?.length; i++) {
      let func = beforeArray[i];
      if (typeof func !== "function") {
        continue;
      }
      await func(req);
    }
  }

  if (Array.isArray(methodArray)) {
    for (let i = 0; i < methodArray?.length; i++) {
      let func = methodArray[i];
      if (typeof func !== "function") {
        continue;
      }
      await func(req);
    }
  }
}

module.exports = handleBeforePermission;
