import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getFieldByName, updatedSubsection } from '../../common/commonFunctions';
import axios from "axios";
import RadioComponent from '../Components/common/Inputfiled/RadioComponent';
import moment from 'moment-timezone';
import { axiosJWT } from '../Auth/AddAuthorization';
import Viewallowence  from './view.jsx';
import { FaRegEye } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import Select from '../Components/common/SelectComponent/CreateSingleSelectComponent';
const components = {
  'Text': dynamic(() => import('../Components/common/Inputfiled/TextComponent')),
  'OnlyText': dynamic(() => import('../Components/common/Inputfiled/OnlyTextComponent')),
  'TextwithAdd': dynamic(() => import('../Components/common/Inputfiled/TextComponentwithAddField')),
  'Time': dynamic(() => import('../Components/common/Inputfiled/TimeComponent')),
  'Date': dynamic(() => import('../Components/common/Inputfiled/DateComponent')),
  'Password': dynamic(() => import('../Components/common/Inputfiled/PasswordComponent')),
  'Number': dynamic(() => import('../Components/common/Inputfiled/NumberComponent')),
  'Button': dynamic(() => import('../Components/common/Buttons/ButtonComponent')),
  'Email': dynamic(() => import('../Components/common/Inputfiled/EmailComponent')),
  'Location': dynamic(() => import('../Components/common/SelectComponent/LocationComponent')),
  'Role': dynamic(() => import('../Components/common/SelectComponent/RoleComponent')),
  'Status': dynamic(() => import('../Components/common/SelectComponent/StatusComponent')),
  'Employee': dynamic(() => import('../Components/common/SelectComponent/EmployeeComponent')),
  'Select': dynamic(() => import('../Components/common/SelectOption/SelectComponent')),
  'radio': dynamic(() => import('../Components/common/Inputfiled/RadioComponent')),
  'RadioButton': dynamic(() => import('../Components/common/Inputfiled/RadioButtonComponent')),
  'Textwithicon': dynamic(() => import('../Components/common/Inputfiled/TextwithiconComponent')),
  'Textarea': dynamic(() => import('../Components/common/Inputfiled/TextAreaComponentcomman')),
  'SelectEmployee': dynamic(() => import('../Components/common/Inputfiled/SelectEmployee')),
  'Popupform': dynamic(() => import('../Components/common/Inputfiled/Popupform')),
  'Checkbox': dynamic(() => import('../Components/common/Inputfiled/CheckboxComponent')),
  'SelectOption': dynamic(() => import('../Components/common/SelectComponent/SelectOptionComponent')),
  'CreateSingleSelect': dynamic(() => import('../Components/common/SelectComponent/CreateSingleSelectComponent')),
  'ExitingShift': dynamic(() => import('../Components/common/SelectComponent/ExistingShift')),
  'Textleftlable': dynamic(() => import('../Components/common/Inputfiled/TextLeftLableComponent')),
  'MounthPicker': dynamic(() => import('../Components/common/Inputfiled/MonthDateComponent')),
  'TextSalary': dynamic(() => import('../Components/common/Inputfiled/TextSalaryComponent')),
};

