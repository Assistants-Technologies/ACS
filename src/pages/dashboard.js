import React from 'react';
import Head from 'next/head';

import Script from 'next/script'

/*import Row from '../components/row/Row';
import Column from '../components/column/Column';*/
import StatsRow from '../components/stats/StatsRow';
import NavbarMenu from "../components/nav/top/NavbarMenu";
import Sidebar from "../components/nav/side/Sidebar";
import PageBody from "../components/content/PageBody";
import Scripts from "../components/content/Scripts";

import FeaturedTab from "../components/row/FeaturedTab";
import DiscordDashboardProjectTab from "../components/row/DiscordDashboardProjectTab";

export async function getServerSideProps(context) {
    return {
        props: {
            user: context.query.user,
        },
    }
}

export default function TestPage ({ user }) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <title>Star Admin2 </title>
                <link rel="stylesheet" href="vendors/feather/feather.css" />
                <link rel="stylesheet" href="vendors/mdi/css/materialdesignicons.min.css" />
                <link rel="stylesheet" href="vendors/ti-icons/css/themify-icons.css" />
                <link rel="stylesheet" href="vendors/typicons/typicons.css" />
                <link
                    rel="stylesheet"
                    href="vendors/simple-line-icons/css/simple-line-icons.css"
                />
                <link rel="stylesheet" href="vendors/css/vendor.bundle.base.css" />
                <link
                    rel="stylesheet"
                    href="vendors/datatables.net-bs4/dataTables.bootstrap4.css"
                />
                <link rel="stylesheet" href="js/select.dataTables.min.css" />
                <link rel="stylesheet" href="css/vertical-layout-light/style.css" />
                <link rel="shortcut icon" href="images/favicon.png" />
            </Head>
            <PageBody user={user}>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="home-tab">
                            <div className="tab-content" id="content-featured">
                                <FeaturedTab
                                    title={
                                        <>
                                            <span className="fw-bold">Discord Dashboard v3</span>{" "}
                                            is now available
                                        </>
                                    }
                                    button_title={
                                        'Explore novelties'
                                    }
                                    background={'url("https://cdn.assistantscenter.com/l4smwhnd")'}
                                />
                            </div>
                            <div className={"row"} id="tabs">
                                <div className="col-lg-6 d-flex flex-column">
                                    <FeaturedTab
                                        title={<b>Discord Dashboard</b>}
                                        subtitle={"The best way to create Dashboard for your bot."}
                                        button_title={"Create project"}
                                        background={"url('https://cdn.assistantscenter.com/l4smyro6')"}
                                    />
                                </div>
                                <div className="col-lg-6 d-flex flex-column">
                                    <FeaturedTab
                                        title={<b>Twitter Tools</b>}
                                        subtitle={"The best way to manage your Creator tools."}
                                        button_title={"Explore"}
                                        background={"url('https://cdn.assistantscenter.com/l4smzkqt')"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageBody>
            <Scripts/>
        </>
    )
}