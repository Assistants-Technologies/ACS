require('dotenv').config({})
const DEVELOPMENT_CHANNEL = process.env.DEVELOPMENT_CHANNEL === "TRUE";

console.log(DEVELOPMENT_CHANNEL)

const express = require('express')
const http = require('http')
const app = express()

app.get('*', (req,res)=>{
    res.status(200).send({error:false,message:"Oracle ACS VPS test."})
})

if(DEVELOPMENT_CHANNEL){
    app.listen(80)
}else{
    const server = http.createServer(app)
    server.listen(3000) // 3000 for this project
}

