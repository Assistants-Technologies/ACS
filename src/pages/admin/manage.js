import React, { useState, useEffect } from 'react'
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

    const [userDB, setUserDB] = useState(null)
    const [users, setUsers] = useState(null)
    const [items, setItems] = useState(null)
    const [imType, setImType] = useState(null)
    const [imItem, setImItem] = useState(null)
    const [imUser, setImUser] = useState(null)
    const [currentItem, setCurrentItem] = useState(null)
    const [userPerms, setUserPerms] = useState(null)
    const [editType, setEditType] = useState(null)
    const [userCoins, setUserCoins] = useState(null)
    const [emBody, setEmBody] = useState(null)
    const [emTitle, setEmTitle] = useState(null)    
    const [userEmail, setUserEmail] = useState(null)
    const [manageUser, setManageUser] = useState({})

    const getUser = async (value) => {
        const val = value || document.getElementById('userSearch').value;
        if (value) document.getElementById('userSearch').value = value;

        const selectedUser = users.find(user => user?._id == val || user?.ip_address == val || user?.assistants_username?.toLowerCase() == val.toLowerCase() || user?.email?.toLowerCase() == val.toLowerCase() || user?.connections?.discord?.id == val);
        if (!selectedUser) {
            $('#userNotFoundModal').modal('show');
            return setUserDB(null);
        }

        setUserDB(selectedUser)
        getItems(selectedUser._id)
        setUserPerms({
            verified: selectedUser.verified,
            og: selectedUser.og,
            admin: selectedUser.admin,
            blog_permissions: selectedUser.blog_permissions
        })
    }

    const handleUserSearch = (e) => {
        if (e.key === 'Enter') getUser();
    }

    const manageItem = async ({ user_id, item_id, item_name, username, category_id, type }) => {
        const modal = $('#itemManagementModal');

        setImType(type),
            setImItem(item_name),
            setImUser(username);

        setCurrentItem({ user_id, item_id, category_id, action: type });

        modal.modal('show');
    }

    const itemActionConfirm = async () => {
        if (!currentItem) return;

        await axios.post(`/api/discord-dashboard/license/${currentItem.action}`, currentItem).catch(err => {
            console.log(err)
        })

        setCurrentItem(null);

        getUsers()
        getItems(userDB._id)
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
                                                    <div className="d-flex">
                                                        <input id="userSearch" className="form-control" type="text" onKeyDown={handleUserSearch} placeholder='Account ID, Username, Email, Discord ID' style={{ width: 300 + 'px' }} />
                                                        <button className="btn btn-primary" onClick={() => getUser()} onKeyDown={handleUserSearch}>Submit</button>
                                                    </div>
                                                    <div className="modal fade" id="userNotFoundModal" tabIndex="-1" aria-labelledby="userNotFoundModalLabel" aria-hidden="true">
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h1 className="modal-title fs-5" id="userNotFoundModalLabel">User not found</h1>
                                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    User doesn't exist in the database.
                                                                    <hr />
                                                                    Maybe try refreshing the page?
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal fade" id="errorModal" tabIndex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h1 className="modal-title fs-5" id="errorModalLabel">{emTitle}</h1>
                                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                </div>
                                                                <div className="modal-body">{emBody}</div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="modal fade" id="itemManagementModal" tabIndex="-1" aria-labelledby="itemManagementLabel" aria-hidden="true">
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h1 className="modal-title fs-5">{imType === "assign" ? "Assign" : "Revoke"} <b>{imItem}</b></h1>
                                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    {imType === "assign" ? "Are you sure you want to assign " : "Are you sure you want to revoke "}
                                                                    <b>{imItem}</b> {imType === "assign" ? "to" : "from"} <b>{imUser}</b>?
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                    <button type="button" className={`btn btn-${imType === "assign" ? "primary" : "danger"}`} data-bs-dismiss="modal" onClick={itemActionConfirm}>{imType === "assign" ? "Assign" : "Revoke"}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal fade" id="manageUserModal" tabIndex="-1" aria-labelledby="manageUserLabel" aria-hidden="true">
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h1 className="modal-title fs-5">{manageUser.title ? manageUser.title : `${manageUser.type} ${userDB?.assistants_username || "None"}`}</h1>
                                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    {manageUser.type === "Warn" ? <>
                                                                        <label id="ReasonDesc">Reason</label>
                                                                        <input type="text" className="form-control" placeholder="Being stupid!" aria-label="" id="reasonDesc" aria-describedby="ReasonDesc" />
                                                                        <p>This will stop the user's licenses from working until they acknowledge the warning.</p>
                                                                    </> : manageUser.type === "Suspend" || manageUser.type === "Suspend IP" ? <>
                                                                        <label id="ReasonDesc2">Reason</label>
                                                                        <input type="text" className="form-control" placeholder="Being stupid!" aria-label="" id="reasonDesc2" aria-describedby="ReasonDesc2" />
                                                                        <div className="form-check" style={{
                                                                            paddingLeft: "35px"
                                                                        }}>
                                                                            <input className="form-check-input" type="checkbox" id="sExpires" />
                                                                            <label className="form-check-label" for="sExpires">
                                                                                Expires
                                                                            </label>
                                                                        </div>
                                                                        {manageUser.type === "Suspend IP" ? <><div className="form-check" style={{
                                                                            paddingLeft: "35px"
                                                                        }}>
                                                                            <input className="form-check-input" type="checkbox" id="suspendIP" checked={true} />
                                                                            <label className="form-check-label" for="suspendIP">
                                                                                Suspend IP (All known accounts & Future accounts)
                                                                            </label>
                                                                        </div></> : <></>}
                                                                        
                                                                        <label id="ReasonDesc3">Expires When</label>
                                                                        <input type="date" className="form-control" id="sExpDate" aria-describedby="ReasonDesc3" />

                                                                        <p>This will stop the user's licenses from working until it expires.</p>
                                                                    </> : manageUser.type === "Reactivate" ? <>
                                                                        <p>Are you sure you want to reactivate {userDB?.assistants_username}'s account?</p>
                                                                    </> : manageUser.type === "Clear Warnings" ? <>
                                                                        <p>Are you sure you want to clear {userDB?.assistants_username}'s warnings?</p>
                                                                    </> : manageUser.type === "Delete Account" ? <>
                                                                        <p>Are you sure you want to delete {userDB?.assistants_username}'s account?</p>
                                                                    </> : manageUser.type === "View Warnings" ? <>
                                                                        {userDB?.warnings?.length === 0 ? <p>No warnings found.</p> : userDB?.warnings?.map(warning => {
                                                                            let d = new Date(warning.date),
                                                                                now = new Date(),
                                                                                diff = now - d,
                                                                                diffSeconds = diff / 1000,
                                                                                diffMinutes = diff / (1000 * 60),
                                                                                diffHours = diff / (1000 * 60 * 60),
                                                                                diffDays = diff / (1000 * 60 * 60 * 24),
                                                                                diffWeeks = diff / (1000 * 60 * 60 * 24 * 7),
                                                                                diffMonths = diff / (1000 * 60 * 60 * 24 * 30),
                                                                                diffYears = diff / (1000 * 60 * 60 * 24 * 365),
                                                                                time = '';
                                                                            if (diffSeconds < 60) time = `${Math.floor(diffSeconds)} seconds ago`;
                                                                            else if (diffMinutes < 60) time = `${Math.floor(diffMinutes)} minutes ago`;
                                                                            else if (diffHours < 24) time = `${Math.floor(diffHours)} hours ago`;
                                                                            else if (diffDays < 7) time = `${Math.floor(diffDays)} days ago`;
                                                                            else if (diffWeeks < 4) time = `${Math.floor(diffWeeks)} weeks ago`;
                                                                            else if (diffMonths < 12) time = `${Math.floor(diffMonths)} months ago`;
                                                                            else time = `${Math.floor(diffYears)} years ago`;

                                                                            return <>
                                                                                <div style={{ borderRadius: "20px", marginBottom: "20px", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundImage: "url('https://cdn.assistantscenter.com/l4smyro6')" }}>
                                                                                    <div style={{ padding: "15px", backgroundColor: "rgba(255, 255, 255, 0.12)", borderRadius: "20px" }}>
                                                                                        <h6>{warning.reason}</h6>
                                                                                        <p>Warned {time}</p>
                                                                                        <p>Acknowledged: {warning.active ? "No" : "Yes"}</p>
                                                                                        <p>Administrator: {warning.admin || "Unknown"}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        })}


                                                                    </> : <></>}
                                                                </div>
                                                                <div className="modal-footer">
                                                                    {manageUser.type !== "View Warnings" ? <>
                                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => {
                                                                            if (manageUser.type === "Warn") {
                                                                                axios.post(`/api/admin/users/warn/${userDB?._id}`, { reason: $("#reasonDesc").val() })
                                                                                    .then(res => {
                                                                                        const data = res.data;

                                                                                        if (data.error) {
                                                                                            setEmBody(data.message);
                                                                                            setEmTitle("An error occurred");
                                                                                            return $("#errorModal").modal("show");
                                                                                        }
                                                                                    })
                                                                                    .catch(err => {
                                                                                        console.log(err)
                                                                                    })
                                                                            } else if (manageUser.type === "Suspend" || manageUser.type === "Suspend IP") {
                                                                                axios.post(`/api/admin/users/suspend/${userDB?._id}`, { reason: $("#reasonDesc2").val(), expires: $("#sExpires").is(":checked"), expiresAt: $("#sExpDate").val(), ip: $("#suspendIP")?.is(":checked") || null })
                                                                                    .then(res => {
                                                                                        const data = res.data;

                                                                                        if (data.error) {
                                                                                            setEmBody(data.message);
                                                                                            setEmTitle("An error occurred");
                                                                                            return $("#errorModal").modal("show");
                                                                                        } else userDB.suspended.enabled = true;
                                                                                    })
                                                                                    .catch(err => {
                                                                                        console.log(err)
                                                                                    })
                                                                            } else if (manageUser.type === "Reactivate") {
                                                                                axios.post(`/api/admin/users/reactivate/${userDB?._id}`)
                                                                                    .then(res => {
                                                                                        const data = res.data;

                                                                                        if (data.error) {
                                                                                            setEmBody(data.message);
                                                                                            setEmTitle("An error occurred");
                                                                                            return $("#errorModal").modal("show");
                                                                                        } else userDB.suspended.enabled = false;
                                                                                    })
                                                                                    .catch(err => {
                                                                                        console.log(err)
                                                                                    })
                                                                            } else if (manageUser.type === "Clear Warnings") {
                                                                                axios.post(`/api/admin/users/warnings/clear/${userDB?._id}`)
                                                                                    .then(res => {
                                                                                        const data = res.data;

                                                                                        if (data.error) {
                                                                                            setEmBody(data.message);
                                                                                            setEmTitle("An error occurred");
                                                                                            return $("#errorModal").modal("show");
                                                                                        } else userDB.warnings = [];
                                                                                    })
                                                                                    .catch(err => {
                                                                                        console.log(err)
                                                                                    })
                                                                            } else if (manageUser.type === "Delete Account") {
                                                                                axios.post(`/api/admin/users/delete/${userDB?._id}`)
                                                                                    .then(res => {
                                                                                        const data = res.data;

                                                                                        if (data.error) {
                                                                                            setEmBody(data.message);
                                                                                            setEmTitle("An error occurred");
                                                                                            return $("#errorModal").modal("show");
                                                                                        } else {
                                                                                            setEmBody(data.message);
                                                                                            setEmTitle("Success")
                                                                                            $("#errorModal").modal("show");
                                                                                            return setUserDB(null);
                                                                                        }
                                                                                    })
                                                                                    .catch(err => {
                                                                                        console.log(err)
                                                                                    })
                                                                            }
                                                                        }}>Submit</button>
                                                                    </> : <>
                                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                    </>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="modal fade" id="editPermsModal" tabIndex="-1" aria-labelledby="editPermsLabel" aria-hidden="true">
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h1 className="modal-title fs-5">Editing {editType} for <b>{userDB?.assistants_username || "None"}</b></h1>
                                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                </div>

                                                                <div className="modal-body">
                                                                    {editType === "permissions" ? <>
                                                                        <div className="form-check" style={{
                                                                            paddingLeft: "35px"
                                                                        }}>
                                                                            <input className="form-check-input" type="checkbox" value="" id="verifiedBox" checked={userPerms?.verified}
                                                                                onChange={(e) => {
                                                                                    setUserPerms({
                                                                                        ...userPerms,
                                                                                        verified: e.target.checked
                                                                                    })
                                                                                }}
                                                                            />
                                                                            <label className="form-check-label" for="verifiedBox">
                                                                                Verified
                                                                            </label>
                                                                        </div>
                                                                        <div className="form-check" style={{
                                                                            paddingLeft: "35px"
                                                                        }}>
                                                                            <input className="form-check-input" type="checkbox" value="" id="ogBox" checked={userPerms?.og}
                                                                                onChange={(e) => {
                                                                                    setUserPerms({
                                                                                        ...userPerms,
                                                                                        og: e.target.checked
                                                                                    })
                                                                                }}
                                                                            />
                                                                            <label className="form-check-label" for="ogBox">
                                                                                OG
                                                                            </label>
                                                                        </div>
                                                                        <div className="form-check" style={{
                                                                            paddingLeft: "35px"
                                                                        }}>
                                                                            <input className="form-check-input" type="checkbox" value="" id="adminBox" checked={userPerms?.admin} onChange={(e) => {
                                                                                setUserPerms({
                                                                                    ...userPerms,
                                                                                    admin: e.target.checked
                                                                                })
                                                                            }}
                                                                            />
                                                                            <label className="form-check-label" for="adminBox">
                                                                                Admin
                                                                            </label>
                                                                        </div>
                                                                        <div className="form-check" style={{
                                                                            paddingLeft: "35px"
                                                                        }}>
                                                                            <input className="form-check-input" type="checkbox" value="" id="blogBox" checked={userPerms?.blog_permissions} onChange={(e) => {
                                                                                setUserPerms({
                                                                                    ...userPerms,
                                                                                    blog_permissions: e.target.checked
                                                                                })
                                                                            }}
                                                                            />
                                                                            <label className="form-check-label" for="blogBox">
                                                                                Blog Permissions
                                                                            </label>
                                                                        </div>
                                                                    </> : editType === "coins" ? <>
                                                                        <p>Original Coins: <b>{userDB?.coins.toLocaleString()}</b></p>
                                                                        <div className="input-group mb-3">
                                                                            <input type="number" min="0" className="form-control" placeholder="Amount" aria-label="" id="coinValue" aria-describedby="CoinsDesc" value={userCoins} onChange={(e) => {
                                                                                setUserCoins(parseInt(e.target.value));
                                                                            }} />
                                                                            <span className="input-group-text" id="CoinsDesc">coins</span>
                                                                        </div>
                                                                    </> : editType === "email" ? <>
                                                                        <p>Original Email: <b>{userDB?.email.toLocaleString()}</b></p>
                                                                        <div className="input-group mb-3">
                                                                            <span className="input-group-text" id="EmailDesc">Email:</span>
                                                                            <input type="email" className="form-control" placeholder="bob@gmail.com" aria-label="" id="emailValue" aria-describedby="EmailDesc" value={userEmail} onChange={(e) => {
                                                                                setUserEmail(e.target.value);
                                                                            }} />
                                                                        </div>
                                                                    </>
                                                                        : editType === "known accounts" ?
                                                                            <>
                                                                                <p>Are you sure you want to wipe all known accounts?</p>
                                                                            </> : <></>}
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => {
                                                                        axios.post(`/api/admin/users/edit/${editType.replace(" ", "_")}/${userDB?._id}`, editType === "permissions" ? userPerms : editType === "coins" ? { coins: userCoins } : editType === "email" ? { email: userEmail } : {})
                                                                            .then(res => {
                                                                                const data = res.data;

                                                                                if (data.error) {
                                                                                    setEmBody(data.message);
                                                                                    setEmTitle("An error occurred");
                                                                                    return $("#errorModal").modal("show");
                                                                                }
                                                                            })
                                                                            .catch(err => {
                                                                                console.log(err)
                                                                            })
                                                                    }}>Update</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    userDB ?
                                                        <>
                                                            <div className="row mt-4">
                                                                <div className="col-sm-6">
                                                                    <div className="card card-rounded" id="user-information">
                                                                        <div className="card-body">
                                                                            <h3>User Information</h3>
                                                                            <div className="table-responsive">
                                                                                <p><b>Account ID:</b> {userDB._id}</p>
                                                                                <p><b>Username:</b> {userDB.assistants_username}</p>
                                                                                <p><b>Email:</b> {userDB.email}</p>
                                                                                <p><b>Discord ID:</b> {userDB.connections?.discord?.id || "Not Linked"}</p>
                                                                                <p><b>Last IP Address:</b> {userDB.ip_address}</p>
                                                                                <p><b>Known Accounts:</b> {
                                                                                    userDB.known_accounts && userDB.known_accounts.length > 0 ?
                                                                                        userDB.known_accounts.filter((item, index) => userDB.known_accounts.indexOf(item) === index).map((account, index) => {
                                                                                            if (account === userDB._id) return null;
                                                                                            return (
                                                                                                <>
                                                                                                    <a key={index} href="#" onClick={() => getUser(account)}>{account}</a>
                                                                                                </>
                                                                                            )
                                                                                        })
                                                                                        :
                                                                                        'None'
                                                                                }</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-sm-6">
                                                                    <div className="card card-rounded" id="user-information">
                                                                        <div className="card-body">
                                                                            <h3>User Actions</h3>
                                                                            <div className="table-responsive">
                                                                                <div className="d-flex">
                                                                                    <button className="btn btn-secondary w-100 mb-2" onClick={() => {
                                                                                        setEditType("permissions");
                                                                                        $("#editPermsModal").modal('show');
                                                                                    }}>Edit Permissions</button>
                                                                                    <button className="btn btn-secondary w-100 mb-2" onClick={() => {
                                                                                        setEditType("coins");
                                                                                        setUserCoins(userDB?.coins);
                                                                                        $("#editPermsModal").modal('show');
                                                                                    }}>Edit Coins</button>
                                                                                </div>
                                                                                <div className="d-flex">
                                                                                    <button className="btn btn-secondary w-100 mb-2" onClick={() => {
                                                                                        setEditType("email");
                                                                                        setUserEmail(userDB?.email);
                                                                                        $("#editPermsModal").modal('show');
                                                                                    }}>Update Email Address</button>
                                                                                    <button className="btn btn-secondary w-100 mb-2" onClick={() => {
                                                                                        setEditType("known accounts");
                                                                                        $("#editPermsModal").modal('show');
                                                                                    }}>Reset Known Accounts</button>
                                                                                </div>
                                                                                <div className="d-flex">
                                                                                    <button className="btn btn-primary w-100 mb-2" onClick={() => {
                                                                                        setManageUser({
                                                                                            type: "View Warnings",
                                                                                            title: `View ${userDB?.assistants_username || "None"}'s Warnings`,
                                                                                        });
                                                                                        $("#manageUserModal").modal('show');
                                                                                    }}>View Warnings</button>
                                                                                    <button className="btn btn-primary w-100 mb-2" onClick={() => {
                                                                                        setManageUser({
                                                                                            type: "Clear Warnings",
                                                                                            title: `Clear ${userDB?.assistants_username || "None"}'s Warnings`,
                                                                                        });
                                                                                        $("#manageUserModal").modal('show');
                                                                                    }}>Clear Warnings</button>
                                                                                </div>
                                                                                <div className="d-flex">
                                                                                    <button className="btn btn-warning w-100 mb-2" onClick={() => {
                                                                                        setManageUser({
                                                                                            type: "Warn",
                                                                                        });
                                                                                        $("#manageUserModal").modal('show');
                                                                                    }}>Issue Warning</button>
                                                                                    {userDB.suspended?.enabled ? <>
                                                                                        <button className="btn btn-success w-100 mb-2" onClick={() => {
                                                                                            setManageUser({
                                                                                                type: "Reactivate",
                                                                                            });
                                                                                            $("#manageUserModal").modal('show');
                                                                                        }}>Reactivate Account</button>
                                                                                    </> : <>
                                                                                        <button className="btn btn-warning w-100 mb-2" onClick={() => {
                                                                                            setManageUser({
                                                                                                type: "Suspend",
                                                                                            });
                                                                                            $("#manageUserModal").modal('show');
                                                                                        }}>Suspend Account</button>
                                                                                    </>}
                                                                                </div>
                                                                                <div className="d-flex">
                                                                                    <button className="btn btn-danger w-100 mb-2" onClick={() => {
                                                                                            setManageUser({
                                                                                                type: "Suspend IP",
                                                                                            });
                                                                                            $("#manageUserModal").modal('show');
                                                                                        }}>Suspend IP</button>
                                                                                    <button className="btn btn-danger w-100 mb-2" onClick={() => {
                                                                                            setManageUser({
                                                                                                type: "Delete Account",
                                                                                            });
                                                                                            $("#manageUserModal").modal('show');
                                                                                        }}>Delete Account</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            {
                                                                items && items.map((category, index) => {
                                                                    return (
                                                                        <>
                                                                            <div className="row mt-4" key={index}>
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
                                                                                                            category.categoryItems.map((item, index) => {
                                                                                                                return (
                                                                                                                    <tr key={index}>
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
                                                                                                                            Price: <b>{item.price.toLocaleString()}</b>
                                                                                                                        </td>
                                                                                                                        <td style={{ textAlign: 'center' }}>
                                                                                                                            {
                                                                                                                                !item.owns ?
                                                                                                                                    <button type="button" onClick={() => manageItem({ type: "assign", user_id: userDB._id, item_id: item.id, item_name: item.name, username: userDB.assistants_username, category_id: category.categoryId })} className="btn btn-primary" style={{ color: 'white', height: 40, margin: 'auto', borderColor: 'transparent' }}>Assign</button>
                                                                                                                                    :
                                                                                                                                    <button type="button" onClick={() => manageItem({ type: "revoke", user_id: userDB._id, item_id: item.id, item_name: item.name, username: userDB.assistants_username, category_id: category.categoryId })} className="btn btn-danger" style={{ color: 'white', height: 40, margin: 'auto', borderColor: 'transparent' }}>Revoke</button>
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
