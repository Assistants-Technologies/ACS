const express = require('express')
const app = express()

app.get('*', (req,res)=>{
    res.status(200).send({error:false,message:"Oracle ACS VPS test."})
})

app.listen(80)