import React, { useState } from 'react'
import Head from 'next/head'

import Script from 'next/script'

import PageBody from "../../components/content/PageBody"
import Scripts from "../../components/content/Scripts"

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

export default function TestPage({ user, url, props }) {
    let ud_s = '../'

    const title = `${IsBeta ? 'BETA | ' : ''}Assistants Center - Email system`

    const axios = require('axios');

    const [userDB, setUserDB] = useState(null);
    const [users, setUsers] = useState(null)
    const [items, setItems] = useState(null)

    const getUser = async (e) => {
        const selectedUser = users.find(user => user.assistants_username === e.target.value)
        if (!selectedUser) return setUserDB(null);
        setUserDB(selectedUser)
        getItems(selectedUser._id)
    }

    const assignItem = async ({ user_id, item_id, category_id }) => {
        await axios.post('/api/discord-dashboard/license/assign', {
            user_id,
            item_id,
            category_id
        })
        
        getUsers()
        getItems(user_id)
    }

    const revokeItem = async ({ user_id, item_id, category_id }) => {
        await axios.post('/api/discord-dashboard/license/revoke', {
            user_id,
            item_id,
            category_id
        })
   
        getUsers()
        getItems(user_id)
    }

    const getItems = async (_id) => {
        await axios.post('/api/admin/items-owned', {
            user_id: _id
        }).then(res => {
            setItems(res.data.items || [])
        })
    }

    const getUsers = async () => {
        axios.get('/api/admin/users/list').then(res => {
            setUsers(res.data?.users || [])

        })
    }

    React.useEffect(() => {
        getUsers()
    }, [])

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `!function(){var e=document.createElement("script");e.type="text/javascript",e.src="https://global.ketchcdn.com/web/v2/config/assistantscenter/website_smart_tag/boot.js",e.defer=e.async=!0,document.getElementsByTagName("head")[0].appendChild(e),window.semaphore=window.semaphore||[]}();` }}></script>
                <title>{title}</title>
                <link rel="stylesheet" href={`${ud_s}vendors/feather/feather.css`} />
                <link rel="stylesheet" href={`${ud_s}vendors/mdi/css/materialdesignicons.min.css`} />
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

                <link rel="stylesheet" href={`${ud_s}mycss/my_dark_css.css`} />
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
                                                    <h3><b>Manage User</b></h3>
                                                    <hr />
                                                    <input type="text" placeholder='username' onInput={e => getUser(e)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        userDB ?
                                            <>
                                                {
                                                    items && items.map((category, index) => {
                                                        return (
                                                            <>
                                                                <div className="row mt-4">
                                                                    <div className="col-sm-12">
                                                                        <div className="card card-rounded" id={category.categoryName.toLowerCase().replace(/\s/g, '')}>
                                                                            <div className="card-body">
                                                                                <h3>{category.categoryName}</h3>
                                                                                <div className="table-responsive">
                                                                                    <table className="table table-striped">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th>
                                                                                                </th>
                                                                                                <th>
                                                                                                </th>
                                                                                                <th>
                                                                                                </th>
                                                                                                <th>
                                                                                                </th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {
                                                                                                category.categoryItems &&
                                                                                                category.categoryItems.map(item => {
                                                                                                    return (
                                                                                                        <tr>
                                                                                                            <td className="py-1">
                                                                                                                <img src={item.image} alt="image" />
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                <div>
                                                                                                                    <h6>{item.name}</h6>
                                                                                                                    <p>{item.description}</p>
                                                                                                                </div>
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                Price: <b>{item.price}</b>
                                                                                                            </td>
                                                                                                            <td style={{ textAlign: 'center' }}>
                                                                                                                {
                                                                                                                    !item.owns ?
                                                                                                                        <button type="button" onClick={async () => {
                                                                                                                            if (confirm(`Are you sure you want to assign this item to ${userDB.assistants_username}?`)) {
                                                                                                                                await assignItem({ user_id: userDB._id, item_id: item.id, category_id: category.categoryId })
                                                                                                                            }
                                                                                                                        }} className="btn btn-primary" style={{ color: 'white', height: 40, margin: 'auto', borderColor: 'transparent' }}>Assign</button>
                                                                                                                        :
                                                                                                                        <button type="button" onClick={async () => {
                                                                                                                            if (confirm(`Are you sure you want to revoke this item from ${userDB.assistants_username}?`)) {
                                                                                                                                await revokeItem({ user_id: userDB._id, item_id: item.id, category_id: category.categoryId })
                                                                                                                            }
                                                                                                                        }} className="btn btn-danger" style={{ color: 'white', height: 40, margin: 'auto', borderColor: 'transparent' }}>Revoke</button>
                                                                                                                }
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
                                                            </>
                                                        )
                                                    })
                                                }
                                            </> : null

                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageBody>
            <Scripts src={ud_s} />
            <Script src={`${ud_s}vendors/js/vendor.bundle.base.js`} />
            <Script src={`${ud_s}vendors/bootstrap-datepicker/bootstrap-datepicker.min.js`} />
            <Script src={`${ud_s}js/off-canvas.js`} />
            <Script src={`${ud_s}js/hoverable-collapse.js`} />
            <Script src={`${ud_s}js/template.js`} />
            <Script src={`${ud_s}js/settings.js`} />
            <Script src={`${ud_s}js/todolist.js`} />
        </>
    )
}