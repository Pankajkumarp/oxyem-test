import React from 'react';
import FileComponent from '../common/Inputfiled/FileComponent';
import { IoMdRemoveCircleOutline, IoMdAdd } from "react-icons/io";
import MandatorydocumentsTable from './InnerComponent/MandatorydocumentsTable';
import DocumentTypeComponnet from '../common/SelectComponent/DocumentTypeComponnet';
import ButtonPrimary from '../common/Buttons/ButtonPrimaryComponent';

export default function DocumentComponent({experience, fields, handleChangess, handlesubmitbyDocumment, documents, setDocuments, errors, setErrors }) {


  const handleAddDocument = () => {
    setDocuments([...documents, { type: '', files: [] }]);
    setErrors([...errors, {}]);
  };

  const handleRemoveDocument = (index) => {
    const updatedDocuments = documents.filter((doc, i) => i !== index);
    setDocuments(updatedDocuments);

    const updatedErrors = errors.filter((error, i) => i !== index);
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
        handleChangess(documents);
      } catch (error) {
        console.error('Error submitting form', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-8">
          <div className="row">
            <div className="mb-2">
              <button className='btn btn-primary float-end' type="button" onClick={handleAddDocument}><IoMdAdd size={15}/> Add</button>
            </div>
          </div>
          <>
            {documents.map((document, index) => (
              <div className="row" key={index}>
                <div className="col-md-5">
                  <div className='form-group'>
                    <DocumentTypeComponnet
                      onChange={(value) => handleDocumentTypeChange(index, value)}
                      label={'Document Type'}
                      value={document.type} // Ensure controlled component behavior
                      experience={experience}
                    />
                    {errors[index] && errors[index].type && <div className="error text-danger">{errors[index].type}</div>}
                  </div>
                </div>
                <div className="col-md-5">
                  <div className='form-group'>
                    <FileComponent
                      label={'Upload document'}
                      onChange={(files) => handleFileChange(index, files)}
                      files={document.files} // Ensure controlled component behavior
                    />
                    {errors[index] && errors[index].files && <div className="error text-danger">{errors[index].files}</div>}
                  </div>
                </div>
                <div className="col-md-2">
                  {index > 0 && (
                    <button type="button" className='btn ' onClick={() => handleRemoveDocument(index)}><IoMdRemoveCircleOutline size={22} color='red'/></button>
                  )}
                </div>
              </div>
            ))}
          </>
        </div>
        <div className="col-md-4">
          <MandatorydocumentsTable documents={documents} experience={experience}/>
        </div>
      </div>
      <div className="float-end">
        <ButtonPrimary btntype={'submit'} label={'Next'} onClick={handleSubmit} />
      </div>
    </form>
  );
}
