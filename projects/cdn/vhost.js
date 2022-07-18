const express = require('express')
const path = require("path")
const uuid = require('uuid').v4

const fileUpload = require('express-fileupload')

const vhost = ({next_app, next_handle}) => {
    const app = express();

    app.use(express.static(path.join(__dirname, '../../cdn'), { redirect : false }));

   /* app.get('/get', async(req,res) => {
        const data = await CDN.List('.')
        res.send(data)
    })

    app.get('/upload', async (req,res) => {
        let allowedExtensions = ["jpg", "png", "jpeg"]

        let sampleFile = req.files.file
        let fileName = req.body?.fileName || uuid()
        let extension

        if (!files || Object.keys(files).length === 0)
            return res.status(400).send('No files were uploaded.')

        if(sampleFile.size > 30000000)return res.status(401).send("File too big. Max size is +- 30MB")

        extension = sampleFile.name.substring(sampleFile.name.lastIndexOf('.') + 1)

        if (!allowedExtensions.includes(extension))
            return res.status(401).send('Invalid file extension type.')

        const upload_stream = CDN.Upload(req.body?.resourceFolder || '.', fileName, sampleFile.data)
        return res.send(upload_stream)
    })*/

    return app
}

module.exports = {
    vhost,
    prodPort: 3001
}
