const fs = require("fs");
const path = require("path");
const { getPrismaFilePath } = require("../config");
const prismaDict = require("./prismaDict");
// const metaInfoDict = require("./metaInfoDict");

async function getPrismaModels() {
  // const configObj = getConfigObject()
  // co;
  //console.log("prisma file path", prisma_file_path);

  const cwd = process.cwd();

  let prisma_file = getPrismaFilePath();

  if (!fs.existsSync(prisma_file)) {
    console.warn("prima file not found");
    return null;
  }

  const data = fs.readFileSync(prisma_file, "utf8");

  const lines = data.split("\n");

  const modelStrObj = getModelStrObj({ lines });

  // console.log(configObj);

  //console.log(modelStrObj);

  const modelStrObjKeys = Object.keys(modelStrObj);
  const model = {};

  for (let i = 0; i < modelStrObjKeys.length; i++) {
    let modelName = modelStrObjKeys[i];
    let fieldArray = modelStrObj[modelName];

    let fields = {};
    let include = {};

    fieldObjectGen({ fieldArray, fields, include });

    model[modelName] = { field: fields, include };
  }

  console.log(model);

  return model;
}

function getModelStrObj({ lines }) {
  const modelStrObj = {};
  let activeModel = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim()?.replace(/\s+/g, " ");

    if (line.includes("model") && line.includes("{")) {
      let lineArr = line.split(" ");
      if (!lineArr[1]) {
        activeModel = "";
        continue;
      }
      activeModel = lineArr[1];
      modelStrObj[activeModel] = [];
      continue;
    }

    if (Array.isArray(modelStrObj[activeModel]) && !line.includes("}")) {
      modelStrObj[activeModel].push(line);
    }

    if (line.includes("}")) {
      activeModel = "";
    }
  }

  return modelStrObj;
}

function fieldObjectGen({ fieldArray, fields = {}, include }) {
  for (let i = 0; i < fieldArray.length; i++) {
    let fieldLine = fieldArray[i];
    let noSpaceFieldLine = fieldLine.replace(/\s+/g, "");

    let fieldLineArray = fieldLine.split(" ");

    let field = fieldLineArray[0]?.toLowerCase()?.replace(/\s+/g, "")?.trim();
    let type = fieldLineArray[1]?.toLowerCase()?.replace(/\s+/g, "")?.trim();
    let metaInfo = fieldLineArray[2]?.toLowerCase()?.replace(/\s+/g, "");

    let convertedType = type?.toLowerCase()?.replace(/\?/g, "");

    const fieldItemObj = prismaDict[convertedType]
      ? structuredClone(prismaDict[convertedType])
      : null;

    if (!fieldItemObj) {
      if (
        convertedType &&
        !convertedType?.includes("_enum") &&
        !hasSpecialOrNumbers(convertedType)
      ) {
        include[convertedType] = true;
      }
      continue;
    }

    if (type?.trim()?.endsWith("?")) {
      fieldItemObj.required = false;
    }

    if (noSpaceFieldLine?.includes("@default")) {
      fieldItemObj.skip_check = true;
    }

    fields[field] = fieldItemObj;
  }
}

function hasSpecialOrNumbers(str) {
  // Matches any number (0–9) OR any non-alphabetic character
  return /[^a-zA-Z]/.test(str);
}

module.exports = getPrismaModels;
