import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getFieldByName, updatedSubsection } from '../../common/commonFunctions';
import RadioComponent from './common/Inputfiled/RadioComponent';

const components = {
  'Text': dynamic(() => import('./common/Inputfiled/TextComponent')),
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
  'SelectOption': dynamic(() => import('./common/SelectComponent/SelectOptionComponent')),
  'CreateSingleSelect': dynamic(() => import('./common/SelectComponent/CreateSingleSelectComponent')),
};

const CommanForm = ({ fields, apiurl, handleChangess, Openedsection, handleChangeValue, content, getleavedetail, submitformdata, getleaveoption, isModule, actionid, handleGetformvalueClick }) => {
  const [errors, setErrors] = useState({});
  const [errorres, setErrorres] = useState('');
  const [submitdata, setSubmitdata] = useState({});
  const [formData, setFormData] = useState({});
  const [currentFormData, setCurrentFormData] = useState({});
  const [fieldUpdate, setfieldUpdate] = useState([]);

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

  useEffect(() => {
    if (fieldUpdate !== "" && isModule == "Leave") {
      getFieldByName(fieldUpdate, "leaveType")
        .then(leaveType => {
          return getFieldByName(fieldUpdate, "fromDate")
            .then(fromDate => {
              return getFieldByName(fieldUpdate, "toDate")
                .then(toDate => {
                  return getFieldByName(fieldUpdate, "idEmployee")
                    .then(idEmployee => {
                      if (leaveType && fromDate && toDate) {
                        const getvalue = {
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
  }, [formData.fromDate, formData.toDate, fieldUpdate]);

  const handleChange = async (fieldName, value) => {
    let getfieldarry = await updatedSubsection(fields, fieldName, value);
    setfieldUpdate(getfieldarry);
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

    if (isModule == "Leave") {
      const formfieldarray = ["leaveType", "fromDate", "toDate", "idEmployee"];
      if (formfieldarray.includes(fieldName)) {
        const extractedData = extractFields(fields);
        getleaveoption({ ...currentFormData, [fieldName]: value }, extractedData);
      }
    }
  };

  const handleValidation = async () => {
    const updatedErrors = {};
  
    fields.Subsection.forEach((subsection) => {
      if (subsection.isVisible !== false) {
        subsection.fields.forEach((field) => {
          field.validations.forEach((validation) => {
            const value = formData[field.name];
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
      }
    });
  
    if (formData.BankAccountNo !== formData.BankConformAccountNo) {
      updatedErrors.BankConformAccountNo = 'Bank account number does not match';
    }
  
    setErrors(updatedErrors);
    return updatedErrors;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validationErrors = await handleValidation();

      if (Object.keys(validationErrors).length === 0) {
        handleChangess(submitdata);
        submitformdata();
      } else {
        setErrors(validationErrors);
      }
    } catch (error) {
      console.error("Error handling submit:", error);
    }
  };

  const handleChangeAdd = async (fieldName, value) => {
    handleChangeValue(fieldName, value);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <form>
        {errorres && <div id="messages-container"><div className="alert alert-danger mb-4" role="alert">{errorres}</div></div>}
        {fields.Subsection.map((subsection, subsectionIndex) => (
          <div key={subsectionIndex}>
            {subsection.isVisible !== false && (
              <>
                <h5 className='mb-5'>{subsection.SubsectionName}</h5>
                <div className="row">
                  {subsection.fields.map((field, fieldIndex) => {
                    const InputComponent = components[field.type];
                    return (
                      field.isVisible !== false && (
                        <div className={`col-md-${field.col}`} key={fieldIndex}>
                          <div className={`form-group ${field.type === "Checkbox" ? "checkbox-form-group" : ""}`}>
                            <InputComponent
                              label={field.label}
                              placeholder={field.placeholder}
                              validations={field.validations}
                              onChange={(value) => handleChange(field.name, value)}
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
                            />
                            {errors[field.name] && <div className="error text-danger">{errors[field.name]}</div>}
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
        <div className="text-end w-100">
          {fields.buttons.map((buttonval, fieldIndex) => (
            buttonval.type === 'radio' ? (
              <RadioComponent key={fieldIndex} value={buttonval.value} label={buttonval.label} options={buttonval.options} onChange={(value) => handleChangeAdd(buttonval.name, value)} />
            ) : (
              <button key={fieldIndex} type="submit" className={`btn ${buttonval.class}`} onClick={handleSubmit}>
                {buttonval.label}
              </button>
            )
          ))}
        </div>
      </form>
    </Suspense>
  );
};

export default CommanForm;
