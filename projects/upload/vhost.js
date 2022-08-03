const express = require('express')
const db = require('quick.db');
const uploadAppDb = new db.table('uploadApp');
const uniqid = require('uniqid');

const cloudinary = require('cloudinary').v2;
cloudinary.config(require('../../cloudinary_config').cloudinary);

const fileUpload = require('express-fileupload');

const vhost = ({next_app, next_handle}) => {
    const uploadApp = express()

    uploadApp.use(fileUpload());

    uploadApp.post('/', (req,res) => {
        let allowedExtensions = ["jpg", "png", "jpeg"];

        let sampleFile;
        let files = req.files;
        let fileName;
        let extension;

        if (!files || Object.keys(files).length === 0)
            return res.status(400).send('No files were uploaded.');
        sampleFile = req.files.sampleFile;

        if(sampleFile.size > 30000000)return res.status(401).send("File too big. Max size is +- 30MB");

        fileName = uniqid.time();
        extension = sampleFile.name.substring(sampleFile.name.lastIndexOf('.') + 1);

        if (!allowedExtensions.includes(extension))
            return res.status(401).send('Invalid file extension type.');

        const upload_stream = cloudinary.uploader.upload_stream({}, async function (err, image) {
            if(err)return res.send(err);
            const uid = uniqid.time();
            await uploadAppDb.set(uid, image.secure_url);
            return res.redirect(`https://cdn.assistantscenter.com/${uid}`);
        });

        const stream = require('stream');
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(sampleFile.data));
        bufferStream.pipe(upload_stream);
    });

    uploadApp.get('*', (req,res)=>{
        res.send(`<html>
            <body>
                <form ref='uploadForm'
                      id='uploadForm'
                      action='/'
                      method='post'
                      encType="multipart/form-data">
                    File:
                    <input type="file" name="sampleFile" />
                    <input type='submit' value='Upload!' />
                </form>
            </body>
            </html>`);
    });

    return uploadApp
}

module.exports = {
    vhost,
    prodPort: 3002,
}
