import React from 'react'

import axios from 'axios'

import { MultiStepForm, Step } from 'react-multi-form'

export default function NotPartneredNoRequest({
    postSubmit, 
    validateEmail,

    active,
    setActive,

    submitError,
    setSubmitError,

    partnerData,
    setPartnerData,

    displaySubmit, 
    setDisplaySubmit,

    partnerCode,
    setPartnerCode,

    partnerEmail,
    setPartnerEmail,

    aboutYou,
    setAboutYou,
}) {
    return <>
            <div className="row">
            <div className="col-sm-12">
                <div className="card card-rounded">
                    <div className="card-body">
                        <h2><b>What is an Partnership Program?</b></h2>
                        <p style={{fontSize:16,paddingTop:10}}>
                            Partnership Program from Assistants Center is a way to earn money by 
                            recommending our services. 
                            For every purchase made by the person who will support you with the code 
                            (whether a subscription or a one-time purchase) 
                            made with real currency, you will receive 5% of the value of the 
                            transaction made minus any taxes.
                        </p>

                        <h2 style={{paddingTop:15}}><b>Why is it worth it?</b></h2>
                        <p style={{fontSize:16,paddingTop:10}}>
                            You don't have to put anything from yourself into the program. 
                            Everything is designed to be easy and simple. 
                            In addition, you will get access to a panel where you can easily 
                            check the statistics of your earnings and have us order a withdrawal.
                        </p>

                        <h2 style={{paddingTop:15,paddingBottom: 10}}><b>Want to join?</b></h2>
                        <button className="btn btn-primary btn-icon-text" style={{fontSize:16,height:'40px',}} onClick={()=>setDisplaySubmit(true)}>
                            Apply for access
                        </button>

                        {
                            partnerData.request_status?.confirmed != null
                            &&
                            <div>
                                <p><b>We rejected your previous application due to:</b> {partnerData.request_status.denied_message||"Not specified. Contact support to know the reason."}</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>

        <div id="submitModal" className="modal" style={{display: displaySubmit ? 'block' : 'none'}} onClick={(event)=> {
        }}>
            <div className="modal-content" style={{borderRadius:15}}>
                <div className="card card-rounded">
                    <div className="card-body">
                        <h3 style={{paddingBottom:15}}><b>Apply for Partnership Program</b></h3>

                        <MultiStepForm activeStep={active} accentColor={"#0420bf"}>
                            <Step label="INFORMATION">
                                <div style={{paddingTop:15,paddingBottom:15}}>
                                    <p style={{fontSize:20}}>We are happy to see interest from your side!</p>
                                    <p style={{fontSize:16}}>We need to ask you first for some important information.</p>
                                </div>

                                <div class="form-group">
                                    <label for="exampleInputEmail1">What should your partner code look like? Use 4-15 characters</label>
                                    <input type="text" 
                                        class="form-control" 
                                        id="exampleInputEmail1" 
                                        placeholder="Partner code"
                                        value={partnerCode}
                                        minLength={4}
                                        maxLength={15}
                                        onChange={(event)=>{
                                            setSubmitError('')
                                            setPartnerCode(event.target.value.trim())
                                        }}
                                    />
                                </div>

                                <div class="form-group">
                                    <label for="exampleInputEmail1">What is your contact email? Make sure it is correct</label>
                                    <input
                                        type="email" 
                                        class="form-control" 
                                        id="exampleInputEmail1" 
                                        placeholder="Email"
                                        maxLength={50}
                                        value={partnerEmail}
                                        onChange={(event)=>{
                                            setSubmitError('')
                                            setPartnerEmail(event.target.value.trim())
                                        }}
                                    />
                                </div>
                            </Step>
                            <Step label="ABOUT YOU">
                                <div style={{paddingTop:15,paddingBottom:15}}>
                                    <p style={{fontSize:20}}>Now, tell us about yourself and your business.</p>
                                    <p style={{fontSize:15}}>To make sure your request is approved - we ask that you provide links to your ongoing projects and social media.</p>
                                </div>

                                <div class="form-group">
                                    <label for="exampleTextarea1">Tell us about you. Use 50-500 characters</label>
                                    <textarea 
                                        className="form-control" 
                                        id="exampleTextarea1" 
                                        rows="10" 
                                        style={{height:'100px',lineHight:'150%'}}
                                        onChange={(event)=>{
                                            setSubmitError('')
                                            setAboutYou(event.target.value)
                                        }}
                                        value={aboutYou}
                                    ></textarea>
                                </div>
                            </Step>
                            <Step label="CONFIRM">
                            <div style={{paddingTop:15,paddingBottom:15}}>
                                    <p style={{fontSize:20}}>You're almost there!</p>
                                    <p style={{fontSize:15}}>Now confirm all settings and submit your request.</p>
                                </div>
                            
                                <div>
                                    <p><b>E-mail adress:</b> {partnerEmail}</p>
                                    <p><b>Requested code:</b> {partnerCode}</p>
                                    <p><b>About:</b> {aboutYou}</p>
                                </div>

                                <div style={{paddingTop:15}}>
                                <button type="button"
                                        className="btn btn-success btn-icon-text"
                                        onClick={()=>{
                                            postSubmit()
                                        }}
                                        style={{color:'white',height:'40px',fontSize:'16px',justifyContent:'center', display:'flex',borderColor:'#278f89',float:"right"}}
                                >
                                    Confirm
                                </button>
                            </div>
                            
                            </Step>
                        </MultiStepForm>

                        {
                            submitError && <p style={{color: "red", fontSize: 15}}><b>Error: </b>{submitError}</p>
                        }

                        {active !== 1 && (
                            <button 
                                className="btn btn-primary btn-icon-text"
                                onClick={() => setActive(active - 1)}
                            >Previous</button>
                        )}
                        {active !== 3 && (
                            <button
                                onClick={() => {
                                    if(active == 1){
                                        if(partnerCode.length < 4 || partnerCode.length > 15)return setSubmitError("Partner code should be 5-15 characters long. Submited " + partnerCode.length)
                                        if(!validateEmail(partnerEmail))return setSubmitError("E-mail submited is not an valid e-mail adress.")
                                    }else if(active == 2){
                                        if(aboutYou.length < 50 || aboutYou.length > 500)return setSubmitError("About you should be 50-500 characters long. Submited " + aboutYou.length)
                                    }
                                    setActive(active + 1)
                                }}
                                style={{ float: 'right' }}
                                className="btn btn-primary btn-icon-text"
                            >
                            Next
                            </button>
                        )}

                        <div className={"d-flex"} style={{}}>
                            <div style={{paddingTop:15}}>
                                <button type="button"
                                        className="btn btn-danger btn-icon-text"
                                        onClick={()=>setDisplaySubmit(null)}
                                        style={{color:'white',height:'40px',fontSize:'16px',justifyContent:'center', display:'flex',borderColor:"red"}}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}