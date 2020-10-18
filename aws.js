const setting = require('./setting.js');
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(setting.upload_endpoint),
    accessKeyId: setting.access_key,
    secretAccessKey: setting.secret_key
});

function upload (params)
{   
    s3.putObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
    });
}
module.exports = {
    upload: upload
}