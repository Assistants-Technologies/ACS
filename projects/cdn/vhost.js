const express = require('express')
const db = require('quick.db');
const uploadAppDb = new db.table('uploadApp');

const cloudinary = require('cloudinary').v2;
cloudinary.config(require('../../cloudinary_config').cloudinary);

const vhost = ({next_app, next_handle}) => {
    const uploadAppGet = express();

    uploadAppGet.get('/:id', async (req,res)=>{
        const image = uploadAppDb.get(req.params.id);
        if(!image)return res.send({error:true,message:"No image with this id passed found."});
        try{
            const response = await require('node-fetch')(image);
            const buffer = await response.buffer();
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(buffer);
        }catch(err){
            return res.send({error:true,message:"No image with this id passed found."});
        }
    });

    return uploadAppGet
}

module.exports = {
    vhost,
    prodPort: 3003,
}
