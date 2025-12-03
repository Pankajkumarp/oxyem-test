import React, { useState, useEffect, useRef } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';
import { IoMdClose } from "react-icons/io";
export default function InputFileComponent({ type, placeholder, label, validations = [], onChange, files, value }) {
  const isRequired = validations.some(validation => validation.type === "required");
  const [innerValue, setInnerValue] = useState("");
  const [showValue, setShowValue] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    if (value === "") {
      setShowValue(true)
    }else{
      if (typeof value === 'string') {
        const filename = value.split('/').pop();
        setShowValue(false)
        setInnerValue(filename)
      } else if (Array.isArray(value)) {
       // setShowValue(false)
      }
      
    }
  }, [value]);

  useEffect(() => {
    if (files) {
      setSelectedFiles(files);
    }
  }, [files]);

  useEffect(() => {
    const dropArea = dropRef.current;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('drag-over');
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.add('drag-over');
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropArea.classList.remove('drag-over');

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files);
        setSelectedFiles(filesArray);
        onChange(filesArray); // Send the files array to the parent component
        e.dataTransfer.clearData();
      }
    };

    dropArea.addEventListener('dragenter', handleDragEnter);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragenter', handleDragEnter);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      console.log("filesArray", filesArray)
      onChange(filesArray); // Send the files array to the parent component
    }
  };

  const handleInputClick = () => {
    fileInputRef.current.click();
  };
  const handleClesrClick = () => {
    setShowValue(true)
    onChange("");
  };

  return (
    <>
      {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}

      {showValue ? (
        <>
          <div
            ref={dropRef}
            className="drop-area"
            onClick={handleInputClick}
            style={{ border: '1px dashed #ccc', padding: '11px', textAlign: 'center', cursor: 'pointer' }}
          >
            {selectedFiles.length > 0
              ? selectedFiles.map(file => file.name).join(', ')
              : 'Drag and drop or select file'}
          </div>
          <input
            type="file"
            className="form-control"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </>
      ) : (
        <div
            ref={dropRef}
            className="drop-area"
           
            style={{ border: '1px dashed #ccc', padding: '11px', textAlign: 'center', cursor: 'pointer' }}
          >{innerValue}<span className='oxyem_file_close' onClick={handleClesrClick}><IoMdClose /></span></div>
      )}
    </>
  );
}



