OVERVIEW
==========
Simple upload server to upload files to Digital Ocean Space.

To prevent uploading the same file, we use sha1 checksum of the file as the file name and the first two characters as the file directory.


ENV
===============
Set this as your environment variable.

Create `.env` file when in development.
```
SERVER_PORT=8080
SPACE_BUCKET=bucket_name
SPACE_ENDPOINT=https://nyc3.digitaloceanspaces.com
SPACE_ACCESS_KEY=xxxxxxxxxxxxxxxxxx
SPACE_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
UPLOAD_URL=https://bucket_name.nyc3.digitaloceanspaces.com
ALLOWED_EXTENSIONS=jpg,jpeg,png,pneg,gif
UPLOAD_PASSWORD=test123
```

UPLOAD ENDPOINT
===============
```json
POST /upload

multipart/form-data

Response:
{
  "src": "https://UPLOAD_URL/0d/0d8b7ab472a0147b8754613f29b22c0ce7e0d9b0.jpg"
}
```

|param|value|
|:---|:---|
|file|uploading file|
|password|`UPLOAD_PASSWORD`|