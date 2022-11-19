const express = require('express')
const router = express.Router()

const Project = require('../../../../../models/DBDStats/dbd_project')
const Views = require('../../../../../models/DBDStats/Views/view')

function getCountries(lang = 'en') {
    const A = 65
    const Z = 90
    const countryName = new Intl.DisplayNames([lang], { type: 'region' });
    const countries = {}
    for(let i=A; i<=Z; ++i) {
        for(let j=A; j<=Z; ++j) {
            let code = String.fromCharCode(i) + String.fromCharCode(j)
            let name = countryName.of(code)
            if (code !== name) {
                countries[code.toLowerCase()] = name
            }
        }
    }
    return Object.keys(countries)
}

const countries_list = getCountries()

router.get('/get', async(req,res)=>{
    if(!req.session?.user?._id) return res.status(401).json({
        error: true,
        message: 'Unauthorized',
    })

    const UserProjects = await Project.find({owner: req.session.user._id})
    return res.status(200).json({
        error: false,
        data: UserProjects,
    })
})

router.post('/create', async(req,res)=>{
    if(!req.session?.user?._id) return res.status(401).json({
        error: true,
        message: 'Unauthorized',
    })

    const { project_name, project_theme } = req.body;

    if(!project_name || !project_theme)
        return res.status(400).json({
            error: true,
            message: 'Missing required fields',
        })

    const UserProjects = await Project.find({owner: req.session.user._id})
    if(UserProjects.length >= 2) {
        return res.status(400).json({
            error: true,
            message: 'You can only have up to 2 projects unless you have Premium Account Boost.',
        })
    }

    const NewProject = await Project.create({
        owner: req.session.user._id,
        name: project_name,
        theme: project_theme,
    })

    return res.status(200).json({
        error: false,
        project_id: NewProject._id,
    })
})

router.get('/views/total/countries/:projectId', async (req,res)=>{
    const projectId = req.params.projectId
    if(!req.session?.user?._id) return res.json({
        error: true,
        message: 'Unauthorized',
    })

    let ObjectId = require('mongoose').Types.ObjectId
    if(!ObjectId.isValid(projectId)) {
        return res.status(400).json({
            error: true,
            message: 'Invalid ObjectId ' + projectId,
        })
    }

    const ProjectData = await Project.findOne({
        _id: projectId,
    })

    if(!ProjectData) {
        return res.status(400).json({
            error: true,
            message: 'Project does not exist',
        })
    }

    if(ProjectData.owner.toString() !== req.session.user._id.toString()) {
        return res.status(400).json({
            error: true,
            message: 'No access to the project.',
        })
    }

    const ViewsData = await Views.find({
        project_id: projectId,
    })

    let countryData = {

    }
    for(const country of countries_list) {
        countryData[country] = ViewsData.filter(view => view.country == country).length
    }

    return res.status(200).json({
        error: false,
        countryData: countryData,
    })
})


router.get('/stats/:projectId', async (req,res)=>{
    const projectId = req.params.projectId
    if(!req.session?.user?._id) return res.json({
        error: true,
        message: 'Unauthorized',
    })

    let ObjectId = require('mongoose').Types.ObjectId
    if(!ObjectId.isValid(projectId)) {
        return res.status(400).json({
            error: true,
            message: 'Invalid ObjectId ' + projectId,
        })
    }

    const ProjectData = await Project.findOne({
        _id: projectId,
    })

    if(!ProjectData) {
        return res.status(400).json({
            error: true,
            message: 'Project does not exist',
        })
    }

    if(ProjectData.owner.toString() !== req.session.user._id.toString()) {
        return res.status(400).json({
            error: true,
            message: 'No access to the project.',
        })
    }

    const ProjectViews = await Views.find({
        project_id: projectId,
    })

    return res.status(200).json({
        error: false,
        data: {
            today: {
                views: ProjectViews.filter(view => new Date().toDateString() == new Date(view.createdAt).toDateString()).length,
                uniqueUsers: ProjectViews.filter(view => new Date().toDateString() == new Date(view.createdAt).toDateString()).filter((view, index, self) => self.findIndex(t => t.user_id === view.user_id) === index).length,
            },
            total: {
                views: ProjectViews.length,
                uniqueUsers: ProjectViews.filter((view, index, self) => self.findIndex(t => t.user_id === view.user_id) === index).length,
            }
        }
    })
})

router.get('/views/comparison/:projectId', async(req,res)=>{
    const projectId = req.params.projectId
    if(!req.session?.user?._id) return res.json({
        error: true,
        message: 'Unauthorized',
    })

    let ObjectId = require('mongoose').Types.ObjectId
    if(!ObjectId.isValid(projectId)) {
        return res.status(400).json({
            error: true,
            message: 'Invalid ObjectId ' + projectId,
        })
    }

    const ProjectData = await Project.findOne({
        _id: projectId,
    })

    if(!ProjectData) {
        return res.status(400).json({
            error: true,
            message: 'Project does not exist',
        })
    }

    if(ProjectData.owner.toString() !== req.session.user._id.toString()) {
        return res.status(400).json({
            error: true,
            message: 'No access to the project.',
        })
    }

    const ProjectViews = await Views.find({
        project_id: projectId,
    })

    function getDateXDaysAgo(numOfDays, date = new Date()) {
        const daysAgo = new Date(date.getTime());
        daysAgo.setUTCDate(date.getUTCDate() - numOfDays);

        const start = new Date(daysAgo);
        start.setUTCHours(0,0,0,0);

        const end = new Date(daysAgo);
        end.setUTCHours(23,59,59,999);

        return {start, end};
    }

    function filterProjectViews(projectViews, {start, end}) {
        return projectViews.filter(view => {
            console.log(view, start, end)
            return new Date(view.createdAt) >= start && new Date(view.createdAt) <= end;
        })
    }

    let dates = JSON.parse(JSON.stringify({
        today: filterProjectViews(ProjectViews, getDateXDaysAgo(0)).length,
        yesterday: filterProjectViews(ProjectViews, getDateXDaysAgo(1)).length,
        days_ago_2: filterProjectViews(ProjectViews, getDateXDaysAgo(2)).length,
        days_ago_3: filterProjectViews(ProjectViews, getDateXDaysAgo(3)).length,
        days_ago_4: filterProjectViews(ProjectViews, getDateXDaysAgo(4)).length,
        days_ago_5: filterProjectViews(ProjectViews, getDateXDaysAgo(5)).length,
        days_ago_6: filterProjectViews(ProjectViews, getDateXDaysAgo(6)).length,
        days_ago_7: filterProjectViews(ProjectViews, getDateXDaysAgo(7)).length,
        days_ago_8: filterProjectViews(ProjectViews, getDateXDaysAgo(8)).length,
        days_ago_9: filterProjectViews(ProjectViews, getDateXDaysAgo(9)).length,
        days_ago_10: filterProjectViews(ProjectViews, getDateXDaysAgo(10)).length,
        days_ago_11: filterProjectViews(ProjectViews, getDateXDaysAgo(11)).length,
        days_ago_12: filterProjectViews(ProjectViews, getDateXDaysAgo(12)).length,
        days_ago_13: filterProjectViews(ProjectViews, getDateXDaysAgo(13)).length,
    }))

    console.log(dates)

    return res.json({
        error:false,
        dates
    })
})

module.exports = router
