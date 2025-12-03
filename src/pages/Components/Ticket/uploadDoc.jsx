import React, { useState } from 'react';
import FileComponent from '../common/Inputfiled/FileComponent';

export default function DocumentComponent({ handleChangesDocument, errors, setErrors }) {
  const [documents, setDocuments] = useState({ files: [] });

  const handleFileChange = (files) => {
    setDocuments({ files });
    setErrors('');

    handleChangesDocument(files);
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