const express = require('express')
const ObjectId = require('mongoose').Types.ObjectId
const router = express.Router()
const uuid = require('uuid').v4

const fs = require('fs')
const path = require('path')

const { BunnyStorageClient } = require("bunnycdnjs");

const fileUpload = require('express-fileupload');

router.use(fileUpload())

router.get('/:user_id', async (req,res) => {
    const fileExists = fs.existsSync(path.join(__dirname, `../../../public/avatar/${req.session.user._id+'.png'}`));
    if(fileExists)
        return res.sendFile(path.join(__dirname, `../../../public/avatar/${req.session.user._id+'.png'}`));
    else
        return res.sendFile(path.join(__dirname, `../../../public/avatar/default.png`));
})

router.post('/', async (req,res) => {
    const files = req.files

    if (!files || Object.keys(files).length === 0)
        return res.status(400).json({
            error: true,
            message: 'No files were uploaded',
        })

    let allowedExtensions = ["jpg", "png", "jpeg"];

    let avatarFile = req.files.file
    let extension

    if(avatarFile.size > 250000)return res.status(401).json({
        error: true,
        message: "File too big. Max size is 2.5MB",
    })

    extension = avatarFile.name.substring(avatarFile.name.lastIndexOf('.') + 1)

    if (!allowedExtensions.includes(extension))
        return res.status(401).json({
            error: true,
            message: 'Invalid file extension type',
        })

    fs.writeFileSync(path.join(__dirname, `../../../public/avatar/${req.session.user._id+'.png'}`), avatarFile.data)
    return res.send({error:false})
})

module.exports = router