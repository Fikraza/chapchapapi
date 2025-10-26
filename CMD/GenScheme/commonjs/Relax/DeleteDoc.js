async function Delete(req, res, next) {
  try {
    // code here

    const { id } = req.query;
  } catch (e) {
    next(e);
  }
}

module.exports = Delete;
