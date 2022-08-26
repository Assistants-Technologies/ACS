import React from 'react'
import Router from 'next/router'

export default function RegisterForm({ username, setUsername, email, setEmail, password, setPassword, registerSubmitted, setMethod, setError, error, }) {
    const [ppTos, setPpTos] = React.useState(false)
    
    return (
        <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                    <b style={{fontSize:'130%'}}><span style={{color:'#2611bd'}}>Assist</span>ants</b>
                </div>
                <h4>Hello! let's get started</h4>
                <h6 className="fw-light">Create account to continue.</h6>
                <div className="pt-3">
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Username"
                            value={username}
                            onChange={(event)=>setUsername(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="E-mail"
                            value={email}
                            onChange={(event)=>setEmail(event.target.value)}
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
                    <div className="mt-3 d-flex justify-content-left align-items-center">
                        <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" value={ppTos} onChange={()=>setPpTos(!ppTos)}/>
                            &nbsp;I accept <a href="pp" target={"_blank"}>Privacy Policy</a> and <a href="tos" target={"_blank"}>Terms of Services</a>.
                        <i class="input-helper"></i></label>
                    </div>
                    {
                        error&&
                            <div className="mt-3 d-flex justify-content-center" style={{color:'red'}}>
                                <b>Error:&nbsp;</b>{error}
                            </div>
                    }
                    <div className="mt-3">
                        <button
                            className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                            onClick={()=>{
                                if(ppTos !== true)return setError("You need to accept Privacy Policy and Terms of Services to create an ACS account")
                                registerSubmitted()
                            }}
                        >
                            CREATE ACCOUNT
                        </button>
                    </div>
                    <div className="my-2">
                        <a href="#" onClick={()=>Router.push('/forgot-password')} className="auth-link text-black">
                            Forgot password?
                        </a>
                    </div>
                    <div className="mb-2 d-flex" style={{paddingTop:15}}>
                        <button
                            type="button"
                            className="btn btn-block btn-facebook auth-form-btn"
                            onClick={()=>{
                                if(ppTos !== true)return setError("You need to accept Privacy Policy and Terms of Services to create an ACS account")
                                Router.push('/api/auth/discord/authorize')
                            }}
                            style={{marginRight:2,background: '#7289d9'}}
                        >
                            <img src="images/discord-icon.png" style={{width:25,paddingRight:5}}/>
                            Continue using Discord
                        </button>
                        <button
                            type="button"
                            className="btn btn-block btn-facebook auth-form-btn"
                            style={{background:'#1DA1F2',marginLeft:2}}
                            onClick={()=>{
                                if(ppTos !== true)return setError("You need to accept Privacy Policy and Terms of Services to create an ACS account")
                                Router.push('/api/auth/twitter/authorize')
                            }}
                        >
                            <img src="images/twitterlogo.png" style={{width:25,paddingRight:5}}/>
                            Continue using Twitter
                        </button>
                    </div>
                    <div className="text-center mt-4 fw-light">
                        Already have an account?{" "}
                        <a href="#" className="text-primary" onClick={()=>setMethod('login')}>
                            Log in
                        </a>
                    </div>
                    <div className="text-center mt-4 fw-light">
                        <a href="#" style={{color:'white',}} onClick={()=>{
                            Router.push('/')
                        }}>
                            {'<'} Back home?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}