const NewFormField = ({ fieldsvalue, handleChangeValue, submitformdata, actionid, handleGetformvalueClick, pagename, showButton, showleave, getChangessField, tdsAmount, salaryAmount,pageedit }) => {

  const [fields, setFields] = useState(fieldsvalue);
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
    const extractedData = extractFields(fields);
    setFormData(extractedData);
  }, [fields]);

  

  const handleChange = async (fieldName, value) => {

    let getfieldarry = await updatedSubsection(fields, fieldName, value)
    if (pagename === "addPayRollNonemp") {
      getChangessField(getfieldarry)
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

    handleChangeValue(fieldName, value);
    if (pagename === "create_allowance") {
      submitformdata(formData)
    }
  };

  const [additionalFields, setAdditionalFields] = useState({
    earning: [],
    deductions: []
  });
  
    const calculateSalary = () => {
  const totalEarnings = additionalFields.earning.reduce((sum, field) => {
    return sum + (parseFloat(field.attributeValue) || 0);
  }, 0);
 
  const totalDeductions = additionalFields.deductions.reduce((sum, field) => {
    return sum + (parseFloat(field.attributeValue) || 0);
  }, 0);
 
  const netSalary = totalEarnings - totalDeductions;
 
  return { totalEarnings, totalDeductions, netSalary };
};
 
  useEffect(() => {
  const { netSalary } = calculateSalary();
 
  setFields(prevFields => {
    const updated = { ...prevFields };
    updated.Subsection.forEach(subsection => {
      subsection.fields.forEach(field => {
        if (field.type === "TextSalary") {
          field.value = netSalary;
        }
      });
    });
    return updated;
  });
 
}, [additionalFields]);

  const validateFields = () => {
    let isValid = true;
    const newEarning = additionalFields.earning.map(field => {
      if (
         field.name.trim() === '' ||
        field.attributeValue.trim() === ''
      ) {
        isValid = false;
        return { ...field, error: true };
      }
      return { ...field, error: false };
    });
  
    const newDeductions = additionalFields.deductions.map(field => {
      if (
        field.name.trim() === '' || 
        field.attributeValue.trim() === ''
      ) {
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
  
  const handleValidation = async () => {
    const updatedErrors = {};
  
    if (pagename === "addPayRoll") {
      fields.Subsection.forEach((subsection) => {
        subsection.fields.forEach((field) => {
          if (field.name === "idEmployee" || field.name === "applicableFrom") {  // Check if the field name matches
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
          }
        });
      });
    }
    
    setErrors(updatedErrors);
    return updatedErrors;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validationErrors = await handleValidation();
      

      if (Object.keys(validationErrors).length === 0) {
        if (validateFields()) {
                    

          submitformdata(additionalFields);
        }
      }

    } catch (error) {
      // Handle error response
    }
  };

  const handleChangeAdd = async (fieldName, value) => {};

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

  const editAdditionalfiled = async (fieldName, value) => {
    try {
      setAdditionalFields(prevState => {
        // Copy the previous state to preserve existing data
        const updatedFields = { ...prevState };
  
        if (fieldName === "otherAllowance") {
          // Add new earnings to the existing earnings array
          if (Array.isArray(value)) {
          value.forEach(item => {
            updatedFields.earning.push(item);
          });
        }
        } else if (fieldName === "deductionOtherAllowance") {
          // Add new deductions to the existing deductions array
          if (Array.isArray(value)) {
          value.forEach(item => {
            updatedFields.deductions.push(item);
          });
        }
        }
  
        return updatedFields; // Return the updated state
      });
    } catch (error) {
      
    }
  };
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => {

    setIsDrawerOpen(true);

  };

  const closeDrawer = async () => {

    setIsDrawerOpen(false);

  };
  
  return (
     <>

  <Viewallowence isOpen={isDrawerOpen} closeModal={closeDrawer}/>
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
                                selectedAsset={field.value} 
                                editAdditionalfiled={editAdditionalfiled}
                                pageedit={pageedit}
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
                                editAdditionalfiled={editAdditionalfiled}
                                pageedit={pageedit}
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
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Description</label>
                            <input 
                            label="Description"
                            type="text"
                              value={field.name}
                              onChange={(e) => handleFieldChange('earning', index, 'name', e.target.value)}
                              className="form-control mb-2"
                              documentType={'other_allowances'}
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
                              value={field.attributeValue}
                              onChange={(e) => handleFieldChange('earning', index, 'attributeValue', e.target.value)}
                              className="form-control"
                            />
                            {field.error && !field.attributeValue && (
                              <div className="error text-danger">Amount is required</div>
                            )}
                          </div>
                        </div>
                            <div className="col-md-2 d-flex mt-2 add_payroll_icon">
                 <span className="me-2 view-icon"
                 onClick={openDrawer}
               >
                 <FaRegEye />
               </span>
               <span
                                       className="del-icon"
                                       onClick={() => handleDeleteField('earning', index)}
                          style={{ cursor: "pointer"}}
                                     >
                                       <RiDeleteBinLine style={{ color: "#f44336" }} />
                                     </span>
             </div>
                       
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
                                editAdditionalfiled={editAdditionalfiled}
                                pageedit={pageedit}
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
                              value={field.attributeValue}
                              onChange={(e) => handleFieldChange('deductions', index, 'attributeValue', e.target.value)}
                              className="form-control"
                            />
                            {field.error && !field.attributeValue && (
                              <div className="error text-danger">Amount is required</div>
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
    </>
  );
};

export default NewFormField;