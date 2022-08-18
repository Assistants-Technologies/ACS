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

    const title = `${IsBeta ? 'BETA | ':''}Assistants Center - Terms of Purchase`

    return (
        <>
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
                <link  rel="stylesheet" href={`${ud_s}mycss/my_dark_css.css`}/>
            </Head>
            <PageBody user={user} uds={ud_s}>
                <div className="card card-rounded">
                    <div className="card-body">
                        <div className="col-sm-12">
                            <h1 style={{paddingBottom:20}}>Terms of Purchase</h1>

                            <h2 style={{paddingTop: 7}}>INTRODUCTION</h2>
                            <h6>
                                These terms and conditions set out the terms and conditions between you, the
                                customer, and Abounding Solutions (“us”, “we”), governing the use of our
                                website and our downloadable digital recordings and streaming digital
                                products including the content therein (the “products”). Your use of our
                                website, and purchase, download and use of our products, constitutes your
                                full acceptance of these terms and conditions. If you do not agree with
                                these terms and conditions, you should not use our website or purchase,
                                download or use any of our products.
                            </h6>
                            <h2 style={{paddingTop: 7}}>LICENSE AND USE</h2>
                            <h6>
                                Your purchase of one of our products constitutes our granting to you of a
                                non-exclusive, non-sublicensable, non-transferable license to download
                                and/or access that product for the purpose of your own personal use and
                                reference, and in the case of downloadable digital products, print or
                                convert the product to an image or vector format for your own storage,
                                retention and reference (the “purpose”). You agree that under no
                                circumstances shall you use, or permit to be used, any product other than
                                for the aforesaid purpose. For the avoidance of doubt, you shall not copy,
                                re-sell, sublicense, rent out, share or otherwise distribute any of our
                                products, whether modified or not, to any third party. You agree not to use
                                any of our products in a way which might be detrimental to us or damage our
                                reputation.
                            </h6>
                            <h2 style={{paddingTop: 7}}>INTELLECTUAL PROPERTY</h2>
                            <h6>
                                The products, whether modified or not, and all intellectual property and
                                copyright contained therein, are and shall at all times remain our sole and
                                exclusive property. You agree that under no circumstances, whether the
                                product has been modified or not, shall you have or attempt to claim
                                ownership of any intellectual property rights or copyright in the product.
                            </h6>
                            <h2 style={{paddingTop: 7}}>REFUNDS AND CHARGEBACKS</h2>
                            <h6>
                                Once a product has been purchased by you, no right of cancellation or refund
                                exists under the Consumer Protection (Distance Selling) Regulations 2000 due
                                to the electronic nature of our products. Any refunds shall be at our sole
                                and absolute discretion. You agree that under no circumstances whatsoever
                                shall you initiate any chargebacks via your payment provider. You agree that
                                any payments made by you for any of our products are final and may not be
                                charged back. We reserve the right to alter any of our prices from time to
                                time.
                            </h6>
                            <h2 style={{paddingTop: 7}}>WARRANTIES AND LIABILITY</h2>
                            <h6>
                                We make every effort to ensure that our products are accurate, authoritative
                                and fit for the use of our customers. However, we take no responsibility
                                whatsoever for the suitability of the product, and we provide no warranties
                                as to the function or use of the product, whether express, implied or
                                statutory, including without limitation any warranties of merchantability or
                                fitness for particular purpose. You agree to indemnify us against all
                                liabilities, claims, demands, expenses, actions, costs, damages, or loss
                                arising out of your breach of these terms and conditions. Furthermore, we
                                shall not be liable to you or any party for consequential, indirect, special
                                or exemplary damages including but not limited to damages for loss of
                                profits, business or anticipated benefits whether arising under tort,
                                contract, negligence or otherwise whether or not foreseen, reasonably
                                foreseeable or advised of the possibility of such damages.
                            </h6>
                            <h2 style={{paddingTop: 7}}>GENERAL</h2>
                            <h6>
                                These terms and conditions constitute the entire agreement and understanding
                                between you and us for the supply of downloadable digital products and
                                streaming digital products, and shall supersede any prior agreements whether
                                made in writing, orally, implied or otherwise. The failure by us to exercise
                                or enforce any right(s) under these terms and conditions shall not be deemed
                                to be a waiver of any such right(s) or operate so as to bar the exercise or
                                enforcement thereof at any time(s) thereafter, as a waiver of another or
                                constitute a continuing waiver. You agree that monetary damages may not be a
                                sufficient remedy for the damage which may accrue to us by reason of your
                                breach of these terms and conditions, therefore we shall be entitled to seek
                                injunctive relief to enforce the obligations contained herein. The
                                unenforceability of any single provision within these terms and conditions
                                shall not affect any other provision hereof. These terms and conditions,
                                your acceptance thereof, and our relationship with you shall be governed by
                                and construed in accordance with English law and both us and you irrevocably
                                submit to the exclusive jurisdiction of the English courts over any claim,
                                dispute or matter arising under or in connection with these terms and
                                conditions or our relationship with you.
                            </h6>
                            <h2 style={{paddingTop: 7}}>CONTACTING US</h2>
                            <h6>
                                Please do not hesitate to contact us regarding any matter relating to this
                                Downloadable and Streaming Digital Products Terms and Conditions of Sale
                                Policy via email support@assistantscenter.com
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