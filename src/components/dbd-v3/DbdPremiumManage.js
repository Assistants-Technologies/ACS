import React from 'react'
import axios from 'axios'

export default function DbdPremiumManage({ user, subscriptionInfo }) {
    const [displayPremiumInfo, setDisplayPremiumInfo] = React.useState(false)

    return (
        <>
            <div className="col-lg-12 grid-margin stretch-card">
                <div className="card card-rounded" style={{background:"url('https://cdn.assistantscenter.com/l4snvbcn')",backgroundSize:'cover !important',backgroundRepeat:'no-repeat'}}>
                    <div className="card-body">
                        <h2><b>Your Discord-Dashboard Plan</b></h2>

                        {
                            subscriptionInfo
                            &&
                            <div style={{paddingTop:15}}>
                                <p style={{fontSize:15}}><b>Type</b>: {subscriptionInfo.type == 'premium' ? "Premium" : "Free"}</p>
                                {subscriptionInfo.type == 'premium' &&
                                    <>
                                        {
                                            !subscriptionInfo.canceled &&
                                            <p style={{fontSize:15}}>
                                                <b>Next invoice:</b> {new Date(new Date(subscriptionInfo.active_until).getTime()-172800000).toISOString().substr(0,10)}
                                            </p>
                                        }
                                        <p style={{fontSize:15}}>
                                            <b>Valid until:</b> {subscriptionInfo.active_until.substr(0,10)}
                                            {subscriptionInfo.canceled && <p>Subscription was canceled. If you want to renew it, wait until the end of the billing period.</p>}
                                        </p>
                                    </>
                                }
                                {subscriptionInfo.expired_on &&
                                    <p style={{fontSize:15}}>
                                        <b>Premium has expired on:</b> {subscriptionInfo.expired_on.substr(0,10)}
                                    </p>
                                }

                                <div style={{ paddingTop: 15 }}>
                                    <div style={{display:"flex"}}>
                                        <button type="button"
                                                className="btn btn-primary btn-icon-text"
                                                onClick={() => setDisplayPremiumInfo(true)}
                                                style={{ color: 'white',
                                                    height: '40px',
                                                    fontSize: '16px',
                                                    justifyContent: 'center',
                                                    display: 'flex',
                                                    border: 0,
                                                    backgroundColor: "#c7ae20"
                                                }}
                                        >
                                            {
                                                "About Premium"
                                            }
                                        </button>
                                        {
                                            (subscriptionInfo.type == 'premium' && !subscriptionInfo.canceled)
                                            &&
                                            <button type="button"
                                                    className="btn btn-primary btn-icon-text"
                                                    onClick={() => setDisplayPremiumInfo(true)}
                                                    style={{ color: 'white',
                                                        height: '40px',
                                                        fontSize: '16px',
                                                        justifyContent: 'center',
                                                        display: 'flex',
                                                        border: 0,
                                                        backgroundColor: "#474747"
                                                    }}
                                            >
                                                {
                                                    "Cancel Plan"
                                                }
                                            </button>
                                        }
                                        {
                                            subscriptionInfo.type != "premium" &&
                                            <button type="button"
                                                    className="btn btn-primary btn-icon-text"
                                                    onClick={() => setDisplayPremiumInfo(true)}
                                                    style={{ color: 'white',
                                                        height: '40px',
                                                        fontSize: '16px',
                                                        justifyContent: 'center',
                                                        display: 'flex',
                                                        border: 0,
                                                        backgroundColor: "#c7ae20"
                                                    }}
                                                    onClick={()=>location.href="/api/shop/subscription/plan/create/dbd_premium"}
                                            >
                                                {
                                                    "Join Premium"
                                                }
                                            </button>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div id="displayPremiumInfoModal" className="modal" style={{display: displayPremiumInfo ? 'block' : 'none'}} onClick={(event) => {
                if (event.target.id == "displayPremiumInfoModal") {
                    setDisplayPremiumInfo(false)
                }
            }}>
                <div className="modal-content" style={{borderRadius:15}}>
                    <div className="card card-rounded">
                        <div className="card-body">
                            <div>
                                <h2 style={{fontSize:36}}><b>Discord-Dashboard Premium</b></h2>

                                <p className="card-description" style={{fontSize:16}}>
                                    Premium is an optional subscription plan that applies to all instances of Discord-Dashboard projects created in your account.
                                </p>

                                <h3 style={{fontSize:28,paddingTop:10}}><b>What does Premium give you?</b></h3>

                                <ul>
                                    <li style={{fontSize:16, color: "rgb(204, 193, 177)"}}>Priority support,</li>
                                    <li style={{fontSize:16, color: "rgb(204, 193, 177)"}}>Commercial usage and edit source files license,</li>
                                    <li style={{fontSize:16, color: "rgb(204, 193, 177)"}}>Up to 4 instances of the Discord-Dashboard project,</li>
                                    <li style={{fontSize:16, color: "rgb(204, 193, 177)"}}>Themes and Addons intended for Premium users only,</li>
                                    <li style={{fontSize:16, color: "rgb(204, 193, 177)"}}>Additional modules for Discord-Dashboard,</li>
                                    <li style={{fontSize:16, color: "rgb(204, 193, 177)"}}>Removing trademarks from themes,</li>
                                    <li style={{fontSize:16, color: "rgb(204, 193, 177)"}}>Virtual currency each time you renew your subscription.</li>
                                </ul>
                            </div>


                            <div className="d-flex">
                                <button type="button" className="btn btn-info"
                                        style={{
                                            color:'white',
                                            height:'40px',
                                            backgroundColor: '#006d9c',
                                            border: 0
                                        }}
                                        onClick={()=>setDisplayPremiumInfo(false)}>
                                    Okay
                                </button>
                                {
                                    subscriptionInfo?.type != 'premium'
                                    &&
                                    <button type="button" className="btn btn-info"
                                               style={{
                                                   color:'white',
                                                   border: 0,
                                                   backgroundColor: "#c7ae20",
                                                   height:'40px'
                                               }}
                                               onClick={()=>void(false)}>
                                        I want to join!
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}