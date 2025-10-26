const { mergeIfObject } = require("./objectUtils");

function buildResponse({ baseMessage, data, beforeRes, afterRes }) {
  let response = {};

  // Include base message only if it's a defined string
  if (typeof baseMessage === "string" && baseMessage.trim() !== "") {
    response._message = baseMessage;
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
