import React, { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import Select from 'react-select';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import AssignUser from '../Components/common/Inputfiled/TablewithiconComponent';
import { FaPlus } from "react-icons/fa6";
import DateTable from '../Components/common/Inputfiled/DateTable';
import dynamic from 'next/dynamic';
import { FaEdit } from "react-icons/fa";
import { axiosJWT } from '../Auth/AddAuthorization';
import { Toaster, toast } from 'react-hot-toast';
import { FaRegClock, FaTimes } from "react-icons/fa";
import { useRouter } from 'next/router'
import { FaRegCheckCircle} from "react-icons/fa";
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
const DynamicForm = dynamic(() => import('../Components/CommanForm.jsx'), {
  ssr: false
});
export default function TableWithField({ userFormdata }) {  // Default to empty array if not provided
  const router = useRouter();
  const [existingData, setexistingData] = useState([]);
  const [formvalue, setFormvalue] = useState(userFormdata);
  const [projectStauts, setProjectstauts] = useState("");
  const [projectidAssignTask, setProjectidAssignTask] = useState("");
  const showButton = "";
  const pagename = "edit_timeManagement";

  const [fields, setfields] = useState(formvalue.section[1].Subsection);
  const [fieldscol, setfieldscol] = useState(formvalue.section[1].Subsection[0].fields);
  useEffect(() => {
    setfields(formvalue.section[1].Subsection)
    setfieldscol(formvalue.section[1].Subsection[0].fields)
  }, [formvalue]);

  function transformTaskList(taskList) {
    return {
      SectionName: "Assign Task",
      Subsection: taskList.map(task => ({
        SubsectionName: "Assign Task",
        fields: [
          {
            col: "4",
            isDisabled: true,
            isfilter: true,
            issort: false,
            label: "idTaskProject",
            name: "idTaskProject",
            placeholder: "",
            type: "Text",
            validations: [
              {
                message: "This is required",
                type: "required"
              }
            ],
            value: task.idTaskProject
          },
          {
            col: "4",
            isDisabled: true,
            isfilter: true,
            issort: false,
            label: "Project Name",
            name: "idProject",
            placeholder: "",
            type: "Projectlist",
            validations: [
              {
                message: "This is required",
                type: "required"
              }
            ],
            value: task.idProject
          },
          {
            col: "4",
            isDisabled: true,
            isfilter: true,
            issort: false,
            label: "Project Code",
            name: "projectCode",
            placeholder: "",
            type: "Text",
            validations: [],
            value: task.projectCode
          },
          {
            col: "4",
            isfilter: true,
            issort: false,
            label: "Task Name",
            name: "taskName",
            placeholder: "",
            type: "Text",
            validations: [
              {
                message: "Task Name is required",
                type: "required"
              }
            ],
            value: task.taskName
          },
          {
            col: "4",
            isfilter: true,
            issort: false,
            label: "Assigned To",
            name: "assignedTo",
            placeholder: "",
            type: "Textwithicon",
            validations: [
              {
                message: "Member is required",
                type: "required"
              }
            ],
            value: task.assignedTo
          },
          {
            col: "4",
            isfilter: true,
            issort: true,
            label: "Start Date",
            name: "startDate",
            placeholder: "",
            type: "Date",
            validations: [
              {
                message: "This is required",
                type: "required"
              }
            ],
            value: task.startDate
          },
          {
            col: "4",
            isfilter: true,
            issort: true,
            label: "End Date",
            name: "endDate",
            placeholder: "",
            type: "Date",
            validations: [
              {
                message: "This is required",
                type: "required"
              }
            ],
            value: task.endDate
          },
          {
            col: "12",
            isfilter: true,
            issort: false,
            label: "Task Code",
            name: "taskCode",
            placeholder: "",
            type: "Tasklist",
            validations: [
              {
                message: "Task Code is required",
                type: "required"
              }
            ],
            value: task.taskCode
          },
          {
            col: "12",
            isfilter: true,
            issort: false,
            label: "Status",
            name: "status",
            placeholder: "",
            type: "Status",
            validations: [],
            value: task.status
          }
        ],
        isVisible: true,
        name: "assignTask",
        sectionHeading: "Assign Task"
      })),
      buttons: [
        {
          buttontype: "Cancel",
          class: "btn-oxyem mx-2",
          col: "3 float-end",
          label: "Cancel",
          placeholder: "Cancel",
          type: "Button",
          validations: [],
          value: "Cancel"
        },
        {
          buttontype: "SaveDraft",
          class: "btn-oxyem mx-2",
          col: "3 float-end",
          label: "Save as Draft",
          placeholder: "Save as Draft",
          type: "Button",
          validations: [],
          value: "Recall"
        },
        {
          buttontype: "submit",
          class: "btn btn-primary",
          col: "3 float-end",
          label: "submit",
          placeholder: "submit",
          type: "Button",
          validations: [],
          value: "submit"
        }
      ],
      isVisible: true,
      name: "assignTask"
    };
  }
  // Merge existing data with form fields
  const mergeDataWithFields = (data) => {
    return data.map(subsection => {
      const result = {};
      subsection.fields.forEach(field => {
        result[field.name] = field.value;
      });
      return result;
    });
  };




  const [data, setData] = useState();
  const getProjectValue = async (id) => {
    try {

      const response = await axiosJWT.get(`${apiUrl}/timesheet/viewTaskInfo`, {
        params: {
          idAssignTask: id,
        },
      });
      if (response) {
        const apiResponse = response.data.data
        const projectstatus = response.data.data.status
		const status = apiResponse.status
        setProjectstauts(projectstatus)
        setProjectidAssignTask(response.data.data.idAssignTask)
        const updatedFormValue = { ...formvalue };

        // Function to update a subsection with data from apiResponse
        const updateSubsectionFields = (subsection, data) => {
          subsection.fields.forEach(field => {
            if (field.name === "assignedTo") {
              // Handle the special case for "assignedTo" which is an array
              field.value = data.taskList.map(task => task.assignedTo).flat();
            } else if (data[field.name]) {
              field.value = data[field.name];
            } else if (data.taskList && data.taskList[0] && data.taskList[0][field.name]) {
              field.value = data.taskList[0][field.name];
            }
          });
        };

        // Update fields for the "Create Task" section
        const createTaskSection = updatedFormValue.section.find(section => section.SectionName === "Create Task");
        if (createTaskSection) {
          const createTaskSubsection = createTaskSection.Subsection.find(subsection => subsection.SubsectionName === "Create Task");
          if (createTaskSubsection) {
            updateSubsectionFields(createTaskSubsection, apiResponse);
          }
        }







        updatedFormValue.section = updatedFormValue.section.filter(section => section.SectionName !== "Assign Task");
        const transformedData = transformTaskList(apiResponse.taskList);

        updatedFormValue.section.push(transformedData);
        setfields(updatedFormValue.section[1].Subsection)
        const initialData = mergeDataWithFields(updatedFormValue.section[1].Subsection);
        setData(initialData);
		// Function to update the 'isDisabled' property of fields if the status is not 'open'
        function updateFieldsIfNotOpen(section) {
          if (status !== 'open') {
            section.fields.forEach(field => {
              field.isDisabled = true;
            });
          }
        }

        // Update the 'Create Task' section
        updatedFormValue.section.forEach(section => {
          if (section.SectionName === 'Create Task') {
            section.Subsection.forEach(subsection => {
              if (subsection.SubsectionName === 'Create Task') {
                updateFieldsIfNotOpen(subsection);
              }
            });
          }
        });
        setFormvalue(updatedFormValue);
      }

    } catch (error) {

    }
  }
  useEffect(() => {
    const { id } = router.query; // Extract the "id" parameter from the query object
    getProjectValue(id)

  }, [router.query.id]);



  const formbuttons = formvalue.section[1].buttons;
  const [activeTab, setActiveTab] = useState(formvalue.section[0].SectionName);
  const [isTabclick, setisTabclick] = useState(false);
  const [tableSection, settableSection] = useState("hide");

  const handleTabClick = (tab) => {
    if (isTabclick === true) {
      setActiveTab(tab);
    }

  };
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;



  const [stateOptions, setstateOptions] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);
  const [showtaskOptions, setShoowTaskOptions] = useState([]);
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

  // Generate columns dynamically from form fields
  const columns = fieldscol.map(field => ({
    name: field.name,
    label: field.label,
    options: {
      filter: field.isfilter,
      sort: field.issort,
      display: ['idTaskProject'].includes(field.name) ? 'excluded' : 'true',
      customBodyRender: (value, tableMeta, updateValue) => {
        const error = errors[field.name];
        if (field.type === 'Text') {
          return (
            <>

              {projectStauts === "open" ? (
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
              ) : (
                <input
                  className={`form-control ${field.name === 'taskName' ? 'oxyem-custom-class-input' : ''}`}
                  value={value || ""}
                  disabled={true}
                  placeholder={field.placeholder}
                  
                />
              )}
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
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderColor: state.isFocused ? 'var(--dropdownhoverbg)' : provided.borderColor, // Change border color when focused
                    boxShadow: state.isFocused ? 'var(--dropdownbgshadow)' : provided.boxShadow, // Change box shadow when focused
                    '&:hover': {
                      borderColor: state.isFocused ? 'var(--dropdownhoverbg)' : provided.borderColor // Ensure hover state does not override focus state
                    }
                  }),
                  indicatorSeparator: (provided, state) => ({
                    ...provided,
                    backgroundColor: 'var(--dropdownhoverbg)' // Change border color when clicked to show options
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    padding: 'var(--dropdownpadding)',
                    //margin: '5px 0px',
                    cursor: 'var(--dropdowncursorstyle)',
                    backgroundColor: state.isFocused || state.isSelected ? 'var(--dropdownhoverbg)' : 'var(--dropdowntransparentcolor)', // Change background color on hover and when selected
                    color: state.isSelected ? 'var(--dropdownselectcolor)' : 'var(--dropdowninheritcolor)', // Change text color of selected options
                    ':hover': {
                      backgroundColor: 'var(--dropdownhoverbg)', // Change background color on hover
                      color: 'var(--dropdownhovercolor)' // Change text color on hover
                    }
                  })
                }}
              />
              {error && <div className="error">{error}</div>}
            </>
          );
        } else if (field.type === 'Tasklist') {
          return (
            <>
             {projectStauts === "open" ? (
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
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    borderColor: state.isFocused ? 'var(--dropdownhoverbg)' : provided.borderColor, // Change border color when focused
                    boxShadow: state.isFocused ? 'var(--dropdownbgshadow)' : provided.boxShadow, // Change box shadow when focused
                    '&:hover': {
                      borderColor: state.isFocused ? 'var(--dropdownhoverbg)' : provided.borderColor // Ensure hover state does not override focus state
                    }
                  }),
                  indicatorSeparator: (provided, state) => ({
                    ...provided,
                    backgroundColor: 'var(--dropdownhoverbg)' // Change border color when clicked to show options
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    padding: 'var(--dropdownpadding)',
                    //margin: '5px 0px',
                    cursor: 'var(--dropdowncursorstyle)',
                    backgroundColor: state.isFocused || state.isSelected ? 'var(--dropdownhoverbg)' : 'var(--dropdowntransparentcolor)', // Change background color on hover and when selected
                    color: state.isSelected ? 'var(--dropdownselectcolor)' : 'var(--dropdowninheritcolor)', // Change text color of selected options
                    ':hover': {
                      backgroundColor: 'var(--dropdownhoverbg)', // Change background color on hover
                      color: 'var(--dropdownhovercolor)' // Change text color on hover
                    }
                  })
                }}
              />
             ):(
              <Select
                value={taskOptions.find(option => option.value === value)}
                options={taskOptions}
                isDisabled={true}
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
                className="oxyem-custom-dropdown"
                placeholder="Select"

              />
             )}
              {error && <div className="error">{error}</div>}
            </>
          );
        }
        else if (field.type === 'Textwithicon') {
          return (
            <div className='oxtem-table-custom-pic'>
              <AssignUser projectStauts={projectStauts} value={value} projectid={previousformvalue ? previousformvalue.idProject : ""} onChange={(value) => {
                updateValue(value);
                handleDataChange(tableMeta.rowIndex, field.name, value);
              }} />
              {error && <div className="error">{error}</div>}
            </div>
          );
        } else if (field.type === 'Date') {
          return (
            <>
            {projectStauts === "open" ? (
              <DateTable value={value || ""} placeholder={field.placeholder}
                disabled={false} // Ensure this is set correctly
                onChange={(value) => {
                  updateValue(value);
                  handleDataChange(tableMeta.rowIndex, field.name, value);
                }} />
              ):(
                <DateTable value={value || ""} placeholder={field.placeholder}
                disabled={true} // Ensure this is set correctly
                
                 />
              )}
              {error && <div className="error">{error}</div>}
            </>
          );
        }else if (field.type === 'Status') {
          return (
            <>
            <span className={`oxyem-mark-${value}`}>{value}</span>
            </>
          );
        } else {
          return value;
        }
      }
    }
  }));

  const options = {
    filterType: 'checkbox',
	responsive: "standard",
    search: false,
    filter: false,
    download: false,
    print: false,
    viewColumns: false,
    selectableRows: 'none', // Hide checkbox for selecting rows
	rowsPerPage: [20],
    rowsPerPageOptions: [20, 50, 100, 150],
    jumpToPage: true,
  };

  const handleDataChange = (rowIndex, field, value) => {
    const updatedData = [...data];
    console.log("beforeu", updatedData)
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [field]: value
    };
    console.log("afteru", updatedData)
    setData(updatedData);
    setErrors(prevErrors => ({ ...prevErrors, [field]: undefined }));
  };

  const addRow = () => {
    // Select an existing row to duplicate. For example, the first row.
    const rowToDuplicate = data[0];
    // Create a deep copy of the row
    const newRow = JSON.parse(JSON.stringify(rowToDuplicate));
    // Remove the assignedTo value
    newRow.assignedTo.splice(0, newRow.assignedTo.length);
    // Remove other values
    newRow.startDate = "";
    newRow.endDate = "";
    newRow.taskName = "";
    newRow.taskCode = "";
    newRow.idTaskProject =""
    // Add the new row to the data array
    setData([...data, newRow]);
  };

  const [previousformvalue, setPreviousformvalue] = useState({});
  const [errors, setErrors] = useState({});

  const validateFields = (data) => {
    const fieldErrors = {};

    data.forEach((item, index) => {
      const errors = {};

      if (!item.idProject) errors.idProject = "idProject is required";
      if (!item.projectCode) errors.projectCode = "projectCode is required";
      if (!item.taskName) errors.taskName = "taskName is required";
      if (!item.startDate) errors.startDate = "startDate is required";
      if (!item.endDate) errors.endDate = "endDate is required";
      if (!item.taskCode) errors.taskCode = "taskCode is required";
      if (!item.status) errors.status = "status is required";
      if (item.assignedTo.length === 0) {
        errors.assignedTo = "assignedTo must have at least one entry";
      } else {
        item.assignedTo.forEach((assigned, assignedIndex) => {
          if (!assigned.idEmployee) {
            errors[`assignedTo[${assignedIndex}].idEmployee`] = "idEmployee is required";
          }
          if (!assigned.taskPercentage) {
            errors[`assignedTo[${assignedIndex}].taskPercentage`] = "taskPercentage is required";
          }
        });
      }

      if (Object.keys(errors).length > 0) {
        fieldErrors[index] = errors;
      }
    });

    return fieldErrors;
  };

  const [sectionerrorstable, setSectionErrorstable] = useState("");

  const handleSubmit = async () => {

    const fieldErrors = validateFields(data);
    console.log("fieldErrors", fieldErrors)
    if (Object.keys(fieldErrors).length > 0) {
      setSectionErrorstable("All Fields are required")
      setErrors(fieldErrors);
      return;
    }
    setSectionErrorstable("")
    const payload = {
      "idProject": previousformvalue.idProject,
      "endDate": previousformvalue.endDate,
      "startDate": previousformvalue.startDate,
      "timesheetDescription": previousformvalue.timesheetDescription,
      "idAssignTask":projectidAssignTask,
	  "status":"open",
      "taskList": data
    }
    try {
      const response = await axiosJWT.post(`${apiUrl}/timesheet/assignTask`, payload);

      if (response) {
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
         router.push(`/timesheet/adminDashboard`);
        }, 3000);
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
  
   const handleDraftSubmit = async () => {

    const fieldErrors = validateFields(data);
    console.log("fieldErrors", fieldErrors)
    if (Object.keys(fieldErrors).length > 0) {
      setSectionErrorstable("All Fields are required")
      setErrors(fieldErrors);
      return;
    }
    setSectionErrorstable("")
    const payload = {
      "idProject": previousformvalue.idProject,
      "endDate": previousformvalue.endDate,
      "startDate": previousformvalue.startDate,
      "timesheetDescription": previousformvalue.timesheetDescription,
      "idAssignTask":projectidAssignTask,
	  "status":"draft",
      "taskList": data
    }
    try {
      const response = await axiosJWT.post(`${apiUrl}/timesheet/assignTask`, payload);

      if (response) {
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
         router.push(`/timesheet/adminDashboard`);
        }, 3000);
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
    const disableField = (sectionName, subsectionName, fieldName) => {
    const newFormvalue = { ...formvalue };
    newFormvalue.section = newFormvalue.section.map(section => {
      if (section.SectionName === sectionName) {
        section.Subsection = section.Subsection.map(subsection => {
          if (subsection.SubsectionName === subsectionName) {
            subsection.fields = subsection.fields.map(field => {
              if (field.name === fieldName) {
                return { ...field, isDisabled: true };
              }
              return field;
            });
          }
          return subsection;
        });
      }
      return section;
    });

    setFormvalue(newFormvalue);
  };
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


    //const mergedData = data.map((item) => ({ ...item, ...value }));
    //setData(mergedData)
    setexistingData(mergedArrayV22);
    setSectionErrors({})
    setActiveTab("Assign Task");
    setisTabclick(true);
    settableSection("show");
	 disableField("Create Task", "Create Task", "idProject");
  };
  const removeError = (key) => {
    setSectionErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[key];
      return updatedErrors;
    });
  };
  const handleBackClick = async () => {
    router.push(`/timesheet/adminDashboard`);
  }
  return (
    <>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col">
                    <Breadcrumbs maintext={"Time Management"} />
                  </div>
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">

                            <div className="center-part">
                              <div className="card-body -body skolrup-learning-card-body oxyem-time-managment">
                                <div className="row">
                                  <div className="col-12">
                                    <div className="user-text skolrup-m-user-text">

                                    </div>
                                  </div>
                                </div>
                                {Array.isArray(formvalue.section) ? (
                                  <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab">
                                    {formvalue.section.map((section, index) => (
                                      section.isVisible && (
                                        <li key={index} className="nav-item">
                                          <a
                                            className={`nav-link ${activeTab === section.SectionName ? 'active' : ''}`}
                                            onClick={() => handleTabClick(section.SectionName)}
                                          >
                                            <div className="skolrup-profile-tab-link">{section.SectionName}</div>
                                          </a>
                                        </li>
                                      )
                                    ))}
                                  </ul>

                                ) : (
                                  <div>

                                  </div>
                                )}


                                <div className="tab-content" >



                                  {formvalue.section.map((section, index) => (
                                    activeTab === section.SectionName && (
                                      <div key={index} className={`tab-pane ${activeTab === section.SectionName ? 'active' : ''}`}>

                                        {section.name === "assignTask" ? (
                                          <>
                                            {tableSection === "show" ? (
                                              <div className='oxyem-time-mang-format'>
                                                {sectionerrorstable ? (
                                                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                                    {sectionerrorstable}

                                                  </div>
                                                ) : (null)}
                                                {projectStauts === "open" ? (
                                                <div className="col-12 text-end">
                                                  <span className='btn btn-primary breadcrum-btn' onClick={addRow}><FaPlus /></span>
                                                </div>
                                                ):(null)}
                                                <MUIDataTable
                                                  title={""}
                                                  data={data}
                                                  columns={columns}
                                                  options={options}
                                                />
                                                {projectStauts === "open" ? (
                                                <div className="justify-content-end d-flex w-100 mt-4">
                                                  {formbuttons.map((btn, index) => (
                                                    <>
                                                      {btn.buttontype === "submit" ? (
                                                        <button className={`btn ${btn.class}`} key={index} onClick={handleSubmit}>{btn.label}</button>
                                                      ) : (
                                                        <>
                                                          {btn.buttontype === "Cancel" ? (
                                                            <button className={`btn ${btn.class}`} key={index} onClick={handleBackClick}>{btn.label}</button>
                                                          ) : (
                                                            <button className={`btn ${btn.class}`} key={index} onClick={handleDraftSubmit}>{btn.label}</button>
                                                          )}
                                                        </>
                                                      )}
                                                    </>
                                                  ))}
                                                </div>
                                                ):(null)}
                                              </div>
                                            ) : (<></>)}
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
  const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'AssignTask' }, context);
  return {
    props: { userFormdata },
  };
}
