import React from 'react'
import Head from 'next/head'
import axios from 'axios'
import Router from 'next/router'

import PageBody from "../components/content/PageBody"
import Scripts from "../components/content/Scripts"
import Script from "next/script"

import IsBeta from '../isBeta'

export async function getServerSideProps(context) {
    return {
        props: {
            url: (context.query.url || '/').split('?')[0],
            user: context.query.user,
            connections: context.query.connections,
            query: context.query.query,
            email: context.query.email || null
        },
    }
}

export default function ShopPage ({ user, url, connections, query, email }) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }

    const [profileFile, setProfileFile] = React.useState(null)
    const [accountToken, setAccountToken] = React.useState(null)

    const [resetPasswordRequested, setResetPasswordRequested] = React.useState(false)

    const [avatarFile, setAvatarFile] = React.useState(null)

    const [displayError, setDisplayError] = React.useState(query?.error)


    const regenAccountToken = async () => {
        const res = await axios.post('/api/user/token/regen')
        setAccountToken(res.data.token)
    }

    const requestPasswordReset = async () => {
        const res = await axios.post(`/api/user/password/change-request/${user._id}`)
        if(!res?.data?.error){
            setResetPasswordRequested(true)
        }
    }

    const uploadAvatar = async () => {
        if(!avatarFile) return
        const formData = new FormData();

        formData.append('file', avatarFile)
        formData.append('resourceFolder', 'Avatars')
        formData.append('fileName', `${user._id}.${avatarFile.name.split('.').pop()}`)
        const res = await axios.post('/api/user/avatar', formData)
        console.log(res.data)
    }

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <title>{IsBeta ? 'BETA | ' : ''}Assistants Center - Profile</title>
                <link rel="stylesheet" href={`${ud_s}vendors/feather/feather.css`} />
                <link rel="stylesheet" href={`${ud_s}vendors/mdi/css/materialdesignicons.min.css`}/>
                <link rel="stylesheet" href={`${ud_s}vendors/ti-icons/css/themify-icons.css`} />
                <link rel="stylesheet" href={`${ud_s}vendors/typicons/typicons.css`} />
                <link
                    rel="stylesheet"
                    href={`${ud_s}vendors/simple-line-icons/css/simple-line-icons.css`}
                />
                <link rel="stylesheet" href={`${ud_s}vendors/css/vendor.bundle.base.css`} />
                <link
                    rel="stylesheet"
                    href={`${ud_s}vendors/datatables.net-bs4/dataTables.bootstrap4.css`}
                />
                <link rel="stylesheet" href={`${ud_s}js/select.dataTables.min.css`} />
                <link rel="stylesheet" href={`${ud_s}css/vertical-layout-light/style.css`} />
                <link rel="shortcut icon" href={`${ud_s}images/favicon.png`} />
                <style>
                    {`
                   
                   
                    .modal {
  position: fixed;
  z-index: 4324;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}


                    .modal-content {
                      background-color: #fefefe;
                      margin: 5% auto;
                      padding: 20px;
                      border: 1px solid #888;
                      width: 80%;
                    }
                    
                    @media only screen and (min-width: 910px) and (max-width: 1200px) {
                        .modal-content {
                            width: 60% !important;
                        }
                    }
                    
                    @media only screen and (min-width: 1200px){
                        .modal-content {
                            width: 50% !important;
                        }
                    }
`}
                </style>

                <link  rel="stylesheet" href={`${ud_s}mycss/my_dark_css.css`}/>
            </Head>
            <PageBody user={user} uds={ud_s}>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="home-tab">
                            <div className="tab-content" id="content-featured">
                                <div className="tab-pane fade show active" id="featured">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="card card-rounded">
                                                <div className="card-body">
                                                    <h3><b>User Profile</b></h3>

                                                    <h5 className="pt-3">Profile information</h5>

                                                    <div className="row pt-2">
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Username</label>
                                                                <input type="text" className="form-control"
                                                                       placeholder="Username" aria-label="Username"
                                                                       value={user.username}
                                                                       disabled
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>E-mail</label>
                                                                <input type="email" className="form-control"
                                                                       placeholder="E-mail" aria-label="Email"
                                                                       value={email} disabled
                                                                />
                                                                {
                                                                    (user.username.startsWith('@t_') || user.username.startsWith('@d_')) &&
                                                                    <label><b>Why is nothing here?</b> For registration, you have used <i>{user.username.startsWith('@d_') ? 'Discord' : (user.username.startsWith('@t_') ? 'Twitter' : null)}</i>. Soon you will be able to link your email address to your account.</label>
                                                                }
                                                            </div>
                                                        </div>
                                                        {/*<div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Profile image update</label>
                                                                <div>
                                                                    <input type="file" name="img[]"
                                                                           onChange={(event)=>setAvatarFile(event.target.files[0])}
                                                                    />
                                                                </div>
                                                                <button onClick={uploadAvatar}>Upload</button>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Password change request</label>
                                                                <div>
                                                                    <button onClick={requestPasswordReset} disabled={resetPasswordRequested} className={`btn btn-sm ${resetPasswordRequested ? 'btn-success' : 'btn-primary'} text-white`}
                                                                            type="button">{resetPasswordRequested ? 'Instructions has been sent to your e-mail address' : 'Request password reset'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>*/}
                                                    </div>

                                                    <h5 className="pt-3">Connections</h5>
                                                    <div className="row pt-2">
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Discord</label>
                                                                <div style={{paddingBottom:8}}>
                                                                    <p>Status: <b>{connections.Discord ? `CONNECTED (Account Id ${connections.Discord})` : 'NOT CONNECTED'}</b></p>
                                                                    {
                                                                        connections.Discord ?
                                                                        <p><a href='/api/auth/discord/connect?back_redirect=/profile'>Connect another account</a></p>
                                                                        :
                                                                        <p><a href='/api/auth/discord/connect?back_redirect=/profile'>Connect</a></p>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="form-group">
                                                                <label>Twitter</label>
                                                                <div style={{paddingBottom:8}}>
                                                                    <p>Status: <b>{connections.Twitter ? `CONNECTED (Account Id ${connections.Twitter})` : 'NOT CONNECTED'}</b></p>
                                                                    {
                                                                        connections.Twitter ?
                                                                        <p><a href='/api/auth/twitter/connect?back_redirect=/profile'>Connect another account</a></p>
                                                                        :
                                                                        <p><a href='/api/auth/twitter/connect?back_redirect=/profile'>Connect</a></p>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <h5 className="pt-3">Profile secrets</h5>
                                                    <div className="row pt-2">
                                                        <div className="form-group">
                                                            <label>Account access token</label>
                                                            <div style={{paddingBottom:accountToken?8:0}}>
                                                                {
                                                                    accountToken?
                                                                        <code>{accountToken}</code>
                                                                        :
                                                                        <button className="btn btn-sm btn-primary text-white"
                                                                                type="button"
                                                                                onClick={regenAccountToken}
                                                                        >Regenerate and show
                                                                        </button>
                                                                }
                                                            </div>
                                                            <p><b><i>Note:</i></b> You can only see the token after it has been generated. If you come back here because you lose the token, you must generate it again.</p>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="errorModal" className="modal" style={{display: displayError ? 'block' : 'none'}} onClick={(event)=> {
                            if(event.target.id == "errorModal"){
                                setDisplayError(null)
                            }
                        }}>
                            <div className="modal-content" style={{borderRadius:15}}>
                                <div className="card card-rounded">
                                    <div className="card-body">
                                        <h3><b>An error occurred</b></h3>

                                        <h4><b>{displayError}</b></h4>

                                        <div className={"d-flex"} style={{}}>
                                            <div style={{paddingTop:15}}>
                                                <button type="button"
                                                        className="btn btn-primary btn-icon-text"
                                                        onClick={()=>setDisplayError(null)}
                                                        style={{color:'white',height:'50px',fontSize:'16px',justifyContent:'center', display:'flex',}}
                                                >
                                                    Okay
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
            </PageBody>
            <Scripts src={ud_s}/>
            <Script src={`${ud_s}vendors/js/vendor.bundle.base.js`}/>
            <Script src={`${ud_s}vendors/bootstrap-datepicker/bootstrap-datepicker.min.js`}/>
            <Script src={`${ud_s}js/off-canvas.js`}/>
            <Script src={`${ud_s}js/hoverable-collapse.js`}/>
            <Script src={`${ud_s}js/template.js`}/>
            <Script src={`${ud_s}js/settings.js`}/>
            <Script src={`${ud_s}js/todolist.js`}/>
        </>
    )
}