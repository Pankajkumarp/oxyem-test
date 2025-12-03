import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import {FaAward } from 'react-icons/fa';
import { axiosJWT } from '../../Auth/AddAuthorization';
export default function StatComponent({initiateCycleBtn}) {

    const [isStatData, setIsStatData] = useState({});
    const fetchStatData = async () => {
        try {

            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/performance/stats`)
            if (response) {
                const responseData = response.data.data
                setIsStatData(responseData)
                if(responseData.initiateCycleBtn){
                    initiateCycleBtn(responseData.initiateCycleBtn)
                }
            }
        } catch (error) {

        }
    };
    useEffect(() => {
        fetchStatData();
    }, []);
    return (
        <div className="row">
            <div className="col-12 col-lg-12 col-xl-12 oxyem_perf oxyem_perf_emp">
                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-perform_dashborad performance_head_box">
                    <h3 className='performance_head_text'><FaAward /> Empowering Performance Excellence</h3>
                    <div className="oxyem-top-box-design design-only-attendence design-only-timesheetemp design-only-performance_Review performance_employee">
					
					
                        <div className="stats-info stats-info-cus stats-info-sub">
                            <span className='top_lable_perform'>In Progress</span>
                            <h4 className='all_performance'>{isStatData ? isStatData.submissionPending : "0"}</h4>
                            <h6>Performance Submission is pending</h6>
                        </div>
					
					
					
                        <div className="stats-info stats-info-cus stats-info-srev">
                            <span className='top_lable_perform'>Under Review</span>
                            <h4 className='all_performance'>{isStatData ? isStatData.reviewPending : "0"}</h4>
                            <h6>Performance Review is pending</h6>
                        </div>
                        
						
						
                        <div className="stats-info stats-info-cus stats-info-close">
                            <span className='top_lable_perform'>Closed</span>
                            <h4 className='all_performance'>{isStatData ? isStatData.reviewClosed : "0"}</h4>
                            <h6>Performance review closed</h6>
                        </div>
                       
						
						
                    </div>
                </div>
            </div>
        </div>
    )
}
