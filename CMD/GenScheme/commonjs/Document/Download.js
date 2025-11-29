const miniO = require("./../Utils/MiniO");

async function Download(req, res, next) {
  try {
    // code here

    const { id } = req.query;

    if (!id) {
      throw { custom: true, message: "Updated id" };
    }

    let bucketArray = id.split("_");
    let bucketName = bucketArray[0];
    //
    let filePath = await miniO.download({ bucketName, fileName: id });

    return res.sendFile(filePath);
  } catch (e) {
    next(e);
  }
}

module.exports = Download;
