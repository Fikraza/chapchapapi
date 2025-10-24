const path = require("path");
const fs = require("fs");
const structure_file_path = "/chapchapapi/structure.json";
const config_file_path = "/chapchapapi/config.json";

function baseFolderSetup() {
  const cwd = process.cwd();
  let base_path = path.join(cwd, "chapchapapi");

  if (!fs.existsSync(base_path)) {
    fs.mkdirSync(base_path, { recursive: true });
  }
}

function jsonFileToObj(file_path) {
  if (!fs.existsSync(file_path)) {
    return null;
  }
  const ext = path.extname(file_path);

  if (ext !== ".json") {
    return null;
  }

  const jsonContent = fs.readFileSync(file_path, "utf-8");
  const jsonObj = JSON.parse(jsonContent);
  return jsonObj;
}

function getConfigPath() {
  const cwd = process.cwd();
  const config = path.join(cwd, config_file_path);

  return config;
}

function getConfigObject() {
  try {
    const config_file_path = getConfigPath();

    const jsonObj = jsonFileToObj(config_file_path);

    return jsonObj;
  } catch (e) {
    return null;
  }
}

function getPrismaFilePath() {
  let startDir = process.cwd();
  let prisma_path = path.join(startDir, "prisma/schema.prisma");

  if (fs.existsSync(prisma_path)) {
    return prisma_path;
  }

  return null;
}

function getPackageJsonPath() {
  let startDir = process.cwd();
  let package_json_path = path.join(startDir, "package.json");
  if (fs.existsSync(package_json_path)) {
    return package_json_path;
  }
  return null;
}

function projectIsModuleBased() {
  let startDir = process.cwd();
  let package_json_path = getPackageJsonPath(startDir);

  if (!package_json_path) {
    throw "Pacjage json file not found";
  }

  const jsonContent = fs.readFileSync(package_json_path, "utf-8");
  if (jsonContent.type === "module") {
    return "module";
  }

  return "commonjs";
}

function updateConfigFile(newConfigFields) {
  baseFolderSetup();
  let config = getConfigObject();

  let newConfig = { ...config, ...newConfigFields };

  let config_file_path = getConfigPath();

  fs.writeFileSync(config_file_path, JSON.stringify(newConfig, null, 2));
}

function getStructurePath() {
  const cwd = process.cwd();
  const config = path.join(cwd, structure_file_path);

  return config;
}

function getStructureObject() {
  let structure_path = getStructurePath();
  if (!structure_path) {
    return null;
  }

  let obj = jsonFileToObj(structure_path);

  if (!obj) {
    return null;
  }
  return obj;
}

module.exports = {
  getConfigPath,
  getPrismaFilePath,
  getConfigObject,
  getPackageJsonPath,
  projectIsModuleBased,
  updateConfigFile,
  jsonFileToObj,
  getStructureObject,
};
