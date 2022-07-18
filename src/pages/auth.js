import React from 'react'
import Script from 'next/script'
import axios from 'axios'
import { useRouter } from 'next/router'
import Router from 'next/router'

import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

export default function AuthPage (props) {
    const router = useRouter()

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
            return location.href = router.query?.back_redirect || '/'
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
            return location.href = router.query?.back_redirect || '/'
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
    }, [method]);

    React.useEffect(()=>{
        setError('')
    }, [parameter, username, email, password]);


    return (
        <>
            {/* Required meta tags */}
            <meta charSet="utf-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <title>Star Admin2 </title>
            {/* plugins:css */}
            <link rel="stylesheet" href="vendors/feather/feather.css" />
            <link
                rel="stylesheet"
                href="vendors/mdi/css/materialdesignicons.min.css"
            />
            <link rel="stylesheet" href="vendors/ti-icons/css/themify-icons.css" />
            <link rel="stylesheet" href="vendors/typicons/typicons.css" />
            <link
                rel="stylesheet"
                href="vendors/simple-line-icons/css/simple-line-icons.css"
            />
            <link rel="stylesheet" href="vendors/css/vendor.bundle.base.css" />
            {/* endinject */}
            {/* Plugin css for this page */}
            {/* End plugin css for this page */}
            {/* inject:css */}
            <link rel="stylesheet" href="css/vertical-layout-light/style.css" />
            {/* endinject */}
            <link rel="shortcut icon" href="images/favicon.png" />
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

                                        back_redirect={router.query?.back_redirect}
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

                                        back_redirect={router.query?.back_redirect}
                                    />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js" strategy={"beforeInteractive"}/>
            <Script src="vendors/js/vendor.bundle.base.js"/>
            <Script src="vendors/bootstrap-datepicker/bootstrap-datepicker.min.js"/>
            <Script src="js/off-canvas.js"/>
            <Script src="js/hoverable-collapse.js"/>
            <Script src="js/template.js"/>
            <Script src="js/settings.js"/>
            <Script src="js/todolist.js"/>
        </>

    )
}