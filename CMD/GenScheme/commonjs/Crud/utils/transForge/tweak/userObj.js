function userObj(obj) {
  const { body, field, req } = obj;
  const member = req.member;

  if (!member) {
    throw { custom: true, message: "Failed to add logged in user id" };
  }

  body[field] = member;
}

module.exports = userObj;
