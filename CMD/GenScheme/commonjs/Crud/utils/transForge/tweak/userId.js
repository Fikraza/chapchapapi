function userId(obj) {
  const { body, field, req } = obj;
  const member_id = req.member_id;

  if (!member_id) {
    throw { custom: true, message: "Failed to add logged in user id" };
  }

  body[field] = member_id;
}

module.exports = userId;
