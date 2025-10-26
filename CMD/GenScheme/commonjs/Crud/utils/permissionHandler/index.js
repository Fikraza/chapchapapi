const handleAfterPermission = require("./handleAfterPermission");
const handleBeforePermission = require("./handleBeforePermission");

async function checkPermission(modelDoc, method) {
  const allowedMethods = Array.isArray(modelDoc?.permission?.allowedMethods)
    ? modelDoc.permission.allowedMethods
    : [];

  if (!allowedMethods.includes(method)) {
    throw { custom: true, message: "Model permission", status: 403 };
  }
}

async function runPermissionHooks({ req, permission, data, hookFn }) {
  return hookFn ? await hookFn({ req, permission, data }) : {};
}

module.exports = {
  checkPermission,
  runPermissionHooks,
  handleAfterPermission,
  handleBeforePermission,
};
