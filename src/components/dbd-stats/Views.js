import React from 'react'
import Script from 'next/script'
import { WorldMap } from 'react-svg-worldmap'
import axios from 'axios'

const CountryViews = ({project}) => {
    const [data, setData] = React.useState(null)

    React.useEffect(() => {
        const exec = async () => {
            const res = await axios.get('/api/discord-dashboard/project/views/total/countries/'+project._id)
            console.log(res.data)
            let resData = Object.keys(res.data.countryData).map((country,idx) => {
                return { country, value: Object.values(res.data.countryData)[idx] }
            })
            setData(resData)
        }
        exec()
    }, [])

    return (
        data?
            <div>
                <WorldMap
                    color="blue"
                    value-suffix="views"
                    size="responsive"
                    data={data}
                />
            </div>
            : <div>
                <a>Loading...</a>
            </div>
    )
}

const Comparison = ({project}) => {
    const [data, setData] = React.useState(null)

    React.useEffect(() => {
        const exec = async () => {
            const res = await axios.get('/api/discord-dashboard/project/views/comparison/'+project._id).catch(err=>{
                console.log(err)
            })
            setData(res.data.dates)
        }
        exec()
    }, [])

    React.useEffect(()=>{
        if(!data)return
        const graphGradient = document.getElementById("performaneLine").getContext('2d');
        const graphGradient2 = document.getElementById("performaneLine").getContext('2d');
        const saleGradientBg = graphGradient.createLinearGradient(5, 0, 5, 100);
        saleGradientBg.addColorStop(0, 'rgba(26, 115, 232, 0.18)');
        saleGradientBg.addColorStop(1, 'rgba(26, 115, 232, 0.02)');
        const saleGradientBg2 = graphGradient2.createLinearGradient(100, 0, 50, 150);
        saleGradientBg2.addColorStop(0, 'rgba(0, 208, 255, 0.19)');
        saleGradientBg2.addColorStop(1, 'rgba(0, 208, 255, 0.03)');
        const salesTopData = {
            labels: ["6 days ago", "5 days ago", "4 days ago", "3 days ago", "2 days ago", "Yesterday", "Today"],
            datasets: [{
                label: 'This week',
                data: [data.days_ago_6, data.days_ago_5, data.days_ago_4, data.days_ago_3, data.days_ago_2, data.yesterday, data.today],
                backgroundColor: saleGradientBg,
                borderColor: [
                    '#1F3BB3',
                ],
                borderWidth: 1.5,
                fill: true, // 3: no fill
                pointBorderWidth: 1,
                pointRadius: [4, 4, 4, 4, 4,4, 4, 4, 4, 4,4, 4, 4],
                pointHoverRadius: [2, 2, 2, 2, 2,2, 2, 2, 2, 2,2, 2, 2],
                pointBackgroundColor: ['#1F3BB3)', '#1F3BB3', '#1F3BB3', '#1F3BB3','#1F3BB3)', '#1F3BB3', '#1F3BB3', '#1F3BB3','#1F3BB3)', '#1F3BB3', '#1F3BB3', '#1F3BB3','#1F3BB3)'],
                pointBorderColor: ['#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff',],
            },{
                label: 'Last week',
                data: [data.days_ago_13, data.days_ago_12, data.days_ago_11, data.days_ago_10, data.days_ago_9, data.days_ago_8, data.days_ago_7],
                backgroundColor: saleGradientBg2,
                borderColor: [
                    '#52CDFF',
                ],
                borderWidth: 1.5,
                fill: true, // 3: no fill
                pointBorderWidth: 1,
                pointRadius: [4, 4, 4, 4, 4,4, 4, 4, 4, 4,4, 4, 4],
                pointHoverRadius: [2, 2, 2, 2, 2,2, 2, 2, 2, 2,2, 2, 2],
                pointBackgroundColor: ['#52CDFF)', '#52CDFF', '#52CDFF', '#52CDFF','#52CDFF)', '#52CDFF', '#52CDFF', '#52CDFF','#52CDFF)', '#52CDFF', '#52CDFF', '#52CDFF','#52CDFF)'],
                pointBorderColor: ['#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff',],
            }]
        };

        const salesTopOptions = {
            responsive: true,
            maintainAspectRatio: false,
            legend:false,
            legendCallback: function (chart) {
                var text = [];
                text.push('<div class="chartjs-legend"><ul>');
                for (var i = 0; i < chart.data.datasets.length; i++) {
                    console.log(chart.data.datasets[i]); // see what's inside the obj.
                    text.push('<li>');
                    text.push('<span style="background-color:' + chart.data.datasets[i].borderColor + '">' + '</span>');
                    text.push(chart.data.datasets[i].label);
                    text.push('</li>');
                }
                text.push('</ul></div>');
                return text.join("");
            },

            elements: {
                line: {
                    tension: 0.4, // disables bezier curves
                }
            },
            tooltips: {
                backgroundColor: 'rgba(31, 59, 179, 1)',
            }
        }
        const salesTop = new Chart(graphGradient, {
            type: 'line',
            data: salesTopData,
            options: salesTopOptions
        });
    }, [data])

    return <>{
        data?null:<a>Loading...</a>
    }</>
}

