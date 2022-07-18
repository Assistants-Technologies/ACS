import React from 'react'
import NavbarMenu from "../nav/top/NavbarMenu";
import Sidebar from "../nav/side/Sidebar";
import Footer from "./Footer";

export default function PageBody ({ user, children }) {
    return (
        <>
            <NavbarMenu user={user}/>
            <div className="container-fluid page-body-wrapper">
                <Sidebar user={user}/>
                <div className="main-panel">
                    <div className="content-wrapper">
                        {children}
                    </div>
                    <Footer/>
                </div>
            </div>
        </>
    )
}