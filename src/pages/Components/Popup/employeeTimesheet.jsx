import React, { useState, useEffect, useRef } from "react";
import ReactModal from 'react-modal';
import Select from 'react-select';
import { MdClose } from "react-icons/md";
import Profile from '../commancomponents/profile';
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import MUIDataTable from "mui-datatables";
import { useRouter } from 'next/router'
import { axiosJWT } from '../../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes } from "react-icons/fa";
import { FaRegCheckCircle} from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
const customStyles = {
    content: {
        background: '#fff',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minHeight: '80vh',
        maxHeight: '90vh',
        minWidth:'80vw'
    },
};

export default function SelectUser({ isOpen, closeModal, isfor, timesheetId, closeAfterAction, section, sectionName }) {

    const router = useRouter();

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [showTable, SetShowtable] = useState(true);
    const [sectionButton, setSectionButton] = useState([]);
    const [idTimesheet, setidTimesheet] = useState("");
    const [filltercolums, setFilltercolums] = useState([]);
    const [invalidCells, setInvalidCells] = useState({});

    const [fillterData, setFillterData] = useState([]);

    const transformedData = fillterData.map(item => item.map(subItem => subItem.value));

    const fetchtabledata = async (value, isfor) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
			
			
            let response;

            if (section === "pendingApprove") {
                response = await axiosJWT.get(`${apiUrl}/timesheet/getApprovalViewDtls`, {
                    params: {
                        id: value,
                        isfor: isfor
                    }
                });
            } else if (section === "admintimesheet") {
                response = await axiosJWT.get(`${apiUrl}/timesheet/getApprovalViewDtls`, {
                    params: {
                        id: value
                    }
                });
            } else if (section === "timesubmition") {
                response = await axiosJWT.get(`${apiUrl}/timesheet/getPendingTask`, {
                    params: {
                        id: value
                    }
                });
            }
            if (response) {
                const data = response.data.data.data;
                if (data.length < 1) {
                    SetShowtable(false)
                } else (
                    SetShowtable(true)
                )

                const button = response.data.data.button ? response.data.data.button : [];
                setSectionButton(button)
                const tableHeaders = [
                    { name: "idTaskProject", label: "idTaskProject", isfilter: true, issort: false },
                    { name: "idTaskSubmission", label: "idTaskSubmission", isfilter: true, issort: false },
                    { name: "idSubTask", label: "idSubTask", isfilter: true, issort: false },
                    { name: "isSubTask", label: "isSubTask", isfilter: true, issort: false },
                    { name: "startDate", label: "startDate", isfilter: true, issort: false },
                    { name: "endDate", label: "endDate", isfilter: true, issort: false },
                    { name: "sn", label: "S.N", isfilter: true, issort: true },
                    { name: "projectName", label: "Project Name", isfilter: true, issort: false },
                    { name: "taskName", label: "Task Name", isfilter: false, issort: false },
                    { name: "percentageAllocation", label: "%", isfilter: false, issort: false },
                ];

                if (data.length > 0) {
                    const firstTask = data[0];

                    // Map `taskAssignedDays` from the first task
                    firstTask.taskAssignedDays.forEach(day => {
                        tableHeaders.push({
                            name: day.date,
                            label: day.dateWithWeekName,
                            isfilter: false,
                            issort: false
                        });
                    });
                }

                // Add remaining headers
                const additionalHeaders = [
                    { name: "totalEffortsSubmitted", label: "Total Effort", isfilter: true, issort: false },
                    { name: "totalEffortsAllocated", label: "Alloc Effort", isfilter: true, issort: false },
                    { name: "remainEffortsAllocated", label: "Pending Effort", isfilter: true, issort: false }
                ];

                tableHeaders.push(...additionalHeaders);
                setFilltercolums(tableHeaders);

                const formattedData = data.map((task, index) => {

                    // Calculate total effort
                    const totalEffort = task.taskAssignedDays.reduce((sum, day) => sum + parseFloat(day.effort), 0);
                    const remainingEffort = task.totalEffortsAllocated - totalEffort;

                    // Format taskAssignedDays
                    const formattedDays = task.taskAssignedDays.map(day => ({
                        name: day.date,
                        isFreezable: day.isFreezable,
                        maxEffortsCurrentDay: day.maxEffortsCurrentDay,
                        value: Number(day.effort).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), // Format with 2 decimal places
                        type: "taskAssignedDays"
                    }));

                    return [
                        { name: "idTaskProject", value: task.idTaskProject },
                        { name: "idTaskSubmission", value: task.idTaskSubmission ? task.idTaskSubmission : "" },
                        { name: "idSubTask", value: task.idSubTask ? task.idSubTask : "" },
                        { name: "isSubTask", value: task.isSubTask ? task.isSubTask :false },
                        { name: "startDate", value: task.startDate },
                        { name: "endDate", value: task.endDate },
                        { name: "sn", value: (index + 1).toString() },
                        { name: "projectName", value: task.projectName },
                        { name: "TaskName", value: task.taskName },
                        { name: "percentageAllocation", value: task.taskPercentage },
                        ...formattedDays,
                        { name: "totalEffortsSubmitted", value: totalEffort.toFixed(2) },
                        { name: "totalEffortsAllocated", value: task.totalEffortsAllocated.toFixed(2) },
                        { name: "remainEffortsAllocated", value: remainingEffort.toFixed(2) }
                    ];
                });

                const result = [];

                // Get all unique names
                const names = [...new Set(formattedData.flatMap(item => item.map(innerItem => innerItem.name)))];

                // Calculate the sum for each name
                names.forEach(name => {
                    const sum = formattedData.flatMap(item => item.filter(innerItem => innerItem.name === name)).reduce((acc, current) => acc + parseFloat(current.value), 0);
                    result.push({ name, value: sum.toFixed(2) });
                });

                const totalresult = names.map(name => {
                    if (name === "idTaskProject" || name === "sn" || name === "projectName" || name === "TaskName" || name === "idTaskSubmission" || name === "startDate" || name === "endDate" || name === "idSubTask" || name === "isSubTask") {
                        return { name, value: "Total" };
                    } else {
                        const sum = formattedData.flatMap(item => item.filter(innerItem => innerItem.name === name)).reduce((acc, current) => acc + parseFloat(current.value), 0);
                        return { name, value: sum.toFixed(2) };
                    }
                });
                const mergedResult = [...formattedData, totalresult];

                setFillterData(mergedResult)
            }
        } catch (error) {
			SetShowtable(false)
            console.error('Error fetching options:', error);
        }
    };


    useEffect(() => {
        if (timesheetId !== "") {
            fetchtabledata(timesheetId, isfor);
            setidTimesheet(timesheetId)
        }
    }, [timesheetId]);

    const handleDataCancel = () => {
        closeModal()
    };
    const handleDataApprove = async () => {

        const payload = {
            "status": "approved",
            "idTimesheet": [idTimesheet]
        }
        const message = "You have successfully <strong>Approved</strong> Timesheet!"
        const errormessage = 'Error connecting to the backend. Please try after Sometime.';
        try {
            const response = await axiosJWT.post(`${apiUrl}/timesheet/approval`, payload);
            // Handle the response if needed
            if (response) {
                toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                        <img src='/assets/img/proposal-icon.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                        <span dangerouslySetInnerHTML={{ __html: message }}></span>
                        <button
                            onClick={() => toast.dismiss(id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4caf50',
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
                        border: '1px solid #4caf50',
                        padding: '8px',
                        color: '#4caf50',
                    },
                });
				closeModal();
                router.push(`/timesheet/timesheetDashboard`);
                closeAfterAction();
            }

        } catch (error) {
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                    <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
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
            // Handle the error if any
            console.error("Error occurred:", error);
        }
    }
    const handleDataReject = async () => {

        const payload = {
            "status": "rejected",
			"rejectReason":"",
            "idTimesheet": [idTimesheet]
        }
        const message = "You have successfully <strong>Rejected</strong> Timesheet!"
        const errormessage = 'Error connecting to the backend. Please try after Sometime.';
        try {
            const response = await axiosJWT.post(`${apiUrl}/timesheet/approval`, payload);
            // Handle the response if needed
            if (response) {
                toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                        <img src='/assets/img/proposal-icon.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                        <span dangerouslySetInnerHTML={{ __html: message }}></span>
                        <button
                            onClick={() => toast.dismiss(id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4caf50',
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
                        border: '1px solid #4caf50',
                        padding: '8px',
                        color: '#4caf50',
                    },
                });
				closeModal();
                router.push(`/timesheet/timesheetDashboard`);
                closeAfterAction();
            }

        } catch (error) {
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                    <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
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
            // Handle the error if any
            console.error("Error occurred:", error);
        }
    }

    const validateTimesheet = () => {
  const errors = {};
  let hasError = false;

  // remove total row
  const rows = fillterData.slice(0, -1);

  rows.forEach((row, rowIndex) => {
    row.forEach(cell => {
      if (
        cell.type === 'taskAssignedDays' &&
        cell.isFreezable === false &&
        Number(cell.value) <= 0
      ) {
        const key = `${rowIndex}-${cell.name}`;
        errors[key] = true;
        hasError = true;
      }
    });
  });

  setInvalidCells(errors);
  return !hasError;
};
const [errorsMessage, setErrorMessage] = useState("");
    const handleDataSave = async (value) => {
        setErrorMessage("")
    if ((value === 'submit' || value === 'draft') && !validateTimesheet()) {
      setErrorMessage('Please fill all required effort fields before submitting.')
  return;
}
        fillterData.pop();

        const transformItem = (item) => {
            const taskAssignedDays = item.filter(entry => entry.type === 'taskAssignedDays').map(entry => ({
                date: entry.name,
                effort: entry.value
            }));

            const otherEntries = item.filter(entry => entry.type !== 'taskAssignedDays')
                .reduce((acc, entry) => {
                    acc[entry.name] = entry.value;
                    return acc;
                }, {});

            otherEntries.submittedEfforts = taskAssignedDays;
			otherEntries.status = value;
            return otherEntries;
        };

        const transformedData = fillterData.map(item => transformItem(item));


        try {
            const response = await axiosJWT.post(`${apiUrl}/timesheet/timesheetSubmit`, transformedData);

            if (response && response.data) {
                const message = response.data.message;
                setErrorMessage("")
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
                closeAfterAction();
            }
        } catch (error) {
            const errormessage = 'Error connecting to the backend. Please try after Sometime.';
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                    <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
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
            console.error('Error:', error);
        }
    };
    const handleDatarecall = async () => {
        fillterData.pop();

        const transformItem = (item) => {
            const taskAssignedDays = item.filter(entry => entry.type === 'taskAssignedDays').map(entry => ({
                date: entry.name,
                effort: entry.value
            }));

            const otherEntries = item.filter(entry => entry.type !== 'taskAssignedDays')
                .reduce((acc, entry) => {
                    acc[entry.name] = entry.value;
                    return acc;
                }, {});

            otherEntries.submittedEfforts = taskAssignedDays;
            return otherEntries;
        };

        const transformedData = fillterData.map(item => transformItem(item));
        const idTaskSubmissions = [...new Set(transformedData.map(item => item.idTaskSubmission).filter(id => id))];
        const payload = {
            "timesheetIds": idTaskSubmissions
        }
        try {
            const response = await axiosJWT.post(`${apiUrl}/timesheet/recall`, payload);

            if (response) {
                const message = 'You have successfully <strong>Recall </strong> Task!';
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
                closeAfterAction();
            }
        } catch (error) {
            const errormessage = 'Error connecting to the backend. Please try after Sometime.';
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                    <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
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
            console.error('Error:', error);
        }
    };

