import React, { useState, useMemo, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Profile from '../../../Components/commancomponents/profile';
import TopSectionHeading from "../../../Components/common/Heading/TopSectionHeading.jsx";
import { format } from "date-fns";
import { FcPositiveDynamic } from "react-icons/fc";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";


/* ================= CONSTANTS ================= */
const DAY_WIDTH = 55;
const WEEK_WIDTH = 140;
const MS_DAY = 86400000;

/* ================= DATE HELPERS ================= */
const toDate = (d) => new Date(d);

const daysBetween = (a, b) =>
    Math.floor((toDate(b) - toDate(a)) / MS_DAY) + 1;

const startOfWeek = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay()); // Sunday
    d.setHours(0, 0, 0, 0);
    return d;
};

const daysInWeek = (taskStart, taskEnd, weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const start = new Date(Math.max(taskStart, weekStart));
    const end = new Date(Math.min(taskEnd, weekEnd));

    if (start > end) return 0;
    return Math.floor((end - start) / MS_DAY) + 1;
};

const getMonthLabel = (d) =>
    d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

/* ================= COMPONENT ================= */
export default function GanttChart({ dataEntry, projectid }) {
    const [userdetails, setuserdetails] = useState([]);
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return isNaN(d) ? "" : format(d, "dd MMM yyyy");
    };

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

                const response = await axiosJWT.get(`${apiUrl}/project/getResource`, { params: { "idProject": projectid } })
                const optionsData = response.data.data.map((item) => ({ // Access response.data.data
                    userName: item.employeeName,
                    id: item.idEmployee,
                    imageUrl: item.profilePicPath ? item.profilePicPath : '',
                    designation: item.designation ? item.designation : '',
                }));
                setuserdetails(optionsData)
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };
        fetchOptions();
    }, [projectid]);
    const userMap = useMemo(() => {
        const map = new Map();
        userdetails.forEach(user => {
            map.set(user.id, user);
        });
        return map;
    }, [userdetails]);

    const [view, setView] = useState("day"); // day | week
const flattenTasks = (tasks = []) => {
    const result = [];

    tasks.forEach((task, taskIndex) => {
        const parentNo = taskIndex + 1;

        // Parent task
        result.push({
            ...task,
            srNo: `${parentNo}`,
            isSubTask: false,
            level: 0
        });

        // Subtasks
        if (task.subTasks && task.subTasks.length) {
            task.subTasks.forEach((sub, subIndex) => {
                result.push({
                    ...sub,
                    srNo: `${parentNo}.${subIndex + 1}`,
                    parentTask: task.taskName,
                    isSubTask: true,
                    level: 1
                });
            });
        }
    });

    return result;
};


