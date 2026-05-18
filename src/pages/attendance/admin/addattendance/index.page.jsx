import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SecTab from '../../../Components/Employee/SecTab';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Breadcrumbs from '../../../Components/Breadcrumbs/Breadcrumbsdiscription';
import { SocketContext } from '../../../Auth/Socket';
import Head from 'next/head';
import { fetchWithToken } from '../../../Auth/fetchWithToken.jsx';
import pageTitles from '../../../../common/pageTitles.js';
import { ToastNotification, ToastContainer } from '../../../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { MdAssignmentInd } from "react-icons/md";
import AttendanceRegularization from "./AttendanceRegularization";
export default function Projectmanagement({ userFormdata }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
  const handlesubmitApiData = async (newArray, idAttendance) => {
    setSubmitButtonLoading(true);
    let idEmployee = "";
    let dateRange = "";

    if (newArray.section && newArray.section.length > 0) {
      const fields = newArray.section[0].fields;
      fields.forEach(field => {
        if (field.name === "idEmployee") {
          idEmployee = field.attributeValue;
        }
        if (field.name === "attendancedate") {
          dateRange = field.attributeValue;
        }
      });
    }

    let sectionData = [];

    if (newArray.section && newArray.section.length > 0 && idAttendance !== null) {
      // Deep clone the section to avoid mutating the original newArray
      sectionData = JSON.parse(JSON.stringify(newArray.section));

      const fields = sectionData[0].fields;

      fields.forEach(field => {
        if (field.name === "idEmployee") {
          if (idAttendance !== "") {
            field.attributeValue = ""; // Clear idEmployee for updates
          } else {
            idEmployee = field.attributeValue;
          }
        }
        if (field.name === "attendancedate") {
          dateRange = field.attributeValue;
        }
      });
    }

    const apipayload = {
      feature: !idAttendance ? newArray.feature : "Edit_Attendance",
      mode: "custom",
      section: !idAttendance ? newArray.section : sectionData,
      location: "",
      ...(idAttendance ? { idAttendance } : {}),
      ...(idAttendance ? { idEmployee: "" } : {})
    };

    try {
      const response = await axiosJWT.post(`${apiUrl}/attendance`, apipayload);

      if (response.status === 200) {
        const idAction = response.data.data.idAttendance
        socket.emit("insert", {
          idNotify: "",
          idEmployee: idEmployee,
          actionFor: "attendance",
          idAction: idAction,
          dateRange: dateRange
        });
        router.push(`/attendance/admin`);
        setSubmitButtonLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const errorMessage = error?.response?.data?.message || 'Failed to submit the form. Please try again later.';
        ToastNotification({ message: errorMessage });
      } else {
        ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
      }
      setSubmitButtonLoading(false);
    }
  };
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
          fetchForm();
      }, []);
  
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
          }
      };
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

