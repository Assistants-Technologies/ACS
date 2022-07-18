import React from 'react'
import Head from 'next/head'
import axios from 'axios'
import Router from 'next/router'

import PageBody from "../components/content/PageBody"
import Scripts from "../components/content/Scripts"
import Script from "next/script"

export async function getServerSideProps(context) {
    return {
        props: {
            user: context.query.user,
        },
    }
}

export default function ShopPage ({ user }) {
    const [coins, setCoins] = React.useState('fetching')
    const [items, setItems] = React.useState(null)
    const [displayCurrency, setDisplayCurrency] = React.useState('USD')

    const [displayCoinsShop, setDisplayCoinsShop] = React.useState(false)
    const [setSelected, setSetSelected] = React.useState(null)

    const fetchCoins = async () => {
        const res = await axios.get('/api/shop/coins/get')
        setCoins(res.data.coins)
    }

    const fetchItems = async () => {
        const res = await axios.get('/api/shop/items/get')
        setItems(res.data.items)
        console.log(res.data.items)
        setSetSelected(res.data.items.coinsPacks[0].id)
    }

    React.useEffect(() => {
        fetchCoins()
        fetchItems()
    }, [])


    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <title>Star Admin2 </title>
                <link rel="stylesheet" href="vendors/feather/feather.css" />
                <link rel="stylesheet" href="vendors/mdi/css/materialdesignicons.min.css" />
                <link rel="stylesheet" href="vendors/ti-icons/css/themify-icons.css" />
                <link rel="stylesheet" href="vendors/typicons/typicons.css" />
                <link
                    rel="stylesheet"
                    href="vendors/simple-line-icons/css/simple-line-icons.css"
                />
                <link rel="stylesheet" href="vendors/css/vendor.bundle.base.css" />
                <link
                    rel="stylesheet"
                    href="vendors/datatables.net-bs4/dataTables.bootstrap4.css"
                />
                <link rel="stylesheet" href="js/select.dataTables.min.css" />
                <link rel="stylesheet" href="css/vertical-layout-light/style.css" />
                <link rel="shortcut icon" href="images/favicon.png" />

                <style>
                    {`
                   
                   
                    .modal {
  position: fixed;
  z-index: 4324;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}


                    .modal-content {
                      background-color: #fefefe;
                      margin: 5% auto;
                      padding: 20px;
                      border: 1px solid #888;
                      width: 80%;
                    }
                    
                    @media only screen and (min-width: 910px) and (max-width: 1200px) {
                        .modal-content {
                            width: 60% !important;
                        }
                    }
                    
                    @media only screen and (min-width: 1200px){
                        .modal-content {
                            width: 50% !important;
                        }
                    }
`}
                </style>
            </Head>
            <PageBody user={user}>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="home-tab">
                            <div className="tab-content" id="content-featured">
                                <div className="tab-pane fade show active" id="featured">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="card card-rounded">
                                                <div className="card-body">
                                                    <h3><b>Digital Features Shop</b></h3>

                                                    <h4 className={"pt-2"}>
                                                        <small className="text-muted">
                                                            Store for virtual goodies for your account and projects. Here you can purchase items such as licenses, access to features, or even account upgrades. The currency used in the store is virtual currency which you can top up by clicking the button below.
                                                        </small>
                                                    </h4>

                                                    <div className={"d-flex column pt-2"} style={{alignItems:'center'}}>
                                                        <div style={{marginRight:15}}>
                                                            <h6 >
                                                                Your AC coins: <span style={{fontWeight:'bolder'}}>{coins=='fetching' ? 'FETCHING...' : coins} <i className="mdi mdi-cash-multiple" /></span>
                                                            </h6>
                                                        </div>
                                                        <button type="button" className="btn btn-warning" style={{color:'white',height:40}} onClick={()=>setDisplayCoinsShop(true)}>Top up currency</button>
                                                    </div>
                                                    {
                                                        items ?
                                                            <div>
                                                                <div className="form-group">
                                                                    <label htmlFor="exampleFormControlSelect2">Currency</label>
                                                                    <select className="form-control"
                                                                            id="exampleFormControlSelect2"
                                                                            value={displayCurrency}
                                                                            onChange={(event)=>setDisplayCurrency(event.target.value)}
                                                                            style={{color:'black'}}
                                                                    >
                                                                        {
                                                                            Object.keys(items.supportedCurrencies).map((val,idx)=>{
                                                                                return (
                                                                                    <option value={val}>{val} ({Object.values(items.supportedCurrencies)[idx]})</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                                {
                                                                    items.coinsPacks.map(set=>{
                                                                        return (
                                                                            <>
                                                                                <a>{set.name}</a>
                                                                                <a>{set.prices[displayCurrency]}{items.supportedCurrenciesShorts[displayCurrency]}</a>
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                            :
                                                            <h1>Loading items...</h1>
                                                    }

                                                    <div id="coinsShopModal" className="modal" style={{display: displayCoinsShop ? 'block' : 'none'}} onClick={(event)=> {
                                                       if(event.target.id == "coinsShopModal"){
                                                           setDisplayCoinsShop(false)
                                                       }
                                                    }}>
                                                        <div className="modal-content" style={{borderRadius:15}}>
                                                            <div className="card card-rounded">
                                                                <div className="card-body">
                                                                    <h3><b>Top Up Assistants Coins</b></h3>
                                                                    {
                                                                        items && coins != null && setSelected ?
                                                                            <div className={"pt-3"}>
                                                                                <div className="form-group">
                                                                                    <label htmlFor="exampleFormControlSelect2">Currency</label>
                                                                                    <select className="form-control"
                                                                                            id="exampleFormControlSelect2"
                                                                                            value={displayCurrency}
                                                                                            onChange={(event)=>setDisplayCurrency(event.target.value)}
                                                                                            style={{color:'black'}}
                                                                                    >
                                                                                        {
                                                                                            Object.keys(items.supportedCurrencies).map((val,idx)=>{
                                                                                                return (
                                                                                                    <option value={val}>{val} ({Object.values(items.supportedCurrencies)[idx]})</option>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </select>
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label htmlFor="exampleFormControlSelect2">
                                                                                        Pack
                                                                                    </label>
                                                                                    <select className="form-control"
                                                                                            id="exampleFormControlSelect2"
                                                                                            value={setSelected}
                                                                                            onChange={(event)=> {
                                                                                                setSetSelected(event.target.value)
                                                                                            }}
                                                                                            style={{color:'black'}}
                                                                                    >
                                                                                        {
                                                                                            items.coinsPacks.map(set=>{
                                                                                                return (
                                                                                                    <option value={set.name}>{set.name}</option>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </select>
                                                                                </div>

                                                                                <hr/>

                                                                                <h4><b>Pack Selected</b></h4>
                                                                                <h5 className="pt-2">Item: {items.coinsPacks.find(e=>e.id==setSelected).name}</h5>
                                                                                <h5>Total Price: {items.coinsPacks.find(e=>e.id==setSelected).prices[displayCurrency]}{items.supportedCurrenciesShorts[displayCurrency]}</h5>


                                                                                <div className="pt-2">Total Coins after Purchase: <b>{coins + Number((setSelected || '0').replace('_coins',''))}</b></div>

                                                                                <hr/>

                                                                                <div className={"d-flex"} style={{justifyContent:'space-between'}}>
                                                                                    <div style={{paddingTop:15}}>
                                                                                        <button type="button"
                                                                                                className="btn btn-primary btn-icon-text"
                                                                                                onClick={()=>Router.push(`/api/shop/payment/create?currency=${displayCurrency}&items=${setSelected}`)}
                                                                                                style={{color:'white',height:'50px',fontSize:'16px',justifyContent:'center', display:'flex',}}
                                                                                        >
                                                                                            <i style={{fontSize:'14px'}} className="mdi mdi-credit-card"></i>
                                                                                            Purchase
                                                                                        </button>
                                                                                    </div>
                                                                                    <div>
                                                                                        <img style={{width:210,height:'auto',maxWidth:'100%'}} src={"https://cdn.assistantscenter.com/l4odmzg7"}/>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            <h1>Loading...</h1>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageBody>
            <Scripts/>
            <Script src="https://checkout.stripe.com/checkout.js" strategy="beforeInteractive" defer={true}/>
        </>
    )
}