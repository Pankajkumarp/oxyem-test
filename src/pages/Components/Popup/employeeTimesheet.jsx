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
                    if (name === "idTaskProject" || name === "sn" || name === "projectName" || name === "TaskName" || name === "idTaskSubmission" || name === "startDate" || name === "endDate") {
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
    const handleDataSave = async (value) => {
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
        // Create a deep copy of fillterData to avoid mutating the original state directly
        const updatedData = fillterData.map(row => row.map(cell => ({ ...cell })));

        // Find the correct cell to update
        const rowToUpdate = updatedData[rowIndex];
        for (let i = 0; i < rowToUpdate.length; i++) {
            if (rowToUpdate[i].name === field) {
                rowToUpdate[i].value = value;
                break;
            }
        }

        // Calculate the total effort
        let totalEffort = 0;
        let totalAllocationEffort = 0;
        for (let i = 0; i < rowToUpdate.length; i++) {
            if (rowToUpdate[i].name.startsWith('2024-')) {
                // Check if the value is a valid number
                const effortValue = parseFloat(rowToUpdate[i].value);
                totalEffort += isNaN(effortValue) ? 0 : effortValue;
            } else if (rowToUpdate[i].name === 'totalEffortsAllocated') {
                // Get the total allocation effort value
                totalAllocationEffort = parseFloat(rowToUpdate[i].value);
            }
        }

        // Format the total Effort(hrs)
        const formatNumber = (num) => {
            if (isNaN(num)) return '0';
            const fixed = num.toFixed(2);
            return fixed.endsWith('.00') ? fixed.slice(0, -3) : fixed;
        };

        // Update the total Effort(hrs)
        for (let i = 0; i < rowToUpdate.length; i++) {
            if (rowToUpdate[i].name === 'totalEffortsSubmitted') {
                rowToUpdate[i].value = formatNumber(totalEffort);
            }
        }

        // Calculate and update the Remaining allocation Effort(hrs)
        for (let i = 0; i < rowToUpdate.length; i++) {
            if (rowToUpdate[i].name === 'remainEffortsAllocated') {
                const remainingEffort = totalAllocationEffort - totalEffort;
                rowToUpdate[i].value = formatNumber(remainingEffort);
            }
        }

        updatedData.pop();
        const result = [];

        // Get all unique names
        const names = [...new Set(updatedData.flatMap(item => item.map(innerItem => innerItem.name)))];

        function formatValue(value) {
            return value % 1 === 0 ? value.toString() : value.toFixed(2);
        }

        names.forEach(name => {
            const sum = updatedData.flatMap(item => item.filter(innerItem => innerItem.name === name))
                .reduce((acc, current) => acc + parseFloat(current.value), 0);
            result.push({ name, value: formatValue(sum) });
        });

        const totalresult = names.map(name => {
            if (name === "idTaskProject" || name === "sn" || name === "projectName" || name === "TaskName" || name === "idTaskSubmission" || name === "startDate" || name === "endDate") {
                return { name, value: "Total" };
            } else {
                const sum = updatedData.flatMap(item => item.filter(innerItem => innerItem.name === name))
                    .reduce((acc, current) => acc + parseFloat(current.value), 0);
                return { name, value: formatValue(sum) };
            }
        });
        const mergedResult = [...updatedData, totalresult];
        console.log("merge", mergedResult)
        // Update the state with the modified data
        setFillterData(mergedResult);
    };

    const columns = filltercolums.map(field => ({
        name: field.name,
        label: field.label,
        options: {
            filter: field.isfilter,
            sort: field.issort,
            display: ['idTaskProject', 'idTaskSubmission', 'startDate', 'endDate'].includes(field.name) ? 'excluded' : 'true',
            customHeadRender: (columnMeta) => {
                // Example: Apply custom class to a specific column header
                const customClass = field.name === 'sn'
                    ? 'timesheet-table-th-sr'
                    : (field.name === 'projectName' || field.name === 'taskName')
                        ? 'timesheet-table-th-other'
                        : 'timesheet-table-th-otherfield';
                return (
                    <th className={customClass}>
                        {columnMeta.label}
                    </th>
                );
            },
            customBodyRender: (value, tableMeta, updateValue) => {
                const rowData = fillterData[tableMeta.rowIndex];
                const field = rowData[tableMeta.columnIndex];
               
                if (field.isFreezable === false) {
                    return (
                        <>
                            <input
                                type='number'
                                className={`form-control timesheet-emp`}
                                value={value || ""}
                                min="0"
                                max="100"
                                placeholder={field.placeholder}
                                onChange={(e) => {
                                    // Ensure the entered value is not negative
                                    const newValue = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                                    updateValue(newValue);
                                    handleDataChange(tableMeta.rowIndex, field.name, newValue);
                                }}
                                onInput={(e) => {
                                    // Prevent entering a minus sign or any non-digit characters
                                    if (e.target.value < 0) {
                                        e.target.value = 0;
                                    }
                                }}
                                onKeyDown={(e) => {
                                    // Prevent entering a minus sign or 'e' for scientific notation
                                    if (e.key === '-' || e.key === 'e') {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </>
                    );
                } else if (field.isFreezable === true) {
                    return (
                        <>
                            <input
                                className={`form-control timesheet-emp`}
                                value={value || ""}
                                disabled={true}
                            />
                        </>
                    );
                } else if (field.name === "sn") {
                    return (
                        value
                    );
                } else {
                    return (
                        <div className={`${value < 0 ? 'time_hightlight_test_minus' : 'time_text_value'}`}>{value}</div>
                    );
                }
            }
        }
    }));


    const options = {
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
            console.log("row", row)
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
                                                    return <button type="submit" className="btn btn btn-primary mx-2" onClick={() => handleDataSave("draft")}>{button.type}</button>;
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
