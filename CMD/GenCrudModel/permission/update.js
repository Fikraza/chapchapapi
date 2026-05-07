// const prisma=require("./../../../prisma")
async function beforeTransforge({ body, tx }) {}

async function beforeUpdate({ req, tx }) {}

async function afterUpdate({ req, record }) {}

module.exports = { beforeUpdate, afterUpdate, beforeTransforge };
