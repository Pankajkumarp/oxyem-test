import React, { useState, useEffect, useRef } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

export default function FileComponent({ label, validations = [], onChange, files }) {
  const isRequired = validations.some(validation => validation.type === "required");
  const [selectedFiles, setSelectedFiles] = useState(files || []);
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    setSelectedFiles(files || []);
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
        setSelectedFiles(prevFiles => {
          const newFiles = [...prevFiles, ...filesArray];
          onChange(newFiles);
          return newFiles;
        });
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
      setSelectedFiles(prevFiles => {
        const newFiles = [...prevFiles, ...filesArray];
        onChange(newFiles);
        return newFiles;
      });
    }
  };

  const handleInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileRemove = (indexToRemove, event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the drop area
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(updatedFiles);
    onChange(updatedFiles);
  };

  return (
    <>
      {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
      <div
        ref={dropRef}
        className="drop-area"
        onClick={handleInputClick}
        style={{ border: '1px dashed #ccc', padding: '11px', textAlign: 'center', cursor: 'pointer' }}
      >
        {selectedFiles.length > 0
          ? selectedFiles.map((file, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{file.name}</span>
              <button
                type="button"
                onClick={(event) => handleFileRemove(index, event)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'red',
                  cursor: 'pointer',
                  marginLeft: '10px'
                }}
              >
                &times;
              </button>
            </div>
          ))
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
  );
}
