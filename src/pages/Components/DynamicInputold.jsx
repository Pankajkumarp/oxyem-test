import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getFieldByName, updatedSubsection } from '../../common/commonFunctions';
import axios from "axios";
import RadioComponent from './common/Inputfiled/RadioComponent';
import moment from 'moment-timezone';
import { axiosJWT } from '../Auth/AddAuthorization';

const components = { 
  'Text': dynamic(() => import('./common/Inputfiled/TextComponent')),
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
  'Roledepartment': dynamic(() => import('./common/SelectComponent/RoledepartmentComponent')),
  'SelectOption': dynamic(() => import('./common/SelectComponent/SelectOptionComponent')),
  'CreateSingleSelect': dynamic(() => import('./common/SelectComponent/CreateSingleSelectComponent')),
};

const CommanForm = ({ fields, handleChangess, handleChangeValue, submitformdata, getleaveoption, isModule, actionid, handleGetformvalueClick, pagename }) => {
  //console.log("feildvalueddddddddd", fields)

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
    console.log()
    const extractedData = extractFields(fields);
    
    setFormData(extractedData);
  }, [fields]);

  const handleChange = async (fieldName, value) => {

    let getfieldarry = await updatedSubsection(fields, fieldName, value)
    setfieldUpdate(getfieldarry)


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
  };

  const handleValidation = async () => {
    const updatedErrors = {};
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
        });
      });
    });
  
    setErrors(updatedErrors);
    return updatedErrors;
  };
  

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      const validationErrors = await handleValidation();

      console.log(submitdata);

      if (Object.keys(validationErrors).length === 0) {
       
        handleChangess(submitdata);
        submitformdata();
      
  
      } else {
        setErrors(validationErrors);
      }
    } catch (error) {
      // Handle error response
    }
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <form>
        {errorres && <div id="messages-container"><div className="alert alert-danger mb-4" role="alert">{errorres}</div></div>}

        {fields.Subsection.map((subsection, subsectionIndex) => (

          <div key={subsectionIndex}>
             {subsection.SubsectionName ? ( <h5 className='mb-5'>{subsection.SubsectionName}</h5> ):null}

             {subsection.formetFiled === true ? (
            <div className="row">
              {subsection.fields.map((field, fieldIndex) => {
                const InputComponent = components[field.type];

                return (
                  <>
                    {field.isVisible !== false &&  field.showinput !== false && field.tablefiled !== true ? (
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
                            isDisabled={field.isDisabled || ""} 
							              showImage={field.showImage || ""} 
							              readonly={field.readonly}
                          />
                          {errors[field.name] && <div className="error text-danger">{errors[field.name]}</div>}
                        </div>
                      </div>
                    ) : (<></>)}
                  </>
                );

              })}

            </div>

):

<>
{!subsection.formetFiled && (
  <table className="table-input-oxyem">
    <thead>
      <tr className="heading">
        <th scope="col">Description</th>
        <th scope="col">Existing BOA</th>
        <th scope="col">Revised BOA</th>
      </tr>
    </thead>
    <tbody>
      {subsection.fields.map((field, fieldIndex) => {
        const InputComponent = components[field.type];
        return (
          <tr key={fieldIndex}>
            <td className="title">{field.label}</td>
            <td>0</td>
            <td>
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
                isDisabled={field.isDisabled || ""} 
                showImage={field.showImage || ""} 
                readonly={field.readonly}
                labelShow={false}
              />
            </td>
          </tr>
        );
      })}
      <tr className="monthlySalary">
        <td className="title2">Total Monthly Salary</td>
        <td>0</td>
        <td>50000</td>
      </tr>
      <tr className="annualSalary">
        <td className="title2">Total Annual Salary</td>
        <td>0</td>
        <td>50000</td>
      </tr>
    </tbody>
  </table>
)}



</>

}

          </div>
        ))}
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
      
      </form>
    </Suspense>
  );
};

export default CommanForm;
