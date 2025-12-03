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
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
import { FaRegCheckCircle} from "react-icons/fa";
const DynamicForm = dynamic(() => import('../Components/CommanForm.jsx'), {
  ssr: false
});
export default function TableWithField({ userFormdata }) {  // Default to empty array if not provided
  const router = useRouter();
  const [existingData, setexistingData] = useState([]);
  const [formvalue, setFormvalue] = useState(userFormdata);
  const showButton = "";
  const pagename = "timeManagement";
  const [fields, setfields] = useState(formvalue.section[1].Subsection[0].fields);
  useEffect(() => {
    setfields(formvalue.section[1].Subsection[0].fields)
  }, [formvalue]);
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
  const columns = fields.map(field => ({
    name: field.name,
    label: field.label,
    options: {
      filter: field.isfilter,
      sort: field.issort,
      customBodyRender: (value, tableMeta, updateValue) => {
        const error = errors[field.name];
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
              {error && <div className="error">{error}</div>}
            </>
          );
        }
        else if (field.type === 'Textwithicon') {
          return (
            <div className='oxtem-table-custom-pic'>
              <AssignUser projectStauts={"open"} value={value} projectid={previousformvalue ? previousformvalue.idProject : ""} onChange={(value) => {
                updateValue(value);
                handleDataChange(tableMeta.rowIndex, field.name, value);
              }} />
              {error && <div className="error">{error}</div>}
            </div>
          );
        } else if (field.type === 'Date') {
          return (
            <>
              <DateTable value={value || ""} placeholder={field.placeholder}
                onChange={(value) => {
                  updateValue(value);
                  handleDataChange(tableMeta.rowIndex, field.name, value);
                }} />
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
	responsive: "standard", 
    filterType: 'checkbox',
    search: false,
    filter: false,
    download: false,
    print: false,
    viewColumns: false,
    selectableRows: 'none', // Hide checkbox for selecting rows
  };

  const handleDataChange = (rowIndex, field, value) => {
    const updatedData = [...data];
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [field]: value
    };

    setData(updatedData);
    setErrors(prevErrors => ({ ...prevErrors, [field]: undefined }));
  };

  const addRow = () => {
    const newRow = mergeDataWithFields(fields, existingData);
    setData([...data, newRow]);
  };

  const [previousformvalue, setPreviousformvalue] = useState({});
  const [errors, setErrors] = useState({});
  const validateFields = (fields) => {
    const errors = {};
    fields.forEach(field => {
      field.validations.forEach(validation => {
        if (validation.type === 'required' && !data[0][field.name]) {
          errors[field.name] = validation.message;
        }
      });
    });
    return errors;
  };


  const handleSubmit = async () => {
    const fieldErrors = validateFields(fields);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    const payload = {
      "idProject": previousformvalue.idProject,
      "endDate": previousformvalue.endDate,
      "startDate": previousformvalue.startDate,
      "timesheetDescription": previousformvalue.timesheetDescription,
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
          <FaRegCheckCircle style={{
							fontSize: '35px',
							marginRight: '10px',
							color: '#4caf50'
						}} />
          <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
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
          border: '1px solid #FF000F',
          padding: '8px',
          color: '#FF000F',
        },
      });
      console.error('Error:', error);
    }
  };
  
  const handleDraftSubmit = async () => {
    const fieldErrors = validateFields(fields);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    const payload = {
      "idProject": previousformvalue.idProject,
      "endDate": previousformvalue.endDate,
      "startDate": previousformvalue.startDate,
      "timesheetDescription": previousformvalue.timesheetDescription,
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
    console.log("up", updatedArray)

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

    const initialData = mergeDataWithFields(fields, mergedArrayV22);
    setData([initialData]);
    setexistingData(mergedArrayV22);

    setActiveTab("Assign Task");
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
     router.push(`/timesheet/adminDashboard`);
  }
  return (
    <>
    <Head>
        <title>{pageTitles.TimesheetAddTask}</title>
        <meta name="description" content={pageTitles.TimesheetAddTask} />
    </Head>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col">
                    <Breadcrumbs maintext={"Add Task"} />
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
                                                <div className="col-12 text-end">
                                                  <span className='btn btn-primary breadcrum-btn' onClick={addRow}><FaPlus /></span>
                                                </div>
                                                <MUIDataTable
                                                  title={""}
                                                  data={data}
                                                  columns={columns}
                                                  options={options}
                                                />
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
                                                            <button className={`btn ${btn.class}`} key={index} onClick={handleDraftSubmit} >{btn.label}</button>
                                                          )}
                                                        </>
                                                      )}
                                                    </>
                                                  ))}
                                                </div>
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
