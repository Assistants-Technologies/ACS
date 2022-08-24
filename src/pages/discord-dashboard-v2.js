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
            licenses: context.query.licenses,
            user: context.query.user,
        },
    }
}

export default function TestPage ({ user, url, licenses }) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }

    const title = `${IsBeta ? 'BETA | ' : ''}Assistants Center - Discord Dashboard v2`

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

                                <div className="row flex-grow">
                                    <div className="col-12 grid-margin stretch-card">
                                        <div className="card card-rounded">
                                            <div className="card-body">
                                                <h3><b>Discord-Dashboard v2 Licenses</b></h3>

                                                <div className="table-responsive">
                                                    <table className="table table-striped">
                                                        <thead>
                                                        <tr>
                                                            <th width="25%">Type</th>
                                                            <th width="75%">License ID</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr>
                                                            <td><b>OpenSource</b></td>
                                                            <td>{licenses.OpenSource ?? <a href="/shop">Generate now</a>}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b>Personal</b></td>
                                                            <td>{licenses.Personal ?? <a href="/shop">Buy now</a>}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><b>Production</b></td>
                                                            <td>{licenses.Production ?? <a href="/shop">Buy now</a>}</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div style={{paddingTop:'30px'}}>
                                                    {
                                                        (!licenses.OpenSource || !licenses.Personal || !licenses.Production) ?
                                                            <p>
                                                                You can obtain an license in the <a href="/shop">Digital Features Store</a>
                                                            </p>
                                                            :
                                                            <p>
                                                                Thanks for your support ❤️
                                                            </p>
                                                    }
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