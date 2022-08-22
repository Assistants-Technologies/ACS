const User = require('../../../models/user')

module.exports.VerifyToken = async (account_access_token) => {
    if(!account_access_token)
        return "You are not authorized with an Account Access Token."
    
    const user = await User.findOne({
        account_access_token
    })

    if(!user)
        return "Provided Account Access Token is invalid or expired."
    
    return user
}