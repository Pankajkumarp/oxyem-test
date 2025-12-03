import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import axios from "axios";
import Cookies from 'js-cookie';
import {useRouter} from 'next/router'
const components = {     
 //'Select': dynamic(() => import('./common/SelectOption/SelectComponent')),
 'Button': dynamic(() => import('./common/Buttons/ButtonComponent')),
  'Email': dynamic(() => import('./common/Inputfiled/EmailComponent')),
  'Password': dynamic(() => import('./common/Inputfiled/PasswordComponent')),
};

const DynamicForm = ({ fields, apiurl, gethandleChange }) => { 
  const router = useRouter()  
  const [errors, setErrors] = useState([]);
  const [errorres, setErrorres] = useState('');
  const allkeys = Object.fromEntries(fields.fields.map(item => [item.name, '']));
  const filteredObj = Object.fromEntries(
    Object.entries(allkeys).filter(([key, value]) => value !== undefined && key !== 'undefined')
  );
  const [formData, setFormData] = useState(filteredObj);

 // console.log(formData)
  const handleChange = (fieldName, value) => {
    setFormData((formData) => ({
      ...formData,
      [fieldName]: value,
    }));

    setErrors((errors) => ({
      ...errors,
      [fieldName]: '',
    }));
  };


   const handleValidation  = async (formData) => { 
  //  console.log("tttt", formData);
    const updatedErrors = {}; 
    fields.fields.forEach((mainitem) => { 
      mainitem.validations.forEach((item) => {       
            if (item && item.type =="required" && !formData[mainitem.name].trim()) {                      
               updatedErrors[mainitem.name]= item.params            
            } else if (formData[mainitem.name] != "" && item && item.type == "validEmail") {
              const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[mainitem.name]);
             if (!isValidEmail) {
                updatedErrors[mainitem.name]= item.params
              }
             
            }
      })
    })
    setErrors(updatedErrors)
    return updatedErrors
  };
  const handleSubmit = async (e) => {
		e.preventDefault();
		try {
     	const validationErrors = await handleValidation(formData);      
     if (Object.keys(validationErrors).length === 0) {    
		  const response = await axios.post(`${apiurl}`, formData)
      const apiresponse = response.data != "" ? response.data :"";
      //console.log("yyy",apiresponse.qrimage)
      gethandleChange(apiresponse)
     } else {
      // Update state with validation errors
      setErrors(validationErrors);
    }

			
		} catch (error) {    
      
			const errormessage  = error.response.data
     // console.log("666",errormessage)  
			gethandleChange(errormessage)
		  // Handle network error or other exceptions
		  }
	  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
      <form onSubmit={handleSubmit}>
      {errorres && <div id="messages-container"><div className="alert alert-danger  mb-4" role="alert">{errorres}</div></div>}
        {fields.fields.map((field, fieldIndex) => {
          const InputComponent = components[field.type];
          if (field.type != 'Button') {
            return (       
            <div key={fieldIndex}>
          
              <InputComponent                           
                label={field.label}
                placeholder={field.placeholder}               
                value={formData[field.name] || ''}
                validations={field.validations}
                error={errors[field.name]}
                onChange={(value) => {handleChange(field.name, value); }}
              />
              {errors[field.name] && <div className="error">{errors[field.name]}</div>}
              </div>
             )
            }else if(field.type === 'Button') {
              return (
                <div key={fieldIndex}>
          
                <InputComponent      
                  btntype = {field.buttontype}                    
                  label={field.label}
                 
                />                
                </div>
                )
             
            }
          

         
        })}
         
            </form>
      </Suspense>
    </>
  );
};

export default DynamicForm;