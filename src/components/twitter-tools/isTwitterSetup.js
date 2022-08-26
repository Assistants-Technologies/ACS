import React from 'react'

export default function IsTwitterSetUp ({ user }) {
    return <div className="col-sm-12">
        <div className="home-tab">
            <div className="card card-rounded">
                <div className="card-body">
                    <p style={{fontSize:16}}>
                        <b>Successfully connected to the Twitter API.</b>
                        Tweets will be published to your connected Twitter account.</p>

                    <p>Something isn't working or you want to change your connected Twitter account?&nbsp;
                        <a href="/api/auth/twitter/connect?back_redirect=/twitter-tools/daily-shop%26info%3DSuccessfully%20connected%20new%20Twitter%20account%20with%20ACS%20account.">
                            Click here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
}