const data = useMemo(() => {
    const flat = flattenTasks(dataEntry);

    return flat.map(item => ({
        srNo: item.srNo,              // ✅ ADD THIS
        task: item.taskName,
        start: item.startDate,
        end: item.endDate,
        status: item.status,
        isSubTask: item.isSubTask,
        level: item.level,
        parentTask: item.parentTask,
        totalUser: item?.assignedTo?.length || 0,
        assignedTo: (item.assignedTo || []).map(a => {
            const user = userMap.get(a.idEmployee);
            return {
                ...a,
                userName: user?.userName || "Unknown",
                designation: user?.designation || "",
                imageUrl: user?.imageUrl || ""
            };
        })
    }));
}, [dataEntry, userMap]);



    const projectStart = startOfWeek(
        new Date(Math.min(...data.map(d => toDate(d.start))))
    );
    const projectEnd = new Date(Math.max(...data.map(d => toDate(d.end))));

    const totalDays = daysBetween(projectStart, projectEnd);
    const totalWeeks =
        Math.floor((startOfWeek(projectEnd) - projectStart) / (7 * MS_DAY)) + 1;

    const columns = view === "day" ? totalDays : totalWeeks;
    const COL_WIDTH = view === "day" ? DAY_WIDTH : WEEK_WIDTH;

    /* ===== MONTH HEADER ===== */
    const monthMeta = useMemo(() => {
        if (view !== "week") return [];

        const res = [];
        let last = "";

        for (let i = 0; i < totalWeeks; i++) {
            const d = new Date(projectStart);
            d.setDate(d.getDate() + i * 7);

            const label = getMonthLabel(d);
            if (label !== last) {
                res.push({ label, span: 1 });
                last = label;
            } else {
                res[res.length - 1].span++;
            }
        }
        return res;
    }, [view, totalWeeks, projectStart]);
    const todayStr = new Date().toDateString();

    return (
        <>
            {/* TOGGLE */}

            <div className="gantt-chart-head">
                <TopSectionHeading
                    headingH1={"Gantt Chart"}
                    headingH2={""}
                    Icon={FcPositiveDynamic}
                />
                <div className="d-flex gantt-chart-head-btn">
                    <button className={`btn btn-info-detail-gantt ${view === "day" ? "active" : ""}`} onClick={() => setView("day")} >Day</button>
                    <button className={`btn btn-info-detail-gantt ${view === "week" ? "active" : ""}`} onClick={() => setView("week")} >Week</button>
                </div>
            
            <div className="gantt-root">
                <div className={`gantt-left ${view === "week" ? "week-left-head" : ""}`}>
                    <div className="gantt-left-header">
                        <div>S No</div><div>Task</div><div>Start</div><div>End</div>
                    </div>
                    {data.map((t, i) => (
                        <div key={i} className="gantt-left-row">
                            <div className={`sr-no ${t.isSubTask ? "sr-no-subtask" : "sr-no-parent"}`}>{t.srNo}</div>
                            <div
  className={`truncate ${t.isSubTask ? "subtask" : ""}`}
  style={{ paddingLeft: t.level === 0 ? 9 : 17, textAlign:"left" }}
  title={t.task}
>
  {t.isSubTask && <span className="subtask-dot"><MdOutlineSubdirectoryArrowRight/></span>}
  {t.task}
</div>

                            <div>{formatDate(t.start)}</div>
                            <div>{formatDate(t.end)}</div>
                            <Tooltip id={`left-task-${i}`} className="gantt-chart-tool">
                                <div>
                                    <strong>{t.task}</strong>
                                </div>
                            </Tooltip>
                        </div>
                    ))}
                </div>

                <div className={`gantt-right ${view === "week" ? "week-right-head" : ""}`}>
                    {view === "week" && (
                        <div className="month-header" style={{ gridTemplateColumns: `repeat(${columns}, ${COL_WIDTH}px)` }}>
                            {monthMeta.map((m, i) => (
                                <div key={i} style={{ gridColumn: `span ${m.span}` }}>{m.label}</div>
                            ))}
                        </div>
                    )}

                    <div className="week-header" style={{ gridTemplateColumns: `repeat(${columns}, ${COL_WIDTH}px)` }}>
                        {[...Array(columns)].map((_, i) => {
                            if (view === "day") {
                                const d = new Date(projectStart);
                                d.setDate(d.getDate() + i);

                                const dayNum = d.getDate();
                                const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
                                const isWeekend = [0, 6].includes(d.getDay());
                                const isToday = d.toDateString() === todayStr;

                                return (
                                    <div
                                        key={i}
                                        className={`header-day ${isWeekend ? "weekend-header" : ""
                                            } ${isToday ? "today-header" : ""}`}
                                    >
                                        <span className="date-num">{dayNum}</span>
                                        <span className="date-day">{dayName}</span>
                                    </div>
                                );
                            }

                            return (
                                <div key={i} className="header-week">
                                    {`Wk${String(i + 1).padStart(2, "0")}`}
                                </div>
                            );
                        })}

                    </div>

                    {data.map((t, i) => {
                        const ts = toDate(t.start);
                        const te = toDate(t.end);

                        let left = 0;
                        let width = 0;

                        if (view === "day") {
                            left = daysBetween(projectStart, ts) * DAY_WIDTH - DAY_WIDTH;
                            width = daysBetween(ts, te) * DAY_WIDTH;
                        } else {
                            const sw = Math.floor((startOfWeek(ts) - projectStart) / (7 * MS_DAY));
                            const ew = Math.floor((startOfWeek(te) - projectStart) / (7 * MS_DAY));

                            const ws = new Date(projectStart);
                            ws.setDate(ws.getDate() + sw * 7);
                            left = sw * WEEK_WIDTH +
                                (daysBetween(ws, ts) - 1) / 7 * WEEK_WIDTH;

                            for (let w = sw; w <= ew; w++) {
                                const wk = new Date(projectStart);
                                wk.setDate(wk.getDate() + w * 7);
                                width += (daysInWeek(ts, te, wk) / 7) * WEEK_WIDTH;
                            }
                        }

                        return (
                            <div key={i} className={`${view === "day" ? "gantt-row" : "gantt-month"}`} style={{ width: columns * COL_WIDTH }}>
                                <div className={`task-bar ${t.isSubTask ? "subtask-bar" : "parent-task-bar"}`} style={{ left, width }} data-tooltip-id={`task-${i}`}>
                                    {t.task}
                                </div>

                                <Tooltip
                                    id={`task-${i}`}
                                    className="gantt-chart-tool"
                                    place="top"
                                    positionStrategy="fixed"
                                >
                                    <div>
                                        <h3><strong>{t.task}</strong></h3>
                                        <p className="d-flex align-items-center">{formatDate(t.start)} - {formatDate(t.end)} <span className={`mx-2 oxyem-table-mark-${t.status}`}>{t.status}</span></p>
                                        <div className="assignees">
                                            <div className="assignees-heading">Allocated Users <b>({t.totalUser})</b></div>

                                            {t.assignedTo && t.assignedTo.length > 0 ? (
                                                t.assignedTo.map(emp => (
                                                    <div key={emp.idEmployee} className="assignee-row">
                                                        <div className="assignee-info">
                                                            <div className="assignee-profile">
                                                                <Profile name={emp.userName} imageurl={emp.imageUrl} size={"30"} />
                                                                <div className="assignee-details">
                                                                    <div className="assignee-name">{emp.userName}</div>
                                                                    <div className="assignee-role">{emp.designation}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="assignee-percent">
                                                                <b>{emp.taskPercentage}% Allocated</b>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No users assigned</p>
                                            )}
                                        </div>
                                    </div>
                                </Tooltip>
                            </div>
                        );
                    })}
                </div>
            </div>
            </div>
        </>
    );
}
