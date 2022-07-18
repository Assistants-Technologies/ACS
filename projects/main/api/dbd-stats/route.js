const express = require('express')
const router = express.Router()
const ObjectId = require('mongoose').Types.ObjectId;

const Project = require('../../../../models/DBDStats/dbd_project')

const User = require('../../../../models/user')

const View = require('../../../../models/DBDStats/Views/view')


router.route('/event')
    .post(async(req,res)=>{
        const { type, data, projectId, accountToken, } = req?.body;
        if(!type || !data || !projectId || !accountToken){
            return res.status(400).json({
                error: true,
                message: 'Missing required fields',
            })
        }

        if(!ObjectId.isValid(projectId)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid ObjectId',
            })
        }

        const AccountFound = await User.findOne({
            account_access_token: accountToken,
        })

        if(!AccountFound)
            return res.status(400).json({
                error: true,
                message: 'Invalid Account Token',
            })

        const ProjectExists = await Project.findOne({
            project_id: projectId,
        });
        if(!ProjectExists) {
            return res.status(400).json({
                error: true,
                message: 'Project does not exist',
            })
        }

        if(ProjectExists.owner.toString() !== AccountFound._id.toString()) {
            return res.status(400).json({
                error: true,
                message: 'No access to the project.',
            })
        }

        if(type == 'VIEW'){
            const { websiteUrl, userId, country } = data

            await View.create({
                website_url: websiteUrl,
                user_id: userId,
                project_id: projectId,
                country,
            })
        }


        return res.status(200).json({
            error: false,
        })
    });

module.exports = router