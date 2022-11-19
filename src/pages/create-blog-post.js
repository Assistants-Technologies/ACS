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

export async function getServerSideProps(context) {
    return {
        props: {
            url: context.query.url.split('?')[0],
            post_id: context.query.post_id || null,
            content: context.query.content || null,
            user: context.query.user,
            post_data: context.query.post_data || null,
        },
    }
}


const defaultContent = {"blocks":[{"key":"3s3kt","text":"Start writing to create your first epic Assistants Post!","type":"header-two","depth":0,"inlineStyleRanges":[{"offset":0,"length":56,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"f7fd2","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8cp4u","text":"\"There's only one thing we know for sure. That life is now.\"\n- Isak ❤️","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":61,"length":9,"style":"BOLD"},{"offset":61,"length":9,"style":"ITALIC"}],"entityRanges":[],"data":{}}],"entityMap":{}}


const UpdateBlogPostPage = ({ title, category, content, slug, id, image, }) => {
    axios.post('/api/blog/update/'+id, {
        slug,
        title,
        category,
        content,
        image,
    })
}

const CreateBlogPostPage = async ({ title, category, content, slug, image }) => {
    const data = (await axios.post('/api/blog/create', {
        slug,
        title,
        category,
        content,
        image,
    })).data
    location.href = `/blog/edit/${data.post_id}`
}


export default function TestPage ({ user, url, content, post_data }) {
    const [postId, setPostId] = React.useState(post_data?._id)
    const [postSlug, setPostSlug] = React.useState(post_data?.slug)
    const [postTitle, setPostTitle] = React.useState(post_data?.title)
    const [postCategory, setPostCategory] = React.useState(post_data?.category?.slug || "general")
    const [postContent, setPostContent] = React.useState(post_data?.content || JSON.stringify(defaultContent))
    const [postImage, setPostImage] = React.useState(post_data?.image || null)

    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }

    const [editorState, setEditorState] = React.useState(EditorState.createWithContent(convertFromRaw(JSON.parse(postContent))))

    const onEditorStateChange = (newEditorState) => {
        setPostContent(JSON.stringify(convertToRaw(newEditorState.getCurrentContent())))
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

                                            <textarea disabled value={postContent}/>
                                            <textarea disabled value={JSON.stringify(post_data)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <input placeholder={"Post title"} onChange={(event)=>{
                                setPostTitle(event.target.value)
                            }} value={postTitle}/>
                            <select value={postCategory} onChange={(event)=>{
                                setPostCategory(event.target.value)
                            }}>
                                <option value="discord-dashboard">discord-dashboard</option>
                                <option value="general">General</option>
                            </select>
                            <input value={postSlug} placeholder={"Post slug (az,09,-), no /"} onChange={(event)=>{
                                setPostSlug(event.target.value)
                            }}/>
                            <input value={postImage} placeholder={"Post image URL"} onChange={(event)=>{
                                setPostImage(event.target.value)
                            }}/>
                            <button disabled={(postSlug != null && postTitle != null && postContent !=null && postCategory !=null) ? false : true} onClick={()=> {
                                if(postId){
                                    UpdateBlogPostPage({ image: postImage, id:postId, title: postTitle, category: postCategory, content: postContent, slug: postSlug})
                                }else{
                                    CreateBlogPostPage({image: postImage, title: postTitle, category: postCategory, content: postContent, slug: postSlug})
                                }
                            }}>{postId ? "Edit Post" : "Create Post"}</button>
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
