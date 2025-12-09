import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const ClientChart = ({ activeTab }) => {
   const [showGraph, setShowGraph] = useState(false);
   const [totalClient, setTotalClient] = useState({});
   const [totalproject, setTotalproject] = useState({});
   const [dealsStat, setDealsStat] = useState({});
   console.log(dealsStat,"dealsStat")
    const fetchClientData = async (value) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/getDashboardDetails`, {
                params: { isFor: value},
            });
            if (response) {
                const dataCome =response.data.data
                setTotalClient(
                    {
                        series: dataCome.totalClient.series,
                        options: {
                            chart: {
                                width: 380,
                                type: 'pie',
                            },
                            responsive: [{
                                breakpoint: 480,
                                options: {
                                    chart: {
                                        width: 200
                                    },
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }]
                        },
                        title: {
                            text: "Total Client",
                            align: 'center',
                            margin: 20,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Helvetica Now MT Micro Regular',
                                fontWeight: '500',
                                color: '#263238',
                            },
                        },
                        colors: ['#37997b', '#ed6a58', '#fcb040', '#f77837'],
                        labels:  dataCome.totalClient.labels,
                        legend: {
                            position: 'bottom',
                        },
                        fill: {
                            opacity: 1,
                        },
                    }
                );
                setTotalproject(
                    {
                        series: dataCome.project.series,
                        options: {
                            chart: {
                                type: 'polarArea',
                            },
                
                            stroke: {
                                colors: ['#fff']
                            },
                            fill: {
                                opacity: 0.8
                            },
                            responsive: [{
                                breakpoint: 480,
                                options: {
                                    chart: {
                                        width: 200
                                    },
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }]
                
                        },
                        title: {
                            text: "Project",
                            align: 'center',
                            margin: 20,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Helvetica Now MT Micro Regular',
                                fontWeight: '500',
                                color: '#263238',
                            },
                        },
                        colors: ['#37997b', '#ed6a58', '#fcb040', '#f77837'],
                        labels: dataCome.project.labels,
                        legend: {
                            position: 'bottom',
                        },
                    }
                )
                setDealsStat(dataCome.dealsStatistics)
                setShowGraph(true)
            }
        } catch (error) {

        }
    };
    useEffect(() => {
        if (activeTab === "Clients") {
            fetchClientData("client");
        }
    }, [activeTab]);
    return (
        <div className='row mb-3'>
            <div className="col-12 col-md-2 custom_padding_taskbar">
                <div className="oxy_chat_box">
                    {showGraph ?(
                    <Chart
                        options={totalClient}
                        series={totalClient.series}
                        type="pie"
                        height={330}
                    />
                    ):null}
                </div>
            </div>
            <div className="col-12 col-md-3 custom_padding_taskbar">
                <div className="oxy_chat_box">
                {showGraph ?(
                    <Chart
                        options={totalproject}
                        series={totalproject.series}
                        type="polarArea"
                        width="100%"
                        height={330}
                    />
                ):null}
                </div>
            </div>
            <div className="col-12 col-md-7 custom_padding_taskbar">
                <div className="oxy_chat_box oxy_chat_box_stat">
                    <h6>Deals Statistics</h6>
                    {showGraph ?(
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="custom_padding_taskbar_box">
                                <img src="\assets\img\graph.png" className='oxy_dashboard_img' />
                                <div className='oxy_tsk_inn_box win_t'>
                                    <span className='oxy_tsk_1'>{dealsStat.series[0]}</span>
                                    <span className='oxy_tsk_2'>{dealsStat.labels[0]}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="custom_padding_taskbar_box">
                                <img src="\assets\img\static.png" className='oxy_dashboard_img' />
                                <div className='oxy_tsk_inn_box loss_t'>
                                    <span className='oxy_tsk_1'>{dealsStat.series[1]}</span>
                                    <span className='oxy_tsk_2'>{dealsStat.labels[1]}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="custom_padding_taskbar_box">
                                <img src="\assets\img\area-graph.png" className='oxy_dashboard_img' />
                                <div className='oxy_tsk_inn_box pen_t'>
                                    <span className='oxy_tsk_1'>{dealsStat.series[2]}</span>
                                    <span className='oxy_tsk_2'>{dealsStat.labels[2]}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="custom_padding_taskbar_box">
                                <img src="\assets\img\dps.png" className='oxy_dashboard_img' />
                                <div className='oxy_tsk_inn_box ten_t'>
                                    <span className='oxy_tsk_1'>{dealsStat.series[3]}</span>
                                    <span className='oxy_tsk_2'>{dealsStat.labels[3]}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    ):null}
                </div>
            </div>

        </div>
    );
};

export default ClientChart;
