import React, { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import Select from 'react-select';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbsdiscription';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import Head from 'next/head';
import { FaRegCheckCircle, FaTimes } from "react-icons/fa";
import { MdErrorOutline, MdPlaylistAddCheck } from "react-icons/md";
import Image from 'next/image';
export default function EmployeeTimeSheet() {

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [datevalue, setDatevalue] = useState("");
  const [dateoption, setDateOptions] = useState([]);
  const [sectionButton, setSectionButton] = useState([]);

  useEffect(() => {
    const fetchtimeOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const response = await axiosJWT.get(`${apiUrl}/timesheet/getAssignedPendingTaskList`)
        const optionsData = response.data.data.map((item) => ({
          label: item.timesheetDate,
          value: item.date
        }));

        setDateOptions(optionsData);

        // Set datevalue to the date of the first item in the array if the array is not empty
        if (response.data.data.length > 0) {
          setDatevalue(response.data.data[0].date);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchtimeOptions();
  }, []);

  const [filltercolums, setFilltercolums] = useState([]);

  const [fillterData, setFillterData] = useState([]);
  const [planedHours, setPlanedHours] = useState(0);
  const [submitHours, setSubmitHours] = useState(0);
  const [pendingHours, setPendingHours] = useState(0);
  const [leaveHours, setLeaveHours] = useState(0);
  const [holidayHours, setHolidayHours] = useState(0);
  const [invalidCells, setInvalidCells] = useState({});

  const transformedData = fillterData.map(item => item.map(subItem => subItem.value));

  const fetchtabledata = async (value) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const [fromDate, toDate] = value.split('@');
      const response = await axiosJWT.get(`${apiUrl}/timesheet/getPendingTask`, {
        params: {
          fromDate, // Short for fromDate: fromDate
          toDate    // Short for toDate: toDate
        }
      });
      if (response) {
        const data = response.data.data.data;
        let planned = 0;
        let submitted = 0;
        let pending = 0;
        let leave = 0;
        let holiday = 0;

        data.forEach(task => {
          const projectName = task.projectName;

          const isLeaveProject = projectName === 'Leave';
          const isHolidayProject = projectName === 'Holiday';
          const isNormalProject = !isLeaveProject && !isHolidayProject;
          if (isNormalProject) {
            planned += Number(task.totalEffortsAllocated) || 0;
          }

          task.taskAssignedDays.forEach(day => {
            const effort = Number(day.effort) || 0;
            if (isLeaveProject) {
              leave += effort;
              return;
            }
            if (isHolidayProject) {
              holiday += effort;
              return;
            }
            submitted += effort;
          });
        });

        // ---------- Pending ----------
        pending = planned - submitted;

        // ---------- Set state ----------
        setPlanedHours(planned);
        setSubmitHours(submitted);
        setPendingHours(pending);
        setLeaveHours(leave);
        setHolidayHours(holiday);
        const button = response.data.data.button;
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
          const totalEffort = task.taskAssignedDays.reduce((sum, day) => sum + Number.parseFloat(day.effort), 0);
          const remainingEffort = task.totalEffortsAllocated - totalEffort;

          // Format taskAssignedDays
          const formattedDays = task.taskAssignedDays.map(day => ({
            name: day.date,
            isFreezable: day.isFreezable,
            maxEffortsCurrentDay: day.maxEffortsCurrentDay,
            value: day.effort.toString(),
            type: "taskAssignedDays"
          }));

          return [
            { name: "idTaskProject", value: task.idTaskProject },
            { name: "idTaskSubmission", value: task.idTaskSubmission ? task.idTaskSubmission : "" },
            { name: "idSubTask", value: task.idSubTask ? task.idSubTask : "" },
            { name: "isSubTask", value: task.isSubTask ? task.isSubTask : false },
            { name: "startDate", value: task.startDate },
            { name: "endDate", value: task.endDate },
            { name: "sn", value: (index + 1).toString() },
            { name: "projectName", value: task.projectName },
            { name: "TaskName", value: task.taskName },
            { name: "percentageAllocation", value: task.taskPercentage },
            ...formattedDays,
            { name: "totalEffortsSubmitted", value: totalEffort.toString() },
            { name: "totalEffortsAllocated", value: task.totalEffortsAllocated.toString() },
            { name: "remainEffortsAllocated", value: remainingEffort.toString() }
          ];
        });

        const result = [];

        // Get all unique names
        const names = [...new Set(formattedData.flatMap(item => item.map(innerItem => innerItem.name)))];

        // Calculate the sum for each name
        names.forEach(name => {
          const sum = formattedData.flatMap(item => item.filter(innerItem => innerItem.name === name)).reduce((acc, current) => acc + parseFloat(current.value), 0);
          result.push({ name, value: sum.toString() });
        });

        const totalresult = names.map(name => {
          if (name === "idTaskProject" || name === "sn" || name === "projectName" || name === "TaskName" || name === "idTaskSubmission" || name === "startDate" || name === "endDate" || name === "idSubTask" || name === "isSubTask") {
            return { name, value: "Total" };
          } else {
            const sum = formattedData.flatMap(item => item.filter(innerItem => innerItem.name === name)).reduce((acc, current) => acc + parseFloat(current.value), 0);
            return { name, value: sum.toString() };
          }
        });
        const mergedResult = [...formattedData, totalresult];
        setFillterData(mergedResult)
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };
useEffect(() => {
  const fetchData = async () => {
    if (datevalue !== "") {
      await fetchtabledata(datevalue);
    }
  };

  fetchData();
}, [datevalue]);

  const dateonChange = (selectedOption) => {
    if (selectedOption) {
      setDatevalue(selectedOption.value);
    } else {
      setDatevalue(""); // Handle the case when the selected option is cleared
    }
  };
  const handleDataCancel = () => {
    fetchtabledata(datevalue);
  };
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

  const [errorsMessage, setErrorsMessage] = useState("");
  const handleDataSave = async (value) => {
    setErrorsMessage("")
    if ((value === 'submit' || value === 'draft') && !validateTimesheet()) {
      setErrorsMessage('Please fill all required effort fields before submitting.')
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

      if (response?.data) {
        const message = response.data.message;
        setErrorsMessage("")
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
        setTimeout(() => {
          globalThis.location.reload();
        }, 5000);
      }
    } catch (error) {
      const errormessage = 'Error connecting to the backend. Please try after Sometime.';
      toast.success(({ id }) => (
        <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
          <Image
            src="/assets/img/wrong.png"
            alt="icon"
            width={30}
            height={30}
            style={{ marginRight: '10px' }}
          />
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
    const idTaskSubmissions = [...new Set(transformedData.map(item => item.idTaskSubmission).filter(Boolean))];
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
        setTimeout(() => {
          globalThis.location.reload();
        }, 5000);
      }
    } catch (error) {
      const errormessage = 'Error connecting to the backend. Please try after Sometime.';
      toast.success(({ id }) => (
        <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
          <Image
            src="/assets/img/wrong.png"
            alt="icon"
            width={30}
            height={30}
            style={{ marginRight: '10px' }}
          />
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
        const effort = Number.parseFloatseFloat(cell.value);
        totalEffort += Number.isNaN(effort) ? 0 : effort;
      }

      if (cell.name === 'totalEffortsAllocated') {
        totalAllocationEffort = Number.parseFloatseFloat(cell.value) || 0;
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
        .reduce((acc, c) => acc + (Number.parseFloatseFloat(c.value) || 0), 0);

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
      display: ['idTaskProject', 'idTaskSubmission', 'startDate', 'endDate', 'idSubTask', 'isSubTask']
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
    <>
      <Head>
        <title>Log Work Hours | Oxytal</title>
        <meta name="description" content={"Submit your timesheet by logging daily work hours, project details, and task information for approval."} />
      </Head>
      <div className="main-wrapper">
        <div
          className="page-wrapper">
          <div className="content container-fluid">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col">
                    <Breadcrumbs
                      maintext={"Submit Work Hours"}
                      discription={"Enter your work hours, select project or task details, and submit your timesheet for approval."}
                      icon={<MdPlaylistAddCheck />}
                    />
                  </div>
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index">
                      <div className="center-part">
                        <div className="card-body">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                            <div className='timesheet-submit-view-header'>
                              <div className='timesheet-submit-head-box timesheet-head-plan-hours'>
                                <div className='head-overview-icon'>
                                  <Image
                                    src="/assets/img/plan-hours.png"
                                    alt="Plan hours"
                                    width={45}
                                    height={45}
                                  />
                                </div>
                                <div className='head-overview-text'>
                                  <h2 className='head-text-box'>Planned</h2>
                                  <p className='head-count-text'>{planedHours}<span>hrs</span></p>
                                </div>
                              </div>
                              <div className='timesheet-submit-head-box timesheet-head-submitted'>
                                <div className='head-overview-icon'>
                                  <Image
                                    src="/assets/img/submited-hours.png"
                                    alt="Submit hours"
                                    width={45}
                                    height={45}
                                  />
                                </div>
                                <div className='head-overview-text'>
                                  <h2 className='head-text-box'>Submitted</h2>
                                  <p className='head-count-text'>{submitHours}<span>hrs</span></p>
                                </div>
                              </div>
                              <div className='timesheet-submit-head-box timesheet-head-pending'>
                                <div className='head-overview-icon'>
                                  <Image
                                    src="/assets/img/pending-hours.png"
                                    alt="Pending hours"
                                    width={45}
                                    height={45}
                                  />
                                </div>
                                <div className='head-overview-text'>
                                  <h2 className='head-text-box'>Pending</h2>
                                  <p className="head-count-text">
                                    {pendingHours}
                                    <span>hrs</span>
                                  </p>
                                </div>
                              </div>
                              <div className='timesheet-submit-head-box timesheet-head-leave-taken'>
                                <div className='head-overview-icon'>
                                  <Image
                                    src="/assets/img/Leave-hours.png"
                                    alt="Leave hours"
                                    width={45}
                                    height={45}
                                  />
                                </div>
                                <div className='head-overview-text'>
                                  <h2 className='head-text-box'>Leave</h2>
                                  <p className="head-count-text">
                                    {leaveHours}
                                    <span>hrs</span>
                                  </p>
                                </div>
                              </div>
                              <div className='timesheet-submit-head-box timesheet-head-holiday'>
                                <div className='head-overview-icon'>
                                  <Image
                                    src="/assets/img/holiday-hours.png"
                                    alt="Holiday hours"
                                    width={45}
                                    height={45}
                                  />
                                </div>
                                <div className='head-overview-text'>
                                  <h2 className='head-text-box'>Holiday</h2>
                                  <p className="head-count-text">
                                    {holidayHours}
                                    <span>hrs</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">

                            <div className="center-part">
                              <div className="card-body -body skolrup-learning-card-body oxyem-time-managment">
                                <div className="row align-items-center">
                                  <div className="col-12 col-md-5 col-lg-3 col-xxl-2 p-0">
                                    <h6 className='mb-0 select-submitsheet-text'>
                                      <Image
                                        src="/assets/img/timesheet-schedule.png"
                                        alt="Timesheet schedule"
                                        width={30}
                                        height={30}
                                      /> Select Timesheet</h6>
                                  </div>
                                  <div className="col-12 col-md-6 col-lg-5 col-xxl-4">

                                    <Select
                                      value={dateoption.find(option => option.value === datevalue)}
                                      options={dateoption}
                                      onChange={dateonChange}
                                      isClearable={false}
                                      getOptionLabel={(option) => option.label}
                                      getOptionValue={(option) => option.value}
                                      className="oxyem-custom-dropdown"
                                      placeholder="Select"
                                      styles={{
                                        control: (provided, state) => ({
                                          ...provided,
                                          borderColor: state.isFocused ? 'var(--dropdownfocusbordercolor)' : provided.borderColor,
                                          boxShadow: state.isFocused ? 'var(--dropdownfocusboxshadow)' : provided.boxShadow,
                                          '&:hover': {
                                            borderColor: state.isFocused ? 'var(--dropdownfocusbordercolor)' : 'var(--dropdownhoverbordercolor)',
                                          },
                                          backgroundColor: state.isFocused ? 'var(--dropdownfocusbgcolor)' : provided.backgroundColor,
                                        }),
                                        indicatorSeparator: (provided) => ({
                                          ...provided,
                                          backgroundColor: 'var(--dropdownhoverbg)',
                                          fontWeight: 'var(--dropdownfontweight)',
                                        }),
                                        option: (provided, state) => {
                                          let backgroundColor = 'var(--dropdowntransparentcolor)';
                                          let color = 'var(--dropdowninheritcolor)';
                                          if (state.isSelected) {
                                            backgroundColor = 'var(--dropdownselectedbgcolor)';
                                            color = 'var(--dropdownselectedcolor)';
                                          } else if (state.isFocused) {
                                            backgroundColor = 'var(--dropdownhoverbg)';
                                          }
                                          return {
                                            ...provided,
                                            padding: 'var(--dropdownpadding)',
                                            cursor: 'var(--dropdowncursorstyle)',
                                            fontWeight: 'var(--dropdownfontweight)',
                                            backgroundColor,
                                            color,
                                            ':hover': {
                                              backgroundColor: 'var(--dropdownhoverbg)',
                                              color: 'var(--dropdownhovercolor)',
                                              fontWeight: 'var(--dropdownfontweight)',
                                            },
                                          };
                                        },
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12">
                              <div className="user-text oxyem-time-managment_table">
                                {errorsMessage && (
                                  <div className="alert alert-danger alert-dismissible fade show oxyem-submit-timesheet-error" role="alert">
                                    <MdErrorOutline /> {errorsMessage}
                                    <button
                                      type="button"
                                      className="btn-close"
                                      aria-label="Close"
                                      onClick={() => setErrorsMessage('')}
                                    />
                                  </div>
                                )}
                                <MUIDataTable
                                  title={""}
                                  data={transformedData}

                                  columns={columns}
                                  options={options}
                                />

                                <div className="text-end w-100 mt-3">
                                  {sectionButton.map((button, index) => {
                                    if (button.isEnabled) {
                                      if (button.type === "submit") {
                                        return <button  key={index} type="submit" className="btn btn btn-primary mx-2" onClick={() => handleDataSave("submit")}>{button.type}</button>;
                                      } else if (button.type === "save") {
                                        return <button  key={index} type="submit" className="btn btn-oxyem mx-2" onClick={() => handleDataSave("draft")}>{button.type}</button>;
                                      } else if (button.type === "cancel") {
                                        return <button  key={index} type="submit" className="btn btn-oxyem mx-2" onClick={handleDataCancel}>{button.type}</button>
                                      } else if (button.type === "recall") {
                                        return <button  key={index} type="submit" className="btn btn-oxyem btn-recall-btn mx-2" onClick={handleDatarecall}>{button.type}</button>
                                      } else {
                                        return <button  key={index} type="submit" className="btn btn-oxyem mx-2" onClick={handleDataCancel}>{button.type}</button>
                                      }
                                    }
                                    return null;
                                  })}

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
          </div>
        </div>
      </div>
      <Toaster
        position="top-right"
        reverseOrder={false}

      />
    </>
  );
}

