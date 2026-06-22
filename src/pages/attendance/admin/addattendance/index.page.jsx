import React, {  useState, useEffect } from 'react';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Breadcrumbs from '../../../Components/Breadcrumbs/Breadcrumbsdiscription';
import Head from 'next/head';
import pageTitles from '../../../../common/pageTitles.js';
import { MdAssignmentInd } from "react-icons/md";
import AttendanceRegularization from "./AttendanceRegularization";
export default function Projectmanagement() {
  useEffect(() => {
    const mainElement = document.querySelector('body');
    if (mainElement) {
      mainElement.setAttribute('id', 'attendance-module');
    }
    return () => {
      if (mainElement) {
        mainElement.removeAttribute('id');
      }
    };
  }, []);


      const [formShow, setFormShow] = useState(false);
      const [leaveFormdata, setLeaveFormdata] = useState({});
      useEffect(() => {
        const fetchForm = async () => {
          try {
              const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
              const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, {
                  params: { formType: "applyAdminAttandance" },
              });
  
              if (response.status === 200 && response.data.data) {
                  setLeaveFormdata(response.data.data);
                  setFormShow(true)
              }
          } catch (error) {
            console.error(error)
          }
      };
          fetchForm();
      }, []);
  
      
  return (
    <>
      <Head><title>{pageTitles.AttendanceApplyAttendance}</title></Head>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col">
                    <Breadcrumbs
                      maintext={"Apply Attendance on Behalf of Employee"}
                      discription={"Submit attendance records for an employee who missed marking attendance, including date, time, and a valid reason."}
                      icon={<MdAssignmentInd />}
                    />
                  </div>
                  <div className="col-12 col-lg-12 col-xl-12">
                    <AttendanceRegularization formShow={formShow} formData={leaveFormdata}/>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>


    </>

  );
}

