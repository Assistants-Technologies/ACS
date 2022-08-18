import React from 'react'
import Router from 'next/router'

export default function LoginForm({ parameter, setParameter, password, setPassword, loginSubmitted, setMethod, error, back_redirect }) {
    return (
        <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                    <b style={{fontSize:'130%'}}><span style={{color:'#2611bd'}}>Assist</span>ants</b>
                </div>
                <h4>Hello! let's get started</h4>
                <h6 className="fw-light">Sign in to continue.</h6>
                <div className="pt-3">
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="E-mail/Username"
                            value={parameter}
                            onChange={(event)=>setParameter(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Password"
                            value={password}
                            onChange={(event)=>setPassword(event.target.value)}
                        />
                    </div>
                    {
                        error?
                            <div className="mt-3 d-flex justify-content-center" style={{color:'red'}}>
                                <b>Error: </b>{error}
                            </div>
                        :
                            <></>
                    }
                    <div className="mt-3">
                        <button
                            className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                            onClick={loginSubmitted}
                        >
                            SIGN IN
                        </button>
                    </div>
                    <div className="my-2">
                        <a href="#" onClick={()=>Router.push('/forgot-password')} className="auth-link text-black">
                            Forgot password?
                        </a>
                    </div>
                    <div className="mb-2 d-flex">
                        <button
                            type="button"
                            className="btn btn-block btn-facebook auth-form-btn"
                            onClick={()=>Router.push(`/api/auth/discord/authorize?back_redirect=${back_redirect || '/'}`)}
                            style={{marginRight:2,background: '#7289d9'}}
                        >
                            <img src="images/discord-icon.png" style={{width:25,paddingRight:5}}/>
                            Continue using Discord
                        </button>
                        <button
                            type="button"
                            className="btn btn-block btn-facebook auth-form-btn"
                            style={{background:'#1DA1F2',marginLeft:2}}
                            onClick={()=>Router.push(`/api/auth/twitter/authorize?back_redirect=${back_redirect || '/'}`)}
                        >
                            <img src="images/twitterlogo.png" style={{width:25,paddingRight:5}}/>
                            Continue using Twitter
                        </button>
                    </div>
                    <div className="text-center mt-4 fw-light">
                        Don't have an account?{" "}
                        <a href="#" className="text-primary" onClick={()=> {
                            setMethod('register')
                        }}>
                            Create
                        </a>
                    </div>
                    <div className="text-center mt-4 fw-light">
                        <a href="#" style={{color:'white',}} onClick={()=>Router.push('/')}>
                            {'<'} Back home?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}