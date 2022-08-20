import React from 'react';
import Head from 'next/head';

import Script from 'next/script'

import PageBody from "../../components/content/PageBody";
import Scripts from "../../components/content/Scripts";

import IsBeta from '../../isBeta'

import axios from 'axios'

export async function getServerSideProps(context) {
    return {
        props: {
            url: context.query.url.split('?')[0],
            user: context.query.user,
        },
    }
}

export default function TestPage ({ user, url}) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }

    const [users, setUsers] = React.useState(null)

    React.useEffect(()=>{
        axios.get('/api/admin/users/list').then(res=>{
            setUsers(res.data?.users || [])
        })
    }, [])

    const title = `${IsBeta ? 'BETA | ' : ''}Assistants Center - Admin Users Management`

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <title>{title}</title>
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
                {
                    IsBeta ?
                        <link rel="shortcut icon" href={`${ud_s}images/favicon.png`} />
                    :
                        <link rel="shortcut icon" href={`${ud_s}favicon.png`} />
                }

                <link  rel="stylesheet" href={`${ud_s}mycss/my_dark_css.css`}/>
            </Head>
            <PageBody user={user} uds={ud_s}>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="home-tab">
                            <div className="card card-rounded">
                                <div className="card-body">
                                    <h2><b>[ADMIN] Users List</b></h2>

                                    <h4 style={{paddingTop:10}}>Users Count: <b>{users ? users.length : "Loading..."}</b></h4>
                                    <h4>Verified: <b>{users ? users.filter(u=>u.verified===true).length : "Loading..."}</b></h4>
                                    <h4>Admins: <b>{users ? users.filter(u=>u.admin===true).length : "Loading..."}</b></h4>

                                    <h4 style={{paddingTop:10}}>OpenSource: <b>{users ? users.filter(u=>u.OpenSource?.license_id !== null).length : "Loading..."}</b></h4>
                                    <h4>Personal: <b>{users ? users.filter(u=>u.Personal?.license_id != null).length : "Loading..."}</b></h4>
                                    <h4>Production: <b>{users ? users.filter(u=>u.Production?.license_id != null).length : "Loading..."}</b></h4>

                                    <h4 style={{paddingTop:10}}>Discord: <b>{users ? users.filter(u=>u.connections?.discord?.id !== null).length : "Loading..."}</b></h4>
                                    <h4>Twitter: <b>{users ? users.filter(u=>u.connections?.twitter?.id != null).length : "Loading..."}</b></h4>

                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                            <tr>
                                                <th>
                                                    Avatar
                                                </th>
                                                <th>
                                                    Username, email
                                                </th>
                                                <th>
                                                    Discord
                                                </th>
                                                <th>
                                                    Twitter
                                                </th>
                                                <th>
                                                    Role
                                                </th>
                                                <th>
                                                    Verified
                                                </th>
                                                <th>
                                                    DBD v2
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                users && 
                                                users.map(user => {
                                                    let userDBDv2Licenses = []
                                                    if(user.OpenSource?.license_id)userDBDv2Licenses.push("OpenSource")
                                                    if(user.Personal?.license_id)userDBDv2Licenses.push("Personal")
                                                    if(user.Production?.license_id)userDBDv2Licenses.push("Production")
                                                    return (
                                                        <tr>
                                                            <td class="py-1">
                                                            <img src={user.avatarURL.replace('assistants.ga', 'assistantscenter.com')} alt="image"/>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <h6>{user.assistants_username}</h6>
                                                                    <p>{user.email ?? "no_mail"}</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {user.connections?.discord?.id ?? "any"}
                                                            </td>
                                                            <td>
                                                                {user.connections?.twitter?.id ?? "any"}
                                                            </td>
                                                            <td>
                                                                <b>{user.admin ? "ADMIN" : "USER"}</b>
                                                            </td>
                                                            <td>
                                                                <b>{user.verified ? "YES" : "NO"}</b>
                                                            </td>
                                                            <td>
                                                                {userDBDv2Licenses.length > 0 ? userDBDv2Licenses.join(', ') : "any"}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                        </table>
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