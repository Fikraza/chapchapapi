const { mergeIfObject } = require("./objectUtils");

function buildResponse({ _message, data, beforeRes, afterRes }) {
  let response = {};

  if (_message) {
    response._message = _message;
  }
  // Include data only if it's a plain object
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    response = { ...response, ...data };
  }

  // Merge before/after permission responses (if valid)
  response = mergeIfObject(response, beforeRes);
  response = mergeIfObject(response, afterRes);

  return response;
}

module.exports = { buildResponse };
