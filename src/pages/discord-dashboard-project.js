import React from 'react';
import Head from 'next/head';

import Script from 'next/script'
import PageBody from "../components/content/PageBody";
import Scripts from "../components/content/Scripts";

import FeaturedTab from "../components/row/FeaturedTab";
import DiscordDashboardProjectTab from "../components/row/DiscordDashboardProjectTab";
import StatsRow from "../components/stats/StatsRow";
import ViewsStats from "../components/dbd-stats/Views";

export async function getServerSideProps(context) {
    return {
        props: {
            url: context.query.url.split('?')[0],
            user: context.query.user || null,
            project: context.query.project || null,
        },
    }
}

export default function TestPage ({ user, project, url }) {
    if(!user || !project || !url) return <a></a>;
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <title>Star Admin2 </title>
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
                <link rel="shortcut icon" href={`${ud_s}images/favicon.png`} />
                <style>
                    {`
                   
                   
                    .modal {
  position: fixed;
  z-index: 4324;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}


                    .modal-content {
                      background-color: #fefefe;
                      margin: 5% auto;
                      padding: 20px;
                      border: 1px solid #888;
                      width: 80%;
                    }
                    
                    @media only screen and (min-width: 910px) and (max-width: 1200px) {
                        .modal-content {
                            width: 60% !important;
                        }
                    }
                    
                    @media only screen and (min-width: 1200px){
                        .modal-content {
                            width: 50% !important;
                        }
                    }
`}
                </style>
            </Head>
            <PageBody user={user} uds={ud_s}>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="home-tab">
                            <div className="d-sm-flex align-items-center justify-content-between border-bottom">
                                <a><b>Manage {project.name}</b></a>
                            </div>

                            <div className="tab-content tab-content-basic">
                                <a>Tutaj nazwa projektu, przycisk do edycji, boostowania projektu, etc.</a>
                            </div>

                            <div className="tab-content tab-content-basic">
                                <StatsRow project={project}/>

                                <div className="row tab-content tab-content-basic">
                                    <ViewsStats project={project}/>
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