const handleDataChange = (rowIndex, field, value) => {
  const updatedData = fillterData.map(row =>
    row.map(cell => ({ ...cell }))
  );

  const rowToUpdate = updatedData[rowIndex];

  // Update changed cell
  rowToUpdate.forEach(cell => {
    if (cell.name === field) {
      cell.value = value;
    }
  });

  let totalEffort = 0;
  let totalAllocationEffort = 0;

  rowToUpdate.forEach(cell => {
    if (cell.type === 'taskAssignedDays') {
      const effort = parseFloat(cell.value);
      totalEffort += isNaN(effort) ? 0 : effort;
    }

    if (cell.name === 'totalEffortsAllocated') {
      totalAllocationEffort = parseFloat(cell.value) || 0;
    }
  });

  const format = num =>
    Number.isInteger(num) ? num.toString() : num.toFixed(2);

  rowToUpdate.forEach(cell => {
    if (cell.name === 'totalEffortsSubmitted') {
      cell.value = format(totalEffort);
    }

    if (cell.name === 'remainEffortsAllocated') {
      cell.value = format(totalAllocationEffort - totalEffort);
    }
  });

  // remove total row
  updatedData.pop();

  // recompute footer totals
  const names = [...new Set(updatedData.flatMap(r => r.map(c => c.name)))];

  const totalRow = names.map(name => {
    if (
      ["idTaskProject", "sn", "projectName", "TaskName", "idTaskSubmission", "startDate", "endDate"]
        .includes(name)
    ) {
      return { name, value: "Total" };
    }

    const sum = updatedData
      .flatMap(r => r.filter(c => c.name === name))
      .reduce((acc, c) => acc + (parseFloat(c.value) || 0), 0);

    return { name, value: format(sum) };
  });

  setFillterData([...updatedData, totalRow]);
};

