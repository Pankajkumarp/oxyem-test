import React, { useState } from 'react';
import ReactModal from 'react-modal';
import DocumentTypeComponent from '../../common/SelectComponent/DocumentTypeComponnet'; // Adjusted import
import FileComponent from '../../common/Inputfiled/FileComponent'; // Adjusted import
import Drawer from 'react-modern-drawer';

const customStyles = {
  content: {
    background: '#fff',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const DocumentComponent = ({ isOpen, closeModal ,handleSubmitByDocument}) => {
  const [document, setDocument] = useState({ type: '', files: [] });
  const [errors, setErrors] = useState({});
  const [documentName, setDocumentName] = useState('');
  const [loader, setLoader] = useState(false);
  

  const handleDocumentTypeChange = (value) => {
    setDocument({ ...document, type: value });

    // Clear type error when type is selected
    setErrors({ ...errors, type: '' });
  };

  const handleFileChange = (files) => {
    setDocument({ ...document, files });

    // Clear files error when files are selected
    setErrors({ ...errors, files: '' });
  };

  const handleDocumentNameChange = (e) => {
    setDocumentName(e.target.value);

    // Clear document name error when document name is entered
    setErrors({ ...errors, documentName: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!document.type) {
      errors.type = 'Document type is required';
    }
    if (document.files.length === 0) {
      errors.files = 'Files are required';
    }
    if (!documentName.trim()) {
      errors.documentName = 'Document name is required';
    }

    setErrors(errors);

    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {
      const formData = new FormData();
      
      const fileData = [];

      formData.append('files', document.files[0]); // Assuming single file upload

      fileData.push({
        type: document.type.label, // Only use the label from the type object
        name: document.files[0].name,
        documentName: documentName
      });

      formData.append('fileData', JSON.stringify(fileData));
    
      try {
        setLoader(true);
        await handleSubmitByDocument(formData);
        setLoader(false);
      } catch (error) {
        console.error('Error submitting form', error);
      }
    }
  };

  return (
    <Drawer open={isOpen} onClose={closeModal} direction='right' className='custom-drawer' overlayClassName='custom-overlay' >
    {/* <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Modal"
      style={customStyles}
      ariaHideApp={false}
    > */}
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <h4 className="modal-title mb-3" id="myLargeModalLabel">
              Add Document
            </h4>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <DocumentTypeComponent
                  onChange={handleDocumentTypeChange}
                  label="Document Type"
                  value={document.type}
                />
                {errors.type && <div className="text-danger">{errors.type}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="documentName">Document Name</label>
                <input
                  type="text"
                  id="documentName"
                  className="form-control"
                  value={documentName}
                  placeholder='Enter Document Name'
                  onChange={handleDocumentNameChange}
                />
                {errors.documentName && <div className="text-danger">{errors.documentName}</div>}
              </div>

              <div className="form-group">
                <FileComponent
                  label="Upload Document"
                  onChange={handleFileChange}
                  files={document.files}
                />
                {errors.files && <div className="text-danger">{errors.files}</div>}
              </div>

              <div className="float-end">
                
                <button className='btn btn-primary' type='submit' disabled={loader}>
                {loader ? 
                <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
                </div>
                
                : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    {/* </ReactModal> */}
    </Drawer>
  );
};

export default DocumentComponent;
