/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import DocumentComponent from '../UploadFile/uploadfile';


export default function AttachmentComponent({ attachments =[], handleChangesDocument, errors, setErrors}) {
  if (!attachments || attachments.length === 0) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (attachments?.length > 0) {
      handleChangesDocument(prev => ({
        ...prev,
        file: attachments
      }));
    }
  }, [attachments]);
  
  

  return (
    <div>
    <DocumentComponent 
      handleChangesDocument={handleChangesDocument}
      setErrors={setErrors}
      errors={errors}
    />

    {attachments.length > 0 && (
      <div className="attachments-container">
        {attachments.map((file, index) => (
          <div key={index} className="attachment-wrapper">
            <img
              src={file.url || URL.createObjectURL(file.file)}
              alt={file.name}
              className="attachment-image"
            />
          </div>
        ))}
      </div>
    )}
  </div>
);
}
