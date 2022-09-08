import React from 'react'
import LandingNavbar from "../components/nav/top/LandingNavbar"
import Head from 'next/head'
import IsBeta from "../isBeta"

import "animate.css"
import dynamic from "next/dynamic";

import ScrollAnimation from "react-animate-on-scroll"

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

    return <>
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
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>

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
            <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `!function(){var e=document.createElement("script");e.type="text/javascript",e.src="https://global.ketchcdn.com/web/v2/config/assistantscenter/website_smart_tag/boot.js",e.defer=e.async=!0,document.getElementsByTagName("head")[0].appendChild(e),window.semaphore=window.semaphore||[]}();` }}></script>
            <link rel="stylesheet" href={`${ud_s}css/vertical-layout-light/style.css`} />
            {
                IsBeta ?
                    <link rel="shortcut icon" href={`${ud_s}images/favicon.png`} />
                    :
                    <link rel="shortcut icon" href={`${ud_s}favicon.png`} />
            }
            <link  rel="stylesheet" href={`${ud_s}mycss/my_dark_css.css`}/>
            <style>{`
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
body {
  font-family: 'Poppins', sans-serif;
}

.gradient-text {
  background-color: red;
  
  background-image: linear-gradient(45deg, #6230bd 40%, #f01de2 60%);
  
  background-size: 100%;
  background-repeat: repeat;

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; 
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
  
  font-size: 88px;
}

@media (max-width: 450px) {
    .gradient-text {
        font-size: 62px;
    }
}


@media (max-width: 300px) {
    .gradient-text {
        font-size: 52px;
    }
}

            `}</style>
        </Head>
        <LandingNavbar/>
        <div style={{
            height:'80vh',
            width:'100%',
            display:"flex",
            flexDirection:"column",
            justifyContent: "center",
            alignContent:"center",
            textAlign: "center",
            paddingLeft: '10px',
            paddingRight: '10px'
        }}>
            <h1 style={{fontWeight:800}} className={"gradient-text"}>
                <ScrollAnimation animateIn="fadeIn">
                    Let us solve<br/><i>the problem</i>.
                </ScrollAnimation>
            </h1>
        </div>
        <div style={{
            height:'80vh',
            width:'100%',
            display:"flex",
            flexDirection:"column",
            justifyContent: "center",
            alignContent:"center",
            textAlign: "center",
            paddingLeft: '10px',
            paddingRight: '10px'
        }}>
            <h1 style={{fontWeight:800}} className={"gradient-text"}>
                <ScrollAnimation animateIn="fadeIn">
                    Let us solve<br/><i>the problem</i>.
                </ScrollAnimation>
            </h1>
        </div>
            <div style={{
                height:'80vh',
                width:'100%',
                display:"flex",
                flexDirection:"column",
                justifyContent: "center",
                alignContent:"center",
                textAlign: "center",
                paddingLeft: '10px',
                paddingRight: '10px',
            }} className={"animate__animated animate__bounce"}>
                <h1 style={{fontWeight:800}} className={"gradient-text"}>
                        Let us solve<br/><i>the problem</i>.
                </h1>
            </div>
    </>
}