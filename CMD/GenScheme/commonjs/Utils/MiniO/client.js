const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_END_POINT, // or your MinIO server IP
  port: process.env.MINIO_PORT,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

module.exports = minioClient;
