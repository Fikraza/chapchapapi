const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: "127.0.0.1", // or your MinIO server IP
  port: 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

module.exports = minioClient;
