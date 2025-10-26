function authGen({ body, req, field, tweakObj = {} }) {
  const user = req.user;

  if (!field) {
    throw { custom: true, message: "Tweak Field Required" };
  }

  if (!user || typeof user !== "object") {
    throw { custom: true, message: "Authentication Failed", status: 401 };
  }

  let key = typeof tweakObj?.key === "string" ? tweakObj?.key : "id";

  body[field] = user[key];
}

module.exports = authGen;
