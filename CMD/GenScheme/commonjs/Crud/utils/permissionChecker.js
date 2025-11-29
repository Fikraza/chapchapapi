const responseBuilder = require("./responseBuilder");

function ifmethodNotAllowedThrowError({ permisionConfig, method }) {
  let allowedMethods = permisionConfig?.allowedMethods;

  if (!Array.isArray(allowedMethods)) {
    console.warn("allowedMethods should be an array");
    console.log("skipping method check");
    return true;
  }

  let found = allowedMethods.find(
    (m) => m.toLowerCase() === method.toLowerCase()
  );

  if (!found) {
    throw { custom: true, message: "Method not allowed", status: 401 };
  }

  return true;
}

async function beforeRequestPermissionCheck(obj) {
  if (typeof obj !== "object" || obj === null) {
    return;
  }
  const { req, body, beforeReqFunction, responseObject } = obj;
  if (typeof beforeReqFunction !== "function") {
    console.warn("beforeReqFunction is not a function");
    console.log("skipping before request permission check");
    return;
  }

  let newResponsePayload = await beforeReqFunction(obj);

  responseBuilder({ responseObject, newResponsePayload });
}

async function afterRequestPermissionCheck(obj) {
  const { req, record, afterReqFunction, responseObject } = obj;
  if (typeof afterReqFunction !== "function") {
    console.warn("beforeReqFunction is not a function");
    console.log("skipping before request permission check");
    return;
  }

  let newResponsePayload = await afterReqFunction(obj);

  responseBuilder({ responseObject, newResponsePayload });
}

module.exports = {
  ifmethodNotAllowedThrowError,
  beforeRequestPermissionCheck,
  afterRequestPermissionCheck,
};
