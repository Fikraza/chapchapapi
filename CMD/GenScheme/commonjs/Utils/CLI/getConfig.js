const fs = require("fs");
const process = require("process");
const path = require("path");

function getConfig() {
  const rootDir = process.cwd();
  // console.log(rootDir);
  const configPath = path.join(rootDir, "tajiri.json");

  if (!fs.existsSync(configPath)) {
    throw {
      custom: true,
      message: "Scheme cli config file missing",
      status: 504,
    };
  }

  const jsonContent = fs.readFileSync(configPath, "utf-8");

  let config = JSON.parse(jsonContent);

  return config;
}

module.exports = getConfig;
