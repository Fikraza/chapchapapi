require("dotenv").config();

function errorMiddleware(error, req, res, next) {
  try {
    if (process?.env?.ENV === "development") {
      console.log(error);
    }
    if (error?.custom) {
      return res.status(error?.status || 400).json(error);
    }

    if (error?.message?.includes("Unique constraint failed")) {
      if (error?.meta) {
        return res.status(error?.status || 400).json({
          custom: true,
          _message: `!! ${error.meta.target.join(", ")} .Should be unique`,
          meta: error.meta.target,
        });
      }
    }

    res.status(500).json({
      custom: false,
      _message: "Try again",
    });
  } catch (e) {
    res.status(500).json({
      custom: false,
      _message: "Try again",
    });
  }
}

module.exports = errorMiddleware;
