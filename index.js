var koa = require('koa');
var router = require('koa-router');
var bodyParser = require('koa-body');
var setting = require('./setting.js');
var app = new koa();
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(setting.upload_endpoint),
    accessKeyId: setting.access_key,
    secretAccessKey: setting.secret_key
});

var fs = require('fs');
var crypto = require('crypto');

app.use(bodyParser({
    formidable: { uploadDir: './uploads' },
    multipart: true,
    urlencoded: true
}));

var _ = router();

_.get('/', (ctx) => { ctx.body = "HELLO"; });
_.post('/upload', async (ctx) => {
    //check if password is correct
    const password = ctx.request.body.password;
    if (password != setting.password) {
        ctx.status = 403;
        ctx.body = "Not Authorized";
        return;
    }

    //check if file is uploaded
    const file = ctx.request.files.file;
    if (file === undefined) {
        ctx.status = 400;
        ctx.body = "Bad Request";
        return;
    }

    //check if file type is allowed
    var file_path = file.path;
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(file.name)[1].toLocaleLowerCase();
    const allowed_extensions = setting.allowed_extensions.split(",").map((e) => e.trim().toLocaleLowerCase());
    if (allowed_extensions.indexOf(ext) === -1) {
        ctx.status = 400;
        ctx.body = "File type not allowed";
        return;
    }

    const file_buffer = get_file_buffer(file_path);
    const hash = get_hash_from_file_buffer(file_buffer);
    if (!file_buffer) {
        ctx.status = 400;
        ctx.body = "Invalid file";
        return;
    }

    const dir = hash.substring(0, 2);
    var params = {
        Bucket: setting.bucket,
        Key: `${dir}/${hash}.${ext}`,
        ContentEncoding: 'base64',
        ContentType: file.type,
        Body: file_buffer,
        ACL: "public-read"
    };
    const result = await upload(params);
    if (result) {
        ctx.body = { src: `${setting.url}/${dir}/${hash}.${ext}` };
        return;
    }
    ctx.status = 503;
    ctx.body = "Server Error";
});

function get_hash_from_file_buffer(buffer) {
    const file_content = buffer.toString('utf8');
    if (file_content === null) return false;

    var hash = crypto.createHash('sha1');
    hash.setEncoding('hex');
    hash.write(file_content);
    hash.end();
    return hash.read();
}

function get_file_buffer(path) {
    const buffer = fs.readFileSync(path);
    fs.unlinkSync(path);
    return buffer;
}

async function upload(params) {
    try {
        return await s3.putObject(params).promise();
    } catch (e) {
        console.log(e);
        return false;
    }
}
app.use(_.routes());
app.listen(setting.port);