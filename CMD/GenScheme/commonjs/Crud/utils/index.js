const { isPlainObject, mergeIfObject } = require("./objectUtils");

const {
  checkPermission,
  runPermissionHooks,
  handleAfterPermission,
  handleBeforePermission,
} = require("./permissionHandler");

const { buildResponse } = require("./responseBuilder");

module.exports = {
  isPlainObject,
  mergeIfObject,
  checkPermission,
  runPermissionHooks,
  handleAfterPermission,
  handleBeforePermission,
  buildResponse,
};
