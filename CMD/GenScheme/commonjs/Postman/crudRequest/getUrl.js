require("dotenv").config();
const BaseUrl = process.env.TAJIRIBASEURL || "";

function getUrl(modelName) {
  return `{{local}}/${BaseUrl}/scheme/${
    typeof modelName === "string" ? modelName : ""
  }`;
}

module.exports = getUrl;
