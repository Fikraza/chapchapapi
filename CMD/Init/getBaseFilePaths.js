const chalk = require("chalk");
const {
  getConfigObject,
  getPrismaFilePath,
  getPackageJsonPath,
} = require("../../UTILS/config");

const cliMessage = require("../../UTILS/cliMessage");

function getBaseFilePaths() {
  const cwd = process.cwd();

  const package_json_file_path = getPackageJsonPath(cwd);
  const prisma_file_path = getPrismaFilePath(process.cwd());

  if (!package_json_file_path) {
    cliMessage.printError(`
    The file package.json was not found in the base directory.
  
    Make sure you are in the correct project folder
    and that this is a valid Node.js project.
  
    This project must be initialized with npm or yarn before continuing.
  
    To fix this, you can run:
      npm init -y
    or:
      yarn init -y
    `);

    return null;
  }

  if (!prisma_file_path) {
    cliMessage.printError(`
  Prisma schema file not found in the current directory.
  
  This project requires Prisma to be initialized first.
  Usually, the schema file is located at:
    prisma/schema.prisma
  
  To create a new Prisma project, visit:
    ${chalk.blueBright.underline("https://pris.ly/d/getting-started")}
  
  Or run:
    ${chalk.green("npx prisma init")}
  `);

    return null;
  }

  return { package_json_file_path, prisma_file_path };
}
module.exports = getBaseFilePaths;
