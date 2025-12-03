import React, { useState, useEffect } from "react";
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import Files from 'react-files'
import { FiUpload } from 'react-icons/fi';
import { FaRegCheckCircle } from "react-icons/fa";
import { GrDocumentUpdate } from "react-icons/gr";
import FileTable from './FileTable.jsx';

const UploadFileDetail = ({ documentId, documentFor }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [documentData, setDocumentData] = useState([]);
  const [fieldValue, setFieldValue] = useState({
    filePaths: {
      loader: null,
      files: []
    }
  });

  const getUploadList = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/getDocumentList`, {
        params: {
          id: id,
          isFor: documentFor,
        },
      });
      if (response && response.data) {
        setDocumentData(response.data.data)
      }
    } catch (error) {
      console.error("Error occurred while fetching documents:", error);
    }
  };

  useEffect(() => {
    getUploadList(documentId);
  }, [documentId]);

  const handleFileChange = async (files) => {
    setFieldValue(prev => ({
      ...prev,
      filePaths: { ...prev.filePaths, loader: "uploading" }
    }));

    try {
      let formData = new FormData();
      files.forEach(file => formData.append("files", file));
      formData.append("idModule", documentId);
      formData.append("isFor", documentFor);

      const response = await axiosJWT.post(
        `${apiUrl}/UploadDocuments`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      
      if (response) {
        const newFile = response.data.uploaded[0];
        const mappedData = {
          "Sr No.": "",
          "Id": newFile.idDocument,
          "Title": newFile.fileName,
          "Doc Type": newFile.fileExtenstion,
          "Uploaded Date": newFile.submitDate,
          "Size": newFile.fileSize,
          "download": newFile.filePath
        };
        setDocumentData(prev => [mappedData, ...prev]);
      }

      setFieldValue(prev => ({
        ...prev,
        filePaths: {
          loader: "uploaded",
          files: response.data.filePaths || []
        }
      }));

      setTimeout(() => {
        setFieldValue(prev => ({
          ...prev,
          filePaths: {
            ...prev.filePaths,
            loader: ""
          }
        }));
      }, 1000);

    } catch (error) {
      console.error("Upload error:", error);
      setFieldValue(prev => ({
        ...prev,
        filePaths: { ...prev.filePaths, loader: "error" }
      }));
    }
  };

  return (
    <div className="upload-doc-section">
      <div className="row">
        {/* File Table - 8 Columns */}
        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
          {documentData && documentData.length > 0 ? (
            <FileTable files={documentData} />
          ) : (
            <div className="no-documents">No previous document found</div>
          )}
        </div>
        {/* Upload Area - 4 Columns */}
        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
          <div className='upload-doc_summary_upload'>
            <GrDocumentUpdate /> <p>Please upload any additional supporting documents.</p>
          </div>
          
          <div className="upload-doc-popup-card">
            <div className="files custom_file_field_b">
              <Files
                className='files-dropzone'
                onChange={handleFileChange}
                accepts={['image/png', 'image/jpg', 'image/jpeg', 'image/webp', '.pdf', '.doc', '.docx']}
                multiple
                maxFileSize={3000000}
                minFileSize={0}
                clickable={true}>
                <FiUpload /> Drag & Drop your files or <span className="filepond--label-action">Browse</span>
                {fieldValue.filePaths.loader === "uploading" ? (
                  <span className='fileupload-pending'>
                    <img src="/assets/img/upload-p.gif" alt="upload" />
                  </span>
                ) : fieldValue.filePaths.loader === "uploaded" ? (
                  <span className='fileupload-check'>
                    <FaRegCheckCircle />
                  </span>
                ) : null}
              </Files>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default UploadFileDetail;