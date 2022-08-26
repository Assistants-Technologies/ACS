import React from 'react';
import Head from 'next/head';

import Script from 'next/script'

import PageBody from "../../components/content/PageBody"
import Scripts from "../../components/content/Scripts"

import IsTwitterSetUp from "../../components/twitter-tools/isTwitterSetup"

import IsBeta from '../../isBeta'

import axios from 'axios'

export async function getServerSideProps(context) {
    return {
        props: {
            url: context.query.url.split('?')[0],
            user: context.query.user,
        },
    }
}

export default function TestPage ({ user, url}) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }

    const [dailyShopData, setDailyShopData] = React.useState(null)

    const [sac, setSac] = React.useState('')
    const [lang, setLang] = React.useState('')
    const [enabled, setEnabled] = React.useState(true)
    const [messageContent, setMessageContent] = React.useState('')

    const [errorMessage, setErrorMessage] = React.useState('')
    const [successMessage, setSuccessMessage] = React.useState('')

    const SubmitForm = async () => {
        setSuccessMessage('')
        const res = await axios.post('/api/twitter-tools/daily-shop', {
            sac,
            lang,
            enabled,
            messageContent,
        })
        if(res.data?.error){
            setErrorMessage(res.data.message)
        }else{
            setErrorMessage('')
            await axios.get('/api/twitter-tools/daily-shop').then(res=>{
                setDailyShopData(res.data?.data)
            })
            setSuccessMessage("Success! Submited data.")
        }
    }

    React.useEffect(()=>{
        axios.get('/api/twitter-tools/daily-shop').then(res=>{
            const { enabled: data_enabled, sac: data_sac, lang: data_lang, message_content } = res.data?.data
            setEnabled(data_enabled==null?true:data_enabled)
            setSac(data_sac==null?'ASSISTANTS':data_sac)
            setLang(data_lang??'en')
            setMessageContent(message_content??'')
            setDailyShopData(res.data?.data)
        })
    }, [])

    const title = `${IsBeta ? 'BETA | ' : ''}Assistants Center - Twitter Tools - Daily Shop`

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

                <link  rel="stylesheet" href={`${ud_s}mycss/my_dark_css.css`}/>
            </Head>
            <PageBody user={user} uds={ud_s}>
                <div className="row" style={{paddingBottom:30}}>
                    <IsTwitterSetUp user={user}/>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="home-tab">
                            <div className="card card-rounded">
                                <div className="card-body">

                                    <div>
                                        <h2><b>Twitter Tools: Daily Shop</b></h2>
                                        <p style={{fontSize:16}}>Set up your automatic Fortnite Daily Store for Twitter.</p>
                                    </div>

                                    {
                                        dailyShopData &&
                                        <div style={{paddingTop:20}}>
                                            <div className="form-group">
                                                <label>Support a Creator code</label>
                                                <input type="text" className="form-control" placeholder="SAC code"
                                                       value={sac} onChange={(event)=>setSac(event.target.value)}/>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="exampleFormControlSelect2">Language</label>
                                                <select className="form-control" id="exampleFormControlSelect2" onChange={(event)=>setLang(event.target.value)}>
                                                    <option selected={lang=='en'} value={"en"}>English</option>
                                                    <option selected={lang=='pl'} value={"pl"}>Polish</option>
                                                    <option selected={lang=='de'} value={"de"}>German</option>
                                                    <option selected={lang=='fr'} value={"fr"}>French</option>
                                                    <option selected={lang=='es'} value={"es"}>Spanish</option>
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="exampleTextarea1">Message sent in Tweet content</label>
                                                <textarea
                                                    className="form-control"
                                                    id="exampleTextarea1"
                                                    rows="10"
                                                    placeholder="Message"
                                                    maxLength={280}
                                                    style={{height: '100px', lineHight: '150%'}}
                                                    onChange={(event) => {
                                                        setMessageContent(event.target.value)
                                                    }}
                                                    value={messageContent}
                                                ></textarea>
                                            </div>

                                            <div className="form-check form-check-flat form-check-primary">
                                                <label className="form-check-label">
                                                    <input checked={enabled} onChange={()=>setEnabled(!enabled)} type="checkbox" className="form-check-input"/>
                                                    Enabled {!dailyShopData['_id']?'(currently, you have not set the settings, but this switch will decide whether to enable Daily Shop module after you save the settings)':''}
                                                    <i className="input-helper"></i></label>
                                            </div>

                                            <button onClick={SubmitForm} type="submit" className="btn btn-primary me-2">Submit</button>
                                            {errorMessage && <p style={{fontSize:14,color:"red"}}><b>Error:</b> {errorMessage}</p>}
                                            {successMessage && <p style={{fontSize:14,color:"green"}}><b>Error:</b> {successMessage}</p>}
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