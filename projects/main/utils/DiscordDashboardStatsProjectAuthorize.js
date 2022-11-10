const Project = require(__models + '/DBDStats/dbd_project')
const User = require(__models + '/user')

let ObjectId = require('mongoose').Types.ObjectId

module.exports = async (req, res, next) => {
    try {
        const project_id = req.headers['dbd-project-id']
        const account_token = req.headers['acs-account-token']

        if (!project_id || !account_token) return res.status(401).send('Missing "DBD-Project-Id" and/or "ACS-Account-Token" header(s).')

        if (!ObjectId.isValid(project_id)) return res.status(401).send({error: true, message: "ObjectId not valid."})

        const dbd_project = await Project.findOne({
            _id: project_id,
        }).populate('owner')
        if (!dbd_project) return res.status(401).send({error: true, message: "Project Id not valid."})

        if (dbd_project.owner.account_access_token != account_token) return res.status(401).send({
            error: true,
            message: "Account Token not valid."
        })

        req.dbd_project = dbd_project

        next()
    }catch(err){
        return res.status(401).send({
            error: true,
            message: "Unknown error."
        })
    }
}
