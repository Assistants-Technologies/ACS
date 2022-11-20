const express = require('express')
const router = express.Router()

router.post('/', async(req,res)=>{
    const { name, codename, version } = req.body
    if(!name || !codename || !version)return res.status(400).send({error:true,message:"Body doesn't match the requirements."})

    await req.dbd_project.updateOne({
        theme: {
            name,
            codename,
            version
        }
    })

    return res.status(200).send({error:false})
})

module.exports = router