export default function ViewsStats ({ project }) {
    console.log('project2,', project)
    const data = [
        { country: "cn", value: 1389 },
        { country: "pl", value: 1289 },
    ];

    return (
        <>
        <div className="col-lg-8 d-flex flex-column">
            <div className="row flex-grow">
                <div className="col-12 col-lg-4 col-lg-12 grid-margin stretch-card">
                    <div className="card card-rounded">
                        <div className="card-body">
                            <div className="d-sm-flex justify-content-between align-items-start">
                                <div>
                                    <h4 className="card-title card-title-dash">
                                        Views comparison of the last 7 days with the previous 7 days
                                    </h4>
                                    <h5 className="card-subtitle card-subtitle-dash">
                                        Views are counted: 1 per page per user per 3 hours, unique views are total unique users logged in and not logged in. Unique users are total unique users logged in.
                                    </h5>
                                </div>
                                <div id="performance-line-legend">
                                    <div className="chartjs-legend">
                                        <ul>
                                            <li>
                                                <span style={{ backgroundColor: "#1F3BB3" }} />
                                                This week
                                            </li>
                                            <li>
                                                <span style={{ backgroundColor: "#52CDFF" }} />
                                                Last week
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="chartjs-wrapper mt-5">
                                <div className="chartjs-size-monitor">
                                    <div className="chartjs-size-monitor-expand">
                                        <div className="" />
                                    </div>
                                    <div className="chartjs-size-monitor-shrink">
                                        <div className="" />
                                    </div>
                                </div>
                                {
                                    (typeof document !== 'undefined') ? <Comparison project={project}/> : null
                                }
                                <canvas
                                    id="performaneLine"
                                    style={{ display: "block", height: 150, width: 658 }}
                                    width={1316}
                                    height={300}
                                    className="chartjs-render-monitor"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
            <div className="col-lg-4 d-flex flex-column">
                <div className="row flex-grow">
                    <div className="col-md-6 col-lg-12 grid-margin stretch-card">
                        <div className="card bg-primary card-rounded">
                            <div className="card-body pb-0">
                                <h4 className="card-title card-title-dash text-white mb-4">
                                    Total Views Summary
                                </h4>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <p className="status-summary-ight-white mb-1">Views</p>
                                        <h2 className="text-white">357</h2>
                                    </div>
                                    <div className="col-sm-4">
                                        <p className="status-summary-ight-white mb-1">Users</p>
                                        <h2 className="text-white">357</h2>
                                    </div>
                                    <div className="col-sm-4">
                                        <p className="status-summary-ight-white mb-1">Unique Views</p>
                                        <h2 className="text-white">357</h2>
                                    </div>
                                    <div className="pt-3"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row flex-grow">
                    <div className="col-md-6 col-lg-12 grid-margin stretch-card">
                        <div className="card bg-primary card-rounded">
                            <div className="card-body pb-0">
                                <h4 className="card-title card-title-dash text-white mb-4">
                                    Total Views Summary
                                </h4>
                                <div className="row">
                                    <div className="col-sm-4">
                                        <p className="status-summary-ight-white mb-1">Views</p>
                                        <h2 className="text-white">357</h2>
                                    </div>
                                    <div className="col-sm-4">
                                        <p className="status-summary-ight-white mb-1">Users</p>
                                        <h2 className="text-white">357</h2>
                                    </div>
                                    <div className="col-sm-4">
                                        <p className="status-summary-ight-white mb-1">Unique Views</p>
                                        <h2 className="text-white">357</h2>
                                    </div>
                                    <div className="pt-3"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xxl-6 d-flex flex-column">
                <div className="card card-rounded">
                    <div className="card-body">
                        <a><b>Views per countries</b></a>
                        {(typeof window !== 'undefined') ?
                            <CountryViews project={project}/>
                            :null
                        }
                    </div>
                </div>
            </div>

        </>
    )
}