const isZeroOrEmpty = (v) =>
  v === '' || v === null || v === undefined || Number(v) <= 0;

const columns = filltercolums.map(col => ({
  name: col.name,
  label: col.label,
  options: {
    filter: col.isfilter,
    sort: col.issort,
    display: ['idTaskProject', 'idTaskSubmission', 'startDate', 'endDate','idSubTask','isSubTask']
      .includes(col.name)
      ? 'excluded'
      : 'true',
    // ✅ ADD CLASS TO <th>
    setCellHeaderProps: () => {
      const baseClass = 'th-common-head';

      const specificClass =
        col.name === 'projectName'
          ? 'th-project-name-head'
          : col.name === 'taskName'
          ? 'th-taskName-name-head'
          : col.name === 'percentageAllocation'
          ? 'th-percentageAllocation-name-head'
          : col.name === 'sn'
          ? 'th-sn-name-head'
          : col.name === 'totalEffortsSubmitted'
          ? 'th-total-effort'
          : col.name === 'totalEffortsAllocated'
          ? 'th-alloc-effort'
          : col.name === 'remainEffortsAllocated'
          ? 'th-pending-effort'
          : '';

      return {
        className: `${baseClass} ${specificClass}`.trim()
      };
    },
    // ✅ ADD CLASS TO <td>
setCellProps: (value) => {
  let className = '';

  // ===== existing column classes =====
  if (col.name === 'totalEffortsSubmitted') {
    className = 'td-total-effort';
  }

  if (col.name === 'totalEffortsAllocated') {
    className = 'td-alloc-effort';
  }

  if (col.name === 'remainEffortsAllocated') {
    className = 'td-pending-effort';

    // ✅ negative highlight
    if (Number(value) < 0) {
      className += ' time_hightlight_test_minus';
    }
  }

  // ===== ✅ CENTER ONLY NUMERIC TD =====
  const isNumberValue =
    value !== null &&
    value !== '' &&
    !isNaN(Number(value));

  if (isNumberValue) {
    className += (className ? ' ' : '') + 'text-center-row';
  }

  return { className };
},


customBodyRender: (value, tableMeta, updateValue) => {
  const rowData = fillterData[tableMeta.rowIndex];
  const cell = rowData[tableMeta.columnIndex];

  const projectName =
    rowData.find(c => c.name === 'projectName')?.value;

  const isLeaveRow = projectName === 'Leave';
  const isHolidayRow = projectName === 'Holiday';

  const isDateCell = cell?.type === 'taskAssignedDays';
  const isEditable = isDateCell && cell.isFreezable === false;

  let className = 'form-control timesheet-emp';

  // ✅ LEAVE
  if (isLeaveRow && isDateCell && Number(value) > 0) {
    className += ' td-leave-project-value';
  }

  // ✅ HOLIDAY
  if (isHolidayRow && isDateCell && Number(value) > 0) {
    className += ' td-holiday-project-value';
  }

  // ✅ Submitted
  if (isEditable && Number(value) > 0) {
  className += ' td-submitted-project-value';
  }
  // ✅ Submitted
if (
    isEditable &&
    (
      value === null ||
      value === undefined ||
      value === '' ||
      Number(value) <= 0
    )
  ) {
    className += ' td-pending-project-value';
  }

  // ---------- Editable days ----------
if (isEditable) {
  const cellKey = `${tableMeta.rowIndex}-${cell.name}`;
  const isInvalid =
    invalidCells[cellKey] && isZeroOrEmpty(value);

  return (
    <input
      type="number"
      min={0}
      value={value ?? ''}
      className={`${className} ${isInvalid ? 'input-error-s-t' : ''}`}

      /* ✅ USE onClick instead of onFocus */
      onClick={() => {
        if (isZeroOrEmpty(value)) {
          setInvalidCells(prev => ({
            ...prev,
            [cellKey]: true
          }));
        }
      }}

      onChange={(e) => {
        const v = Math.max(0, Number(e.target.value) || 0);

        updateValue(v);
        handleDataChange(tableMeta.rowIndex, cell.name, v);

        /* ✅ CLEAR ERROR WHEN VALID */
        if (v > 0) {
          setInvalidCells(prev => {
            const copy = { ...prev };
            delete copy[cellKey];
            return copy;
          });
        }
      }}
    />
  );
}


  // ---------- Disabled days ----------
  if (isDateCell && cell.isFreezable === true) {
    return (
      <input
        className={className}
        value={value || ''}
        disabled
      />
    );
  }

  return value;
}


  }
}));

    const options = {
        responsive: "standard", 
        filterType: 'checkbox',
        search: false,
        filter: false,
        download: false,
        print: false,
        viewColumns: false,
        selectableRows: 'none', // Hide checkbox for selecting rows
        setRowProps: (row, dataIndex, rowIndex) => {

            const rowCount = transformedData.length;
            // Define your row coloring logic here
            let backgroundColor = '';
            let className = '';
            if (rowIndex % 2 === 0) {
                backgroundColor = 'var(--table-bg-row-color1)';
            } else {
                backgroundColor = 'var(--table-bg-row-color2)';
            }


            if (row[0] === 'Total' || row[1] === 'Total' || row[2] === 'Total' || row[3] === 'Total' || row[4] === 'Total' || row[5] === 'Total') { // Assuming 'weekendorDay' is at index 7
                className = 'custom_last_row'; // Assign className if condition met
            }
            return {
                style: {
                    backgroundColor
                },
                className
            };
        },
    };


    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <div className="modal-lg oxyem-timesheet-popup_w">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <h3 className="modal-title oxyem-timesheet_main_text" id="myLargeModalLabel" >{sectionName}</h3>
                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body">
                        <div className="user-text oxyem-time-managment_table">
                            {errorsMessage && (
                              <div className="alert alert-danger alert-dismissible fade show oxyem-submit-timesheet-error" role="alert">
                                <MdErrorOutline /> {errorsMessage}
                                <button
                                  type="button"
                                  className="btn-close"
                                  aria-label="Close"
                                  onClick={() => setErrorMessage('')}
                                />
                              </div>
                            )}
                            {showTable === true ? (
                                <>
                                    <MUIDataTable
                                        title={""}
                                        data={transformedData}
                                        columns={columns}
                                        options={options}
                                    />

                                    <div className="text-end w-100 oxyem-timesheet-popup-button">
                                        {sectionButton.map((button, index) => {
                                            if (button.isEnabled) {
                                                if (button.type === "submit") {
                                                    return <button type="submit" className="btn btn btn-primary mx-2" onClick={() => handleDataSave("submit")}>{button.type}</button>;
                                                } else if (button.type === "save") {
                                                    return <button type="submit" className="btn btn-oxyem mx-2" onClick={() => handleDataSave("draft")}>{button.type}</button>;
                                                } else if (button.type === "cancel") {
                                                    return <button type="submit" className="btn btn-oxyem mx-2" onClick={handleDataCancel}>{button.type}</button>
                                                } else if (button.type === "recall") {
                                                    return <button type="submit" className="btn btn-oxyem btn-recall-btn mx-2" onClick={handleDatarecall}>{button.type}</button>
                                                } else if (button.type === "Approve") {
                                                    return <button type="submit" className="btn btn-approve mx-2" onClick={handleDataApprove}>{button.type}</button>
                                                } else if (button.type === "Reject") {
                                                    return <button type="submit" className="btn btn-reject mx-2" onClick={handleDataReject}>{button.type}</button>
                                                } else {
                                                    return <button type="submit" className="btn btn-oxyem mx-2" onClick={handleDataCancel}>{button.type}</button>
                                                }
                                            }
                                            return null;
                                        })}

                                    </div>
                                </>
                            ) : (

                                <div className="alert alert-danger alert-dismissible fade show" role="alert"><b>Oops:</b> There was an error during the processing of this request. Please try again after some time.</div>

                            )}

                        </div>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
