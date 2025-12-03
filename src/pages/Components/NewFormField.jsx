import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getFieldByName, updatedSubsection } from '../../common/commonFunctions';
import axios from "axios";
import RadioComponent from './common/Inputfiled/RadioComponent';
import moment from 'moment-timezone';
import { axiosJWT } from '../Auth/AddAuthorization';
import { RiDeleteBinLine } from "react-icons/ri";
const components = {
  'Text': dynamic(() => import('./common/Inputfiled/TextComponent')),
  'OnlyText': dynamic(() => import('./common/Inputfiled/OnlyTextComponent')),
  'TextwithAdd': dynamic(() => import('./common/Inputfiled/TextComponentwithAddField')),
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
  'Department': dynamic(() => import('./common/SelectComponent/DepartmentComponent')),
  'LeavesType': dynamic(() => import('./common/SelectComponent/LeaveTypeComponent')),
  'File': dynamic(() => import('./common/Inputfiled/FileComponent')),
  'DocumentType': dynamic(() => import('./common/SelectComponent/DocumentTypeComponnet')),
  'Select': dynamic(() => import('./common/SelectOption/SelectComponent')),
  'radio': dynamic(() => import('./common/Inputfiled/RadioComponent')),
  'RadioButton': dynamic(() => import('./common/Inputfiled/RadioButtonComponent')),
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
  'TextSalary': dynamic(() => import('./common/Inputfiled/TextSalaryComponent')),
};

