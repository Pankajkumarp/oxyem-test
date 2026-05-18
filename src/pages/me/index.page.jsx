import { useState, useEffect } from 'react';
import EmployeeChart from '../Components/Charts/EmployeeChart';
import AttendanceChart from '../Components/Charts/AttendanceChart';
import EmpLeaveChart from '../Components/Charts/EmpLeaveChart';
import EmpClaimChart from '../Components/Charts/EmpClaimChart';
import EmpProfileChart from '../Components/Charts/EmpProfileChart';
import EmpPayrollChart from '../Components/Charts/EmpPayrollChart';
import EmpTimeSheetChart from '../Components/Charts/EmpTimeSheetChart';
import { axiosJWT } from '../Auth/AddAuthorization';
import Head from 'next/head';
import { MdDashboard } from "react-icons/md";
import Breadcrumbs from "../Components/Breadcrumbs/Breadcrumbsdiscription";
export default function Employee() {

    const [empId, setEmpId] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/employees/getLoggedInEmployee`);
                const EmployeeId = response.data.data.idEmployee;
                const isActive = response.data.data.isActive;
                setEmpId(EmployeeId);
            } catch (error) {
            }
        };
        fetchData();
    }, []);
    const [profileInfo, setProfileInfo] = useState({});
    const getProfileDataMain = async (value) => {
        setProfileInfo(value)
    };
    return (
        <>
            <Head>
                <title>Employee Analytics Dashboard | Oxytal</title>
                <meta name="description" content={"View employee performance, attendance, leave, salary, and TDS details through real-time graphs and dashboard analytics."} />
            </Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs
                            name={`Hi, ${profileInfo?.employeeName || "User"}`}
                            additionalTxt={profileInfo?.roleName}
                            maintext={``}
                            discription={
                                "All employee insights in one place through interactive charts."
                            }
                            icon={<MdDashboard />}
                            bottomLink="hide"
                            imageLink={<img src={profileInfo.profilePicPath ? profileInfo.profilePicPath : "https://www.w3schools.com/howto/img_avatar.png"} alt="Profile Picture" />}
                        />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="me-dashboard">
                                                        <div className="row">
                                                            <EmpProfileChart getProfileDataMain={getProfileDataMain} />
                                                            <EmpLeaveChart />
                                                            <EmpClaimChart />
                                                            <EmpTimeSheetChart />
                                                            <EmpPayrollChart empID={empId} />
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
            </div >
        </>
    );
}
