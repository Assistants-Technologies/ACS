import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import Script from 'next/script'

import { EditorState, convertToRaw, convertFromRaw, draftToHtml } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false })  
    
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

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


const defaultContent = {"blocks":[{"key":"3s3kt","text":"Start writing to create your first epic Assistants Post!","type":"header-two","depth":0,"inlineStyleRanges":[{"offset":0,"length":56,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"f7fd2","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8cp4u","text":"\"There's only one thing we know for sure. That life is now.\"\n- Isak ❤️","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":61,"length":9,"style":"BOLD"},{"offset":61,"length":9,"style":"ITALIC"}],"entityRanges":[],"data":{}}],"entityMap":{}}

export default function TestPage ({ user, url }) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }

    const [editorState, setEditorState] = React.useState(EditorState.createWithContent(convertFromRaw(defaultContent)))

    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState)
    }

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <title>{IsBeta ? 'BETA | ' : ''}Assistants Center - Dashboard</title>
                <link rel="stylesheet" href={`${ud_s}vendors/feather/feather.css`} />
                <link rel="stylesheet" href={`${ud_s}vendors/mdi/css/materialdesignicons.min.css`}/>
                <link rel="stylesheet" href={`${ud_s}vendors/ti-icons/css/themify-icons.css`} />
                <link rel="stylesheet" href={`${ud_s}vendors/typicons/typicons.css`} />
                <link
                    rel="stylesheet"
                    href={`${ud_s}vendors/simple-line-icons/css/simple-line-icons.css`}
                />
                <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `!function(){var e=document.createElement("script");e.type="text/javascript",e.src="https://global.ketchcdn.com/web/v2/config/assistantscenter/website_smart_tag/boot.js",e.defer=e.async=!0,document.getElementsByTagName("head")[0].appendChild(e),window.semaphore=window.semaphore||[]}();` }}></script>
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
                            <div className={"row"} id="tabs">
                                <div className="col-sm-12">
                                    <div className="card card-rounded">
                                        <div className="card-body">
                                           <Editor
                                                editorState={editorState}
                                                toolbarClassName="toolbarClassName"
                                                wrapperClassName="wrapperClassName"
                                                editorClassName="editorClassName"
                                                onEditorStateChange={onEditorStateChange}
                                            />

                                            <textarea disabled value={JSON.stringify(convertToRaw(editorState.getCurrentContent()))}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*
                            <div className={"row"} id="tabs" style={{paddingTop:200}}>
                                <div className="col-sm-12">
                                    <h1>Preview</h1>
                                    <div className="card card-rounded">
                                        <div className="card-body">
                                            <Editor toolbarHidden editorState={editorState} readOnly={true} />
                                        </div>
                                    </div>
                                </div>
                            </div>*/}
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