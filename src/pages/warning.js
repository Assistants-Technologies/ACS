import React from 'react';
import Head from 'next/head';
import axios from "axios"

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

import IsBeta from '../isBeta'
import { NextSeo } from "next-seo";

export async function getServerSideProps(context) {
    return {
        props: {
            url: context.query.url.split('?')[0],
            userID: context.query.userID,
            warning: JSON.parse(context.query.warning),
        },
    }
}

export default function Warning({ userID, url, warning }) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if (ud != 1) {
        for (let i = 0; i < ud; i++) {
            ud_s += '../'
        }
    }
    let d = new Date(warning.date);
    let now = new Date();
    let diff = now - d;
    let diffSeconds = diff / 1000;
    let diffMinutes = diff / (1000 * 60);
    let diffHours = diff / (1000 * 60 * 60);
    let diffDays = diff / (1000 * 60 * 60 * 24);
    let diffWeeks = diff / (1000 * 60 * 60 * 24 * 7);
    let diffMonths = diff / (1000 * 60 * 60 * 24 * 30);
    let diffYears = diff / (1000 * 60 * 60 * 24 * 365);

    let time = '';
    if (diffSeconds < 60) time = `${Math.floor(diffSeconds)} seconds ago`;
    else if (diffMinutes < 60) time = `${Math.floor(diffMinutes)} minutes ago`;
    else if (diffHours < 24) time = `${Math.floor(diffHours)} hours ago`;
    else if (diffDays < 7) time = `${Math.floor(diffDays)} days ago`;
    else if (diffWeeks < 4) time = `${Math.floor(diffWeeks)} weeks ago`;
    else if (diffMonths < 12) time = `${Math.floor(diffMonths)} months ago`;
    else time = `${Math.floor(diffYears)} years ago`;

    const title = `${IsBeta ? 'BETA | ' : ''}Assistants Center - Account Warned`
    return <>
        <NextSeo
            title={"Assistants Center's Warning"}
            openGraph={{
                title: "Assistants Center's Warning",
                url: "https://assistantscenter.com/auth/warning",
            }}
        />
        <Head>
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <title>{title}</title>
            <link rel="stylesheet" href={`${ud_s}vendors/feather/feather.css`} />
            <link rel="stylesheet" href={`${ud_s}css/vertical-layout-light/style.css`} />
            {
                IsBeta ?
                    <link rel="shortcut icon" href={`${ud_s}images/favicon.png`} />
                    :
                    <link rel="shortcut icon" href={`${ud_s}favicon.png`} />
            }

            <link rel="stylesheet" href={`${ud_s}mycss/my_dark_css.css`} />
        </Head>
        <div className="row">
            <div className="col-sm-12">
                <div className="card card-rounded">
                    <div className="card-body" style={{display: "grid", placeItems: "center", height: "90vh"}}> 
                        <div style={{ maxWidth: "650px", borderRadius: "50px", backgroundSize: "cover", backgroundPositionX: "-235px", backgroundRepeat: "no-repeat", backgroundImage: "url('https://cdn.assistantscenter.com/l4smyro6')" }}>
                            <div style={{ borderRadius: "50px", background: "rgba(255, 255, 255, 0.12)" }}>
                                <div>
                                    <h1 style={{ color: "white", textAlign: "center", paddingTop: "30px", fontSize: "40px" }}>Account Warned</h1>

                                    <div style={{ height: "auto", borderRadius: "30px", background: "rgba(255, 255, 255, 0.2)", margin: "50px", padding: "30px" }}>
                                        <p style={{ color: "white", textAlign: "center", fontSize: "20px" }}><b>{warning.reason}</b></p>
                                        <p style={{ color: "white", textAlign: "center", fontSize: "18px", marginTop: "30px" }}>Issued {time}</p>
                                        <hr style={{ width: "100%", margin: "auto", marginTop: "30px", marginBottom: "30px", border: "1px solid white" }} />

                                        <p style={{ color: "white", textAlign: "center", fontSize: "15px", marginBottom: "20px" }}>Upon acknowleding this warning, your account and licenses will be restored.</p>
                                        <p style={{ color: "white", textAlign: "center", fontSize: "15px", marginBottom: "20px" }}>Commiting further infractions will result in account suspension and/or deletion.</p>

                                        <div style={{ textAlign: "center" }}>
                                            <button className="btn btn-secondary" style={{ height: "50px", borderRadius: "30px", fontSize: "15px", background: "rgba(255, 255, 255, 0.2)", border: "1px solid white", color: "white" }} onClick={() => {
                                                axios.post(`/api/admin/users/warnings/acknowledge/${userID}`, { warning })
                                                .then((res) => {
                                                    const data = res.data;
                                                    
                                                    if (data.error) alert("Something went wrong while trying to acknowledge the warning. Please try again later.")
                                                    else window.location.href = `/dashboard`;
                                                })
                                                .catch((e) => alert("Something went wrong while trying to acknowledge the warning. Please try again later."));

                                            }}>Acknowledge Warning</button>
                                        </div>
                                    </div>
                                    <p style={{ color: "white", textAlign: "center", fontSize: "15px", marginTop: "30px", marginBottom: 0, paddingBottom: "10px" }}>© {new Date().getFullYear()} Assistants Center</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}