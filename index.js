require('dotenv').config({})

const express = require('express')
const https = require('https')
const fs = require("fs");
const app = express()

app.get('*', (req,res)=>{
    res.status(200).send({error:false,message:"Oracle ACS VPS test."})
})

if(process.env.DEVELOPMENT_CHANNEL){
    app.listen(80)
}else{
    const server = https.createServer(app, {
        requestCert: false,
        rejectUnauthorized: false,
        key: fs.readFileSync('/etc/cert/assistantscenter.com/privkey.pem'),
        cert: fs.readFileSync('/etc/cert/assistantscenter.com/fullchain.pem')
    })

    server.listen(443)
}

