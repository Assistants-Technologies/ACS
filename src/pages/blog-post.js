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
import PageBody from "../components/content/PageBody";
import Scripts from "../components/content/Scripts";

import IsBeta from '../isBeta'
import axios from "axios";
import {NextSeo} from "next-seo";

export async function getServerSideProps(context) {
    return {
        props: {
            url: context.query.url.split('?')[0],
            post_data: context.query.post_data || null,
            user: context.query.user,
        },
    }
}

export default function TestPage ({ user, url, post_data }) {
    const [postId, setPostId] = React.useState(post_data?._id)
    const [postTitle, setPostTitle] = React.useState(post_data?.title)
    const [postCategory, setPostCategory] = React.useState(post_data?.category?.name)
    const [postContent, setPostContent] = React.useState(post_data?.content)

    console.log(postContent)

    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }

    const [editorState, setEditorState] = React.useState(EditorState.createWithContent(convertFromRaw(JSON.parse(postContent))))

    return (
        <>
            <Head>
                <NextSeo
                    title={post_data.title}
                    openGraph={{
                        title: post_data.title,
                        url: "https://assistantscenter.com/blog/"+post_data.category.slug+"/"+post_data.slug,
                        images: [{
                            url: post_data.image,
                        }]
                    }}
                />
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
                                <div className="card card-rounded">
                                    <div className="card-body">
                                        <Editor toolbarHidden editorState={editorState} readOnly={true} />
                                        <hr/>
                                        <p>
                                            <b>Created at:</b> {new Date(post_data?.createdAt).toLocaleString()}
                                            {   post_data?.updatedAt != post_data?.createdAt &&
                                                <>
                                                    <br/>
                                                    <b>Updated at:</b> {new Date(post_data?.updatedAt).toLocaleString()}
                                                </>
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        {
                            user?.blog_permissions && <div style={{paddingTop:25}}><a href={`/blog/edit/${post_data._id}`}>Hello, editor! Do you want to edit the post?</a></div>
                        }
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
