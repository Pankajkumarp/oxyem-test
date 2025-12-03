import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { IoDownloadOutline } from 'react-icons/io5';
const assignDocuView = ({ isOpen, closeModal, isDoc }) => {

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [docummentViewData, setDocummentView] = useState({});
  const [status, setStatus] = useState("");
  const getDocumentDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/docuSign/view`, {
        params: { id: id }
      });
      if (response && response.data && response.data.data) {
        const information = response.data.data
        setDocummentView(information)
        if (information.Status) {
          setStatus(information.Status);
        }
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if (isOpen) {
      getDocumentDetails(isDoc);
      document.body.classList.add("hide-body-scroll");
    } else {
      document.body.classList.remove("hide-body-scroll");
      setStatus("")
      setDocummentView({})
    }
  }, [isOpen, isDoc]);
  const renderdocTypeImag = (value) => {
    const getImage = () => {
      switch (value?.toLowerCase()) {
        case "pdf":
          return "/assets/img/pdf.png";
        case "doc":
        case "docs":
        case "docx":
          return "/assets/img/docs.png";
        case "img":
        case "image":
        case "jpg":
        case "jpeg":
        case "png":
          return "/assets/img/img.png";
        default:
          return "/assets/img/unknown.png";
      }
    };

    return (
      <span className="oxyem-mark-doc-img-list">
        <img
          src={getImage()}
          className="table-inner-image"
          alt={value}
        />
      </span>
    );
  };

  const renderdownloadButon = (value) => {
    return (
      <span
        className="oxyem-mark-doc-img"
        data-tooltip-id="my-tooltip-datatable"
        data-tooltip-content="Download"
      >
        <IoDownloadOutline
          style={{ cursor: 'pointer' }}
          size={20}
          color="#2196f3"
          onClick={() => handleDownloadClickWithPath(value)}
        />
      </span>
    );
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
        responseType: 'blob', // Important for file download
      });

      // Create a URL for the file and download it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = getFileName(filePath);
      link.setAttribute('download', fileName); // or extract the file name from the response
      document.body.appendChild(link);
      link.click();

    } catch (error) {
      // console.error('Error downloading the file', error);
    }
  };
  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction='right'
      className='custom-drawer'
      overlayClassName='custom-overlay'
    >
      <div className="modal-dialog modal-lg  histroy-process-modal">
        <div className="modal-content main-view-box-leave">
          <div className="modal-header mb-2 detail-box-leave">
            <button className="oxyem-btn-close" onClick={closeModal}>
                          <MdClose />
                        </button>
            <h4 className="modal-title space-top" id="myLargeModalLabel"><MdOutlineRemoveRedEye /> View Document Details {status ?<div className={`postion-right top-box-leave-right leave-${status}`}>{status}</div>:null}</h4>
          </div>
          <div className="modal-body " id="dochistroy">
            <table cellPadding="8">
              <tbody>
                {Object.entries(docummentViewData).map(([key, value]) => (
                  <tr key={key} className="inner-table-view">
                    <td><strong>{key}</strong></td>

                    <td>
                      <td>
                        {key.toLowerCase() === "document type" ? (
                          renderdocTypeImag(value)
                        ) : key.toLowerCase() === "download" ? (
                          renderdownloadButon(value)
                        ) : (
                          value || "-"
                        )}
                      </td>

                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default assignDocuView;
