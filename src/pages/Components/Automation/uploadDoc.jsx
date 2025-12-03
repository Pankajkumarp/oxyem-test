import React, { useState } from 'react';
import FileComponent from '../common/Inputfiled/MultiFileComponent';

export default function DocumentComponent({ handleChangesDocument, errors, setErrors }) {
  const [documents, setDocuments] = useState({ files: [] });

  const handleFileChange = (files) => {
    setDocuments({ files });

    setErrors('');

    const formData = new FormData();
    const fileData = [];

    files.forEach((file) => {
      formData.append('files', file);
      fileData.push({
        type: 'RequirementDocument', // If there is no type, use a fallback value
        name: file.name
      });
    });

    formData.append('fileData', JSON.stringify(fileData));
    handleChangesDocument(formData);
  };

  return (
    <div className="">
      
              <FileComponent
                label={'Upload documents'}
                onChange={(files) => handleFileChange(files)}
                files={documents.files}
              />
              {errors && (
                <div className="error text-danger">{errors}</div>
              )}
    </div>
  );
}
