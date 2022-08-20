import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import React from 'react'
import axios from 'axios'
import { format } from 'date-fns'

import { TailSpin } from  'react-loader-spinner'
import Router from "next/router"

export default function DiscordDashboardProjectTab () {
    const [loading, setLoading] = React.useState(true)
    const [userProjects, setUserProjects] = React.useState([])
    const [displayModal, setDisplayModal] = React.useState(false)

    const [projectName, setProjectName] = React.useState("")
    const [projectTheme, setProjectTheme] = React.useState("krdx")


    React.useEffect(()=>{
        const run = async () => {
            const res = await axios.get('/api/discord-dashboard/project/get')
            setUserProjects(res.data.data)
            setLoading(false)
        }
        run()
    }, [])

    const CreateProject = async () => {
        if(!projectName) return alert("Please enter a project name")
        if(!projectTheme) return alert("Please enter a project theme")

        try {
            const res = await axios.post('/api/discord-dashboard/project/create', {
                project_name: projectName,
                project_theme: projectTheme,
            })

            if (res.data.error) {
                return alert(res.data.message)
            }

            setDisplayModal(false)
            Router.push(`/discord-dashboard/project/${res.data.project_id}?justCreated=true`)
        }catch(err){
            return alert(err.response.data.message)
        }
    }

    return (
        <div className="col-lg-12 grid-margin stretch-card">
            <div className="card card-rounded">
                <div className="card-body">
                    <h4 className="card-title" style={{fontWeight: 'bolder'}}>Your Discord Dashboard v3 Projects</h4>
                    <p className="card-description">
                        You can have up to 1 project. <a href="#" style={{color:'gold', fontWeight:'bold', textDecoration:'none'}}>Discord-Dashboard Premium Plan</a> allows you to have up to 10 projects.
                    </p>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Created</th>
                                <th>Theme</th>
                                <th>Edit/Stats</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                loading ? null :
                                userProjects.map((project, index)=>{
                                    console.log(project)
                                    return (
                                        <tr>
                                            <td>{project.name}</td>
                                            <td>{format(new Date(project.createdAt), "d MMM yyyy kk:mm ::XXX").replace("::", "UTC")}</td>
                                            <td>
                                                {
                                                    project.theme === "krdx" ?
                                                        <label className="badge badge-info">Kardex</label>
                                                        :
                                                        null
                                                }
                                            </td>
                                            <td><a style={{textDecoration:'none'}} href={`/discord-dashboard/project/${project._id}`}>Click</a></td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                        {
                            userProjects.length === 0 && !loading ?
                                <div className="d-flex justify-content-center mt-3">
                                    <a>Seems like you don't have any projects yet :o</a>
                                    <br/>
                                </div>
                                :null
                        }
                        <div className="d-flex justify-content-center mt-3">
                            {
                                loading?
                                    <TailSpin
                                        height="30"
                                        width="30"
                                        color='grey'
                                        ariaLabel='loading'
                                    />
                                    :
                                    <>
                                        <>
                                            <button type="button" className="btn btn-primary" style={{color:'white'}}
                                             onClick={()=>setDisplayModal(true)}>
                                                Create New Project
                                            </button>
                                        </>
                                    </>
                            }
                        </div>
                        <div>
                            <p className="card-description">
                            Not interested in Discord-Dashboard v3? Move to <a href="/discord-dashboard/v2" style={{fontWeight:'bold', textDecoration:'none'}}>Discord-Dashboard v2 Licenses</a> page
                            </p>
                        </div>
                        <div id="modal" className="modal" style={{display: displayModal ? 'block' : 'none'}}>
                            <div className="modal-content" style={{borderRadius:15}}>
                                <div className="card card-rounded">
                                    <div className="card-body">
                                        <h3><b>Create new Discord-Dashboard Project</b></h3>

                                        <div className={"pt-3"}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="projectName">Project Name</label>
                                                        <input type="text" className="form-control"
                                                                id="projectName"
                                                               placeholder="Project Name"
                                                               style={{color:'black'}}
                                                               value={projectName}
                                                               onChange={(event)=>setProjectName(event.target.value)}
                                                               maxLength={30}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="theme">Project Theme</label>
                                                        <select value={projectTheme} onChange={(event)=>setProjectTheme(event.target.value)} className="form-control" id="theme" style={{color:'black'}}>
                                                            <option name="krdx" value="krdx">Kardex Theme</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="card-description">
                                            You can change these settings at any time after creating the project.
                                        </p>
                                        <div className="d-flex">
                                            <button type="button" className="btn btn-primary"
                                                    style={{color:'white'}}
                                                    onClick={()=>CreateProject()}>
                                                Create
                                            </button>
                                            <button type="button" className="btn btn-danger"
                                                    style={{color:'white'}}
                                                    onClick={()=>setDisplayModal(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}