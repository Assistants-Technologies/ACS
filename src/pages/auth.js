import React from 'react'
import Script from 'next/script'
import axios from 'axios'
import { useRouter } from 'next/router'
import Router from 'next/router'

import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

import IsBeta from '../isBeta'

export async function getServerSideProps(context) {
    console.log('cqbr', context.query.back_redirect)
    return {
        props: {
            url: context.query.url.split('?')[0],
            back_redirect: context.query.back_redirect || '/',
        },
    }
}

export default function AuthPage ({ url, back_redirect }) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }

    const [method, setMethod] = React.useState('login')

    const [parameter, setParameter] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')

    const [error, setError] = React.useState('')

    const loginSubmitted = async () => {
        try{
            const res = await axios.post('/api/auth/plain/login', {
                parameter,
                password
            })
            if(res.data.error)return setError(res.data.message)
            return location.href = back_redirect
        }catch(err){
            setError(err.message)
        }
    }

    const registerSubmitted = async () => {
        try{
            const res = await axios.post('/api/auth/plain/register', {
                username,
                email,
                password
            })
            if(res.data.error)return setError(res.data.message)
            return location.href = back_redirect
        }catch(err){
            setError(err.message)
        }
    }

    React.useEffect(()=>{
        setParameter('')
        setUsername('')
        setEmail('')
        setPassword('')
        setError('')
    }, [method])

    React.useEffect(()=>{
        setError('')
    }, [parameter, username, email, password])


    const title = `${IsBeta ? 'BETA | ' : ''}Assistants Center - Authenticate`

    return (
        <>
            <Script
                id="Adsense-id"
                data-ad-client="ca-pub-3673520795587574"
                async="true"
                strategy="beforeInteractive"
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3673520795587574"
            />

            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <title>{title}</title>
            <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `!function(){var e=document.createElement("script");e.type="text/javascript",e.src="https://global.ketchcdn.com/web/v2/config/assistantscenter/website_smart_tag/boot.js",e.defer=e.async=!0,document.getElementsByTagName("head")[0].appendChild(e),window.semaphore=window.semaphore||[]}();` }}></script>
            <link rel="stylesheet" href={`${ud_s}vendors/feather/feather.css`} />
            <link
                rel="stylesheet"
                href={`${ud_s}vendors/mdi/css/materialdesignicons.min.css`}
            />
            <link rel="stylesheet" href={`${ud_s}vendors/ti-icons/css/themify-icons.css`} />
            <link rel="stylesheet" href={`${ud_s}vendors/typicons/typicons.css`} />
            <link
                rel="stylesheet"
                href={`${ud_s}vendors/simple-line-icons/css/simple-line-icons.css`}
            />
            <link rel="stylesheet" href={`${ud_s}vendors/css/vendor.bundle.base.css`} />
            <link rel="stylesheet" href={`${ud_s}css/vertical-layout-light/style.css`} />
            {
                    IsBeta ?
                        <link rel="shortcut icon" href={`${ud_s}images/favicon.png`} />
                    :
                        <link rel="shortcut icon" href={`${ud_s}favicon.png`} />
                }
            <link  rel="stylesheet" href={`${ud_s}mycss/my_dark_css.css`}/>
            <div className="container-scroller">
                <div className="container-fluid page-body-wrapper full-page-wrapper">
                    <div className="content-wrapper d-flex align-items-center auth px-0">
                        <div className="row w-100 mx-0">
                            {
                                method == 'login' ?
                                    <LoginForm
                                        loginSubmitted={loginSubmitted}

                                        password={password}
                                        setPassword={setPassword}
                                        parameter={parameter}
                                        setParameter={setParameter}

                                        setMethod={setMethod}
                                        error={error}
                                        setError={setError}
                                    />
                                    :
                                    <RegisterForm
                                        registerSubmitted={registerSubmitted}

                                        username={username}
                                        setUsername={setUsername}
                                        email={email}
                                        setEmail={setEmail}
                                        password={password}
                                        setPassword={setPassword}

                                        setMethod={setMethod}
                                        error={error}
                                        setError={setError}
                                    />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Script src={`https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js`} strategy={"beforeInteractive"}/>
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
