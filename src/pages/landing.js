import React from 'react'
import LandingNavbar from "../components/nav/top/LandingNavbar"
import Head from 'next/head'
import IsBeta from "../isBeta"

export async function getServerSideProps(context) {
    return {
        props: {
            url: (context.query.url || '/').split('?')[0],
            user: context.query.user || {},
        },
    }
}

export default function LandingPage ({ user, url }) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }

    const title = 'Assistants Center'

    return (
        <div>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            <title>Assistants Center</title>
            <style dangerouslySetInnerHTML={{__html: "\n      @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');\n      body {\n        font-family: 'Poppins', sans-serif;\n      }\n\n      .gradient-text {\n        background-color: red;\n\n        background-image: linear-gradient(45deg, #6230bd 40%, #f01de2 60%);\n\n        background-size: 100%;\n        background-repeat: repeat;\n\n        -webkit-background-clip: text;\n        -webkit-text-fill-color: transparent;\n        -moz-background-clip: text;\n        -moz-text-fill-color: transparent;\n\n        font-size: 88px;\n      }\n\n      @media (max-width: 450px) {\n        .gradient-text {\n          font-size: 62px;\n        }\n      }\n\n\n      @media (max-width: 300px) {\n        .gradient-text {\n          font-size: 52px;\n        }\n      }\n    " }} />

            {
                IsBeta ?
                    <link rel="shortcut icon" href={`${ud_s}images/favicon.png`} />
                    :
                    <link rel="shortcut icon" href={`${ud_s}favicon.png`} />
            }

            <link rel="stylesheet" crossOrigin="anonymous" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" integrity="sha512-HK5fgLBL+xu6dm/Ii3z4xhlSUyZgTT9tuc/hSrtw6uzJOvgRr2a9jyxxT1ely+B+xFAmJKVSTbpM/CuL7qxO8w==" />
            <link href={`${ud_s}landing/assets/css/theme.min.css`} rel="stylesheet" />
            <link href={`${ud_s}landing/vendors/swiper/swiper-bundle.min.css`} rel="stylesheet" />

            <style>
                {`
                .btn-secondary {
                    background-color: #312396;
                }
                
                .btn-secondary:hover {
                    background-color: #2e15e8;
                }
               `}
            </style>

            <main className="main" id="top">
                <nav className="navbar navbar-light sticky-top" data-navbar-darken-on-scroll={900}>
                    <div className="container pt-2"><a className="navbar-brand" href="/" /><div><a className="navbar-brand" href="/" /><a className="navbar-brand brand-logo" href="/"><b style={{color: '#2f15eb'}}>Assist<span style={{color: '#e7e6ed'}}>ants</span></b></a><a className="navbar-brand brand-logo-mini" href="/" /></div>
                        <div className="navbar-nav ms-auto"><a href="/dashboard" className="btn btn-secondary">Dashboard</a></div>
                    </div>
                </nav>
                {/* ============================================*/}
                {/* <section> begin ============================*/}
                <section className="mt-6">
                    <div className="container">
                        <div style={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', textAlign: 'center', paddingLeft: '10px', paddingRight: '10px'}}>
                            <h1 style={{fontSize: '40px'}}>Assistants Center</h1>
                            <h1 style={{fontWeight: 800}} className="gradient-text">
                                Let us solve
                                <br />
                                <i>the problem</i>
                                .
                            </h1>
                        </div>
                    </div>{/* end of .container*/}
                </section>{/* <section> close ============================*/}
                {/* ============================================*/}
                {/* ============================================*/}
                {/* <section> begin ============================*/}
                <section>
                    <div className="container">
                        <div className="text-center text-xl-start">
                            <div className="p-5 bg-primary rounded-3 d-flex flex-column justify-content-xl-between flex-xl-row">
                                <div className="py-3">
                                    <h4 className="opacity-50 ls-2 lh-base fw-medium">READY TO START</h4>
                                    <h2 className="mt-3 fs-4 fs-sm-7 latter-sp-3 lh-base fw-semi-bold">Start your adventure now! </h2>
                                </div>
                                <div className="flex-center d-flex"><a href="/dashboard" className="btn btn-info">Dashboard <span className="fas fa-arrow-right" /></a></div>
                            </div>
                        </div>
                    </div>{/* end of .container*/}
                </section>{/* <section> close ============================*/}
                {/* ============================================*/}
                {/* ============================================*/}
                {/* <section> begin ============================*/}
                <section className="bg-secondary">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3 text-center text-xl-start"><a href="https://twitter.com/assistantsga" target="_blank"><img className="footer-img me-xl-5 me-3" src={`${ud_s}landing/assets/img/gallery/twitter-line1.svg`} alt="twitter" style={{width: '20px', height: '20px'}} /></a></div>
                            <div className="col-xl-4 pt-2 pt-xl-0">
                                <p className="mb-0 text-center text-xl-end"><a className="text-300 text-decoration-none footer-link" href="/tos"> Terms &amp; conditon </a><a className="text-300 text-decoration-none footer-link ps-4" href="/pp">Privacy Policy </a></p>
                            </div>
                            <div className="col-xl-5 pt-2 pt-xl-0 text-center text-xl-end">
                                <p className="mb-0">Copyright © 2022 Assistants Center. All rights reserved.</p>
                            </div>
                        </div>
                    </div>{/* end of .container*/}
                </section>{/* <section> close ============================*/}
                {/* ============================================*/}
            </main>{/* ===============================================*/}
            {/*    End of Main Content*/}
            {/* ===============================================*/}
            {/* ===============================================*/}
            {/*    JavaScripts*/}
            {/* ===============================================*/}
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Sora:wght@100;200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400&display=swap" rel="stylesheet" />
        </div>
    );
}