const NewFormField = ({ fieldsvalue, apiurl, handleChangess, Openedsection, handleChangeValue, content, getleavedetail, submitformdata, getleaveoption, isModule, actionid, handleGetformvalueClick, pagename, showButton, showleave, getChangessField, tdsAmount, salaryAmount, handleNetsalaryAmt }) => {

  const [fields, setFields] = useState(fieldsvalue);
  const [tds, setTDS] = useState(tdsAmount);
  const [netsalaryAmount, setNetsalaryAmount] = useState(salaryAmount);
  const [updateAmount, setUpdateAmount] = useState(salaryAmount);
  const [errors, setErrors] = useState({});
  const [errorres, setErrorres] = useState('');
  const [submitdata, setSubmitdata] = useState({});
  const [formData, setFormData] = useState({});
  console.log("formData", formData)
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
    setTDS(tdsAmount)
  }, [tdsAmount]);

  useEffect(() => {
    setNetsalaryAmount(salaryAmount)
    setUpdateAmount(salaryAmount)
  }, [salaryAmount]);

  useEffect(() => {
    const extractedData = extractFields(fields);

    setFormData(extractedData);
  }, [fields]);

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

                      if (leaveType && fromDate && toDate) {
                        const getvalue = {
                          idEmployee: idEmployeeValue,
                          fromDate: fromDate,
                          toDate: toDate,
                          leaveType: leaveType
                        };
                        getleavedetail(getvalue);
                      }
                    });
                });
            });
        })
        .catch(error => {
          console.error("Error retrieving field values:", error);
        });
    }
  }, [formData.fromDate, formData.toDate, formData.idEmployee]);


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

    // console.log(hasValidFormData);
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
                      // console.error("Error generating email:", error);
                    });
                });
            });
        })
        .catch(error => {
          // console.error("Error retrieving field values:", error);
        });
    }
  }, [formData.firstName, formData.lastName, formData.middleName, fieldUpdate, isModule]);

  const handleChange = async (fieldName, value) => {

    let getfieldarry = await updatedSubsection(fields, fieldName, value)
    if (pagename === "addPayRoll") {
      getChangessField(getfieldarry)
    }
    if (pagename === "edit_attendances") {
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
    console.log("validatevalue", fields);
    if (pagename === "edit_allowcation" || pagename === "edit_timeManagement") {
      fields.Subsection.forEach((subsection) => {
        subsection.fields.forEach((field) => {
          const value = field.value;  // Use the value directly from the field object
          console.log(`Validating field: ${field.name}, value: ${value}`);

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
    } else {
      // Assuming formData is an object that contains the current form values
      fields.Subsection.forEach((subsection) => {
        subsection.fields.forEach((field) => {
          const value = formData[field.name];  // Fetch the current value for the field
          console.log(`Validating field: ${field.name}, value: ${value}`);

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

          });
        });
      });

      // Custom validation for Bank Account Number and Confirm Bank Account Number
      if (formData.BankAccountNo !== formData.BankConformAccountNo) {
        updatedErrors.BankConformAccountNo = 'Bank account number does not match';
      }

    }
    console.log("Validation errors:", updatedErrors);
    setErrors(updatedErrors);
    return updatedErrors;
  };

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
            console.error("Error fetching current shift:", error);
          }
        }
      }
    };

    fetchCurrentShift();
  }, [formData.idEmployee, isModule]);


  // shift management end

  const [additionalFields, setAdditionalFields] = useState({
    earning: [],
    deductions: []
  });
  useEffect(() => {
    // Calculate the total earnings
    const totalEarnings = additionalFields.earning.reduce((acc, curr) => {
      return acc + (parseFloat(curr.attributeValue) || 0);
    }, 0);
  
    // Calculate the total deductions
    const totalDeductions = additionalFields.deductions.reduce((acc, curr) => {
      return acc + (parseFloat(curr.attributeValue) || 0);
    }, 0);
  
    // Initialize new net salary with the base net salary amount
    let newNetsalary = parseFloat(netsalaryAmount) + totalEarnings - totalDeductions;
  
    // Subtract formData.tds if it exists and is a valid number
    if (formData.tds) {
      newNetsalary -= parseFloat(formData.tds);
    }
  
    // Round and update the net salary amount
    const roundedAmount = newNetsalary.toFixed(2);
    setUpdateAmount(parseFloat(roundedAmount));
    handleNetsalaryAmt(parseFloat(roundedAmount));
  }, [additionalFields.earning, additionalFields.deductions, formData.tds, netsalaryAmount]);
  
  



  const validateFields = () => {
    let isValid = true;
    const newEarning = additionalFields.earning.map(field => {
      if (field.name.trim() === '' || field.attributeValue.trim() === '') {
        isValid = false;
        return { ...field, error: true };
      }
      return { ...field, error: false };
    });

    const newDeductions = additionalFields.deductions.map(field => {
      if (field.name.trim() === '' || field.attributeValue.trim() === '') {
        isValid = false;
        return { ...field, error: true };
      }
      return { ...field, error: false };
    });

    setAdditionalFields({
      earning: newEarning,
      deductions: newDeductions,
    });

    return isValid;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      


        if (validateFields()) {
          submitformdata(additionalFields);
        }

    } catch (error) {
      // Handle error response
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
  };


  console.log("additionalFields", additionalFields)


  const handleAddField = (position) => {
    setAdditionalFields(prevState => ({
      ...prevState,
      [position]: [
        ...prevState[position],
        { name: '', attributeValue: '' }
      ]
    }));
  };
  const handleFieldChange = (position, index, key, value) => {
    setAdditionalFields(prevState => ({
      ...prevState,
      [position]: prevState[position].map((field, i) =>
        i === index ? { ...field, [key]: value } : field
      )
    }));
  };
  const handleDeleteField = (position, index) => {
    setAdditionalFields(prevState => ({
      ...prevState,
      [position]: prevState[position].filter((_, i) => i !== index)
    }));
  };

  const handleGetAddField = (value) => {

    handleAddField(value)
  };


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <form>
        {errorres && (
          <div id="messages-container">
            <div className="alert alert-danger mb-4" role="alert">
              {errorres}
            </div>
          </div>
        )}

        {fields.Subsection.map((subsection, subsectionIndex) => (
          <div key={subsectionIndex}>
            {subsection.SubsectionName && <h5 className='mb-5'>{subsection.SubsectionName}</h5>}

            <div className="row">
			{/* First Column: Fields with "first-6" position */}
              <div className="col-md-12">
                <div className="row">
                  {subsection.fields
                    .filter(field => field.position === "comman")
                    .map((field, fieldIndex) => {
                      const InputComponent = components[field.type];
                      return (
                        field.isVisible !== false &&
                        field.showinput !== false && (
                          <div className={`col-md-${field.col}`} key={fieldIndex}>
                            <div className="form-group" >
                              <InputComponent
                                label={field.label}
                                placeholder={field.placeholder}
                                validations={field.validations}
                                onChange={value => handleChange(field.name, value)}
                                options={field.options}
                                isMulti={field.isMulti}
                                name={field.name}
                                isClearable={field.isClearable || true}
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
                                handleGetAddField={handleGetAddField}
                              />
                              {errors[field.name] && <div className="error text-danger">{errors[field.name]}</div>}
                            </div>
                          </div>
                        )
                      );
                    })}
                </div>
              </div>
              {/* First Column: Fields with "first-6" position */}
              <div className="col-md-6">
                <div className="row">
                  {subsection.fields
                    .filter(field => field.position === "first-6")
                    .map((field, fieldIndex) => {
                      const InputComponent = components[field.type];
                      return (
                        field.isVisible !== false &&
                        field.showinput !== false && (
                          <div className={`col-md-${field.col}`} key={fieldIndex}>
                            <div className="form-group" >
                              <InputComponent
                                label={field.label}
                                placeholder={field.placeholder}
                                validations={field.validations}
                                onChange={value => handleChange(field.name, value)}
                                options={field.options}
                                isMulti={field.isMulti}
                                name={field.name}
                                isClearable={field.isClearable || true}
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
                                handleGetAddField={handleGetAddField}
                              />
                              {errors[field.name] && <div className="error text-danger">{errors[field.name]}</div>}
                            </div>
                          </div>
                        )
                      );
                    })}
                  {additionalFields.earning.map((field, index) => (
                    <div className="col-md-12" key={`earning-${index}`}>
                      <div className="row ox_add_new_field">
                        <div className="col-md-8">
                          <div className="form-group">
                            <label>Description</label>
                            <input
                              type="text"
                              placeholder=""
                              value={field.name}
                              onChange={(e) => handleFieldChange('earning', index, 'name', e.target.value)}
                              className="form-control mb-2"
                            />
                            {field.error && !field.name && (
                              <div className="error text-danger">Description is required</div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Amonunt</label>
                            <input
                              type="text"
                              placeholder=""
                              value={field.value}
                              onChange={(e) => handleFieldChange('earning', index, 'attributeValue', e.target.value)}
                              className="form-control"
                            />
                            {field.error && !field.attributeValue && (
                              <div className="error text-danger">Amonunt is required</div>
                            )}
                          </div>
                        </div>
                        <span
                          className="ox_field_delete_btn"
                          onClick={() => handleDeleteField('earning', index)}
                        >
                          <RiDeleteBinLine />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Second Column: Fields with "second-6" position */}
              <div className="col-md-6">
                <div className="row">
                  {subsection.fields
                    .filter(field => field.position === "second-6")
                    .map((field, fieldIndex) => {
                      const InputComponent = components[field.type];
                      return (
                        field.isVisible !== false &&
                        field.showinput !== false && (
                          <div className={`col-md-${field.col}`} key={fieldIndex}>
                            <div className="form-group" >
                              <InputComponent
                                label={field.label}
                                placeholder={field.placeholder}
                                validations={field.validations}
                                onChange={value => handleChange(field.name, value)}
                                options={field.options}
                                isMulti={field.isMulti}
                                name={field.name}
                                isClearable={field.isClearable || true}
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
                                handleGetAddField={handleGetAddField}
                              />
                              {errors[field.name] && <div className="error text-danger">{errors[field.name]}</div>}
                            </div>
                          </div>
                        )
                      );
                    })}
                  {additionalFields.deductions.map((field, index) => (
                    <div className="col-md-12" key={`earning-${index}`}>
                      <div className="row ox_add_new_field" >
                        <div className="col-md-8">
                          <div className="form-group">
                            <label>Description</label>
                            <input
                              type="text"
                              placeholder=""
                              value={field.name}
                              onChange={(e) => handleFieldChange('deductions', index, 'name', e.target.value)}
                              className="form-control mb-2"
                            />
                            {field.error && !field.name && (
                              <div className="error text-danger">Description is required</div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Amount</label>
                            <input
                              type="text"
                              placeholder=""
                              value={field.value}
                              onChange={(e) => handleFieldChange('deductions', index, 'attributeValue', e.target.value)}
                              className="form-control"
                            />
                            {field.error && !field.attributeValue && (
                              <div className="error text-danger">Amonunt is required</div>
                            )}
                          </div>
                        </div>
                        <span
                          className="ox_field_delete_btn"
                          onClick={() => handleDeleteField('deductions', index)}
                        >
                          <RiDeleteBinLine />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                    <button key={fieldIndex} type="submit" disabled={buttonval.isDisabled} className={`btn ${buttonval.class}`} onClick={handleSubmit}>
                      {buttonval.label}
                    </button>
                  )
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-end w-100">
            {fields.buttons.map((buttonval, fieldIndex) => (
              buttonval.type === 'Cancel' ? (
                <button key={fieldIndex} type="button" className={`btn ${buttonval.class}`} disabled={buttonval.isDisabled} onClick={handleCancel}>Cancel</button>
              ) : (
                <button key={fieldIndex} type="submit" disabled={buttonval.isDisabled} className={`btn ${buttonval.class}`} onClick={handleSubmit}>
                  {buttonval.label}
                </button>
              )
            ))}
          </div>
        )}
      </form>
    </Suspense>
  );
};

export default NewFormField;
