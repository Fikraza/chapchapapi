// db.js
require("dotenv").config(); // Required to read DATABASE_URL
const pg = require("pg");
const os = require("node:os");
const { PrismaPg } = require("@prisma/adapter-pg");
// Ensure the path and extension are correct for CJS
const { PrismaClient } = require("../../../generated/prisma");

const numWorkers = os.availableParallelism
  ? os.availableParallelism()
  : os.cpus().length;
const totalDbCapacity = 80;

// 1. Setup the PostgreSQL Pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: Math.floor(totalDbCapacity / numWorkers),
  idleTimeoutMillis: 30000,
});

// 2. Wrap the pool in the Prisma Adapter (REQUIRED for Prisma 7)
const adapter = new PrismaPg(pool);

// 3. Initialize Prisma with that adapter
const prisma = new PrismaClient({ adapter });

// Exporting both prisma and the pool
module.exports = prisma;
