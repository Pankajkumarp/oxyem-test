// components/AttendanceSnapshot/index.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./AttendanceSnapshot.module.css";
import { CalendarIcon } from "../icons";
import { FiInfo } from "react-icons/fi";
import { axiosJWT } from '../../../../Auth/AddAuthorization';
import Avatar from 'react-avatar';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import moment from 'moment-timezone';

export interface AttendanceViewOption {
  label: string;
  value: "0" | "2" | "currentWeek" | "lastWeek";
}

const VIEW_OPTIONS: AttendanceViewOption[] = [
  { label: "Today", value: "0" },
  { label: "Last 2 Days", value: "2" },
  { label: "Current Week", value: "currentWeek" },
  { label: "Last Week", value: "lastWeek" },
];
const convertUtcToLocalTime = (
  utcDateTime: string,
  timeZone: string
): string => {
  if (!utcDateTime) return "";

  try {
    return moment
      .utc(utcDateTime)
      .tz(timeZone)
      .format("hh:mm A");
  } catch (error) {
    console.error(error)
    return "";
  }
};
const getCurrentTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
export default function AttendanceSnapshot() {
  const timeZone = getCurrentTimeZone();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState<AttendanceViewOption>(VIEW_OPTIONS[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (option: AttendanceViewOption) => {
    setSelected(option);
    setDropdownOpen(false);
  };
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const getListData = async (value) => {
      try {
        if (value) {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axiosJWT.get(`${apiUrl}/attendance/getAttandenceShfitList`, { params: { day: value } });
          if (response.status === 200 && response.data.data) {
            const fetchedData = response.data.data;
            setEmployees(fetchedData);
          }
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setEmployees([]);
      }
    };
    if (selected.value) {
      getListData(selected.value)
    }
  }, [selected]);
  const [showEmployees, setShowEmployees] = useState(true);
  return (
    <div className={`${styles.card} ${styles.cardbottom}`}>
      <div className={styles.header}>
        <span className={styles.title}>
          Employee Attendance Snapshot
          <FiInfo />
        </span>
        <div className={styles.mainBlock}>
          <div className={styles.recentBlock} ref={dropdownRef}>
            <div className={styles.recentLabel}>Recent Attendance</div>

            <button
              className={styles.dropdownTrigger}
              onClick={() => setDropdownOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <CalendarIcon size={13} />
              <span className={styles.dropdownTriggerText}>{selected.label}</span>
              {/* Chevron */}
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropdownOpen && (
              <ul className={styles.dropdownMenu}>
                {VIEW_OPTIONS.map((opt) => (
                  <li key={opt.value} className={styles.dropdownListItem}>
                    <button
                      type="button"
                      role="menuitemradio"
                      aria-checked={selected.value === opt.value}
                      className={`${styles.dropdownItem} ${selected.value === opt.value
                        ? styles.dropdownItemActive
                        : ""
                        }`}
                      onClick={() => handleSelect(opt)}
                    >
                      {opt.label}

                      <span className={styles.dropdownItemTick}>
                        {selected.value === opt.value && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className={styles.iconColltemplate} onClick={() => setShowEmployees(!showEmployees)}>
            {showEmployees ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </button>
        </div>
      </div>
      <div className={styles.mainBx}>
        {showEmployees && (
          employees?.length > 0 ? (
            employees.map((item) => (
              <div className={styles.card} key={item.employee?.empId}>
                <div className={styles.statsRow}>
                  <div className={styles.employeeInfo}>
                    <Avatar
                      name={item.employee?.name}
                      src={item.employee?.profilePicPath || ""}
                      size={"42"}
                      textSizeRatio={2}
                      round={true}
                      style={{
                        marginRight: '5px',
                        objectFit: 'cover' // Add object-fit
                      }}
                    />
                    <div>
                      <div className={styles.employeeName}>
                        {item.employee?.name}
                      </div>

                      <div className={styles.employeeRole}>
                        {item.employee?.role} &bull;{" "}
                        {item.employee?.empId}
                      </div>
                    </div>
                  </div>

                  <div className={styles.dividerV} />

                  <div className={styles.statBlock}>
                    <span className={styles.statLabel}>
                      Shift Timing
                    </span>

                    <span className={styles.statValue}>
                      {item?.shiftTiming}
                    </span>

                    <span className={styles.badgeWeekday}>
                      Weekday
                    </span>
                  </div>

                  <div className={styles.dividerV} />

                  <div className={styles.statBlock}>
                    <span className={styles.statLabel}>
                      Last Check-in
                    </span>

                    <span
                      className={`${styles.statValue} ${styles.large}`}
                    >
                      {convertUtcToLocalTime(item?.lastCheckIn, timeZone) ?? "--:--"}
                    </span>
                    {!item.lastCheckIn && (
                      <span className={styles.badgeMissing}>
                        Missing
                      </span>
                    )}
                  </div>

                  <div className={styles.dividerV} />

                  <div className={styles.statBlock}>
                    <span className={styles.statLabel}>
                      Last Check-out
                    </span>

                    <span
                      className={`${styles.statValue} ${styles.large}`}
                    >
                      {convertUtcToLocalTime(item?.lastCheckOut, timeZone) ?? "--:--"}
                    </span>

                    {!item.lastCheckOut && (
                      <span className={styles.badgeMissing}>
                        Missing
                      </span>
                    )}
                  </div>

                  <div className={styles.dividerV} />

                  <div className={styles.statBlock}>
                    <span className={styles.statLabel}>
                      Expected Hours
                    </span>

                    <span
                      className={`${styles.statValue} ${styles.large}`}
                    >
                      {item?.expectedHours}.00{" "}
                      <span className={styles.unit}>hrs</span>
                    </span>
                  </div>

                  <div className={styles.dividerV} />

                  <div className={styles.statBlock}>
                    <span className={styles.statLabel}>
                      Actual Hours
                    </span>

                    <span
                      className={`${styles.statValue} ${styles.large}`}
                    >
                      {item?.actualHours ?? "--:--"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noData}>
              No attendance records found
            </div>
          )
        )}
      </div>
    </div>
  );
}