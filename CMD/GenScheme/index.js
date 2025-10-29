const path = require("path");
const { fileURLToPath } = require("url");
const { randomInt } = require("crypto");
const { input } = require("@inquirer/prompts");

const {
  getConfigObject,
  projectIsModuleBased,
  updateConfigFile,
  getStructureObject,
  updateStructureObject,
} = require("../../UTILS/config");

const { copyDirContents } = require("../../UTILS/helpfull");
const cliMessage = require("../../UTILS/cliMessage");

async function GenScheme() {
  const config = await getConfigObject();
  const cwd = process.cwd();
  const currentDir = __dirname;

  if (!config) {
    cliMessage.printError(["Failed to get config object", "Run initializer"]);
    return;
  }

  if (!config?.baseFolder) {
    cliMessage.printError(["Base folder not found", "Run initializer"]);
    return;
  }

  const moduleBase = projectIsModuleBased();
  if (moduleBase !== "commonjs") {
    cliMessage.printError(
      "chapchapapi only supports module-based JS at this point"
    );
    return;
  }

  // Generate a random 6-digit confirmation code
  const confirmationCode = randomInt(100000, 999999);

  cliMessage.printWarning([
    "⚠️  WARNING: This operation will overwrite existing scheme files!",
    "If any of the files already exist, their contents WILL BE LOST.",
    "If you prefer, you can create the scheme files manually instead.",
    "",
    `To proceed, type the following 6-digit code exactly as shown:`,
    `>>> ${confirmationCode}`,
  ]);

  // Ask the user to type the code
  const userInput = await input({
    message: "Enter the confirmation code to proceed:",
  });

  if (parseInt(userInput, 10) !== confirmationCode) {
    cliMessage.error([
      "❌ Incorrect confirmation code.",
      "Aborting scheme generation.",
    ]);
    return;
  }

  cliMessage.success(["✅ Code confirmed", "Generating scheme files..."]);

  const fromDir = path.join(currentDir, "commonjs");
  const toDir = path.join(cwd, config.baseFolder, "Controller", "Scheme");

  const copyResult = await copyDirContents(fromDir, toDir);

  if (!copyResult) {
    cliMessage.error("Failed to generate scheme files");
    return;
  }

  cliMessage.success("✅ Scheme files generated successfully!");
}

module.exports = GenScheme;
