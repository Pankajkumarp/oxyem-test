/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AttendanceRegularization/index.tsx
"use client";

import React, { useContext, useState } from "react";
import AttendanceSnapshot from "../AttendanceSnapshot";
import styles from "./AttendanceRegularization.module.css";
import FormRenderer from "../../../../Components/FormRender/TemplateOne/FormRenderer";
import QuickInfo from "./QuickInfo";
import { axiosJWT } from "../../../../Auth/AddAuthorization";
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { ToastContainer } from "../../../../Components/EmployeeDashboard/Alert/ToastNotification";
import { FaRegCheckCircle, FaTimes } from "react-icons/fa";
import { SocketContext } from '../../../../Auth/Socket';


export default function AttendanceRegularization({ formShow, formData }) {
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const formatTimeOnly = (date: Date | string) => {
    if (!date) {
      return "";
    }
    const time = new Date(date);
    return time.toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );
  };
  const transformPayload = (values: any) => {
    return {
      feature: "Add_Attendance",
      mode: "custom",
      section: [
        {
          SectionName: "AttendanceDetails",
          fields: Object.entries(values)
            .filter(
              ([ value]) =>
                value !== "" &&
                value !== null
            )
            .map(([key, value]) => ({
              name: key,
              attributeValue:
                key === "startTime" ||
                  key === "endTime"
                  ? formatTimeOnly(value as Date)
                  : value,
            })),
        },
      ],
    };
  };
  const socket = useContext(SocketContext);
  const [SubmitLoading, setSubmitLoading] = useState(false);
  const handleSubmit = async (data) => {
    let idEmployee = "";
    let dateRange = "";
    if (data.idEmployee) {
      idEmployee = data.idEmployee;
    }
    if (data.attendancedate) {
      dateRange = data.attendancedate;
    }
    setSubmitLoading(true)
    const payload = transformPayload(data);
    setSubmitLoading(false)
    try {
      const response = await axiosJWT.post(`${apiUrl}/attendance`, payload);
      if (response.status === 200) {
        const message = response.data.message;
        toast.success(({ id }) => (
          <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
            <FaRegCheckCircle style={{
              fontSize: '35px',
              marginRight: '10px',
              color: '#4caf50'
            }} />
            <span dangerouslySetInnerHTML={{ __html: message }}></span>
            <button
              onClick={() => toast.dismiss(id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#4caf50',
                marginLeft: 'auto',
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              <FaTimes />
            </button>
          </div>
        ), {
          icon: null, // Disable default icon
          duration: 7000,
          style: {
            border: '1px solid #4caf50',
            padding: '8px',
            color: '#4caf50',
          },
        });
        const idAction = response.data.data.idAttendance
        socket.emit("insert", {
          idNotify: "",
          idEmployee: idEmployee,
          actionFor: "attendance",
          idAction: idAction,
          dateRange: dateRange
        });
        router.push(`/attendance/admin`);
        setSubmitLoading(false);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.errorMessage || 'Failed to submit the form. Please try again later.';
      toast.success(({ id }) => (
        <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
          <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
          <span dangerouslySetInnerHTML={{ __html: errorMessage }}></span>
          <button
            onClick={() => toast.dismiss(id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FF000F',
              marginLeft: 'auto',
              cursor: 'pointer'
            }}
          >
            <FaTimes />
          </button>
        </div>
      ), {
        icon: null, // Disable default icon
        duration: 7000,
        style: {
          border: '1px solid #FF000F',
          padding: '8px',
          color: '#FF000F',
        },
      });
      setSubmitLoading(false);
    }
  };
  const handleCancel = () => {
    router.push(`/attendance/admin`);
  };
  const [empInfoData, setEmpInfoData] = useState(null);

  const getEmpData = async (value) => {
    try {
      if (value) {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/attendance/getEmployeeAttendanceSummary`, { params: { idEmployee: value } });
        if (response.status === 200 && response.data.data) {
          const fetchedData = response.data.data;
          setEmpInfoData(fetchedData);
        }
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setEmpInfoData(null);
    }
  };
  const onClickGetEmployeeId = (employeeID) => {
    if (employeeID) {
      getEmpData(employeeID)
    }
  };



  return (
    <div className={styles.wrapper}>
      {/* Snapshot header card */}
      <AttendanceSnapshot />

      {/* Main form card */}
      <div className="row d-flex align-items-stretch">
        <div className="col-12 col-lg-7 col-xl-8">
          {formShow ? (
            <div className="w-100 h-100">
              <FormRenderer schema={formData} handeSubmit={handleSubmit} sumbitStart={SubmitLoading} isFor={"applyAttandance"} isPage={"admin"} handleCancelClick={handleCancel} onClickGetEmployeeId={onClickGetEmployeeId} />
            </div>) : (
            <div className="w-100 h-100 comman-form-loader-wrapper">
              <div className="form-loader">
                <div className="spinner"></div>
                <p>Loading form…</p>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-lg-5 col-xl-4">
          <div className="sidebar-info-section h-100 w-100">
            <h5 className="info-main-text">Quick Info</h5>
            <QuickInfo empInfoData={empInfoData} />
          </div>
        </div>
      </div>
      <style>{`.info-main-text{font-size:22px !important;}`}</style>
      <ToastContainer />
    </div>
  );
}
