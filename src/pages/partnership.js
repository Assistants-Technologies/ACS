import React from 'react'
import Head from 'next/head'

import Script from 'next/script'
import PageBody from "../components/content/PageBody"
import Scripts from "../components/content/Scripts"

import FeaturedTab from "../components/row/FeaturedTab"
import DiscordDashboardProjectTab from "../components/row/DiscordDashboardProjectTab"

import axios from 'axios'

import { MultiStepForm, Step } from 'react-multi-form'

import IsBeta from '../isBeta'

import NotPartneredNoRequest from '../components/partnership/NotPartneredNoRequest'

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

    const title = `${IsBeta ? 'BETA | ' : ''}Assistants Center - Partnership`

    const [active, setActive] = React.useState(1)
    const [displaySubmit, setDisplaySubmit] = React.useState(false)

    const [submitError, setSubmitError] = React.useState(null)

    const [partnerData, setPartnerData] = React.useState(null)

    const [partnerCode, setPartnerCode] = React.useState('')
    const [partnerEmail, setPartnerEmail] = React.useState('')
    const [aboutYou, setAboutYou] = React.useState('')

    React.useEffect(()=>{
        axios.get('/api/partnership').then(res=>{
            if(res.data.error)
                return alert(`Error: ${res.data.message}`)
            setPartnerData(res.data)
        })
    }, [])

    const validateEmail = (email) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
    }

    const postSubmit = async () => {
        const res = await axios.post('/api/partnership/apply', {
            about: aboutYou, 
            code_requested: partnerCode, 
            email: partnerEmail
        })

        if(res.data.error){
            return setSubmitError(res.data.message)
        }else{
            setDisplaySubmit(false)
            axios.get('/api/partnership').then(res=>{
                if(res.data.error)
                    return alert(`Error: ${res.data.message}`)
                setPartnerData(res.data)
            })
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
                  background-color: none;
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
                                <div className="tab-pane fade show active" id="featured">

                                    <div className="row flex-grow">
                                        <div className="col-12 grid-margin stretch-card">
                                            <div className="card card-rounded table-darkBGImg" style={{background:"url('https://cdn.assistantscenter.com/l77ccwsa')",backgroundSize:'cover !important',backgroundRepeat:'no-repeat'}}>
                                                <div className="card-body" style={{marginTop:30,marginBottom:30}}>
                                                    <div className="col-sm-8">
                                                        <h3 className="text-white upgrade-info mb-0">
                                                            <b>Partnership Program</b>
                                                        </h3>
                                                        <h5 className="text-white upgrade-info mt-2">
                                                        Support Assistants Center and we will support you!
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        (partnerData && partnerData.partnered == false && (partnerData.request_status ? (partnerData.request_status?.confirmed != null && partnerData.request_status?.confirmed != true) : true))
                                        &&
                                        <NotPartneredNoRequest 
                                        postSubmit={postSubmit}
                                        validateEmail={validateEmail}
                                        
                                        active={active}
                                        setActive={setActive}
                                    
                                        submitError={submitError}
                                        setSubmitError={setSubmitError}
                                    
                                        partnerData={partnerData}
                                        setPartnerData={setPartnerData}
                                    
                                        displaySubmit={displaySubmit}
                                        setDisplaySubmit={setDisplaySubmit}
                                    
                                        partnerCode={partnerCode}
                                        setPartnerCode={setPartnerCode}
                                    
                                        partnerEmail={partnerEmail}
                                        setPartnerEmail={setPartnerEmail}
                                    
                                        aboutYou={aboutYou}
                                        setAboutYou={setAboutYou}
                                    />
                                    }

                                    {
                                        (partnerData && partnerData.partnered == false && (partnerData.request_status?.confirmed == true))
                                        &&
                                        <div>
                                            <p style={{fontSize:20}}>Hmmm, and that's strange.</p>
                                            <p style={{fontSize:16}}>It looks like your application was accepted, but the Creator Profile was not created. Our fault.</p>
                                            <p style={{fontSize:16}}>Please contact us as soon as possible: <a href="mailto:support@assistantscenter.com">support@assistantscenter.com</a></p>
                                        </div>
                                    }

                                    {
                                        (partnerData && partnerData.request_status && partnerData.partnered == false && (partnerData.request_status?.confirmed == null))
                                        &&
                                        <div>
                                            <p style={{fontSize:20}}>We're processing your application</p>
                                            <p style={{fontSize:16}}>Please wait for the application to be processed. If it takes longer than a week, please contact us: <a href="mailto:support@assistantscenter.com">support@assistantscenter.com</a></p>
                                        </div>
                                    }

                                    {
                                        (partnerData && partnerData.partner_data && partnerData.partnered == true)
                                        &&
                                        <div>

                                            <div className="col-lg-12 grid-margin stretch-card">
                                                <div className="card card-rounded">
                                                    <div className="card-body">
                                                        <h4 className="card-title" style={{color:"red"}}>The data on this site is confidential</h4>
                                                        <p style={{fontSize:16}}>Keep in mind that all data available on this site is confidential, and making it public it may end up blocking access to the Partnership Program.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12 grid-margin stretch-card">
                                                <div className="card card-rounded">
                                                    <div className="card-body">
                                                        <h4 className="card-title">Your Assistants Center Partner Profile</h4>
                                                        <p style={{fontSize:16}}>Code: <b>{partnerData.partner_data.user_partnership_id}</b></p>

                                                        <p style={{fontSize:16}}>Shop url: <a href={`https://assistantscenter.com/auth?redirect_back=/shop&referral_code=${partnerData.partner_data.user_partnership_id}`}>https://assistantscenter.com/auth?redirect_back=/shop&referral_code={partnerData.partner_data.user_partnership_id}</a></p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12 grid-margin stretch-card">
                                                <div className="card card-rounded">
                                                    <div className="card-body">
                                                        <h4 className="card-title">Purchases made with your code</h4>
                                                        <p className="card-description">All purchases made by users using your code <b>since your last withdrawal</b>.</p>
                                                        <div className="table-responsive">
                                                            <table className="table table-striped">
                                                                <thead>
                                                                    <tr>
                                                                        <th>
                                                                        №
                                                                        </th>
                                                                        <th>
                                                                            Target type
                                                                        </th>
                                                                        <th>
                                                                            Target id
                                                                        </th>
                                                                        <th>
                                                                            Target currency
                                                                        </th>
                                                                        <th>
                                                                            Target price
                                                                        </th>
                                                                        <th>
                                                                            Date of purchase
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        partnerData.partner_data.user_partnership_actions.map((action,idx)=>{
                                                                            if(action.action_type != "purchase")return null
                                                                            return (
                                                                                <tr>
                                                                                    <td>
                                                                                        <a>{idx+1}</a>
                                                                                    </td>
                                                                                    <td>
                                                                                        <a>{action.action_target.target_type}</a>
                                                                                    </td>
                                                                                    <td>
                                                                                        <a>{action.action_target.target_id}</a>
                                                                                    </td>
                                                                                    <td>
                                                                                        <a>{action.action_target.target_currency}</a>
                                                                                    </td>
                                                                                    <td>
                                                                                        <a>{action.action_target.target_price}</a>
                                                                                    </td>
                                                                                    <td>
                                                                                        <a>{action.action_date}</a>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                            <p style={{paddingTop:10}}>To withdraw collected funds, contact the Assistants Center Billing Support: <a href="mailto:billing@assistantscenter.com">billing@assistantscenter.com</a></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-12 grid-margin stretch-card">
                                                <div className="card card-rounded">
                                                    <div className="card-body">
                                                        <h4 className="card-title">Your payouts history</h4>

                                                        <p style={{fontSize:16}}>Available soon</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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