import React from 'react'
import { useRouter } from "next/router"

export default function Sidebar({ user }) {
    const { asPath } = useRouter()

    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
                <li className={`nav-item${asPath == '/' || asPath.startsWith('/?') ? ' active' : ''}`}>
                    <a className="nav-link" href="/">
                        <i className="mdi mdi-home menu-icon" />
                        <span className="menu-title">Home</span>
                    </a>
                </li>
                <li className={`nav-item${asPath.startsWith('/dashboard') ? ' active' : ''}`}>
                    <a className="nav-link" href="/dashboard">
                        <i className="mdi mdi-grid-large menu-icon" />
                        <span className="menu-title">Dashboard</span>
                    </a>
                </li>


                <li className="nav-item nav-category">Account</li>


                <li className={`nav-item${asPath.startsWith('/profile') ? ' active' : ''}`}>
                    <a className="nav-link" href="/profile">
                        <i className="mdi mdi-account menu-icon" />
                        <span className="menu-title">Manage Profile</span>
                    </a>
                </li>
                <li className={`nav-item${asPath.startsWith('/shop') ? ' active' : ''}`}>
                    <a className="nav-link" href="/shop">
                        <i className="mdi mdi-cart menu-icon" />
                        <span className="menu-title">Features Shop</span>
                    </a>
                </li>


                <li className="nav-item nav-category">Tools</li>


                <li className={`nav-item${asPath.startsWith('/discord-dashboard') ? ' active' : ''}`}>
                    <a style={{ borderRadius: '0px 20px 0px 0px' }} className="nav-link" data-bs-toggle="collapse" href="#form-elements" aria-expanded="false"
                        aria-controls="form-elements">
                        <i className="menu-icon mdi mdi-view-dashboard"></i>
                        <span className="menu-title">Discord-Dashboard</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <div className={`collapse ${asPath.startsWith('/discord-dashboard') ? ' show' : ''}`} id="form-elements">
                        <ul className="nav flex-column sub-menu" style={{ borderRadius: '0px 0px 20px 0px' }}>
                            {/*<li className="nav-item"><a className={`nav-link${(asPath.startsWith('/discord-dashboard') && !asPath.startsWith('/discord-dashboard/')) || asPath.startsWith('/discord-dashboard/project/')?' active':''}`} href="/discord-dashboard">Projects</a></li>*/}
                            <li className="nav-item"><a className={`nav-link${asPath.startsWith('/discord-dashboard/v2') ? ' active' : ''}`} href="/discord-dashboard/v2">v2 Licenses</a></li>
                            <li className="nav-item"><a className="nav-link" href="https://dbd-docs.assistantscenter.com/#/" target="_blank">Documentation</a></li>
                            <li className="nav-item"><a className="nav-link" href="https://learnit.assistantscenter.com/category/discord-dashboard/discord-dashboard-tutorial/" target="_blank">Tutorial</a></li>
                        </ul>
                    </div>
                </li>


                {/*
                <li className={`nav-item${asPath.startsWith('/twitter-tools')?' active':''}`}>
                    <a className="nav-link" data-bs-toggle="collapse" href="#form-elements2" aria-expanded="false"
                       aria-controls="form-elements2">
                        <i className="menu-icon mdi mdi-twitter"></i>
                        <span className="menu-title">Twitter Tools</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <div className={`collapse ${asPath.startsWith('/twitter-tools')?' show':''}`}  id="form-elements2">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item"><a className={`nav-link${asPath.startsWith('/twitter-tools/daily-shop')?' active':''}`} href="/twitter-tools/daily-shop">Fortnite Daily Shop</a></li>
                        </ul>
                    </div>
                </li>
                */}


                <li className="nav-item">
                    <a className="nav-link" href="https://upload.assistantscenter.com" target={"_blank"}>
                        <i className="mdi mdi-cloud menu-icon" />
                        <span className="menu-title">CDN</span>
                    </a>
                </li>

                <li className="nav-item nav-category">Partnership</li>

                <li className={`nav-item${asPath.startsWith('/partnership') ? ' active' : ''}`}>
                    <a className="nav-link" href="/partnership">
                        <i className="mdi mdi-human-handsup menu-icon" />
                        <span className="menu-title">Partnership Program</span>
                    </a>
                </li>


                {
                    user && user.admin && (
                        <>
                            <li className="nav-item nav-category">Admin</li>
                            <li className={`nav-item${asPath.startsWith('/admin/support') ? ' active' : ''}`}>
                                <a className="nav-link" href="/admin/support">
                                    <i className="mdi mdi-human-handsup menu-icon" />
                                    <span className="menu-title">Bot Queries</span>
                                </a>
                            </li>
                            <li className={`nav-item${asPath.startsWith('/admin/users/list') ? ' active' : ''}`}>
                                <a className="nav-link" href="/admin/users/list">
                                    <i className="mdi mdi-human-handsup menu-icon" />
                                    <span className="menu-title">User List</span>
                                </a>
                            </li>
                        </>
                    )
                }


                {
                    user?.username ?
                        <>
                            <li className="nav-item nav-category">Session</li>


                            <li className="nav-item">
                                <a className="nav-link" href="/api/auth/session/destroy">
                                    <i className="mdi mdi-account-off menu-icon" />
                                    <span className="menu-title">Sign out</span>
                                </a>
                            </li>
                        </>
                        : null
                }
            </ul>
        </nav>

    )
}