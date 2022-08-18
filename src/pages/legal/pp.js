import React from 'react';
import Head from 'next/head';

import Script from 'next/script'

import PageBody from "../../components/content/PageBody";
import Scripts from "../../components/content/Scripts";

import IsBeta from '../../isBeta'

export async function getServerSideProps(context) {
    return {
        props: {
            url: context.query.url.split('?')[0],
            user: context.query.user || null,
        },
    }
}

export default function TestPage ({ user, url }) {
    const ud = (url.split("/").length - 1)
    let ud_s = ''
    if(ud != 1){
        for(let i = 0; i < ud; i++){
            ud_s += '../'
        }
    }

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <title>{IsBeta ? 'BETA | ' : ''}Assistants Center - Privacy Policy</title>
                <link rel="stylesheet" href={`${ud_s}vendors/feather/feather.css`} />
                <link rel="stylesheet" href={`${ud_s}vendors/mdi/css/materialdesignicons.min.css`}/>
                <link rel="stylesheet" href={`${ud_s}vendors/ti-icons/css/themify-icons.css`} />
                <link rel="stylesheet" href={`${ud_s}vendors/typicons/typicons.css`} />
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
                <link rel="shortcut icon" href={`${ud_s}images/favicon.png`} />
                <style>{`h6 { color: #7f7f7f !important; }`}</style>
            </Head>
            <PageBody user={user} uds={ud_s}>
                <div className="card card-rounded">
                    <div className="card-body">
                        <div className="col-sm-12">
                            <h1 style={{paddingBottom:20}}>Privacy Policy</h1>
                            <h2 className="h2 text-blue mb-10" style={{ color: "black !important" }}>
                                Introduction
                            </h2>
                            <h6>
                                AssistantsCenter.com respects user privacy and aims to be transparent with
                                the small amount of data we collect. This page explains what information
                                might be collected when using our site.
                            </h6>
                            <h6>
                                AssistantsCenter.com is an unregistered activity located in Poland, by
                                Marcin Kondrat. In case of any doubts as to the rules of our Privacy Policy,
                                please contact us by e-mail:{" "}
                                <b style={{ color: "black" }}>support@assistantscenter.com</b>
                            </h6>
                            <h6>
                                <a href="/tos">Terms of Services</a>
                            </h6>
                            <hr />
                            <h2 className="h2 text-blue mb-10" style={{ color: "black !important", paddingTop: 7 }}>
                                WEBSITE VISITORS
                            </h2>
                            <h6>
                                Like most website operators, AssistantsCenter.com collects
                                non-personally-identifying information of the sort that web browsers and
                                servers typically make available, such as the browser type, language
                                preference, referring site, and the date and time of each visitor request.
                                AssistantsCenter.com's purpose in collecting non-personally identifying
                                information is to better understand how AssistantsCenter.com's visitors use
                                its website.
                            </h6>
                            <h2 className="h2 text-blue mb-10" style={{ color: "black !important", paddingTop: 7 }}>
                                ADVERTISEMENTS
                            </h2>
                            <h6>
                                Ads appearing on our website may be delivered to users by advertising
                                partners, who may set cookies. These cookies allow the ad server to
                                recognize your computer each time they send you an online advertisement to
                                compile information about you or others who use your computer. This
                                information allows ad networks to, among other things, deliver targeted
                                advertisements that they believe will be of most interest to you. For more
                                information visit{" "}
                                <a href="https://policies.google.com/technologies/partner-sites">
                                https://policies.google.com/technologies/partner-sites
                                </a>
                            </h6>
                            <h2 className="h2 text-blue mb-10" style={{ color: "black !important", paddingTop: 7 }}>
                                LINKS TO EXTERNAL SITES
                            </h2>
                            <h6>
                                Our Service may contain links to external sites that are not operated by us.
                                If you click on a third party link, you will be directed to that third
                                party's site. We strongly advise you to review the Privacy Policy and terms
                                and conditions of every site you visit.
                            </h6>
                            <h6>
                                We have no control over, and assume no responsibility for the content,
                                privacy policies or practices of any third party sites, products or
                                services.
                            </h6>
                            <h2 className="h2 text-blue mb-10" style={{ color: "black !important", paddingTop: 7 }}>
                                AGGREGATED STATISTICS
                            </h2>
                            <h6>
                                AssistantsCenter.com may collect statistics about the behavior of visitors
                                to its website. AssistantsCenter.com may display this information publicly
                                or provide it to others. However, AssistantsCenter.com does not disclose
                                your personally-identifying information.
                            </h6>
                            <h2 className="h2 text-blue mb-10" style={{ color: "black !important", paddingTop: 7 }}>
                                COOKIES
                            </h2>
                            <h6>
                                To enrich and perfect your online experience, AssistantsCenter.com uses
                                "Cookies", similar technologies and services provided by others to display
                                personalized content, appropriate advertising and store your preferences on
                                your computer.
                            </h6>
                            <h6>
                                A cookie is a string of information that a website stores on a visitor's
                                computer, and that the visitor's browser provides to the website each time
                                the visitor returns. AssistantsCenter.com uses cookies to help
                                AssistantsCenter.com identify and track visitors, their usage of
                                https://assistantscenter.com, and their website access preferences.
                                AssistantsCenter.com visitors who do not wish to have cookies placed on
                                their computers should set their browsers to refuse cookies before using
                                AssistantsCenter.com's websites, with the drawback that certain features of
                                AssistantsCenter.com's websites may not function properly without the aid of
                                cookies.
                            </h6>
                            <h6>
                                By continuing to navigate our website without changing your cookie settings,
                                you hereby acknowledge and agree to AssistantsCenter.com's use of cookies.
                            </h6>
                            <h2 className="h2 text-blue mb-10" style={{ color: "black !important", paddingTop: 7 }}>
                                PRIVACY POLICY CHANGES
                            </h2>
                            <h6>
                                Although most changes are likely to be minor, AssistantsCenter.com may
                                change its Privacy Policy from time to time, and in AssistantsCenter.com's
                                sole discretion. AssistantsCenter.com encourages visitors to frequently
                                check this page for any changes to its Privacy Policy. Your continued use of
                                this site after any change in this Privacy Policy will constitute your
                                acceptance of such change.
                            </h6>
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