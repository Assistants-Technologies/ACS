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

    const [currentSelection, setCurrentSelection] = useState('select')

    const changeTab = (tab) => {
        setCurrentSelection(tab)
    }

    const title = `${IsBeta ? 'BETA | ' : ''}Assistants Center - Email system`

    const axios = require('axios');

    const [userDB, setUserDB] = useState(null);
    const [users, setUsers] = React.useState(null)
    const [items, setItems] = React.useState(null)

    const change = (e) => {
        const selectedUser = users.find(user => user.assistants_username === e.target.value)
        if (!selectedUser) return setUserDB(null);
        setUserDB(selectedUser)

        axios.post('/api/admin/items-owned', {
            user_id: selectedUser._id
        }).then(res => {
            console.log(res.data.items)
            setItems(res.data.items || [])
        })
    }

    const addItem = async ({ user_id, item_id, category_id }) => {
        console.log(user_id, item_id, category_id)
        axios.post('/api/discord-dashboard/license/assign', {
            user_id,
            item_id,
            category_id
        }).then(async () => {
            console.log("done")
            await axios.get('/api/admin/users/list').then(res => {
                setUsers(res.data?.users || [])
            })
        })
    }

    const revokeItem = async ({ user_id, item_id, category_id }) => {
        console.log(user_id, item_id, category_id)
        axios.post('/api/discord-dashboard/license/revoke', {
            user_id,
            item_id,
            category_id
        }).then(async () => {
            console.log("done")
            await axios.get('/api/admin/users/list').then(res => {
                setUsers(res.data?.users || [])
            })
        })
    }

    React.useEffect(() => {
        axios.get('/api/admin/users/list').then(res => {
            setUsers(res.data?.users || [])
        })
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
                                                    <>

                                                        <input type="text" placeholder='username' onInput={e => change(e)} />

                                                        <div>
                                                            {
                                                                userDB ?
                                                                    <>
                                                                        <h3 className='mt-3'>{userDB.assistants_username}</h3>
                                                                        {
                                                                            items ? items.map((category, index) => {
                                                                                return (
                                                                                    <>
                                                                                        <h3 className='mt-4'>{category.categoryName}</h3>
                                                                                        {
                                                                                            category.categoryItems.map((item, index) => {
                                                                                                return (
                                                                                                    <>
                                                                                                        <div className="d-flex" style={{ placeItems: "center", alignContent: "center", columnGap: "10px" }}>
                                                                                                            <h6><b>{item.name}</b></h6>
                                                                                                            <p style={{ marginTop: "auto", marginBottom: "auto" }}>{item.description}</p>
                                                                                                            <p style={{ marginTop: "auto", marginBottom: "auto" }}>Price: {item.price}</p>
                                                                                                            {
                                                                                                                item.owns ? 
                                                                                                                <button className="btn btn-primary" onClick={() => {
                                                                                                                    addItem({ user_id: selectedUser._id, item_id: item.id, category_id: test.categoryId })
                                                                                                                }}>Assign</button>
                                                                                                                :
                                                                                                                <button className="btn btn-danger" onClick={() => {
                                                                                                                    revokeItem({ user_id: selectedUser._id, item_id: item.id, category_id: test.categoryId })
                                                                                                                }}>Revoke</button>
                                                                                                            }
                                                                                                        </div>
                                                                                                    </>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </>
                                                                                )
                                                                            })
                                                                                : null
                                                                        }
                                                                    </>
                                                                    : <h3>no user selected</h3>
                                                            }
                                                        </div>
                                                    </>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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