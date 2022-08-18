import React from 'react'
import Router from 'next/router'

export default function NavbarMenu ({ user, uds }) {
    const [welcomeText, setWelcomeText] = React.useState('')

    const updateText = () => {
        const day = new Date()
        const hr = day.getHours()
        if(hr>0&&hr<=5)return setWelcomeText('Night')
        if(hr>5&&hr<=12)return setWelcomeText('Morning')
        if(hr>12&&hr<=18)return setWelcomeText('Afternoon')
        if(hr>18&&hr<=21)return setWelcomeText('Evening')
        return setWelcomeText('Night')
    }

    React.useEffect(()=>{
        updateText()
        setInterval(updateText, 60000)
    }, []);

    return (
        <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row">
            <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
                <div className="me-3">
                    <button
                        className="navbar-toggler navbar-toggler align-self-center"
                        type="button"
                        data-bs-toggle="minimize"
                    >
                        <span className="icon-menu" />
                    </button>
                </div>
                <div>
                    <a className="navbar-brand brand-logo" href="/">
                        <b style={{color:'#2f15eb'}}>Assist<span style={{color:'#e7e6ed'}}>ants</span></b>
                    </a>
                    <a className="navbar-brand brand-logo-mini" href="/">
                        <img src={`${uds}images/logo-mini.svg`} alt="logo" />
                    </a>
                </div>
            </div>
            <div className="navbar-menu-wrapper d-flex align-items-top">
                <ul className="navbar-nav">
                    <li className="nav-item font-weight-semibold d-none d-lg-block ms-0">
                        <h1 className="welcome-text">
                            Good {welcomeText}{user && <>, <span className="text-black fw-bold">{user.username}</span></>}
                        </h1>
                        <h3 className="welcome-sub-text">
                            Manage your Assistants Center Services{" "}
                        </h3>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto">
                    {/*<li className="nav-item dropdown">
                        <a
                            className="nav-link count-indicator"
                            id="countDropdown"
                            href="#"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="icon-bell" />
                            <span className="count" />
                        </a>
                        <div
                            className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0"
                            aria-labelledby="countDropdown"
                        >
                            <a className="dropdown-item py-3">
                                <p className="mb-0 font-weight-medium float-left">
                                    You have 7 unread mails{" "}
                                </p>
                                <span className="badge badge-pill badge-primary float-right">
              View all
            </span>
                            </a>
                            <div className="dropdown-divider" />
                            <a className="dropdown-item preview-item py-3">
                                <div className="preview-thumbnail">
                                    <i className="mdi mdi-alert m-auto text-primary" />
                                </div>
                                <div className="preview-item-content">
                                    <h6 className="preview-subject fw-normal text-dark mb-1">
                                        Application Error
                                    </h6>
                                    <p className="fw-light small-text mb-0"> Just now </p>
                                </div>
                            </a>
                            <a className="dropdown-item preview-item py-3">
                                <div className="preview-thumbnail">
                                    <i className="mdi mdi-settings m-auto text-primary" />
                                </div>
                                <div className="preview-item-content">
                                    <h6 className="preview-subject fw-normal text-dark mb-1">
                                        Settings
                                    </h6>
                                    <p className="fw-light small-text mb-0"> Private message </p>
                                </div>
                            </a>
                            <a className="dropdown-item preview-item py-3">
                                <div className="preview-thumbnail">
                                    <i className="mdi mdi-airballoon m-auto text-primary" />
                                </div>
                                <div className="preview-item-content">
                                    <h6 className="preview-subject fw-normal text-dark mb-1">
                                        New user registration
                                    </h6>
                                    <p className="fw-light small-text mb-0"> 2 days ago </p>
                                </div>
                            </a>
                        </div>
                    </li>*/}
                    {user && <li className="nav-item dropdown d-none d-lg-block user-dropdown">
                        <a
                            className="nav-link"
                            id="UserDropdown"
                            href="#"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img
                                className="img-xs rounded-circle"
                                src={`/api/user/avatar/${user?._id}`}
                                alt="Profile image"
                                style={{objectFit: 'cover'}}
                            />{" "}
                        </a>
                        <div
                            className="dropdown-menu dropdown-menu-right navbar-dropdown"
                            aria-labelledby="UserDropdown"
                        >
                            <div className="dropdown-header text-center">
                                <img
                                    className="img-md rounded-circle"
                                    src={`/api/user/avatar/${user?._id}`}
                                    alt="Profile image"
                                    style={{marginTop:5, width: 35, height: 35, objectFit: 'cover'}}
                                />
                                <p className="mb-0 mt-2 font-weight-semibold">{user?.username}</p>
                                <p className="fw-light text-muted mb-0">{user?.email}</p>
                            </div>
                            <a className="dropdown-item" onClick={()=>Router.push(`${uds}/profile`)}>
                                <i className="dropdown-item-icon mdi mdi-account-outline text-primary me-2" />{" "}
                                My Profile {/*<span className="badge badge-pill badge-danger">1</span>*/}
                            </a>
                            <a className="dropdown-item" onClick={()=>Router.push(`${uds}/api/auth/session/destroy`)}>
                                <i className="dropdown-item-icon mdi mdi-power text-primary me-2" />
                                Sign Out
                            </a>
                        </div>
                    </li>}
                </ul>
                <button
                    className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
                    type="button"
                    data-bs-toggle="offcanvas"
                >
                    <span className="mdi mdi-menu" />
                </button>
            </div>
        </nav>

    )
}