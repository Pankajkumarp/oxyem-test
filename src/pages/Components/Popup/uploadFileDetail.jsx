import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import Drawer from 'react-modern-drawer'
import { MdDriveFolderUpload } from "react-icons/md";
import 'react-modern-drawer/dist/index.css'
import Files from 'react-files'
import { FiUpload } from 'react-icons/fi';
import { FaRegCheckCircle } from "react-icons/fa";
import { GrDocumentUpdate } from "react-icons/gr";
import { MdDownload } from 'react-icons/md';
const uploadFileDetail = ({ isOpen, closeModal, documentId, documentFor }) => {
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
      console.error("Error occurred while fetching attendance details:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getUploadList(documentId);
    }
  }, [isOpen, documentId]);
  const handleFileChange = async (files, documentId) => {
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
  const getFileName = (path) => {
  return path.substring(path.lastIndexOf('/') + 1);
};
  
const handleDownloadClickWithPath = async (path) => {
  const filePath = path;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await axiosJWT.get(`${apiUrl}/download`, {
      params: { filePath },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const fileName = getFileName(filePath);
    link.setAttribute('download', fileName); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading the file', error);
  }
};

  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction='right'
      className='custom-drawer'
      overlayClassName='custom-overlay' // Apply the custom overlay class
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <h4 className="modal-title" id="myLargeModalLabel"></h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <div className="modal-body oxyem-attendence-popup">
            <div className='upload-doc_summary_upload'>
              <GrDocumentUpdate /> <p>Please upload any additional supporting documents.</p>
            </div >
            <div className="upload-doc-popup-card">
              <div className="files custom_file_field_b">
                <Files
                  className='files-dropzone'
                  onChange={(files) => handleFileChange(files, documentId)}
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
              {documentData && documentData.length > 0 ? (
                <div className='file_table_data_f'>
                  <table>
                    <thead>
                      <tr>
                        <th className='f_h'>Title</th>
                        <th className='d_h'>Dl</th>
                        <th className='s_h'>Info</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentData.map((file, index) => (
                        <tr className='bottom_table_line' key={file.Id}>
                          <td className='name_ic'>
                            <div className='highlight_t_s'>{file["Uploaded Date"]}</div>
                            <div>{file["Title"]}</div>
                          </td>
                          <td className='svg_ic'>
                            <span onClick={() => handleDownloadClickWithPath(file["download"])}>
                              <MdDownload />
                            </span>
                          </td>
                          <td className='type_ic'><div>{file["Doc Type"]}</div><div>({file["Size"]})</div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (<div className="no-documents">
                No previous document found
              </div>)}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default uploadFileDetail;
