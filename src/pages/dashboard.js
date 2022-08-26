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

    const title = `${IsBeta ? 'BETA | ' : ''}Assistants Center - Dashboard`

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
                                {/* <FeaturedTab
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
                                {
                                    <FeaturedTab
                                        title={
                                            <>
                                                <span className="fw-bold">Twitter Tools</span>{" "}
                                                are back
                                            </>
                                        }
                                        mt={30}
                                        mb={30}
                                        button_title={"Explore now"}
                                        button_url={'/twitter-tools'}
                                        background={'url("https://cdn.assistantscenter.com/l4smwhnd")'}
                                    />
                                }
                            </div>
                            <div className={"row"} id="tabs">
                                <div className="col-lg-6 d-flex flex-column">
                                    <FeaturedTab
                                        title={<b>Discord Dashboard v2</b>}
                                        subtitle={"The best way to create Dashboard for your bot."}
                                        button_title={"Generate License"}
                                        button_url={"/discord-dashboard/v2"}
                                        background={"url('https://cdn.assistantscenter.com/l4smyro6')"}
                                    />
                                </div>
                                <div className="col-lg-6 d-flex flex-column">
                                    <FeaturedTab
                                        title={<b>Learn IT</b>}
                                        subtitle={"Tutorials from the IT world available to you."}
                                        button_title={"Explore"}
                                        button_url={'https://learnit.assistantscenter.com'}
                                        background={"url('https://cdn.assistantscenter.com/l4smzkqt')"}
                                    />
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