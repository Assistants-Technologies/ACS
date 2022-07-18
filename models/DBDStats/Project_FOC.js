const Project = require('./dbd_project');
module.exports = async (query) => {
    let Found;
    Found = await Project.findOne(query);
    if(!Found){
        Found = await Project.create(query);
    }
    return Found;
}