var koa = require('koa');
var router = require('koa-router');
var bodyParser = require('koa-body');
var setting = require('./setting.js');
var app = new koa();
var {upload} = require("./aws.js");

var fs = require('fs');
var crypto = require('crypto');
function get_hash(file_path) {
    var file_buffer = fs.readFileSync(file_path);
    let file_content = null;
    if (Buffer.isBuffer(file_buffer)) { file_content = file_buffer.toString('utf8'); }
    fs.unlink(file_path, (err)=>{console.log(err);});
    if (file_content === null) return false;
    var hash = crypto.createHash('sha1');
    hash.setEncoding('hex');
    hash.write(file_content);
    hash.end();
    var sha1sum = hash.read();
    return {content:file_buffer, hash:sha1sum};
}
app.use(bodyParser({
    formidable: { uploadDir: './uploads' },
    multipart: true,
    urlencoded: true
}));

var _ = router(); //Instantiate the router

_.get('/', (ctx) => { ctx.body = "HELLO"; });
_.post('/upload', async (ctx) => {
    console.log(ctx.request.files);
    var file_path = ctx.request.files.file.path;
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(ctx.request.files.file.name)[1];
    console.log(ext);
    var metadata = ctx.request.files.file.type;
    const {content, hash} = get_hash(file_path);
    if(hash == undefined){
        ctx.body = {src:null};
        return;
    } 
    const dir = hash.substring(0,2);
    var params = {
        Bucket: setting.space_bucket,
        Key: `${dir}/${hash}.${ext}`,
        ContentEncoding: 'base64',
        ContentType: metadata,
        Body: content,
        ACL: "public-read"
    };
    upload(params);
    ctx.body = {src:`${setting.url}/${dir}/${hash}.${ext}`};
});

app.use(_.routes());
app.listen(setting.port);