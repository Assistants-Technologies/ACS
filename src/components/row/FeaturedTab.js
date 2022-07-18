import React from 'react'

export default function FeaturedTab ({ id, title, button_title, background, subtitle }) {
    return (
        <div className="row flex-grow">
            <div className="col-12 grid-margin stretch-card">
                <div className="card card-rounded table-darkBGImg" style={{background:background,backgroundSize:'cover !important',backgroundRepeat:'no-repeat'}}>
                    <div className="card-body" style={{marginTop:30,marginBottom:30}}>
                        <div className="col-sm-8">
                            <h3 className="text-white upgrade-info mb-0">
                                {title}
                            </h3>
                            {
                                subtitle ?
                                    <h5 className="text-white upgrade-info mt-2">
                                        {subtitle}
                                    </h5>
                                    :null
                            }
                            <a href="#" className="btn btn-info upgrade-btn">{button_title}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}