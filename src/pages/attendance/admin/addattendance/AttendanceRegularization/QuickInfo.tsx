"use client";

import React, { useEffect, useState } from "react";
import Avatar from 'react-avatar';
import {
    FaUserCircle,
    FaBuilding,
    FaClock,
    FaUserTie,
    FaCalendarAlt,
    FaClipboardList,
} from "react-icons/fa";

import styles from "./QuickInfo.module.css";
import moment from 'moment-timezone';

const iconMap = {
    department: <FaBuilding />,
    shift: <FaClock />,
    manager: <FaUserTie />,
    weeklyOff: <FaCalendarAlt />,
};

export default function QuickInfo({ empInfoData }) {
    const [quickInfoData, setQuickInfoData] = useState(null);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuickInfoData(empInfoData)
    }, [empInfoData]);
    return (
        <div className={styles.quickinfowrapper}>
            {quickInfoData ? (
                <div className={`card shadow-sm border-0 ${styles.quickcard}`}>
                    {/* Employee Summary */}
                    <div className={styles.sectionCard}>
                        <h6 className={styles.sectionTitle}>
                            <FaUserCircle className="me-2" />
                            Employee Summary
                        </h6>

                        <div className="d-flex align-items-center gap-2 mb-3">
                            <Avatar
                                name={quickInfoData?.employeeInfo?.name}
                                src={quickInfoData?.employeeInfo?.profilePic || ""}
                                size={"50"}
                                textSizeRatio={2}
                                round={true}
                                style={{
                                    marginRight: '5px',
                                    objectFit: 'cover' // Add object-fit
                                }}
                            />
                            <div>
                                <h6 className="mb-0 fw-bold">{quickInfoData?.employeeInfo?.name}</h6>

                                <small className="text-muted">
                                    {quickInfoData?.employeeInfo?.employeeId} - {quickInfoData?.employeeInfo?.designation}
                                </small>
                            </div>

                            <span className="badge bg-success-subtle text-success ms-auto">
                                {quickInfoData?.employeeInfo?.status}
                            </span>
                        </div>
                        {quickInfoData?.employeeSummary?.map((item, index) => (
                            <div
                                key={index}
                                className={`${styles.infoRow} ${index === quickInfoData?.employeeSummary.length - 1
                                    ? "border-0 pb-0"
                                    : ""
                                    }`}
                            >
                                {iconMap[item.type]}

                                <span>{item.label}</span>

                                <strong>{item.value}</strong>
                            </div>
                        ))}

                    </div>

                    {/* Today's Attendance */}
                    <div className={`${styles.sectionCard} mt-3`}>
                        <h6 className={styles.sectionTitle}>
                            <FaClipboardList className="me-2" />
                            Today&apos;s Attendance
                        </h6>

                        <div className="row g-3 text-center">
                            {quickInfoData?.todayAttendance?.map((item, index) => {
                                let displayValue = item.value;

                                if (
                                    (item.type === "checkIn" || item.type === "checkOut") &&
                                    item.value
                                ) {
                                    displayValue = moment
                                        .utc(item.value)
                                        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                                        .format("hh:mm A");
                                }

                                return (
                                    <div className="col-4" key={index}>
                                        <small className="text-muted d-block">
                                            {item.label}
                                        </small>

                                        <div className={`side-text-i-${item.color} all-items`}>
                                            {displayValue || "Missing"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Last 5 Days Attendance */}
                    <div className={`${styles.sectionCard} mt-3`}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className={`${styles.sectionTitle} mb-0`}>
                                <FaCalendarAlt className="me-2" />
                                Last 5 Days Attendance
                            </h6>
                        </div>

                        <table className="table table-sm align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Working Hours</th>
                                </tr>
                            </thead>

                            <tbody>
                                {quickInfoData?.lastFiveDaysAttendance?.length > 0 ? (

                                    quickInfoData.lastFiveDaysAttendance.map(
                                        (item, index) => (
                                            <tr key={index} className={styles.tableRow}>
                                                <td className={styles.tableRowtd}>{item.date}</td>

                                                <td className={styles.tableRowtd}>
                                                    <span
                                                        className={`badge bg-${item.statusClass}-subtle text-${item.statusClass}`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>

                                                <td className={styles.tableRowtd}>{item.hours}</td>
                                            </tr>
                                        )
                                    )

                                ) : (

                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="text-center text-muted py-3"
                                        >
                                            No record available
                                        </td>
                                    </tr>

                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : <div className={styles.noDataContainer}>
                <h4 className={styles.noDataTitle}>
                    No Employee Selected
                </h4>

                <p className={styles.noDataDescription}>
                    Select an employee and attendance date to view
                    quick attendance insights, working hours,
                    shift details, and recent attendance activity.
                </p>
            </div>}
            <style>{`.side-text-i-green{color: #0EBC6B; background: #e7f8f0 !important;}.side-text-i-default{color:#004D95;background: #004d9526 !important;}.side-text-i-blue{color:blue;background: #0000ff17 !important;}.side-text-i-red{color:var(--theme-inactive-color-text);background: #f6e6e6 !important;}.all-items{padding: 2px 10px;width: max-content;min-width: 60px;text-align: center;margin: 0px auto;font-size: 11px;border-radius: 25px;background: #f5f9f7;}`}</style>
        </div>
    );
}