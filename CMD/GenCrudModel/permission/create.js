async function beforeTransforge({ body, tx }) {}

async function beforeCreate({ req }) {}

async function afterCreate({ req, record }) {}

module.exports = { beforeCreate, afterCreate, beforeTransforge };
