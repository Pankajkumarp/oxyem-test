/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import styles from './ProfileHeader.module.css';
import { axiosJWT } from '../../../Auth/AddAuthorization';


export default function StatHeader({ empId }) {

    const [statData, setStatData] = useState({});
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const fetchStatInfo = async () => {
        try {
            if (empId) {
                const response = await axiosJWT.get(`${apiUrl}/me/employee-overview`, {
                    params: { idEmployee: empId }
                });
                if (response.status === 200 && response.data.data) {
                    setStatData(response.data.data);

                }
            }
        } catch (error) {
            console.error("Error occurred during API call:", error);
        }
    };
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStatInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [empId]);
    return (
        <div className="row mb-3 mt-3">
            <div className="col-12 col-sm-6 col-xl-3">
                <StatsCard
                    title="Leave Balance"
                    value={statData?.leaveBalance || 0}
                    subtitle="days available"
                    color="primary"
                    image={'/assets/img/leave-remain.png'}
                />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
                <StatsCard
                    title="Active Projects"
                    value={statData?.activeProjects || 0}
                    subtitle="ongoing"
                    color="success"
                    image={'/assets/img/active-project.png'}
                />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
                <StatsCard
                    title="Years Experience"
                    value={statData?.yearsExperience || 0}
                    subtitle="overall"
                    color="warning"
                    image={'/assets/img/recommend.png'}
                />
            </div>
            <div className="col-12 col-sm-6 col-xl-3">
                <StatsCard
                    title="Assigned Assets"
                    value={statData?.assignedAssets || 0}
                    subtitle="company assets"
                    color="danger"
                    image={'/assets/img/content-management.png'}
                />
            </div>
        </div>
    );
}
function StatsCard({
    title,
    value,
    subtitle,
    color,
    image
}) {
    return (
        <div className="card border-0 rounded-2 h-100">
            <div className="card-body p-4">
                <div className={`d-flex align-items-center gap-3`}>
                    <div
                        className={`${styles.statBoxImage} bg-${color} bg-opacity-10 rounded-2`}
                        style={{
                            width: '70px',
                            height: '70px',
                        }}
                    >
                        {image ? (<img src={image} alt={title} />) : null}
                    </div>
                    <div>
                        <h2 className="fw-bold mb-1">
                            {value}
                        </h2>
                        <div className="fw-semibold">
                            {title}
                        </div>
                        <small className="text-muted">
                            {subtitle}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    )
}