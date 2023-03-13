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
            suspended: JSON.parse(context.query.suspended),
        },
    }
}

export default function Suspended({ userID, url, suspended }) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if (ud != 1) {
        for (let i = 0; i < ud; i++) {
            ud_s += '../'
        }
    }

    let d = suspended.until ? new Date(suspended.until) : null;
    let now = new Date();

    let diff = d ? d - now : null;
    let diffSeconds = diff ? diff / 1000 : null;
    let diffMinutes = diff ? diff / (1000 * 60) : null;
    let diffHours = diff ? diff / (1000 * 60 * 60) : null;
    let diffDays = diff ? diff / (1000 * 60 * 60 * 24) : null;
    let diffWeeks = diff ? diff / (1000 * 60 * 60 * 24 * 7) : null;
    let diffMonths = diff ? diff / (1000 * 60 * 60 * 24 * 30) : null;
    let diffYears = diff ? diff / (1000 * 60 * 60 * 24 * 365) : null;

    let time = '';
    if (diffSeconds < 60) time = `${Math.floor(diffSeconds)} second${diffSeconds >= 2 ? 's' : ''}`;
    else if (diffMinutes < 60) time = `${Math.floor(diffMinutes)} minute${diffMinutes >= 2 ? 's' : ''}`;
    else if (diffHours < 24) time = `${Math.floor(diffHours)} hour${diffHours >= 2 ? 's' : ''}`;
    else if (diffDays < 7) time = `${Math.floor(diffDays)} day${diffDays >= 2 ? 's' : ''}`;
    else if (diffWeeks < 4) time = `${Math.floor(diffWeeks)} week${diffWeeks >= 2 ? 's' : ''}`;
    else if (diffMonths < 12) time = `${Math.floor(diffMonths)} month${diffMonths >= 2 ? 's' : ''}`;
    else time = `${Math.floor(diffYears)} years`;

    const title = `${IsBeta ? 'BETA | ' : ''}Assistants Center - Account Suspended`
    return <>
        <NextSeo
            title={"Assistants Center's Suspended"}
            openGraph={{
                title: "Assistants Center's Suspended",
                url: "https://assistantscenter.com/auth/suspended",
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
                                    <h1 style={{ color: "white", textAlign: "center", paddingTop: "30px", fontSize: "40px" }}>Account Suspended</h1>

                                    <div style={{ height: "auto", borderRadius: "30px", background: "rgba(255, 255, 255, 0.2)", margin: "50px", padding: "30px" }}>
                                        <p style={{ color: "white", textAlign: "center", fontSize: "20px" }}><b>{suspended.reason}</b></p>
                                        <p style={{ color: "white", textAlign: "center", fontSize: "18px", marginTop: "30px" }}>
                                            {d ? `Expires in ${time}` : "This is permanent and will not expire."}
                                        </p>
                                        <hr style={{ width: "100%", margin: "auto", marginTop: "30px", marginBottom: "30px", border: "1px solid white" }} />

                                        <p style={{ color: "white", textAlign: "center", fontSize: "15px", marginBottom: "20px" }}>You can appeal this decision in our <a href="https://discord.gg/EdJFwNvNS9">Discord</a>.</p>

                                        <div style={{ textAlign: "center" }}>
                                            
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