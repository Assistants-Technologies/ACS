import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import Script from 'next/script'

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import PageBody from "../components/content/PageBody";
import Scripts from "../components/content/Scripts";

import IsBeta from '../isBeta'
import {NextSeo} from "next-seo";

export async function getServerSideProps(context) {
    return {
        props: {
            url: context.query.url.split('?')[0],
            posts: context.query.posts || [],
            posts_count: context.query.postsCount || 0,
            user: context.query.user,
            page: context.query.page || 1,
            limit: context.query.limit || 10,
        },
    }
}

export default function TestPage ({ user, url, posts, posts_count, page, limit }) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }

    return (
        <>
            <NextSeo
                title={"Assistants Center's Blog"}
                openGraph={{
                    title: "Assistants Center's Blog",
                    url: "https://assistantscenter.com/blog",
                }}
            />
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <title>{IsBeta ? 'BETA | ' : ''}Assistants Center - Blog</title>
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
                <style>
                    {`
 .band {
\t width: 97%;
\t margin: 0 auto;
\t display: grid;
\t grid-template-columns: 1fr;
\t grid-template-rows: auto;
\t grid-gap: 20px;
}
 @media (min-width: 30em) {
\t .band {
\t\t grid-template-columns: 1fr 1fr;
\t}
}
 @media (min-width: 60em) {
\t .band {
\t\t grid-template-columns: repeat(4, 1fr);
\t}
}
 .card-blog {
 border-radius: 20px;
\t background: #181b1c;
\t text-decoration: none;
\t color: #444;
\t box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
\t display: flex;
\t flex-direction: column;
\t min-height: 100%;
\t position: relative;
\t top: 0;
\t transition: all 0.1s ease-in;
}
 .card-blog:hover {
\t top: -2px;
\t box-shadow: 0 4px 5px rgba(0, 0, 0, 0.2);
}
 .card-blog article {
\t padding: 20px;
\t flex: 1;
\t display: flex;
\t flex-direction: column;
\t justify-content: space-between;
}
 .card-blog h1 {
\t font-size: 20px;
\t margin: 0;
\t color: white;
}
 .card-blog p {
\t flex: 1;
\t line-height: 1.4;
}
 .card-blog span {
\t font-size: 12px;
\t font-weight: bold;
\t color: #999;
\t text-transform: uppercase;
\t letter-spacing: 0.05em;
\t margin: 2em 0 0 0;
}
 .card-blog .thumb {
\t padding-bottom: 60%;
\t background-size: cover;
\t background-position: center center;
}
 @media (min-width: 60em) {
\t .item-1 {
\t\t grid-column: 1 / span 2;
\t}
\t .item-1 h1 {
\t\t font-size: 24px;
\t}
}
 
                    `}
                </style>
            </Head>
            <PageBody user={user} uds={ud_s}>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card card-rounded">
                            <div className="card-body">
                                <header style={{paddingBottom:30}}>
                                    <h1>Assistant's Center Blog</h1>
                                </header>
                                <div className="band">
                                    {
                                        posts.map((post, index) => {
                                            return (
                                                <div className={`item-${index+2}`}>
                                                    <a
                                                        href={`/blog/${post.category.slug}/${post.slug}`}
                                                        className="card-blog"
                                                    >
                                                        <div
                                                            className={"thumb"}
                                                            style={{
                                                                backgroundImage:
                                                                    post.image ? `url(${post.image})` : null,
                                                                borderRadius: '20px 20px 0px 0px',
                                                            }}
                                                        />
                                                        <article>
                                                            <h1>{post.title}</h1>
                                                            <span>{post.category.name}<br/>{new Date(post.createdAt).toLocaleDateString()}, {new Date(post.createdAt).toLocaleTimeString().slice(0,5)}</span>
                                                        </article>
                                                    </a>
                                                </div>
                                            )
                                        })
                                    }

                                    {
                                        (Math.ceil(posts_count / limit) > 1) && (Number(page) <= Math.ceil(posts_count / limit)) && (Number(page) != 1) ? <a href={`/blog?page=${Number(page)-1}`}>Page before</a> : <></>
                                    }
                                    {
                                        (Math.ceil(posts_count / limit) > 1) && (Number(page) != Math.ceil(posts_count / limit)) ? <a href={`/blog?page=${Number(page)+1}`}>Next page</a> : <></>
                                    }
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
