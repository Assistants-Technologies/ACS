import React from 'react'
import Head from 'next/head'

import Script from 'next/script'
import PageBody from "../components/content/PageBody"
import Scripts from "../components/content/Scripts"

import FeaturedTab from "../components/row/FeaturedTab"
import DiscordDashboardProjectTab from "../components/row/DiscordDashboardProjectTab"

import IsBeta from '../isBeta'

export async function getServerSideProps(context) {
    return {
        props: {
            url: context.query.url.split('?')[0],
            user: context.query.user,
        },
    }
}

export default function TestPage ({ user, url }) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }

    const title = `${IsBeta ? 'BETA | ' : ''}Assistants Center - Discord Dashboard v3`

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <title>{title}</title>
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
                {
                    IsBeta ?
                        <link rel="shortcut icon" href={`${ud_s}images/favicon.png`} />
                    :
                        <link rel="shortcut icon" href={`${ud_s}favicon.png`} />
                }
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

                <link  rel="stylesheet" href={`${ud_s}mycss/my_dark_css.css`}/>
            </Head>
            <PageBody user={user} uds={ud_s}>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="home-tab">

                            <div className="tab-content" id="content-featured">
                                {/*
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
                                />*/}

                                <DiscordDashboardProjectTab/>

                                <div className="row flex-grow">
                                    <div className="col-12 grid-margin stretch-card">
                                        <div className="card card-rounded table-darkBGImg" style={{background:"url('https://cdn.assistantscenter.com/l4snvbcn')",backgroundSize:'cover !important',backgroundRepeat:'no-repeat'}}>
                                            <div className="card-body" style={{marginTop:30,marginBottom:30}}>
                                                <div className="col-sm-8">
                                                    <h3 className="text-white upgrade-info mb-0">
                                                        Want us to <b>take care of hosting your Dashboard?</b>
                                                    </h3>
                                                    <h5 className="text-white upgrade-info mt-2">
                                                        Get back to us and we will surely find a profitable solution: <a href="mailto:contact@assistantscenter.com">contact@assistantscenter.com</a>
                                                    </h5>
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