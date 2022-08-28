import React from 'react'
import axios from 'axios'

export default function DbdPremiumManage({ user, subscriptionInfo }) {
    return (
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
                                    </p>
                                </>
                            }
                            {subscriptionInfo.expired_on &&
                                <p style={{fontSize:15}}>
                                    <b>Premium expired on:</b> {subscriptionInfo.expired_on.substr(0,10)}
                                </p>
                            }

                            <div style={{ paddingTop: 15 }}>
                                <button type="button"
                                        className="btn btn-primary btn-icon-text"
                                        onClick={() => void(0)}
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
                                        subscriptionInfo.expired_on ?
                                            "Resubscribe to Premium"
                                            :
                                            subscriptionInfo.type == "Premium" ?
                                                "Manage Subscription"
                                            :
                                            "About Premium"
                                    }
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}