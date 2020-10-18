require('dotenv').config();
module.exports = {
  upload_endpoint: process.env.SPACE_ENDPOINT,
  port: process.env.SERVER_PORT,
  access_key: process.env.SPACE_ACCESS_KEY,
  secret_key: process.env.SPACE_SECRET_KEY,
  url: process.env.UPLOAD_URL,
  bucket: process.env.SPACE_BUCKET
}