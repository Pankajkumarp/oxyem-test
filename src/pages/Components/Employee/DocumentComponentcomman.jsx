import React, { useState, useEffect } from 'react';
import FileComponent from '../common/Inputfiled/FileComponent';
import { IoMdRemoveCircleOutline, IoMdAdd } from "react-icons/io";
import DocumentTypeComponnet from '../common/SelectComponent/DocumentTypeComponnet';
import Buttonsubmit from '../common/Buttons/CommanButtonsubmit';

export default function DocumentComponent({ fields, handlesubmitbyDocumment,loaderSubmitButton }) {
  const [documents, setDocuments] = useState([{ type: '', files: [] }]);

  useEffect(() => {
    if (fields.Subsection[0].fields[0].value !== "") {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDocuments(fields.Subsection[0].fields[0].value)
    }
  }, [fields]);
  const [errors, setErrors] = useState([]);

  const handleAddDocument = () => {
    setDocuments([...documents, { type: '', files: [] }]);
    setErrors([...errors, {}]);
  };

  const handleRemoveDocument = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);

    const updatedErrors = errors.filter((_, i) => i !== index);
    setErrors(updatedErrors);
  };

  const handleDocumentTypeChange = (index, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].type = value;
    setDocuments(updatedDocuments);

    const updatedErrors = [...errors];
    updatedErrors[index] = {};
    setErrors(updatedErrors);
  };

  const handleFileChange = (index, files) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].files = files;
    setDocuments(updatedDocuments);

    const updatedErrors = [...errors];
    updatedErrors[index] = {};
    setErrors(updatedErrors);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errorsAtIndex = documents.map((doc) => {
      const errors = {};
      if (!doc.type) errors.type = 'Document type is required';
      if (doc.files.length === 0) errors.files = 'Files are required';
      return errors;
    });
  
    setErrors(errorsAtIndex);
  
    const hasErrors = errorsAtIndex.some((error) => Object.keys(error).length > 0);
    if (!hasErrors) {
      const formData = new FormData();
      const fileData = [];
      
      documents.forEach((doc) => {
        doc.files.forEach((file) => {
          formData.append('files', file);
          fileData.push({
            type: doc.type.label, // Only use the label from the type object
            name: file.name
          });
        });
      });
  
      formData.append('fileData', JSON.stringify(fileData));
      
      try {
        
        handlesubmitbyDocumment(formData);
        
      } catch (error) {
        console.error('Error submitting form', error);
      }
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="mb-2">
              <button className='btn btn-primary float-end' type="button" onClick={handleAddDocument}><IoMdAdd size={15} /> Add</button>
            </div>
          </div>
          <>
          
            {documents.map((document, index) => (
              <div className="row" key={index}>
                <div className="col-md-6">
                  <div className='form-group'>
                    <DocumentTypeComponnet
                      onChange={(value) => handleDocumentTypeChange(index, value)}
                      label={'Document Type'}
                      value={document.type}
					  name={"projectMang"}
                    />
                    {errors[index] && errors[index].type && <div className="error text-danger">{errors[index].type}</div>}
                  </div>
                </div>
                <div className="col-md-5">
                  <div className='form-group'>
                    <FileComponent
                      label={'Upload document'}
                      onChange={(files) => handleFileChange(index, files)}
                      files={document.files}
                    />
                    {errors[index] && errors[index].files && <div className="error text-danger">{errors[index].files}</div>}
                  </div>
                </div>
                <div className="col-md-1">
                  {index > 0 && (
                    <button type="button" className='btn ' onClick={() => handleRemoveDocument(index)}><IoMdRemoveCircleOutline size={22} color='red' /></button>
                  )}
                </div>
              </div>
            ))}
          </>

           {loaderSubmitButton ? (
          <>
          <div className="float-end">
                  <button type="button" className="btn btn-primary mb-2 ms-2" disabled>
                    <div className="spinner">
                              <div className="bounce1"></div>
                              <div className="bounce2"></div>
                              <div className="bounce3"></div>
                            </div></button>
                </div>
          </>
                ) : 

          <div className="float-end">
            {fields.buttons.map((btnsection) => (
              // eslint-disable-next-line react/jsx-key
              <Buttonsubmit label={btnsection.value} customclass={btnsection.class} handleSubmit={handleSubmit}/>
            ))}
          </div>
          }
        </div>

      </div>


    </form>
  );
}
