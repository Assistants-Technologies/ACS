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
    prodPort: 3005,
}
