const express = require('express')
const router = express.Router()

const SHA256 = require("crypto-js").SHA256

const User = require('../../../../models/user')

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
}

router.route('/plain/login')
    .post(async(req,res)=>{
        if(req.session.user)
            return res.send({error:true,message:"Already logged in."})
        const { parameter, password } = req?.body
        if(!parameter || !password)
            return res.send({error:true,message: "Request not full."})
        
        if(parameter.length < 5 || parameter.length > 25)
            return res.send({error:true,message: "Parameter should be min 5 and max 25 characters"})

        if(password.length < 6 || password.length > 35)
            return res.send({error: true, message: "Password should be min 6 and max 35 characters"})

        const ByEmail = await User.findOne({ email: new RegExp(`^${parameter}$`, 'i') })
        const ByUsername = await User.findOne({ assistants_username: new RegExp(`^${parameter}$`, 'i') })
        const UserFound = ByEmail || ByUsername

        if(!UserFound)
            return res.send({error:true,message:"User not found."})

        if(UserFound.password !== SHA256(password).toString().trim())
            return res.send({error:true,message:"Password invalid."})

        req.session.user = {
            _id: UserFound._id,
            username: UserFound.assistants_username,
            email: UserFound.email,
            avatarURL: UserFound.avatarURL,
            admin: UserFound.admin,
        }
        await req.session.save()

        return res.send({error:false})
    })

router.route('/plain/register')
    .post(async(req,res)=>{
        if(req.session.user)
            return res.send({error:true,message:"Already logged in."})
        const { email, username, password } = req?.body
        if(!email || !username || !password)
            return res.send({error:true,message: "Request not full."})

        if(username.includes('@'))
            return res.send({error:true,message: "Username cannot include '@' character."})
        
        if(!validateEmail(email))
            return res.send({error:true,message: "Email is not valid"})
        
        if(email.length < 5 || email.length > 25 || username.length < 5 || username.length > 25)
            return res.send({error:true,message: "Email and username should be min 5 and max 25 characters"})
        
        if(password.length < 6 || password.length > 35)
            return res.send({error: true, message: "Password should be min 6 and max 35 characters"})

        const ByEmail = await User.findOne({ email: new RegExp(`^${email}$`, 'i') })
        const ByUsername = await User.findOne({ assistants_username: new RegExp(`^${username}$`, 'i') })

        let found = []

        if(ByEmail)
            found.push('e-mail')

        if(ByUsername)
            found.push('username')

        if(found[0])
            return res.send({error:true,message:`Parameters are already taken: ${found.join(', ')}`})

        const UserCreated = await User.create({
            assistants_username: username,
            email,
            password: SHA256(password).toString().trim()
        });

        req.session.user = {
            _id: UserCreated._id,
            username,
            email,
            avatarURL: UserCreated.avatarURL,
            admin: UserCreated.admin
        }
        await req.session.save()

        return res.send({error:false})
    })

router.route('/session/destroy')
    .get((req,res)=>{
        req.session.destroy()
        return res.redirect('/')
    })

router.use('/twitter', require('./twitter'))
router.use('/discord', require('./discord'))

module.exports = router