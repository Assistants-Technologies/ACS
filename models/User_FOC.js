const User = require('./user');
module.exports = async (query) => {
    let Found;
    Found = await User.findOne(query);
    if(!Found){
        Found = await User.create(query);
    }
    return Found;
}