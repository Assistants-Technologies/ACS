import React from 'react'
import Head from 'next/head'

import Script from 'next/script'

import PageBody from "../../../components/content/PageBody"
import Scripts from "../../../components/content/Scripts"

import IsBeta from '../../../isBeta'

import axios from 'axios'

export async function getServerSideProps(context) {
    return {
        props: {
            url: context.query.url.split('?')[0],
            user: context.query.user,
            question: context.query.question
        },
    }
}

export default function TestPage({ user, url, question }) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if (ud != 1) {
        for (let i = 0; i < ud; i++) {
            ud_s += '../'
        }
    }

    const [query, setQuery] = React.useState(null);
    const [answer, setAnswer] = React.useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (!query || !answer) return alert('No query or answer');
        axios.post(`/api/admin/support/questions/edit/${question}/set`, {
            query,
            answer
        }).then(res => {
            if (res.data?.error === false)
                window.location.href = '/admin/support'
            else if (res.data?.error === true) return alert(res.data?.message)
        })
    }

    React.useEffect(() => {
        axios.get('/api/admin/support/questions').then(res => {
            setQuery(res.data?.questions?.list?.find((x) => x.id == question)?.query || [])
            setAnswer(res.data?.questions?.list?.find((x) => x.id == question)?.answer || [])
        });
        setTimeout(() => {
            $("textarea").each(function () {
                this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
            }).on("input", function () {
                this.style.height = 0;
                this.style.height = (this.scrollHeight) + "px";
                this.parentElement.height = (this.scrollHeight) + "px";
            });
        }, 500)
    }, [])

    const title = `${IsBeta ? 'BETA | ' : ''}Assistants Center - Admin Users Management`

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
                <link rel="stylesheet" href={`${ud_s}vendors/mdi/css/materialdesignicons.min.css`} />
                <link rel="stylesheet" href={`${ud_s}vendors/ti-icons/css/themify-icons.css`} />
                <link rel="stylesheet" href={`${ud_s}vendors/typicons/typicons.css`} />
                <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `!function(){var e=document.createElement("script");e.type="text/javascript",e.src="https://global.ketchcdn.com/web/v2/config/assistantscenter/website_smart_tag/boot.js",e.defer=e.async=!0,document.getElementsByTagName("head")[0].appendChild(e),window.semaphore=window.semaphore||[]}();` }}></script>
                <script dangerouslySetInnerHTML={{
                    __html: ` 

                    `}}>
                </script>
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

                <link rel="stylesheet" href={`${ud_s}mycss/my_dark_css.css`} />
            </Head>
            <PageBody user={user} uds={ud_s}>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="home-tab">
                            <div className="card card-rounded">
                                <div className="card-body">
                                    <h3><b>User Profile</b></h3>

                                    <h5 className="pt-3">Profile information</h5>

                                    <form onSubmit={handleSubmit}>
                                        <div className="row pt-2">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label>Query</label>
                                                    <input className="form-control"
                                                        type="text" name="query" onChange={(e) => setQuery(e.target.value)} value={query}
                                                        placeholder="Query" aria-label="Query"
                                                    />
                                                    <label>Answer</label>
                                                    <textarea style={{ wordSpacing: "1px", lineHeight: "15px" }} className='form-control' type="text" name="answer" onChange={(e) => setAnswer(e.target.value)} value={answer} ></textarea>
                                                    <input className='btn btn-primary text-white mt-3' type="submit" />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageBody>
            <Scripts src={ud_s} />
            <Script src={`${ud_s}vendors/js/vendor.bundle.base.js`} />
            <Script src={`${ud_s}vendors/bootstrap-datepicker/bootstrap-datepicker.min.js`} />
            <Script src={`${ud_s}js/off-canvas.js`} />
            <Script src={`${ud_s}js/hoverable-collapse.js`} />
            <Script src={`${ud_s}js/template.js`} />
            <Script src={`${ud_s}js/settings.js`} />
            <Script src={`${ud_s}js/todolist.js`} />
        </>
    )
}