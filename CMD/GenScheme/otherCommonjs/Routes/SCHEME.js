const router = require("express").Router();
const {
  Create,
  Read,
  Patch,
  Update,
  Delete,
} = require("../Controller/Scheme/Crud");

const List = require("../Controller/Scheme/List");

const Csv = require("../Controller/Scheme/Csv");

const Search = require("../Controller/Scheme/Search");

const Document = require("../Controller/Scheme/Document");

const Postman = require("../Controller/Scheme/Postman");

const {
  multerMultiFiles,
  multerSingleFile,
} = require("../Middleware/Multer");

// ✏️ CRUD Generic(Add Browse Change Delete)
router.post("/abcd/:model", Create);
router.get("/abcd/:model", Read);
router.patch("/abcd/:model", Patch);
router.put("/abcd/:model", Update);
router.delete("/abcd/:model", Delete);

//List Models
router.get("/list/:model", List.PaginationList);
router.get("/list-multi-models", List.MultiModel);

//csv
router.get("/csv/generate/:model", Csv.Generate);
router.get("/csv/template/:model", Csv.Template);
router.put("/csv/upload/:model", multerSingleFile, Csv.Upload);
router.put("/csv/upload-tx/:model", Csv.UploadTx);

//Search
router.get("/search-fuse/:model", Search.FuseSearch);
router.get("/search-pg/:model", Search.PgSearch);

//document
router.put("/document/:model", multerMultiFiles, Document.Upsert);
router.get("/document-download", Document.Download);

//postman
router.get("/postman", Postman);

module.exports = router;
