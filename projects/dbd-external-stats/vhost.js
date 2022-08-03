const express = require('express')

const vhost = ({next_app, next_handle}) => {
    const app = express()

    app.all('*', (req,res)=>{
        return res.json({error:true,message:'Project deprecated'})
    })

    return app
}

module.exports = {
    vhost,
    prodPort: process.env.PROD_BUT_BETA === "TRUE" ? 2005 : 3005
}
