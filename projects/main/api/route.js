const express = require('express')
const router = express.Router()

router.use('/auth', require('./auth/route'))
router.use((req,res,next)=>{
    if(!req.session?.user?.admin)return res.status(401).json({error:true, message: "Sorry, you are not allowed to access this resource"});
    next();
})
router.use('/dbd-stats', require('./dbd-stats/route'))
router.use('/shop', require('./shop/route'))
router.use('/user', require('./user/route'))
router.use('/discord-dashboard', require('./discord-dashboard/route'))

module.exports = router