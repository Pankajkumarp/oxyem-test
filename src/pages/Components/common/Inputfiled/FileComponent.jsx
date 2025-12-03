import React, { useState, useEffect, useRef } from 'react';
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

export default function FileComponent({ type, placeholder, label, validations = [], onChange, files }) {
  const isRequired = validations.some(validation => validation.type === "required");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

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
      onChange(filesArray); // Send the files array to the parent component
    }
  };

  const handleInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
      <div
        ref={dropRef}
        className="drop-area"
        onClick={handleInputClick}
        style={{ border: '1px dashed #ccc', padding: '11px', textAlign: 'center' ,cursor: 'pointer'}}
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
  );
}

// import React, { useState, useEffect, useRef } from 'react';
// import LabelMandatory from '../Label/LabelMandatory';
// import LabelNormal from '../Label/LabelNormal';

// export default function FileComponent({ type, placeholder, label, validations = [], onChange, files }) {
//   const isRequired = validations.some(validation => validation.type === "required");
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     if (files) {
//       setSelectedFiles(files);
//     }
//   }, [files]);

//   const handleFileChange = (event) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const filesArray = Array.from(event.target.files);
//       setSelectedFiles(filesArray);
//       onChange(filesArray); // Send the files array to the parent component
//     }
//   };

//   const handleInputClick = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <>
//       {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
//       <input
//         type="text"
//         className="form-control"
//         placeholder="No file selected"
//         value={selectedFiles.map(file => file.name).join(', ')}
//         onClick={handleInputClick}
//         readOnly
//       />
//       <input
//         type="file"
//         className="form-control"
//         multiple
//         onChange={handleFileChange}
//         ref={fileInputRef}
//         style={{ display: 'none' }}
//       />
//     </>
//   );
// }


