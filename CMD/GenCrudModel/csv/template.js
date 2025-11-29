async function beforeTemplate({ req }) {}
async function afterTemplate({ req }) {}

const templateHeadArray = ["id", "name", "email"];

module.exports = { templateHeadArray, beforeTemplate, afterTemplate };
