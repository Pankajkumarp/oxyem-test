import React, { useState, useEffect, Suspense ,useRef} from 'react';
import dynamic from 'next/dynamic';
import { getFieldByName, updatedSubsection ,getFieldByName2} from '../../common/commonFunctions';
import axios from "axios";
import RadioComponent from './common/Inputfiled/RadioComponent';
import moment from 'moment-timezone';
import { axiosJWT } from '../Auth/AddAuthorization';
import { TiExport } from "react-icons/ti";

const components = {
  'Text': dynamic(() => import('./common/Inputfiled/TextComponent')),
  'RenderText': dynamic(() => import('./common/Inputfiled/RenderTextComponent')),
  'Border': dynamic(() => import('./common/Inputfiled/BorderComponent')),
  'Time': dynamic(() => import('./common/Inputfiled/TimeComponent')),
  'Date': dynamic(() => import('./common/Inputfiled/DateComponent')),
  'Password': dynamic(() => import('./common/Inputfiled/PasswordComponent')),
  'Number': dynamic(() => import('./common/Inputfiled/NumberComponent')),
  'Button': dynamic(() => import('./common/Buttons/ButtonComponent')),
  'Email': dynamic(() => import('./common/Inputfiled/EmailComponent')),
  'Location': dynamic(() => import('./common/SelectComponent/LocationComponent')),
  'Role': dynamic(() => import('./common/SelectComponent/RoleComponent')),
  'Status': dynamic(() => import('./common/SelectComponent/StatusComponent')),
  'Employee': dynamic(() => import('./common/SelectComponent/EmployeeComponent')),
  'Client': dynamic(() => import('./common/SelectComponent/ClientComponent')),
  'PolicyType': dynamic(() => import('./common/SelectComponent/PolicyComponent')),
  'Department': dynamic(() => import('./common/SelectComponent/DepartmentComponent')),
  'LeavesType': dynamic(() => import('./common/SelectComponent/LeaveTypeComponent')),
  'File': dynamic(() => import('./common/Inputfiled/FileComponent')),
  'DocumentType': dynamic(() => import('./common/SelectComponent/DocumentTypeComponnet')),
  'Select': dynamic(() => import('./common/SelectOption/SelectComponent')),
  'radio': dynamic(() => import('./common/Inputfiled/RadioComponent')),
  'RadioButton': dynamic(() => import('./common/Inputfiled/RadioButtonComponent')),
  'radioLable': dynamic(() => import('./common/Inputfiled/RadioButtonComponentlable')),
  'Textwithicon': dynamic(() => import('./common/Inputfiled/TextwithiconComponent')),
  'Textarea': dynamic(() => import('./common/Inputfiled/TextAreaComponentcomman')),
  'SelectEmployee': dynamic(() => import('./common/Inputfiled/SelectEmployee')),
  'Popupform': dynamic(() => import('./common/Inputfiled/Popupform')),
  'Checkbox': dynamic(() => import('./common/Inputfiled/CheckboxComponent')),
  'PreviousRole': dynamic(() => import('./common/SelectComponent/PreviousRoleComponent')),
  'Relationship': dynamic(() => import('./common/SelectComponent/RelationshipComponent')),
  'PreviousCompany': dynamic(() => import('./common/SelectComponent/PreviousCompanyComponent')),
  'Institution': dynamic(() => import('./common/SelectComponent/InstitutionComponent')),
  'Qualificationtype': dynamic(() => import('./common/SelectComponent/QualificationtypeComponent')),
  'Subject': dynamic(() => import('./common/SelectComponent/SubjectComponent')),
  'Roledepartment': dynamic(() => import('./common/SelectComponent/RoledepartmentComponent')),
  'Projectlist': dynamic(() => import('./common/SelectComponent/ProjectlistComponent')),
  'SelectOption': dynamic(() => import('./common/SelectComponent/SelectOptionComponent')),
  'CreateSingleSelect': dynamic(() => import('./common/SelectComponent/CreateSingleSelectComponent')),
  'ExitingShift': dynamic(() => import('./common/SelectComponent/ExistingShift')),
  'MultiFile': dynamic(() => import('./common/Inputfiled/MultiFileComponent')),
  'Textleftlable': dynamic(() => import('./common/Inputfiled/TextLeftLableComponent')),
  'MounthPicker': dynamic(() => import('./common/Inputfiled/MonthDateComponent')),
  'appraisalType': dynamic(() => import('./common/SelectComponent/appraisalTypeComponent')),
  'ClaimDoc': dynamic(() => import('./Claim/uploadDoc')),
  'Radiot&c': dynamic(() => import('./common/Inputfiled/Radiot&cComponent')),
  'StokeList': dynamic(() => import('./common/SelectComponent/StokeListComponent')),
  'CKEditor': dynamic(() => import('./common/Inputfiled/CKEditorComponent.js')),
  'StarRating': dynamic(() => import('./common/Inputfiled/StarRatingComponent')),
  'Mover': dynamic(() => import('./common/Mover/Mover.jsx')),
  'Function': dynamic(() => import('./common/SelectComponent/FunctionComponent.jsx')),
  'TreeSelect': dynamic(() => import('./common/TreeSelect/MyTreeSelectMenu.jsx')),
  'AssetList': dynamic(() => import('./common/SelectComponent/AssetListComponent.jsx')),
  'AssetRadio': dynamic(() => import('./common/Inputfiled/AssetRadioComponent.jsx')),
  'AssetListEmp': dynamic(() => import('./common/SelectComponent/AssetListEmpComponent.jsx')),
  'SameNameradio': dynamic(() => import('./common/Inputfiled/SameNameradioComponent.jsx')),
  'TypeOfAssets': dynamic(() => import('./common/SelectComponent/TypeOfAssetsComponents.jsx')),
  'UploadFile': dynamic(() => import('./common/UploadFile/uploadfile.jsx')),
  'InputFile': dynamic(() => import('./common/Inputfiled/InputFile.jsx')),
  'Rating': dynamic(() => import('./common/OnboardQuestions/StarRatingComponents.jsx')),
  'FreeText': dynamic(() => import('./common/Inputfiled/FreeTextComponent.jsx')),
  'OnlyText': dynamic(() => import('./common/Inputfiled/OnlyValueComponent')),
  'RoleBasedOnDepartment': dynamic(() => import('./common/SelectComponent/RoleBasedOnDepartmentComponent')),
  'RadioList': dynamic(() => import('./common/Radio/RadioListComponent.jsx')),
  'MultiEmployee': dynamic(() => import('./common/SelectComponent/MultiEmployeeComponent.jsx')),
  'Month': dynamic(() => import('./common/Inputfiled/MonthComponent')),
  'Year': dynamic(() => import('./common/Inputfiled/YearComponent')),
  'statusRadio': dynamic(() => import('./common/Inputfiled/statusRadioComponent')),
  'statusTextRadio': dynamic(() => import('./common/Inputfiled/statusTextRadioComponent')),
  'CreateSelect': dynamic(() => import('./common/SelectComponent/CreateGoalComponent')),
  'AssignSelect': dynamic(() => import('./common/SelectComponent/AssignMemberComponent')),
  'ExistingSelect': dynamic(() => import('./common/SelectComponent/SelectGoalComponent')),
  'TextCKEditor': dynamic(() => import('./common/Inputfiled/CKEditorTextComponent.js')),
  'ProjectManager': dynamic(() => import('./common/SelectComponent/ProjectManagerlistComponent')),
  'CommanRadio': dynamic(() => import('./common/Inputfiled/CommanRadioButtonComponent')),
  'Attachment': dynamic(() => import('./common/Inputfiled/AttachmentComponent')),
};

