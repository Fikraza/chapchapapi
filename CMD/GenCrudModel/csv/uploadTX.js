//upload csv using prisma transaciton
// Either all items get updated or all removed

async function uploadCSV({ csvRecord, tx, req, index }) {
  // whatever the funnction returns
  // if object will be uploaded

  return null;
}

// the file can ruturn null instead of the
//function that means the default
module.exports = uploadCSV;
