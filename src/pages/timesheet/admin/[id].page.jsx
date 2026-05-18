import React, { useState, useEffect, useRef } from 'react';
import MUIDataTable from "mui-datatables";
import Select from 'react-select';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbsdiscription';
import AssignUserPopup from './add/AssignUserPopup';
import { FaPlus } from "react-icons/fa6";
import DateTable from '../../Components/common/Inputfiled/DateHolidayWeekendComponent';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes, FaRegCheckCircle } from "react-icons/fa";
import { useRouter } from 'next/router'
import Head from 'next/head';
import { fetchWithToken } from '../../Auth/fetchWithToken.jsx';
import { BsClipboardPlus } from "react-icons/bs";
import View from '../../Components/Popup/taskTemplates';
import GanttChart from './add/Gannt-chart.jsx';
import { assignDatesToTasks, createRowFromFields, reactSelectStyles } from "./add/dateUtils";
import { FaTrash } from "react-icons/fa";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { MdOutlineCheckBox } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu";
import { FaUserGroup } from "react-icons/fa6";
import { FcTimeline } from "react-icons/fc";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { countWorkingDays } from "../../Components/Hooks/countWorkingDays";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import DescriptionDrawer from './add/DescriptionDrawer';
const DynamicForm = dynamic(() => import('../../Components/CommanForm.jsx'), {
  ssr: false
});
import { format } from "date-fns";
export default function TableWithField({ userFormdata }) {  // Default to empty array if not provided
  const router = useRouter();
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d) ? "" : format(d, "dd MMM yyyy");
  };
  const [existingData, setexistingData] = useState([]);
  const [formvalue, setFormvalue] = useState(userFormdata);
  const showButton = "";
  const pagename = "timeManagement";
  const [fields, setfields] = useState(formvalue.section[1].Subsection[0].fields);
  useEffect(() => {
    setfields(formvalue.section[1].Subsection[0].fields)
  }, [formvalue]);
  const formbuttons = formvalue.section[1].buttons;
  const formfinalbuttons = formvalue.section[2].buttons;
  const [activeTab, setActiveTab] = useState(formvalue.section[0].SectionName);
  const [isTabclick, setisTabclick] = useState(true);
  const [tableSection, settableSection] = useState("hide");

  const handleTabClick = (tab) => {
    if (isTabclick === true) {
      setActiveTab(tab);
    }
  };
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  // Merge existing data with form fields
  const mergeDataWithFields = (fields, existingData) => {
    const existingDataMap = existingData.reduce((acc, item) => {
      acc[item.attribute] = item.attributevalue;
      return acc;
    }, {});

    return fields.reduce((acc, field) => {
      acc[field.name] = existingDataMap[field.name] || field.value || '';
      return acc;
    }, {});
  };




  const initialData = mergeDataWithFields(fields, existingData);
  const [data, setData] = useState([initialData]);
  const [stateOptions, setstateOptions] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);

  const [showtaskOptions, setShoowTaskOptions] = useState([]);


  const updateFieldsValue = (fields = [], valuesObj = {}) => {
    return fields.map(field => {
      if (Object.prototype.hasOwnProperty.call(valuesObj, field.name)) {
        return {
          ...field,
          value: valuesObj[field.name],
        };
      }
      return field;
    });
  };

  const [idGetProject, setidgetProject] = useState("");
  const [startDateGet, setStartDateGet] = useState("");
  const [endDateGet, setEndDateGet] = useState("");
  const [idAssignTaskId, setidAssignTaskId] = useState("");
  const [idProjectId, setidProjectId] = useState("");
  const [projectNameValue, setprojectNameValue] = useState("");
  const [timesheetDescription, settimesheetDescription] = useState("");
  const getProjectValue = async (id) => {
    try {
      const response = await axiosJWT.get(
        `${apiUrl}/timesheet/viewTaskInfo`,
        {
          params: { idAssignTask: id },
        }
      );

      if (!response?.data?.data) return;

      const apiResponse = response.data.data;
      setidAssignTaskId(apiResponse.idAssignTask)
      setidProjectId(apiResponse.idProject)
      settimesheetDescription(apiResponse.timesheetDescription)
      setprojectNameValue(apiResponse.projectName)
      const updatedFormValue = {
        ...formvalue,
        section: formvalue.section.map(section => {
          if (section.name === "planWork") {
            return {
              ...section,
              Subsection: section.Subsection.map(sub => {
                if (sub.name === "createTask") {
                  return {
                    ...sub,
                    fields: updateFieldsValue(sub.fields, {
                      idProject: apiResponse.idProject,
                      timesheetDescription: apiResponse.timesheetDescription,
                      startDate: apiResponse.startDate,
                      endDate: apiResponse.endDate,
                    }),
                  };
                }
                return sub;
              }),
            };
          }

          return section;
        }),
      };
      const normalizedTasks = (apiResponse.taskList || []).map(task => ({
        ...task,
        subTasks: task.subTaskList
          ? task.subTaskList.map(sub => ({
            ...sub,
            isSubTask: true
          }))
          : []
      }));

      setData(normalizedTasks);
      setidgetProject(apiResponse.idProject);
      setStartDateGet(apiResponse.startDate);
      setEndDateGet(apiResponse.endDate);
      setFormvalue(updatedFormValue);
      const autoExpanded = {};
      normalizedTasks.forEach((task, index) => {
        if (task.subTasks && task.subTasks.length > 0) {
          autoExpanded[index] = true;
        }
      });
      setExpandedRows(autoExpanded);

    } catch (error) {
      console.error("Error fetching project value", error);
    }
  };


  useEffect(() => {
    const { id } = router.query; // Extract the "id" parameter from the query object
    getProjectValue(id)

  }, [router.query.id]);

  useEffect(() => {
    const newTaskOptionsR = taskOptions.filter(option =>
      !data.some(task => task.taskCode === option.value)
    );
    setShoowTaskOptions(newTaskOptionsR)
  }, [data]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const response = await axiosJWT.get(`${apiUrl}/project/list`)

        const optionsData = response.data.data.map((item) => ({ // Access response.data.data
          label: item.projectName,
          value: item.idProject,
          projectCode: item.projectCode,
          startDate: item.startDate,
          endDate: item.endDate
        }));

        setstateOptions(optionsData);
      } catch (error) {
        console.error('Error fetching options:', error);

      }
    };
    const fetchTaskOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, { params: { "isFor": "taskcodelist" } })

        const optionsData = response.data.data.map((item) => ({ // Access response.data.data
          label: item.name,
          value: item.id
        }));

        setTaskOptions(optionsData);
      } catch (error) {
        console.error('Error fetching options:', error);

      }
    };
    fetchTaskOptions();
    fetchOptions();
  }, []);
  const [previousformvalue, setPreviousformvalue] = useState({});


  // Generate columns dynamically from form fields
  const columns = fields.map(field => ({
    name: field.name,
    label: field.label,
    options: {
      filter: field.isfilter,
      sort: field.issort,
      customBodyRender: (value, tableMeta, updateValue) => {
        const rowErrors = errors[tableMeta.rowIndex] || {};
        const error = rowErrors[field.name];
        if (field.type === 'Text') {
          return (
            <>
              <input
                className={`form-control ${field.name === 'taskName' ? 'oxyem-custom-class-input' : ''}`}
                value={value || ""}
                disabled={field.isDisabled || ""}
                placeholder={field.placeholder}
                onChange={(e) => {
                  updateValue(e.target.value);
                  handleDataChange(tableMeta.rowIndex, field.name, e.target.value);
                }}
              />
              {error && <div className="error">{error}</div>}
            </>

          );
        } else if (field.type === 'srNo') {
          return (
            <span>{tableMeta.rowIndex + 1}</span>
          )
        } else if (field.type === 'dateCalculator') {
          return (
            <span className='date-f'>{value}</span>
          )
        } else if (field.type === 'Number') {
          return (
            <>
              <input
                className="form-control form-number-value"
                type="number"
                value={value ?? ""}
                min={0}
                max={100}
                disabled={field.isDisabled}
                placeholder={field.placeholder}
                onChange={(e) => {
                  let newValue = e.target.value;

                  if (newValue === "") {
                    updateValue("");
                    handleDataChange(tableMeta.rowIndex, field.name, "");
                    return;
                  }

                  newValue = Number(newValue);
                  if (newValue < 0) return;
                  if (newValue > 100) return;

                  updateValue(newValue);
                  handleDataChange(tableMeta.rowIndex, field.name, newValue);
                }}
              />
              {error && <div className="error">{error}</div>}
            </>

          );
        } else if (field.type === 'Projectlist') {
          return (
            <>
              <Select
                value={stateOptions.find(option => option.value === value)}
                options={stateOptions}
                isDisabled={field.isDisabled || ""}
                onChange={(selectedOption) => {
                  updateValue(selectedOption.value);
                  handleDataChange(tableMeta.rowIndex, field.name, selectedOption.value);
                }}
                isClearable={true}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                className="oxyem-custom-dropdown"
                placeholder="Select"
                //closeMenuOnSelect={!isMulti} 
                //hideSelectedOptions={!isMulti}
                styles={reactSelectStyles}
              />
              {error && <div className="error">{error}</div>}
            </>
          );
        } else if (field.type === 'Tasklist') {
          return (
            <>
              <Select
                value={taskOptions.find(option => option.value === value)}
                options={showtaskOptions}
                isDisabled={field.isDisabled || ""}
                onChange={(selectedOption) => {
                  updateValue(selectedOption ? selectedOption.value : "");
                  handleDataChange(tableMeta.rowIndex, field.name, selectedOption ? selectedOption.value : "");
                }}
                isClearable={true}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                className="oxyem-custom-dropdown"
                placeholder="Select"
                maxMenuHeight={155}
                //closeMenuOnSelect={!isMulti} 
                //hideSelectedOptions={!isMulti}
                styles={reactSelectStyles}
              />
              {error && <div className="error">{error}</div>}
            </>
          );
        }
        else if (field.type === 'Textwithicon') {
          return (
            <div className='oxtem-table-custom-pic'>
              <AssignUserPopup
                value={value || []}
                projectid={previousformvalue.idProject || idGetProject}
                onChange={(val, meta) => {
                  updateValue(val);
                  handleDataChange(
                    tableMeta.rowIndex,
                    field.name,
                    val,
                    meta
                  );
                }}
              />
              {error && <div className="error">{error}</div>}
            </div>
          );
        } else if (field.type === 'Date') {
          return (
            <>
              <DateTable
                value={value || ""}
                placeholder={field.placeholder}
                otherAttributes={""}
                onChange={(value) => {
                  updateValue(value);
                  handleDataChange(tableMeta.rowIndex, field.name, value);

                }}
                projectStartDate={previousformvalue.startDate || startDateGet}
                projectEndDate={previousformvalue.endDate || endDateGet}
                isModule={"AssignTaskNew"}
              />
              {error && <div className="error">{error}</div>}
            </>
          );
        } else if (field.type === 'Status') {
          return (
            <>
              <span className={`oxyem-table-mark-${value}`}>{value}</span>
            </>
          );
        } else {
          return value;
        }
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
    selectableRows: 'none',
    setRowProps: (row, dataIndex) => {
      const hasError =
        errors[dataIndex] &&
        Object.values(errors[dataIndex]).some(Boolean);

      return {
        className: hasError ? 'error-row' : ''
      };
    }
  };


  const syncedPrimaryRef = useRef(new Set());
  const prevAssignedRef = useRef({})
  const buildEmployeeTasksPayload = (data, idEmployee) => {
    return data
      .filter(row => Array.isArray(row.assignedTo))
      .map(row => {
        const employee = row.assignedTo.find(
          u => u.idEmployee === idEmployee
        );

        if (!employee) return null;

        return {
          taskPercentage: Number(employee.taskPercentage), // ✅ INNER %
          idEmployee: idEmployee,
          startDate: row.startDate,
          endDate: row.endDate,
          idProject: previousformvalue.idProject
        };
      })
      .filter(Boolean); // remove null rows
  };

  const rowExclusionsRef = useRef({});

  const applyPrimaryUsersToAllRows = (data) => {
    const primaryUsersMap = new Map();

    data.forEach(row => {
      const users = Array.isArray(row.assignedTo) ? row.assignedTo : [];
      users.forEach(user => {
        if (user.isPrimary === true) {
          primaryUsersMap.set(user.idEmployee, user);
        }
      });
    });

    const primaryUsers = [...primaryUsersMap.values()];
    if (!primaryUsers.length) return data;

    return data.map((row, rowIndex) => {
      const assigned = Array.isArray(row.assignedTo) ? row.assignedTo : [];
      const merged = [...assigned];
      const excluded = rowExclusionsRef.current[rowIndex] || new Set();

      primaryUsers.forEach(primary => {
        if (
          !merged.some(u => u.idEmployee === primary.idEmployee) &&
          !excluded.has(primary.idEmployee)
        ) {
          merged.push({ ...primary, isPrimary: false });
        }
      });

      return { ...row, assignedTo: merged };
    });
  };



  const validateAllocation = async (tasks) => {
    try {
      const res = await axiosJWT.post(
        `${apiUrl}/timesheet/getAllocationPercentage`,
        { tasks }
      );

      const invalidUsers = res.data.data.filter(item => item.comment);

      return {
        isValid: invalidUsers.length === 0,
        invalidUsers
      };
    } catch (err) {
      return {
        isValid: false,
        invalidUsers: [],
        message: "Allocation check failed"
      };
    }
  };

  const globalErrorsRef = useRef([]);
  const isWeekend = (dateStr) => {
    const day = new Date(dateStr).getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const handleDataChange = async (rowIndex, field, value, meta = {}) => {
    let updatedData = [...data];

    /* =======================
       🔹 CLEAR FIELD ERROR ON CHANGE
    ======================== */
    setErrors(prev => {
      if (!prev[rowIndex]?.[field]) return prev;

      const updated = { ...prev };
      updated[rowIndex] = { ...updated[rowIndex] };
      delete updated[rowIndex][field];

      if (Object.keys(updated[rowIndex]).length === 0) {
        delete updated[rowIndex];
      }

      return updated;
    });

    /* =======================
       🗑️ ROW-ONLY DELETE
    ======================== */
    if (field === "assignedTo" && meta.deletedIds?.length) {
      const filtered = Array.isArray(value)
        ? value.filter(u => !meta.deletedIds.includes(u.idEmployee))
        : [];

      updatedData[rowIndex] = {
        ...updatedData[rowIndex],
        assignedTo: filtered
      };

      prevAssignedRef.current[rowIndex] = filtered;
      setData(updatedData);
      return;
    }

    /* =======================
       NORMAL FIELD UPDATE
    ======================== */
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [field]: value
    };

    /* =======================
       📅 WEEKEND VALIDATION (ADD + REMOVE)
    ======================== */
    if (field === "startDate" || field === "endDate") {
      if (isWeekend(value)) {
        setErrors(prev => ({
          ...prev,
          [rowIndex]: {
            ...prev[rowIndex],
            [field]: "Weekends are not allowed"
          }
        }));
        return;
      } else {
        // remove weekend error
        setErrors(prev => {
          if (!prev[rowIndex]?.[field]) return prev;

          const updated = { ...prev };
          delete updated[rowIndex][field];

          if (Object.keys(updated[rowIndex]).length === 0) {
            delete updated[rowIndex];
          }

          return updated;
        });
      }
    }

    /* =======================
       👥 ASSIGNED TO LOGIC
    ======================== */
    if (field === "assignedTo") {
      const safeValue = Array.isArray(value) ? value : [];
      const prevUsers = prevAssignedRef.current[rowIndex] || [];

      const newOrUpdatedUsers = safeValue.filter(u =>
        !prevUsers.some(p => p.idEmployee === u.idEmployee) ||
        prevUsers.find(p => p.idEmployee === u.idEmployee)?.taskPercentage !==
        u.taskPercentage
      );

      const allErrors = [];
      const validUsers = [];

      for (const user of newOrUpdatedUsers) {
        const tasksPayload = buildEmployeeTasksPayload(
          updatedData,
          user.idEmployee
        );

        const result = await validateAllocation(tasksPayload);

        if (!result.isValid) {
          const errorMsg = result.invalidUsers
            .map(u => u.comment)
            .join("\n");

          allErrors.push(
            `Row ${rowIndex + 1} (${user.employeeName}): ${errorMsg}`
          );
        } else {
          validUsers.push(user);
        }
      }

      const existingValidUsers = prevUsers.filter(
        p => !newOrUpdatedUsers.some(n => n.idEmployee === p.idEmployee)
      );

      updatedData[rowIndex].assignedTo = [
        ...existingValidUsers,
        ...validUsers
      ];

      /* ---------- ASSIGNED TO ERRORS ---------- */
      setErrors(prev => {
        const updated = { ...prev };

        if (allErrors.length) {
          updated[rowIndex] = {
            ...updated[rowIndex],
            assignedTo: "Allocation error"
          };
        } else {
          if (updated[rowIndex]) {
            delete updated[rowIndex].assignedTo;
            if (Object.keys(updated[rowIndex]).length === 0) {
              delete updated[rowIndex];
            }
          }
        }

        return updated;
      });

      globalErrorsRef.current = allErrors;
      setTimeout(() => {
        globalErrorsRef.current = [];
      }, 15000);

      prevAssignedRef.current[rowIndex] =
        updatedData[rowIndex].assignedTo;
    }

    /* =======================
       🔄 PRIMARY USER SYNC
    ======================== */
    const finalData = applyPrimaryUsersToAllRows(updatedData);
    setData(finalData);
  };

  const [totalCount, setTotalCount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [uniqeUser, setUniqeUser] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const calculateTotals = async () => {
      let percentageTotal = 0;
      let daysTotal = 0;
      let hasChange = false;

      const employeeSet = new Set();

      const updatedData = await Promise.all(
        data.map(async (item) => {
          percentageTotal += Number(item.taskPercentage) || 0;

          // collect employees
          if (Array.isArray(item.assignedTo)) {
            item.assignedTo.forEach(emp => {
              if (emp?.idEmployee) {
                employeeSet.add(emp.idEmployee);
              }
            });
          }

          if (item.startDate && item.endDate) {
            const days = await countWorkingDays(
              item.startDate,
              item.endDate
            );

            daysTotal += days;

            if (item.noOfDays !== days) {
              hasChange = true;
              return { ...item, noOfDays: days };
            }
          } else {
            daysTotal += Number(item.noOfDays) || 0;
          }

          return item;
        })
      );

      if (!isMounted) return;

      setTotalCount(percentageTotal);
      setTotalDays(daysTotal);
      setUniqeUser(employeeSet.size);

      if (hasChange) {
        setData(updatedData);
      }
    };

    calculateTotals();

    return () => {
      isMounted = false;
    };
  }, [data]);



  const addRow = () => {
    const newRow = mergeDataWithFields(fields, existingData);
    setData([...data, newRow]);
  };

  const [errors, setErrors] = useState({});
  const validateFields = (fields) => {
    const newErrors = {};

    data.forEach((row, rowIndex) => {
      fields.forEach(field => {
        field.validations?.forEach(validation => {
          if (
            validation.type === 'required' &&
            (!row[field.name] || row[field.name].length === 0)
          ) {
            if (!newErrors[rowIndex]) newErrors[rowIndex] = {};
            newErrors[rowIndex][field.name] = validation.message;
          }
        });
      });
    });

    return newErrors;
  };

  const [submitErrors, setsubmitErrors] = useState("");
  const handleNextSubmit = async () => {
    const fieldErrors = validateFields(fields);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setActiveTab("Review Timeline");
  }
  const normalizedData = data.map((row) => {
    console.log("fjgjg", data)
    const updatedRow = { ...row };

    const selectedOption = taskOptions.find(
      opt => opt.value === row.taskCode
    );

    const parentTaskName = selectedOption?.label || "";
    updatedRow.taskCode = row.taskCode;
    if (Array.isArray(row.subTasks)) {
      updatedRow.subTasks = row.subTasks.map((sub, index) => ({
        ...sub,
        taskCode: `${parentTaskName}-${String(index + 1).padStart(2, "0")}`
      }));
    }

    return updatedRow;
  });
  const formattedTaskList = data.map(task => {
    const { subTasks, subTaskList, ...rest } = task;

    return {
      ...rest,
      subTasks: Array.isArray(subTasks)
        ? subTasks.map(sub => {
          const { isSubTask, ...cleanSub } = sub;
          return cleanSub;
        })
        : []
    };
  });
  const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);

  const handleSubmit = async () => {
    const fieldErrors = validateFields(fields);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setActiveTab("Allocate Effort");
      return;
    }
    const payload = {
      "idProject": previousformvalue.idProject || idProjectId,
      "endDate": previousformvalue.endDate || endDateGet,
      "startDate": previousformvalue.startDate || startDateGet,
      "timesheetDescription": previousformvalue.timesheetDescription || timesheetDescription,
      "status": "open",
      "idAssignTask": idAssignTaskId,
      "taskList": formattedTaskList
    }
    setSubmitButtonLoading(true)
    try {
      const response = await axiosJWT.post(`${apiUrl}/timesheet/assignTask`, payload);

      if (response) {
        if (response.data.errorMessage) {
          setsubmitErrors(response.data.errorMessage);
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        } else {
          const message = 'You have successfully <strong>assigned </strong> Task!';
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
            router.push(`/timesheet/admin`);
          }, 3000);
        }
      }
    } catch (error) {
      setSubmitButtonLoading(false);
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
  const [DraftButtonLoading, setDraftButtonLoading] = useState(false);
  const handleDraftSubmit = async () => {
    const fieldErrors = validateFields(fields);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setActiveTab("Allocate Effort");
      return;
    }
    const payload = {
      "idProject": previousformvalue.idProject || idProjectId,
      "endDate": previousformvalue.endDate || endDateGet,
      "startDate": previousformvalue.startDate || startDateGet,
      "timesheetDescription": previousformvalue.timesheetDescription || timesheetDescription,
      "status": "draft",
      "idAssignTask": idAssignTaskId,
      "taskList": formattedTaskList
    }
    setDraftButtonLoading(true)
    try {
      const response = await axiosJWT.post(`${apiUrl}/timesheet/assignTask`, payload);

      if (response) {
        if (response.data.errorMessage) {
          setsubmitErrors(response.data.errorMessage);
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        } else {
          const message = 'You have successfully <strong>assigned </strong> Task!';
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
            router.push(`/timesheet/admin`);
          }, 3000);
        }
      }
    } catch (error) {
       setDraftButtonLoading(false)
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

  const handleChangeValue = (fieldName, value) => {
    const updatedArray = JSON.parse(JSON.stringify(formvalue)); // Create a deep copy of the original array

    for (let i = 0; i < updatedArray.section.length; i++) {
      const section = updatedArray.section[i];

      for (let j = 0; j < section.Subsection.length; j++) {
        const subsection = section.Subsection[j];

        for (let k = 0; k < subsection.fields.length; k++) {
          const field = subsection.fields[k];

          if (field.name === fieldName) {
            // Update the value of the field with matching fieldName
            updatedArray.section[i].Subsection[j].fields[k].value = value;
            break; // Stop further iteration once the field is found and updated
          }
        }
      }
    }
    if (
      activeTab === "Personal Information" &&
      fieldName === "experience"
    ) {
      // If the value of "experience" is false, remove the "Prior Work Experience" section
      if (!value) {
        const priorWorkExperienceIndex = updatedArray.section.findIndex(
          (section) => section.SectionName === "Prior Work Experience"
        );
        if (priorWorkExperienceIndex !== -1) {
          updatedArray.section.splice(priorWorkExperienceIndex, 1);
        }
      }
    }
    // Update your state or variable holding the array with the updatedArray
    setFormvalue(updatedArray);

  };


  const handleChangess = (currentIndex) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < content.section.length) {
      setActiveTab(content.section[nextIndex].SectionName);
    }
  };

  const [sectionerrors, setSectionErrors] = useState({});
  const submitformdata = (value) => {
    const matchedObject = stateOptions.find(item => item.value === value.idProject);

    if (!matchedObject) {
      setSectionErrors({ form: "Selected project not found." });
      return;
    }

    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);
    const projectStartDate = new Date(matchedObject.startDate);
    const projectEndDate = new Date(matchedObject.endDate);

    const errors = {};

    if (startDate < projectStartDate || startDate > projectEndDate) {
      errors.startDate = `Project Start date must be between ${matchedObject.startDate} and ${matchedObject.endDate}.`;
    }

    if (endDate < projectStartDate || endDate > projectEndDate) {
      errors.endDate = `Project End date must be between ${matchedObject.startDate} and ${matchedObject.endDate}.`;
    }

    if (startDate >= endDate) {
      errors.dateRange = 'Project Start date must be before end date.';
    }

    if (Object.keys(errors).length > 0) {
      setSectionErrors(errors);
      return;
    }

    const reciveData = {
      "idProject": value.idProject,
      "endDate": value.endDate,
      "startDate": value.startDate,
      "timesheetDescription": value.timesheetDescription
    }

    setPreviousformvalue(reciveData);

    const mergedArrayV22 = [
      { "attribute": "idProject", "attributevalue": value.idProject },
      { "attribute": "startDate", "attributevalue": value.startDate },
      { "attribute": "endDate", "attributevalue": value.endDate },
      { "attribute": "projectCode", "attributevalue": matchedObject.projectCode }
    ];

    //const initialData = mergeDataWithFields(fields, mergedArrayV22);
    //setData([initialData]);
    //setexistingData(mergedArrayV22);

    setActiveTab("Allocate Effort");
    setisTabclick(true);
    settableSection("show");
  };
  const removeError = (key) => {
    setSectionErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[key];
      return updatedErrors;
    });
  };
  const handleBackClick = async () => {
    router.push(`/timesheet/admin`);
  }


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTemplateConfig, settaskTemplateConfig] = useState([]);

  const fetchApiText = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "taskTemplateConfig" } });
      if (response?.data?.data?.section) {
        settaskTemplateConfig(response.data.data.section)
      }
    } catch (err) {
      ;
    }
  };
  useEffect(() => {
    fetchApiText();

  }, []);
  const openTemplatePopup = async () => {
    setIsModalOpen(true)
  }
  const closeTemplatePopup = async () => {
    setIsModalOpen(false)
  }
  const getSelectTemplate = (templateValue) => {
    const selectedTemplate = taskTemplateConfig.find(
      t => t.value === templateValue
    );
    if (!selectedTemplate) return;
    const baseRow = {
      idProject: previousformvalue.idProject || idGetProject,
      startDate: previousformvalue.startDate,
      endDate: previousformvalue.endDate,
      projectCode: existingData.find(e => e.attribute === "projectCode")?.attributevalue
    };
    const tasksWithDates = assignDatesToTasks(
      selectedTemplate.tasks,
      baseRow.startDate,
      baseRow.endDate
    );
    const generatedRows = tasksWithDates.map(task =>
      createRowFromFields(
        fields,
        {
          taskName: task.name,
          taskPercentage: task.weightage,
          startDate: task.startDate,
          endDate: task.endDate,
          taskCode: task.taskCode
        },
        baseRow
      )
    );
    setErrors({});
    setData(generatedRows);
    setIsModalOpen(false);
  };
  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const convertToGanttTasks = (data) => {
    return data
      .map((task, index) => {
        if (!task.startDate || !task.endDate) return null;

        const start = new Date(task.startDate);
        const end = new Date(task.endDate);

        if (!isValidDate(start) || !isValidDate(end)) return null;

        return {
          id: `task-${index}`,
          name: task.taskName || "Untitled Task",
          start,
          end,
          progress: 100 || 0,
          type: "task",
          status: "open",
          styles: {
            progressColor: "#004d95",          // progress fill
            progressSelectedColor: "#004d95",
          },

        };
      })
      .filter(Boolean);
  };


  const deleteColumn = {
    name: "delete",
    label: " ",
    options: {
      filter: false,
      sort: false,
      empty: true,
      customBodyRenderLite: (dataIndex) => {
        return (
          data.length > 1 && (
            <span className="text-danger cursor-pointer table-del-btn">
              <FaTrash
                className="text-danger cursor-pointer"
                title="Delete Row"
                onClick={() => removeRowFromTable(dataIndex)}
              />
            </span>
          )
        );
      },
    },
  };
  const columnsWithDelete = [...columns, deleteColumn];



  const [expandedRows, setExpandedRows] = useState({});
  const toggleRow = (rowIndex) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowIndex]: !prev[rowIndex]
    }));
  };

  const tasks = convertToGanttTasks(data);
  const removeRowFromTable = (rowIndex) => {
    setData((prev) => prev.filter((_, index) => index !== rowIndex));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[rowIndex];
      return updated;
    });
  };

  const isPlanWorkCompleted = () => {
    const section = formvalue.section.find(
      (sec) => sec.SectionName === "Plan Work"
    );

    if (!section) return false;

    for (const subsection of section.Subsection) {
      for (const field of subsection.fields) {
        const isRequired = field.validations?.some(
          (v) => v.type === "required"
        );

        if (isRequired && !field.value) {
          return false;
        }
      }
    }

    return true;
  };

  const isAllocateEffortCompleted = (data = []) => {
    if (!Array.isArray(data) || data.length === 0) return false;

    return data.every((row) =>
      row.taskName &&
      row.taskPercentage &&
      row.assignedTo &&
      row.taskCode &&
      row.startDate &&
      row.endDate
    );
  };

  const isTabCompleted = (sectionName) => {
    switch (sectionName) {
      case "Plan Work":
        return isPlanWorkCompleted();

      case "Allocate Effort":
        return isAllocateEffortCompleted(data);

      case "Review Timeline":
        return isAllocateEffortCompleted(data);

      default:
        return false;
    }
  };
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [descValue, setDescValue] = useState("");
  const openDescription = (rowIndex, subIndex = null, existingValue = "") => {
    setSelectedRow(rowIndex);
    setSelectedSub(subIndex);
    setDescValue(existingValue || "");
    setIsDescOpen(true);
  };
  const handleSaveDescription = (value) => {
    if (selectedSub !== null) {
      handleSubTaskChange(selectedRow, selectedSub, "description", value);
    } else {
      handleDataChange(selectedRow, "description", value);
    }
  };
  const remaining = Math.max(0, 100 - totalCount);

  const renderCell = (
    field,
    row,
    rowIndex,
    subIndex = null,
    isSubTask = false
  ) => {

    const value = row[field.name];

    switch (field.type) {
      case "srNo":
        return (
          <span className="srNo-form">
            {isSubTask
              ? `${rowIndex + 1}.${subIndex + 1}`
              : rowIndex + 1}
          </span>
        );
      case "Status":
        return (
          null
        );
      case "description":
        return (
          <div className="description-cell d-flex align-items-center gap-2 justify-content-center">
            <span
              className="cursor-pointer text-primary d-flex align-items-center gap-1" style={{ cursor: 'pointer' }}
              onClick={() =>
                openDescription(
                  rowIndex,
                  isSubTask ? subIndex : null,
                  value
                )
              }
            >
              {value ? (
                <FiEdit size={20} color="#004d95" className="me-3" />
              ) : (
                <FiPlusCircle size={24} color="#004d95" className="me-3" />
              )}
            </span>
          </div>
        );
      case "Text":
        return (
          <input
            className={`form-control input-form-field ${isSubTask ? "subtask-input" : ""}`}
            value={row[field.name] || ""}
            placeholder={isSubTask ? "Subtask Name" : "Task Name"}
            onChange={e => {
              if (isSubTask) {
                handleSubTaskChange(rowIndex, subIndex, field.name, e.target.value);
              } else {
                handleDataChange(rowIndex, field.name, e.target.value);
              }
            }}
          />
        );
      case "Number":
        return (
          <input
            type="number"
            className="form-control number-form-field"
            value={value ?? ""}
            min={0}
            max={100}
            onChange={(e) => {
              if (isSubTask) {
                let newValue = e.target.value;
                if (newValue === "") {
                  handleSubTaskChange(rowIndex, subIndex, field.name, "");
                  return;
                }
                newValue = Number(newValue);
                if (newValue < 0) return;
                if (newValue > 100) return;
                handleSubTaskChange(rowIndex, subIndex, field.name, newValue);
              } else {
                let newValue = e.target.value;
                if (newValue === "") {
                  handleDataChange(rowIndex, field.name, "");
                  return;
                }
                newValue = Number(newValue);
                if (newValue < 0) return;
                if (newValue > 100) return;
                handleDataChange(rowIndex, field.name, newValue);
              }

            }}
          />
        );

      case "Tasklist":
        if (isSubTask) {
          const parentTaskCode = data[rowIndex]?.taskCode;
          const selected = taskOptions.find(o => o.value === parentTaskCode);

          const displayValue = `${selected?.label || parentTaskCode || ""}-${String(subIndex + 1).padStart(2, "0")}`;

          return <span className="value-form">{displayValue}</span>;
        }
        return (
          <Select
            value={taskOptions.find(o => o.value === value)}
            options={showtaskOptions}
            onChange={(opt) => {
              const newValue = opt?.value || "";

              if (isSubTask) {
                handleSubTaskChange(rowIndex, subIndex, field.name, newValue);
              } else {
                handleDataChange(rowIndex, field.name, newValue);
              }
            }}
            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
            styles={{
              ...reactSelectStyles,
              menuPortal: base => ({ ...base, zIndex: 9999 })
            }}
          />
        );

      case "Date":
        return (
          <DateTable
            value={value || ""}
            onChange={(val) => {
              if (isSubTask) {
                handleSubTaskChange(rowIndex, subIndex, field.name, val);
              } else {
                handleDataChange(rowIndex, field.name, val);
              }
            }}
            projectStartDate={
              isSubTask
                ? data[rowIndex]?.startDate
                : previousformvalue.startDate
            }
            projectEndDate={
              isSubTask
                ? data[rowIndex]?.endDate
                : previousformvalue.endDate
            }
            otherAttributes=""
            isModule={"AssignTaskNew"}
          />
        );

      case "Textwithicon":
        return (
          <AssignUserPopup
            value={value || []}
            projectid={previousformvalue.idProject || idGetProject}
            isFor={isSubTask ? "hide":""}
            onChange={(val, meta) => {
              if (isSubTask) {
                handleSubTaskChange(rowIndex, subIndex, field.name, val, meta);
              } else {
                handleDataChange(rowIndex, field.name, val, meta);
              }
            }}
          />
        );

      default:
        return (<span className='value-form'>{value}</span>);
    }
  };


  const addSubTask = (parentIndex) => {
    setExpandedRows(prev => ({ ...prev, [parentIndex]: true }));
    setData(prev =>
      prev.map((row, index) => {
        if (index !== parentIndex) return row;

        const newSubTask = {
          taskName: "",
          taskPercentage: "",
          startDate: row.startDate || "",
          endDate: row.endDate || "",
          assignedTo: [],
          noOfDays: "",
          taskCode: row.taskCode,
          isSubTask: true
        };

        return {
          ...row,
          subTasks: [...(row.subTasks || []), newSubTask]
        };
      })
    );
  };


  const removeSubTask = (parentIndex, subIndex) => {
    setData(prev =>
      prev.map((row, i) => {
        if (i !== parentIndex) return row;

        return {
          ...row,
          subTasks: row.subTasks.filter((_, s) => s !== subIndex)
        };
      })
    );
  };
  const handleSubTaskChange = async (parentIndex, subIndex, field, value, meta = {}) => {
    setData(prev =>
      prev.map((row, i) => {
        if (i !== parentIndex) return row;

        let updatedSubTasks = row.subTasks.map((st, s) =>
          s === subIndex ? { ...st, [field]: value } : st
        );

        let updatedRow = { ...row, subTasks: updatedSubTasks };

        /* ================================
           🔥 NEW LOGIC: Sync subtask users to parent
        ================================= */

        if (field === "assignedTo") {
          const subUsers = Array.isArray(value) ? value : [];
          const parentUsers = Array.isArray(row.assignedTo)
            ? [...row.assignedTo]
            : [];

          subUsers.forEach(subUser => {
            const alreadyExists = parentUsers.some(
              parentUser => parentUser.idEmployee === subUser.idEmployee
            );

            if (!alreadyExists) {
              parentUsers.push({
                ...subUser,
                isPrimary: false
              });
            }
          });

          updatedRow.assignedTo = parentUsers;
        }

        return updatedRow;
      })
    );

    /* ================================
       🔹 Clear subtask error (your existing logic)
    ================================= */

    setErrors(prev => {
      if (!prev[parentIndex]?.subTasks?.[subIndex]?.[field]) {
        return prev;
      }

      const updated = { ...prev };
      updated[parentIndex] = { ...updated[parentIndex] };
      updated[parentIndex].subTasks = {
        ...updated[parentIndex].subTasks
      };

      delete updated[parentIndex].subTasks[subIndex][field];

      if (Object.keys(updated[parentIndex].subTasks[subIndex]).length === 0) {
        delete updated[parentIndex].subTasks[subIndex];
      }

      if (Object.keys(updated[parentIndex].subTasks).length === 0) {
        delete updated[parentIndex].subTasks;
      }

      if (Object.keys(updated[parentIndex]).length === 0) {
        delete updated[parentIndex];
      }

      return updated;
    });
  };

  useEffect(() => {
    if (!errors || Object.keys(errors).length === 0) return;

    setExpandedRows(prev => {
      const updated = { ...prev };

      Object.keys(errors).forEach(rowIndex => {
        const rowErrors = errors[rowIndex];

        // Parent row error
        if (
          rowErrors &&
          Object.keys(rowErrors).some(
            key => key !== "subTasks"
          )
        ) {
          updated[rowIndex] = true;
        }

        // Subtask error
        if (rowErrors?.subTasks) {
          updated[rowIndex] = true;
        }
      });

      return updated;
    });
  }, [errors]);
  return (
    <>
      <DescriptionDrawer
        isOpen={isDescOpen}
        closeModal={() => setIsDescOpen(false)}
        initialValue={descValue}
        onSave={handleSaveDescription}
      />
      <Head>
        <title>Plan the Work | Oxytal</title>
        <meta name="description" content={"Plan work, allocate capacity, and control effort tracking from the start."} />
      </Head>
      <View isOpen={isModalOpen} closeModal={closeTemplatePopup} templateArray={taskTemplateConfig} getSelectTemplate={getSelectTemplate} />
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col">
                    <Breadcrumbs
                      maintext={"Plan the Work"}
                      discription={"Plan work, allocate capacity, and control effort tracking from the start."}
                      icon={<BsClipboardPlus />}
                    />
                  </div>
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border timesheet-add-task-page" id="sk-create-page">

                            <div className="center-part">
                              <div className="card-body -body skolrup-learning-card-body oxyem-time-managment">
                                <div className="row">
                                  <div className="col-12">
                                    <div className="user-text skolrup-m-user-text">

                                    </div>
                                  </div>
                                </div>
                                {Array.isArray(formvalue.section) ? (
                                  <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab time-tabs-sheet">
                                    {formvalue.section.map((section, index) => (
                                      section.isVisible && (
                                        <li key={index} className="nav-item">
                                          <a
                                            className={`nav-link ${activeTab === section.SectionName ? 'active' : ''}`}
                                            onClick={() => handleTabClick(section.SectionName)}
                                          >
                                            <div className="skolrup-profile-tab-link">
                                              {isTabCompleted(section.SectionName) ? (
                                                <span className='tab-s-c'><MdOutlineCheckBox /></span>
                                              ) : (
                                                <MdOutlineCheckBoxOutlineBlank />
                                              )}
                                              {section.SectionName}
                                            </div>
                                          </a>
                                        </li>
                                      )
                                    ))}
                                  </ul>
                                ) : (null)}
                                <div className="tab-content">
                                  {submitErrors && (
                                    <div className="alert alert-danger mb-3 mt-4">
                                      {submitErrors}
                                    </div>
                                  )}
                                  {formvalue.section.map((section, index) => (
                                    activeTab === section.SectionName && (
                                      <div key={index} className={`tab-pane ${activeTab === section.SectionName ? 'active' : ''}`}>

                                        {section.name === "allocateEffort" ? (
                                          <>
                                            <div className='oxyem-time-mang-format timesheet-assign-task-table'>
                                              <div className="row">
                                                <div className="col-md-8">
                                                  {section.Subsection.map((subsection) => (<>
                                                    {subsection.SubsectionName ? (
                                                      <h5 className='mb-0 top-heading-text-tab'>{subsection.SubsectionName}</h5>
                                                    ) : null}
                                                  </>))}
                                                  <p className='gantt-section-sub'>Break the Task into structured phases to track effort, progress and accountability</p>
                                                </div>
                                                <div className="col-md-4 text-end">
                                                  <div className='text-top-time-end'>
                                                    <span className='btn  btn-info-detail me-3' onClick={openTemplatePopup}>Select Template</span>
                                                    <span className='btn btn-primary breadcrum-btn' onClick={addRow}><FaPlus /></span>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-12 display-top-time">
                                                <div className='total-time-summary-all'>
                                                  {totalCount > 0 ? (
                                                    <div className='total-time-summary-effort'>
                                                      <div className='sub-summ'>Effort Allocation Summary</div>
                                                      <p>you have used <b>{totalCount}%</b> of your total effort.</p>
                                                      <div className="effort-progress">
                                                        <div
                                                          className="effort-progress-filled"
                                                          style={{ width: `${totalCount}%` }}
                                                        />
                                                      </div>
                                                      <p><b>{remaining}%</b> effort remaining out of 100%.</p>
                                                    </div>
                                                  ) : null}
                                                  <div className='total-time-summary-days'>
                                                    <div className='sub-summ-d-icon'>
                                                      <LuCalendarDays />
                                                    </div>
                                                    <div className='sub-summ-d-main'>
                                                      <p><b>Total Assigned Days</b></p>
                                                      <p className='sub-summ-d'>  Total <b>{totalDays} days</b> allocated to this task </p>
                                                    </div>
                                                  </div>
                                                  <div className='total-time-summary-days'>
                                                    <div className='sub-summ-d-icon'>
                                                      <FaUserGroup />
                                                    </div>
                                                    <div className='sub-summ-d-main'>
                                                      <p><b>Total Assigned Users</b></p>
                                                      <p className='sub-summ-d'>  {uniqeUser > 0 ? (<><b>{uniqeUser} users</b> assigned to this task</>) : (<>Task currently has no assignees</>)} </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>

                                              {globalErrorsRef.current.length > 0 && (
                                                <div className="alert alert-danger mb-3 mt-4">
                                                  {globalErrorsRef.current.map((err, idx) => (
                                                    <div key={idx} className='c-error-task'>{err}</div>
                                                  ))}
                                                </div>
                                              )}

                                              <div class="table-responsive table-responsive-timesheet-form">
                                                <table className="table oxyem-custom-table">
                                                  <thead>
                                                    <tr>
                                                      {fields
                                                        .filter(field => field.name !== "status")
                                                        .map(field => (
                                                          <th
                                                            key={field.name}
                                                            className={`oxyem-th-table-${field.name}`}
                                                          >
                                                            {field.label}
                                                          </th>
                                                        ))}
                                                      <th>Action</th>
                                                    </tr>
                                                  </thead>


                                                  <tbody>
                                                    {data.map((row, rowIndex) => (
                                                      <React.Fragment key={rowIndex}>
                                                        {/* ================== PARENT ROW ================== */}
                                                        <tr
                                                          className={
                                                            errors[rowIndex] &&
                                                              Object.values(errors[rowIndex]).some(Boolean)
                                                              ? "error-row"
                                                              : ""
                                                          }
                                                        >
                                                          {fields
                                                            .filter(field => field.name !== "status")
                                                            .map(field => (
                                                              <td key={field.name}>
                                                                {renderCell(field, row, rowIndex)}
                                                                {errors[rowIndex]?.[field.name] && (
                                                                  <div className="error">
                                                                    {errors[rowIndex][field.name]}
                                                                  </div>
                                                                )}
                                                              </td>
                                                            ))}

                                                          <td className="text-nowrap table-btn-all-add">
                                                            <span
                                                              className="btn-subtask-add"
                                                              onClick={() => addSubTask(rowIndex)}
                                                            >
                                                              + Sub-Task
                                                            </span>

                                                            {data.length > 1 && (
                                                              <FaTrash
                                                                className="text-danger cursor-pointer"
                                                                onClick={() => removeRowFromTable(rowIndex)}
                                                              />
                                                            )}
                                                            {row.subTasks?.length > 0 && (
                                                              <span onClick={() => toggleRow(rowIndex)} className="mx-2 cursor-pointer">
                                                                {expandedRows[rowIndex] ? <FaChevronDown /> : <FaChevronUp />}
                                                              </span>
                                                            )}
                                                          </td>
                                                        </tr>

                                                        {/* ================== SUBTASK ROWS ================== */}
                                                        {expandedRows[rowIndex] &&
                                                          row.subTasks?.map((subTask, subIndex) => (
                                                            <tr
                                                              key={`sub-${rowIndex}-${subIndex}`}
                                                              className={
                                                                errors[rowIndex]?.subTasks?.[subIndex] &&
                                                                  Object.values(errors[rowIndex].subTasks[subIndex]).some(Boolean)
                                                                  ? `subtask-row subtask-${subIndex} error-row`
                                                                  : `subtask-row subtask-${subIndex}`
                                                              }
                                                            >
                                                              {fields
                                                                .filter(field => field.name !== "status")
                                                                .map(field => (
                                                                  <td key={field.name}>
                                                                    {renderCell(
                                                                      field,
                                                                      subTask,
                                                                      rowIndex,
                                                                      subIndex,
                                                                      true
                                                                    )}
                                                                    {errors[rowIndex]?.subTasks?.[subIndex]?.[field.name] && (
                                                                      <div className="error">
                                                                        {errors[rowIndex].subTasks[subIndex][field.name]}
                                                                      </div>
                                                                    )}
                                                                  </td>
                                                                ))}

                                                              <td className="text-nowrap table-btn-all-add td-sub-btn">
                                                                <FaTrash
                                                                  className="text-danger cursor-pointer"
                                                                  onClick={() =>
                                                                    removeSubTask(rowIndex, subIndex)
                                                                  }
                                                                />
                                                              </td>
                                                            </tr>
                                                          ))}

                                                      </React.Fragment>
                                                    ))}
                                                  </tbody>

                                                </table>
                                              </div>
                                              <div className="justify-content-end d-flex w-100 mt-4">
                                                {formbuttons.map((btn, index) => (
                                                  <>
                                                    {btn.buttontype === "submit" ? (
                                                      <button className={`btn ${btn.class}`} key={index} onClick={handleNextSubmit}>{btn.label}</button>
                                                    ) : (
                                                      <>
                                                        {btn.buttontype === "Cancel" ? (
                                                          <button className={`btn ${btn.class}`} key={index} onClick={handleBackClick}>{btn.label}</button>
                                                        ) : (
                                                          <button className={`btn ${btn.class}`} key={index} onClick={handleDraftSubmit} >{btn.label}</button>
                                                        )}
                                                      </>
                                                    )}
                                                  </>
                                                ))}
                                              </div>
                                            </div>
                                          </>
                                        ) : section.name === "reviewTimeline" ? (
                                          <>
                                            {tasks.length === 0 ? (
                                              <>
                                                <p>No valid tasks to display</p>
                                              </>
                                            ) : (
                                              <div className="timesheet-gantt">
                                                {section.Subsection.map((subsection) => (<>
                                                  {subsection.SubsectionName ? (
                                                    <h5 className='mb-4 top-heading-text-tab'>{subsection.SubsectionName}</h5>
                                                  ) : null}
                                                  <p className='gantt-section-sub'>Visualize the task phases in timeline to ensure balanced capacity and on-time delivery</p>
                                                </>))}
                                                <div className="col-12 display-top-time">
                                                  <div className='total-time-summary-all gantt-chart-top-box'>
                                                    {totalCount > 0 ? (
                                                      <div className='total-time-summary-effort'>
                                                        <div className='sub-summ'>Effort Allocation Summary</div>
                                                        <p>you have used <b>{totalCount}%</b> of your total effort.</p>

                                                        {remaining === 0 ? (null) : (<p><b>{remaining}%</b> effort remaining out of <b>100%</b>.</p>)}
                                                      </div>
                                                    ) : null}
                                                    <div className='total-time-summary-days'>
                                                      <div className='sub-summ-d-icon'>
                                                        <FcTimeline />
                                                      </div>
                                                      <div className='sub-summ-d-main'>
                                                        <p><b>Duration</b></p>
                                                        <p className='sub-summ-d'> {formatDate(startDateGet)} - {formatDate(endDateGet)}</p>
                                                      </div>
                                                    </div>
                                                    <div className='total-time-summary-days'>
                                                      <div className='sub-summ-d-icon'>
                                                        <LuCalendarDays />
                                                      </div>
                                                      <div className='sub-summ-d-main'>
                                                        <p><b>Total Assigned Days</b></p>
                                                        <p className='sub-summ-d'>  Total <b>{totalDays} days</b> allocated to this task </p>
                                                      </div>
                                                    </div>
                                                    <div className='total-time-summary-days'>
                                                      <div className='sub-summ-d-icon'>
                                                        <FaUserGroup />
                                                      </div>
                                                      <div className='sub-summ-d-main'>
                                                        <p><b>Total Assigned Users</b></p>
                                                        <p className='sub-summ-d'>  {uniqeUser > 0 ? (<><b>{uniqeUser} users</b> assigned to this task</>) : (<>Task currently has no assignees</>)} </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <GanttChart dataEntry={data} projectid={previousformvalue.idProject || idGetProject} />
                                              </div>
                                            )}
                                            <div className="justify-content-end d-flex w-100 mt-4">
                                              {formfinalbuttons.map((btn, index) => (
                                                <>
                                                  {btn.buttontype === "submit" ? (

                                                    <button className={`btn ${btn.class}`} key={index} onClick={handleSubmit} disabled={SubmitButtonLoading}>
                                                      {SubmitButtonLoading ? (
                                                        <div className="spinner">
                                                          <div className="bounce1"></div>
                                                          <div className="bounce2"></div>
                                                          <div className="bounce3"></div>
                                                        </div>
                                                      ) : (
                                                        <>{btn.label}</>
                                                      )}
                                                    </button>
                                                  ) : (
                                                    <>
                                                      {btn.buttontype === "Cancel" ? (
                                                        <button className={`btn ${btn.class}`} key={index} onClick={handleBackClick}>{btn.label}</button>
                                                      ) : (
                                                        <button className={`btn ${btn.class}`} key={index} onClick={handleDraftSubmit} disabled={DraftButtonLoading}>
                                                          {DraftButtonLoading ? (
                                                        <div className="spinner">
                                                          <div className="bounce1"></div>
                                                          <div className="bounce2"></div>
                                                          <div className="bounce3"></div>
                                                        </div>
                                                      ) : (
                                                        <>{btn.label}</>
                                                      )}
                                                          </button>
                                                      )}
                                                    </>
                                                  )}
                                                </>
                                              ))}
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            {sectionerrors && Object.keys(sectionerrors).map((key) => (
                                              <div key={key} className="alert alert-danger alert-dismissible fade show" role="alert">
                                                {sectionerrors[key]}
                                                <button type="button" className="btn-close" aria-label="Close" onClick={() => removeError(key)}></button>
                                              </div>
                                            ))}
                                            <DynamicForm
                                              fields={section}
                                              content={formvalue}
                                              apiurl={apiUrl}
                                              handleChangeValue={handleChangeValue}
                                              Openedsection={index}
                                              handleChangess={() => handleChangess(index)}

                                              submitformdata={submitformdata}

                                              isModule={formvalue.formType}
                                              pagename={pagename}
                                              showButton={showButton}
                                            />
                                          </>
                                        )}
                                      </div>
                                    )
                                  ))}
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

export async function getServerSideProps(context) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'AssignTaskNew' }, context);
  return {
    props: { userFormdata },
  };
}