const CommanForm = ({ fields, apiurl, handleChangess, Openedsection, handleChangeValue, content, getleavedetail, submitformdata, getleaveoption, isModule, actionid, handleGetformvalueClick, pagename, showButton, showleave, submitaddnlinfo, claimstatus, handleApprrovereqClaim, getChangessField, handleGetproject, handleAssetsformvalueClick,assetDocument, handleGetfiles, filegetpagename, getInstantValue, cancelClickAction, btpstpvalue,handleOnprocessBoarding,handelPreviewPdf,loaderSubmitButton, handleExportClick,getRewardData ,handelAttendanceData,attachments ,autofillData, isPageType}) => {
  
  const [btnloader, setBtnLoader] = useState(false);  

  const [btnloaderbelow, setBtnLoaderbelow] = useState(false);  

  useEffect(() => {
    setBtnLoader(showButton)
  }, [showButton]);

  useEffect(() => {
    setBtnLoaderbelow(loaderSubmitButton)
  }, [loaderSubmitButton]);
  
  const [errors, setErrors] = useState({});
  const [errorres, setErrorres] = useState('');
  const [submitdata, setSubmitdata] = useState({});
  const [formData, setFormData] = useState({});
  const [currentFormData, setCurrentFormData] = useState({});
  const [fieldUpdate, setfieldUpdate] = useState([]);
  const [selectEmpId, setSelectEmpId] = useState("");
  const extractFields = (fields) => {
    let result = {};
    fields.Subsection.forEach(subsection => {
      subsection.fields.forEach(field => {
        result[field.name] = field.value;
      });
    });
    return result;
  };

  useEffect(() => {
    if (showleave === "holiday") {
      setSelectEmpId(formData.idEmployee ? formData.idEmployee.value : "")
    }
  }, [formData]);

  useEffect(() => {
    const extractedData = extractFields(fields);
    setFormData(extractedData);
	    if(pagename === "updateProjection"){
    handleGetproject(extractedData)
    }
  }, [fields]);

  

  const [lastfromDate, setLastfromDate] = useState(null);
  const [lastToDate, setLastToDate] = useState(null);
  const [lastLeaveType, setLastLeaveType] = useState(null);
  const [lastIdEmployee, setLastIdEmployee] = useState(null);

  useEffect(() => {
    const hasValidFormData = fieldUpdate !== "" && (isModule === "addLeave" || isModule === "Admin_Leave");

    if (hasValidFormData) {
      getFieldByName(fieldUpdate, "fromDate")
        .then(fromDate => {
          return getFieldByName(fieldUpdate, "leaveType")
            .then(leaveType => {
              return getFieldByName(fieldUpdate, "toDate")
                .then(toDate => {
                  return getFieldByName(fieldUpdate, "idEmployee")
                    .then(idEmployee => {
                      // Check if idEmployee is an object and has a 'value' property
                      const idEmployeeValue = (typeof idEmployee === 'object' && idEmployee !== null && 'value' in idEmployee) ? idEmployee.value : idEmployee;

                      if (leaveType && fromDate) {
                        if (fromDate !== lastfromDate || toDate !== lastToDate || leaveType !== lastLeaveType || idEmployeeValue !== lastIdEmployee) {
                          setLastToDate(toDate);
                          setLastLeaveType(leaveType);
                          setLastIdEmployee(idEmployeeValue);
                          setLastfromDate(fromDate);

                          const getvalue = {
                            idEmployee: idEmployeeValue,
                            fromDate: fromDate,
                            toDate: toDate,
                            leaveType: leaveType
                          };
                          getleavedetail(getvalue);
                        }
                      }
                    });
                });
            });
        })
        .catch(error => {
        
        });
    }
  }, [fieldUpdate, formData.fromDate, formData.toDate, formData.idEmployee, lastToDate]); // Include lastToDate in the dependency array

  function updateNumberOfHoursWorked(fields) {
    let startTime, endTime, attendanceDate;

    // Iterate through the fields to find startTime, endTime, and attendancedate
    fields.forEach(field => {


      if (field.name === 'startTime') {
        startTime = field.value;
      }
      if (field.name === 'endTime') {
        endTime = field.value;
      }
      if (field.name === 'attendancedate') {
        attendanceDate = field.value;
      }
    });
    const getCurrentTimeZone = () => {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    };
    const timeZone = getCurrentTimeZone();
    const convertUtcTodayName = (utcDateTime, timeZone) => {
      return moment(utcDateTime).tz(timeZone).format('dddd'); // Format to day name and time
    };
    if (attendanceDate) {

      const weakvalue = convertUtcTodayName(attendanceDate, timeZone);
      fields.forEach(field => {
        if (field.name === 'weekdayOrWeekend') {
          if (weakvalue === 'Saturday' || weakvalue === 'Sunday') {
            field.value = 'Weekend';
          } else {
            field.value = 'Weekday';
          }
        }
      });


    }
    if (startTime && endTime && attendanceDate) {
      if (startTime === "00:00" || endTime === "00:00") {
        setErrorres("Start time and end time cannot be 00:00.");
      } else {
        setErrorres("")
        const weakvalue = convertUtcTodayName(attendanceDate, timeZone);
        // Parse the dates and times
        const start = new Date(`${attendanceDate}T${startTime}Z`);
        const end = new Date(`${attendanceDate}T${endTime}Z`);

        // Calculate the difference in milliseconds
        const diffMs = end - start;

        if (diffMs < 0) {
          // Show alert if the time difference is negative
          setErrorres("End time cannot be before start time.");
        } else {
          setErrorres("")
          // Calculate the difference in hours
          const diffHrs = diffMs / (1000 * 60 * 60);

          // Update the numberOfHrsworked field
          fields.forEach(field => {
            if (field.name === 'numberOfHrsworked') {
              field.value = diffHrs.toFixed(2); // Format to 2 decimal places if needed
            }
            if (field.name === 'weekdayOrWeekend') {
              if (weakvalue === 'Saturday' || weakvalue === 'Sunday') {
                field.value = 'Weekend';
              } else {
                field.value = 'Weekday';
              }
            }
          });
        }
      }
    }
    return fields;
  }

  const [fieldValues, setFieldValues] = useState({});


  useEffect(() => {
    if (attachments?.length > 0) {
      setFieldValues(prev => ({
        ...prev,
        file: attachments
      }));
    }
  }, [attachments]);
  
  const updateTitleAndPath = (fields, autofillData) => {
    fields.Subsection.forEach(subsection => {
      subsection.fields.forEach(field => {
        if (field.name === 'path') {
          field.value = autofillData.path || '';
        }
      });
    });
    return fields;
  };

  useEffect(() => {
    if (autofillData && fields) {
      const updatedFields = updateTitleAndPath(fields, autofillData);
      setfieldUpdate(updatedFields); 
    }
  }, [autofillData, fields]);

  // code for updatting email fields in the user form 
  const updateEmailAddress = (fields, emailAddress) => {
    fields.Subsection.forEach(subsection => {
      subsection.fields.forEach(field => {
        if (field.name === 'emailAddress') {
          field.value = emailAddress;
        }
      });
    });
    return fields;
  };

  useEffect(() => {
    const hasValidFormData = fieldUpdate !== "" && (isModule === "createEmployee");

    if (hasValidFormData) {
      getFieldByName(fieldUpdate, "firstName")
        .then(firstName => {
          if (!firstName) {
            throw new Error("First name is required");
          }
          return getFieldByName(fieldUpdate, "lastName")
            .then(lastName => {
              if (!lastName) {
                throw new Error("Last name is required");
              }
              return getFieldByName(fieldUpdate, "middleName")
                .then(middleName => {
                  const apiurl = "";
                  axiosJWT.get(`${apiurl}/generateEmail`, {
                    params: { firstName, lastName, middleName }
                  })
                    .then(response => {
                      const emailAddress1 = response.data.data;
                      const updatedFields = updateEmailAddress(fields, emailAddress1);
                      setfieldUpdate(updatedFields);
                    })
                    .catch(error => {
                      
                    });
                });
            });
        })
        .catch(error => {
          
        });
    }
  }, [formData.firstName, formData.lastName, formData.middleName, fieldUpdate, isModule]);


  const updateStartTime = (fields, currentShift) => {
      fields.Subsection.forEach(subsection => {
        subsection.fields.forEach(field => {
          if (field.name === 'startTime') {
            field.value = currentShift;
          }
        });
      });
      return fields;
    };
  
     const prevEmployeeId = useRef(null);
      const prevAttendanceDate = useRef(null);
    const [idAttendanceForAddToEdit ,setIdAttendanceForUpdateAddToEdit] = useState('')
       useEffect(() => {
              const fetchCurrentShift = async () => {
                const hasValidFormData = formData.idEmployee && formData.attendancedate && (isModule === "Add_Attendance");
                
                if (hasValidFormData) {
                  const idEmployee = formData.idEmployee.value;
                  const attendancedate = formData.attendancedate;
          
                  if (idEmployee !== prevEmployeeId.current || attendancedate !== prevAttendanceDate.current) {
                    prevEmployeeId.current = idEmployee;
                    prevAttendanceDate.current = attendancedate;
          
                    try {
                      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                      const response = await axiosJWT.get(`${apiUrl}/employeeAttendancebyId`, {
                        params: { idEmployee, date: attendancedate }
                      });
          
                      
                      const punchInTime = response.data.data.startTime; // "2025-04-25 08:09"
                      const idAttendance = response.data.data.idAttendance;
                      setIdAttendanceForUpdateAddToEdit(idAttendance)
                      const getCurrentTimeZone = () => {
                        return Intl.DateTimeFormat().resolvedOptions().timeZone;
                      };
                      const timeZone = getCurrentTimeZone();
      
                      const convertUtcToLocalTime = (utcDateTime, timeZone) => {
                      return moment.utc(utcDateTime).tz(timeZone).format('HH:mm');
                      };
                      const localPunchInTime = convertUtcToLocalTime(punchInTime, timeZone);
      
                      const updatedFields = updateStartTime(fields, localPunchInTime);
                      setfieldUpdate(updatedFields);
          
                    } catch (error) {
                      const updatedFields = updateStartTime(fields, '');
                      setfieldUpdate(updatedFields);
                    }
                  }
                }
              };    
              fetchCurrentShift();
            }, [formData.idEmployee, formData.attendancedate, isModule]);

  const handleChange = async (fieldName, value) => {
    if (pagename === "createPricing") {
    getInstantValue(fieldName, value)
    }
    if (filegetpagename === "policyManagement") {
      if (fieldName === "policyDoccument") {
        handleGetfiles(value)
      }
    }
    let getfieldarry = await updatedSubsection(fields, fieldName, value)

    if (pagename === "addAsset") {
      getChangessField(getfieldarry)
    }
	if (pagename === "addGoalValue") {
      setfieldUpdate(getfieldarry)
      getChangessField(fieldName, value)
    }
    if (pagename === "edit_attendances" || pagename === "add_attendances") {
      const updatedFields = updateNumberOfHoursWorked(getfieldarry[0].fields);
      setfieldUpdate(updatedFields)
    } else {
      setfieldUpdate(getfieldarry)
    }
    setFormData(prevFormData => ({
      ...prevFormData,
      [fieldName]: value,
    }));
    setCurrentFormData(prevFormData => ({
      ...prevFormData,
      [fieldName]: value,
    }));

    setSubmitdata(prevSubmitdata => ({
      ...prevSubmitdata,
      [fieldName]: value,
    }));

    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: '',
    }));

    let formfieldarray = []
    handleChangeValue(fieldName, value);
    if (isModule == "addLeave" || isModule == "Admin_Leave") {
      formfieldarray = ["leaveType", "fromDate", "toDate", "idEmployee"];
      if (formfieldarray.includes(fieldName)) {
        const extractedData = extractFields(fields);
        getleaveoption({ ...currentFormData, [fieldName]: value }, extractedData);
      }
    }
    if (pagename === "create_allowance") {
      submitformdata(formData)
    }
  };

  const handleValidation = async () => {
    const updatedErrors = {};
    
    if (pagename === "edit_allowcation" || pagename === "edit_timeManagement" || pagename === "edit_attendances" || pagename === "createPricing") {
      fields.Subsection.forEach((subsection) => {
        subsection.fields.forEach((field) => {
          const value = field.value;  // Use the value directly from the field object
          

          field.validations.forEach((validation) => {
            if (validation.type === "required" && !value) {
              updatedErrors[field.name] = validation.message;
            } else if (validation.type === "min" && value && value.length < validation.length) {
              updatedErrors[field.name] = validation.message;
            } else if (validation.type === "max" && value && value.length > validation.length) {
              updatedErrors[field.name] = validation.message;
            } else if (validation.type === "domainCheck" && value && !value.endsWith(validation.pattern)) {
              updatedErrors[field.name] = validation.message;
            }
          });
        });
      });
    }else if (pagename === "addAsset" || pagename === "addGoalValue") {
      
      if (fields.Subsection.isFieldVisiblef !== false) {
        fields.Subsection.forEach((subsection) => {
          if (subsection.isFieldVisiblef !== false) {  // Check if the subsection is visible
            subsection.fields.forEach((field) => {
              const value = formData[field.name];  // Fetch the current value for the field
              
      
              field.validations.forEach((validation) => {
                if (validation.type === "required" && !value) {
                  updatedErrors[field.name] = validation.message;
                } else if (validation.type === "min" && value && value.length < validation.length) {
                  updatedErrors[field.name] = validation.message;
                } else if (validation.type === "max" && value && value.length > validation.length) {
                  updatedErrors[field.name] = validation.message;
                } else if (validation.type === "domainCheck" && value && !value.endsWith(validation.pattern)) {
                  updatedErrors[field.name] = validation.message;
                } else if (validation.type === "textOnly" && value && !/^[a-zA-Z\s]*$/.test(value)) {
                  updatedErrors[field.name] = validation.message;
                } else if (validation.type === "validDate" && validation.field && validation.pattern === "<") {
                  const startDate = formData[validation.field];
                  const endDate = value;
                  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
                    updatedErrors[field.name] = validation.message;
                  }
                } else if (validation.type === "validShift" && validation.field) {
                  const currentShift = formData[validation.field];
                  const changeShift = value;
                  if (currentShift && changeShift && currentShift.value !== '' && changeShift.value !== '') {
                    if (currentShift.value === changeShift.value) {
                      updatedErrors[field.name] = validation.message;
                    }
                  }
                }
              });
            });
          }
        });
      }
      
    }else if (pagename === "perform") {
      fields.Subsection.forEach((subsection) => {
        subsection.fields.forEach((field) => {
          const value = field.value;
      
          field.validations.forEach((validation) => {
            if (validation.type === "required" && (value === undefined || value === "")) {
              updatedErrors[field.name] = validation.message;
      
            } else if (validation.type === "min" && value && value.length < validation.length) {
              updatedErrors[field.name] = validation.message;
      
            } else if (validation.type === "max" && value && value.length > validation.length) {
              updatedErrors[field.name] = validation.message;
      
            } else if (validation.type === "domainCheck" && value && !value.endsWith(validation.pattern)) {
              updatedErrors[field.name] = validation.message;
      
            } else if (validation.type === "minValue" && value !== undefined && parseFloat(value) <= validation.minValue) {
              updatedErrors[field.name] = validation.message;
      
            } else if (validation.type === "maxValue" && value !== undefined && parseFloat(value) > validation.maxValue) {
              updatedErrors[field.name] = validation.message;
      
            } else if (validation.type === "urlCheck" && value) {
              const isValidUrl = validateUrl(value, validation.startPattern);
              if (!isValidUrl) { 
                updatedErrors[field.name] = validation.message;
              }
      
            } else if (validation.type === "textOnly" && value && !/^[a-zA-Z\s]*$/.test(value)) {
              updatedErrors[field.name] = validation.message;
            }
          });
        });
      });
    }else {
      // Assuming formData is an object that contains the current form values
      fields.Subsection.forEach((subsection) => {
        subsection.fields.forEach((field) => {
          const value = formData[field.name];  // Fetch the current value for the field
          

          field.validations.forEach((validation) => {
            if (validation.type === "required" && !value) {
              updatedErrors[field.name] = validation.message;
            } else if (validation.type === "min" && value && value.length < validation.length) {
              updatedErrors[field.name] = validation.message;
            } else if (validation.type === "max" && value && value.length > validation.length) {
              updatedErrors[field.name] = validation.message;
            } else if (validation.type === "domainCheck" && value && !value.endsWith(validation.pattern)) {
              updatedErrors[field.name] = validation.message;
            }else if (validation.type === "minValue" && value !== undefined && value <= validation.minValue) {
              updatedErrors[field.name] = validation.message;         
            }else if (validation.type === "maxValue" && value !== undefined && value > validation.maxValue) {
              updatedErrors[field.name] = validation.message;
            }else if (validation.type === "urlCheck" && value) {
              const isValidUrl = validateUrl(value, validation.startPattern);
              if (!isValidUrl) {
                updatedErrors[field.name] = validation.message;
              }
            }
            else if (validation.type === "textOnly" && value && !/^[a-zA-Z\s]*$/.test(value)) {
              updatedErrors[field.name] = validation.message;
            }
            else if (validation.type === "validDate" && validation.field && validation.pattern === "<") {
              const startDate = formData[validation.field];
              const endDate = value;
              if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
                updatedErrors[field.name] = validation.message;
              }
            }

            else if (validation.type === "validShift" && validation.field) {
              const currentShift = formData[validation.field];
              const changeShift = value;
              if (currentShift && changeShift && currentShift.value !== '' && changeShift.value !== '') {
                if (currentShift.value === changeShift.value) {
                  updatedErrors[field.name] = validation.message;
                }
              }
            }
            else if (validation.type === "descriptionTextlength" && value) {
              if (validation.minLength && value.length < validation.minLength) {
                  updatedErrors[field.name] = `Minimum length is ${validation.minLength} characters.`;
              }
              if (validation.maxLength && value.length > validation.maxLength) {
                  updatedErrors[field.name] = `Maximum length is ${validation.maxLength} characters.`;
              }
            }

          });
        });
      });

      // Custom validation for Bank Account Number and Confirm Bank Account Number
      if (formData.BankAccountNo !== formData.BankConformAccountNo) {
        updatedErrors.BankConformAccountNo = 'Bank account number does not match';
      }
    }
    setErrors(updatedErrors);
    return updatedErrors;
  };

  function validateUrl(url, startPatterns) {
    const startsWithValidPattern = startPatterns.some(pattern => url.startsWith(pattern));
    const urlPattern = /^(https?:\/\/|ftp:\/\/|www\.)[^\s/$.?#].[^\s]*$/i;
    const isValidUrlFormat = urlPattern.test(url);
    return startsWithValidPattern && isValidUrlFormat;
  }
  
  // shift management start
  const updateShift = (fields, currentShift) => {
    fields.Subsection.forEach(subsection => {
      subsection.fields.forEach(field => {
        if (field.name === 'currentShift') {
          field.value = currentShift;
        }
      });
    });
    return fields;
  };

  useEffect(() => {
    const fetchCurrentShift = async () => {
      const hasValidFormData = formData.idEmployee && (isModule === "createShift");

      if (hasValidFormData) {
        const idEmployee = formData.idEmployee.value;
        if (idEmployee) {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

          try {
            const response = await axiosJWT.get(`${apiUrl}/currentShift`, {
              params: { idEmployee }
            });

            const currentShift = response.data.data;
            const updatedFields = updateShift(fields, currentShift);
            setfieldUpdate(updatedFields);

          } catch (error) {
            
          }
        }
      }
    };

    fetchCurrentShift();
  }, [formData.idEmployee, isModule]);
  // shift management end

  // Upload document
  const [documentData, setDocumentData] = useState([]);
  const [errorss, setErrorss] = useState('');

  const handleChangesDocument = (formData) => {
    setDocumentData(formData);
  };
  //End Upload document

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validationErrors = await handleValidation();

      if (Object.keys(validationErrors).length === 0) {

        if (pagename === "addAsset" || pagename === "addGoalValue") {
          handleAssetsformvalueClick(formData ,documentData);
        }
        if (pagename === "passwordreset") {
          submitformdata(formData);
        }

        if (pagename === "adminclaimInfo") {
          submitformdata(formData);
        }
        
		if (pagename === "createPricing") {
          const data = fields.Subsection[0].fields
            const result = data.reduce((acc, current) => {
              acc[current.name] = current.value;
              return acc;
            }, {});
          submitformdata(result);
        }
		
        if (pagename === "add-automation-ideas") {
          submitformdata(formData);
        }

        if (pagename === "claimInfo" ) {
          
          if (errorres === "" && (!documentData || documentData.length === 0)) {
            setErrorss('Document is required');
          } else {
            submitformdata(formData, documentData);
          }
        }

        if (pagename === "claim" || pagename === 'ticket') {
          
          if (errorres === "" && (!documentData || documentData.length === 0)) {
            setErrorss('Document is required');
          } else {
            submitformdata(formData, documentData);
          }
        }

        if (pagename === "shift") {
          if (errorres === "") {
            submitformdata(formData);
          }
        }

        if (pagename === "edit_allowcation") {

        } else {
          if (pagename === "timeManagement") {
            submitformdata(formData);
          } else if (pagename === "edit_timeManagement") {
            const data = fields.Subsection[0].fields
            const result = data.reduce((acc, current) => {
              acc[current.name] = current.value;
              return acc;
            }, {});
            submitformdata(result);
          } {
            handleChangess(submitdata);
          }
        }
        if (pagename === "edit_attendances") {
          if (errorres === "") {
            submitformdata();
          }
        } 
        if(isModule==="Add_Attendance"){
          handelAttendanceData(formData,idAttendanceForAddToEdit);
        }
        else {
          submitformdata();
        }

      } else {
        setErrors(validationErrors);
      }
    } catch (error) {
      // Handle error response
    }
  };

  const handleExoportSubmit = async (e) => {
    e.preventDefault();
    try {
      const validationErrors = await handleValidation();
      if (Object.keys(validationErrors).length === 0) {     
          handleExportClick(formData ,documentData);
      } else {
        setErrors(validationErrors);
      }
    } catch (error) {
      
    }
  };
  const handleValidationAddInfo = async () => {
    const updatedErrors = {};

    if (pagename === "claimInfo" || pagename === "adminclaimInfo") {
      fields.Subsection.forEach((subsection) => {
        subsection.fields.forEach((field) => {
          const value = formData[field.name];  // Fetch the current value for the field
          field.validations.forEach((validation) => {
            if (validation.type === "required" && !value && validation.clkinfo !== "notRequired") {
              updatedErrors[field.name] = validation.message;

            } else if (validation.type === "required" && validation.clkinfo === "notRequired") {

            }
          });
        });
      });
    }
    if (pagename === "jobApplicantsFinance" || pagename === "onprocessBoarding") {
      fields.Subsection.forEach((subsection) => {
        subsection.fields.forEach((field) => {
          const value = formData[field.name];  // Fetch the current value for the field
          field.validations.forEach((validation) => {
            if (validation.type === "required" && !value && validation.clkinfo !== "notRequired") {
              updatedErrors[field.name] = validation.message;

            } else if (validation.type === "required" && validation.clkinfo === "notRequired") {

            }
          });
        });
      });
    }
    setErrors(updatedErrors);
    return updatedErrors;
  };


  const handleAddInfo = async (e) => {

    e.preventDefault();
    try {
      const validationErrors = await handleValidationAddInfo();
      if (Object.keys(validationErrors).length === 0) {

        if (pagename === "adminclaimInfo") {
          submitaddnlinfo(formData);
        }
      } else {
        setErrors(validationErrors);
      }
    } catch (error) {
    }
  };

  const handleChangeAdd = async (fieldName, value) => {


  };

  const handleCancel = () => {
    const updateAllFields = () => {
      fields.Subsection.forEach(subsection => {
        subsection.fields.forEach(field => {
          field.value = '';
        });
      });
      return fields;
    };

    const updatedFields = updateAllFields();
    setfieldUpdate(updatedFields);
    setFormData({});
    setCurrentFormData({});
    setSubmitdata({});
    setErrors({});
	  cancelClickAction();
  };

  const handleUpdateClaimStatus = async (e, buttonType) => {
    e.preventDefault();
    try {
      
      const validationErrors = await handleValidationAddInfo();
      if (Object.keys(validationErrors).length === 0) {
        if (pagename === "adminclaimInfo") {
          handleApprrovereqClaim(buttonType, formData);
        }
        else if (pagename === "addReward"){
          setBtnLoader(true);
          handelPreviewPdf(buttonType, formData); 
        }
      } else {
        setErrors(validationErrors);
      }
    } catch (error) {}
  };

  const handleUpdateOnboardStatus = async (e, buttonType ,buttonvalue) => {
    e.preventDefault();
    try {
      if (pagename === "onprocessBoarding") {
          const validationErrors = await handleValidationAddInfo();
          if (Object.keys(validationErrors).length === 0) {
            handleOnprocessBoarding(buttonType, buttonvalue, formData);
            }
            else {
              setErrors(validationErrors);
            }
        }
        else if (pagename === "jobApplicantsFinance") {
          if(buttonType ==='Finance'){
            handleApprrovereqClaim(buttonType, formData);
          }
          else if (buttonType === "OfferLetter") {
            const validationErrors = await handleValidationAddInfo();
            if (Object.keys(validationErrors).length === 0) {
            handleApprrovereqClaim(buttonType, formData);
            }
            else {
              setErrors(validationErrors);
            }
          }
        }
        else if (pagename === "ticketInfo") {
          handleApprrovereqClaim(buttonType, formData);
        }  
    } catch (error) {}
  };

  const [leaveInfo, setLeaveInfo] = useState([]);
  const fetchDaysInfo = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/leave/getDaysInfo`);
      let data = response.data.data;

      if (showleave === 'holiday') {
        data = data.filter((day) => day.status === 'holiday');
      }

      setLeaveInfo(data);
    } catch (error) {
      console.error('Error fetching days info:', error);
    }
  };
  console.log(isPageType,"isPageType")
useEffect(() => {
  if (
    isPageType === null ||
    isPageType === undefined ||
    isPageType === ""
  ) {
    fetchDaysInfo();
  }
}, [isPageType]);

        const fetchEmpOptions = async (value) => {
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/leave/getDaysInfo`, { params: { "idEmployee": value } })
            setLeaveInfo(response.data.data);
          } catch (error) {
            console.error('Error fetching options:', error); 
          }
        };
      useEffect(() => {
  if (formData?.idEmployee?.value && showleave === 'holiday') {
    fetchEmpOptions(formData.idEmployee.value);
  }
}, [formData?.idEmployee?.value, showleave]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <form>
        {errorres && <div id="messages-container"><div className="alert alert-danger mb-4" role="alert">{errorres}</div></div>}
        {/* comman top button */}
        {fields.topbuttons && fields.topbuttons.length > 0 &&  !btnloader ? (
          <div>
            <div className="text-end w-100 mb-4">
              {fields.topbuttons.map((buttonval, fieldIndex) => (
                buttonval.type === 'Cancel' || buttonval.type === 'cancel' ? (
                  <button key={fieldIndex} type="button" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={handleCancel}>Cancel</button>
                ) : buttonval.type === 'PreviewPDF' ? (
                  <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={(e) => handleUpdateClaimStatus(e, buttonval.type)}>{buttonval.label}</button>
                ) : (
                  <button key={fieldIndex} type="submit" disabled={buttonval.isDisabled} className={`btn ${buttonval.class}`} onClick={handleSubmit}>{buttonval.label}</button>
                )
              ))}
            </div>
          </div>
        ) : fields.topbuttons && fields.topbuttons.length > 0 && btnloader ? (
        <>
          <div className="text-end w-100 mb-4">
            <button className="btn btn-primary" type="submit" disabled={btnloader}>
              {btnloader ? (
                <div className="spinner">
                  <div className="bounce1"></div>
                  <div className="bounce2"></div>
                  <div className="bounce3"></div>
                  </div>
                ) : (
                "Submit"
              )}
            </button>
          </div>
        </>
        ) : null}

        {fields.buttontop && fields.buttontop.length > 0 && (
          <div id="form-top-button" className="form-top-button">
            <div className="text-end w-100">
              {fields.buttontop.map((buttonval, fieldIndex) => (
                buttonval.type === 'Cancel' || buttonval.type === 'cancel' ? (
                  <button key={fieldIndex} type="button" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={handleCancel}>Cancel</button>
                ) : buttonval.type === 'Submit' ? (
                  <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={handleSubmit}>{buttonval.label}</button>
                ) : (
                  <button key={fieldIndex} type="submit" disabled={buttonval.isDisabled} className={`btn ${buttonval.class}`} onClick={handleSubmit}>{buttonval.label}</button>
                )
              ))}
            </div>
          </div>
        )}

        {fields.Subsection.map((subsection, subsectionIndex) => (
          <div key={subsectionIndex}>
            {subsection.isFieldVisiblef === false ? (
              null
            ) : (
            <>
              {subsection.SubsectionName ? (
                <h5 className='mb-5 top-heading-text-tab'>{subsection.SubsectionName}</h5>
              ) : null}
            </>
            )}
            {subsection.isFieldVisiblef === false ? (
              null
            ) : (
            <div className="row">
              {subsection.fields.map((field, fieldIndex) => {
                const InputComponent = components[field.type];
                  return (
                    <>
                      {field.isVisible !== false && field.showinput !== false ? (
                        <div className={`col-md-${field.col} ${field?.moreClass}`} key={fieldIndex}>
                          <div className={`form-group ${field.type === "Checkbox" ? "checkbox-form-group" : ""}`}>
                            <InputComponent
                              label={field.label}
                              labelwithtags={field?.labelwithtags || ""}
                              placeholder={field.placeholder}
                              validations={field.validations}
                              onChange={(value) => handleChange(field.name, value)}
                              options={field.options}
                              isMulti={field.isMulti}
                              name={field.name}
							   minDate={field.minDate}
                              isClearable={field.isClearable || true}
							                isCreated={field.isCreated || ""}
                              otherAttributes={field.otherAttributes || ""}
                              value={field.value}
                              additionalLabel={field.additionalLabel}
                              actionid={actionid}
                              handleGetformvalueClick={handleGetformvalueClick}
                              data={fields}
                              documentType={field.documentType}
                              isDisabled={field.isDisabled || ""}
                              showImage={field.showImage || ""}
                              readonly={field.readonly}
                              showleave={showleave}
                              selectEmpId={selectEmpId}
                              handleChangesDocument={handleChangesDocument} //for Document
                              errors={errorss}  //for Document
                              setErrors={setErrorss}  //for Document
							                pagename={pagename}
                              dependentId={field.dependentId} // for dependent select filed
                              selectedAsset={field.value} 
							                btpstpvalue={btpstpvalue}
                              getRewardData={getRewardData}
                              attachments={attachments}
							  leaveInfo={leaveInfo}
                            />
                            {errors[field.name] && <div className="error text-danger">{errors[field.name]}</div>}
                          </div>
                        </div>
                      ) : (<></>)}
                    </>
                  );
                })}

                {fields?.buttonsInRow?.length > 0 && (
                  <div className={`${fields?.buttonOuterClass}`}>
                    <div className="row">
                      {fields.buttonsInRow.map((buttonval, fieldIndex) => (
                      buttonval.type === 'Cancel' || buttonval.type === 'cancel' ? (
                        <div className={`col-md-6 px-1`} key={fieldIndex}>
                          <button key={fieldIndex} type="button" className={`btn ${buttonval.class} custom_btn_filter`} disabled={buttonval.isDisabled} onClick={handleCancel}>{buttonval.label}</button>
                        </div>
                      ): (
                      <div className={`col-md-6 px-1`} key={fieldIndex}>
                        <button key={fieldIndex} type="submit" disabled={buttonval.isDisabled} className={`btn ${buttonval.class} custom_btn_filter`} onClick={handleSubmit}>{buttonval.label}</button>
                      </div>
                      )
                  ))} 
                    </div>
                  </div>
                )}
            </div>
          )}
          </div>
        ))}
        {pagename === "edit_allowcation" ? (
          <>
            {showButton === "hide" ? (
              <></>
            ) : (
              <div className="text-end w-100">
                {fields.buttons.map((buttonval, fieldIndex) => (
                  buttonval.type === 'radio' ? (
                    <RadioComponent key={fieldIndex} value={buttonval.value} label={buttonval.label} options={buttonval.options} onChange={(value) => handleChangeAdd(buttonval.name, value)} />
                  ) : (
                    <button key={fieldIndex} type="submit" disabled={buttonval.isDisabled} className={`btn ${buttonval.class}`} onClick={handleSubmit}>{buttonval.label}</button>
                  )
                ))}
              </div>
            )}
          </>
        ) : pagename === "onprocessBoarding" ? (
          <>
            <div className="text-end w-100">
              {fields.buttons.map((buttonval, fieldIndex) => (
                buttonval.isVisible ? ( 
                  buttonval.type === 'Cancel' || buttonval.type === 'cancel' ? (
                    <button key={fieldIndex} type="button" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={handleCancel}>Cancel</button>
                  ) : buttonval.type === 'Add Info Required' ? (
                    <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={handleAddInfo}>{buttonval.label}</button>
                  ) : buttonval.type === 'approve' || buttonval.type === 'reject' || buttonval.type === 'paid' ? (
                    <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={(e) => handleUpdateClaimStatus(e, buttonval.type)}>{buttonval.label}</button>
                  ) : buttonval.type === 'Submit' ? (
                    <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={handleSubmit}>{buttonval.label}</button>
                  ) : buttonval.type === 'Recalled' ? (
                    <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={(e) => handleUpdateClaimStatus(e, buttonval.type)}>{buttonval.label}</button>
                  ) : buttonval.type === 'Finance' || buttonval.type === 'OfferLetter' || buttonval.type === 'shortlisted' || buttonval.type === 'approved' || buttonval.type === 'rejected' ? (
                    <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={(e) => handleUpdateOnboardStatus(e, buttonval.type, buttonval.value)}>{buttonval.label}</button>
                  ) : (
                    <button key={fieldIndex} type="submit" disabled={buttonval.isDisabled} className={`btn ${buttonval.class}`} onClick={handleSubmit}>{buttonval.label}</button>
                  )
                ) : null
              ))}
            </div>
          </>
        ) : (
          !btnloaderbelow ? ( 
            <>
              <div className="text-end w-100">
                {fields.buttons.map((buttonval, fieldIndex) => (
                  buttonval.type === 'Cancel' || buttonval.type === 'cancel' ? (
                    <button key={fieldIndex} type="button" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={handleCancel}>Cancel</button>
                  ) : buttonval.type === 'Add Info Required' ? (
                    <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={handleAddInfo} > {buttonval.label} </button>
                  ) : buttonval.type === 'approve' || buttonval.type === 'reject' || buttonval.type === 'paid' ? (
                    <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={(e) => handleUpdateClaimStatus(e, buttonval.type)} > {buttonval.label} </button>
                  ) : buttonval.type === 'Submit' ? (
                    <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={handleSubmit} > {buttonval.label} </button>
                  ) : buttonval.type === 'Recalled' ? (
                    <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={(e) => handleUpdateClaimStatus(e, buttonval.type)} > {buttonval.label} </button>
                  ) : buttonval.type === 'Finance' || buttonval.type === 'OfferLetter' || buttonval.type === 'shortlisted' || buttonval.type === 'approved' || buttonval.type === 'rejected' ? (
                    <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={(e) => handleUpdateOnboardStatus(e, buttonval.type , buttonval.value)} > {buttonval.label} </button>
					) : buttonval.type === 'export' ? (
                <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={handleExoportSubmit} > {buttonval.showIcon ? <TiExport /> : null} {buttonval.label} </button>
                  ) : (
                    <button key={fieldIndex} type="submit" disabled={buttonval.isDisabled} className={`btn ${buttonval.class}`} onClick={handleSubmit}>{buttonval.label}</button>
                  )
                ))}
              </div>
            </>
          ) : fields.buttons && fields.buttons.length > 0 && btnloaderbelow ? (
          <>
            <div className="text-end w-100 mb-4">
              <button className="btn btn-primary" type="submit" disabled={btnloaderbelow}>
                {btnloaderbelow ? (
                  <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </>
          ) : null
        )}
      </form>
    </Suspense>
  );
};
export default CommanForm;