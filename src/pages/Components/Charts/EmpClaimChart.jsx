import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const EmpClaimChart = () => {
    const [isChartOpen, setIsChartOpen] = useState(false);
    const [monthlyData, setMonthlyData] = useState(null);
    const [monthlyDatadonut, setMonthlyDatadonut] = useState(null);
    const [claimSummary, setClaimSummary] = useState(null);
    const [showMonthlyChart, setShowMonthlyChart] = useState(false);
    const [showMonthlyDatadonut, setShowMonthlyDatadonut] = useState(false);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/claims/graphStats`, {
                    params: { month:'Mar', year:'2025', isFor: 'self', showAll: 'all' }
                });

                const overallClaimData = response.data.data.overallClaimData.overAll;
                const claimData = response.data.data.allClaims;
                const claimSummaryData = response.data.data.claimSummary;
                const allZero = overallClaimData.data.every(value => value === 0);
                const claimDatazERO = claimData.data.every(value => value === 0);
                setShowMonthlyChart(!allZero);
                setShowMonthlyDatadonut(!claimDatazERO);

                setMonthlyData({
                    series: overallClaimData.data,
                    options: {
                        chart: { width: 450, type: 'pie' },
                        labels: overallClaimData.label,
                        colors: ['#26AF48', '#2196F3', '#FA7E12', '#cf59f1'],
                        legend: { position: 'bottom' },
                        responsive: [{ breakpoint: 480, options: { chart: { width: 300 } } }],
                        title: {
                            text: `Overall Claim Status`,
                            align: 'center',
                            margin: 20,
                            style: { fontSize: '13px', fontFamily: 'Helvetica Now MT Micro Regular', fontWeight: '500', color: '#263238' }
                        },
                    },
                });

                setMonthlyDatadonut({
                    series: claimData.data,
                    options: {
                        chart: { type: 'donut', width: 450 },
                        labels: claimData.label,
                        colors: ['#2196F3', '#FF4560', '#26AF48', '#775DD0'],
                        legend: { position: 'bottom' },
                        responsive: [{ breakpoint: 480, options: { chart: { width: 300 } } }],
                        title: {
                            text: `Claim Type`,
                            align: 'center',
                            margin: 20,
                            style: { fontSize: '13px', fontFamily: 'Helvetica Now MT Micro Regular', fontWeight: '500', color: '#263238' }
                        },
                    },
                });

                setClaimSummary(claimSummaryData);
                setIsChartOpen(true);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchChartData();
    }, []);

    return (
        <>
         {/* <div className="row mb-3"> */}
            {isChartOpen && (
                <>
                  {monthlyDatadonut && monthlyDatadonut.options && monthlyDatadonut.series && showMonthlyDatadonut &&(
                    <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
                        <div className="oxy_chat_box">
                            <Chart options={monthlyDatadonut.options} series={monthlyDatadonut.series} type="donut" width="100%" height={250} />
                        </div>
                    </div>
                    )}
                    {monthlyData && monthlyData.options && monthlyData.series &&  showMonthlyChart &&(
                    <div className="col-lg-3 col-md-6 col-sm-6 custom_padding_taskbar">
                        <div className="oxy_chat_box">
                            {monthlyData && (
                                <Chart options={monthlyData.options} series={monthlyData.series} type="pie" width="100%" height={250} />
                            )}
                        </div>
                    </div>
                    )}
                    {claimSummary && Object.keys(claimSummary).length > 0 && (
                    <div className="col-lg-6 col-md-6 col-sm-6 custom_padding_taskbar">
                        <div className="oxy_chat_box oxy_chat_box_stat oxy_chat_box_stat_project">
                            <h6>Annual Actual Claim Statistics</h6>
                            <div className="row">
                                {claimSummary && Object.entries(claimSummary).map(([key, value]) => (
                                    <div className="col-12 col-md-6" key={key}>
                                        <div className="custom_padding_taskbar_box emp-claim-box-chart">
                                        <img src={`/assets/img/${key.toLowerCase().replace(/ /g, '-')}.png`} className='oxy_dashboard_img' />
                                            <div className='oxy_tsk_inn_box ten_t'>
                                                <span className='oxy_tsk_1'>{value}</span>
                                                <span className='oxy_tsk_2'>{key}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    )}
                </>
            )}
         {/* </div> */}
        </>
    );
};

export default EmpClaimChart;
