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
        },
    }
}

export default function TestPage({ user, url }) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if (ud != 1) {
        for (let i = 0; i < ud; i++) {
            ud_s += '../'
        }
    }

    ud_s += '../'

    const [questions, setQuestions] = React.useState(null)

    function getQuestions() {
        axios.get('/api/admin/support/questions').then(res => {
            setQuestions(res.data?.questions || [])
        });
    }

    React.useEffect(() => {
        getQuestions();
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
                                    <h2><b>[ADMIN] Queries List</b></h2>

                                    <h4 style={{ paddingTop: 10 }}>Question Count: <b>{questions?.list ? questions.list.length : "Loading..."}</b></h4>

                                    <a href='/admin/support/create' className="btn btn-primary" style={{ marginTop: 10 }}>Add Question</a>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>
                                                        Query name and description
                                                    </th>
                                                    <th>
                                                        Edit query
                                                    </th>
                                                    <th>
                                                        Delete query
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    questions &&
                                                    questions.list &&
                                                    questions.list.reverse().map(question => {
                                                        if (!question) return null;
                                                        let safeQuery = question.query.replace(`"`, `'`).replace('`', `'`);
                                                        return (
                                                            <tr key={question.id}>
                                                                <td>
                                                                    <div>
                                                                        <h6>{question?.query}</h6>
                                                                        <p style={{ width: "40vw", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{question?.answer}</p>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <a href={`/admin/support/edit/${question.id}`} className="btn btn-primary btn-sm">Edit</a>
                                                                </td>
                                                                <td>
                                                                    <button className="btn btn-danger btn-sm" onClick={async () => {
                                                                        if (confirm(`Are you sure you want to delete the question "${safeQuery}"?`)) {
                                                                            await axios.post(`/api/admin/support/questions/edit/${question?.id}/delete`)
                                                                            getQuestions();
                                                                        }
                                                                    }}>Delete</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
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