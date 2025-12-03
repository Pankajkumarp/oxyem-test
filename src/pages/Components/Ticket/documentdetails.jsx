import React from 'react';
import { IoDownloadOutline } from 'react-icons/io5';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';


export default function DocumentDetails({ documents, ticketDetails }) {
  
  const handleDownloadClickWithPath = async (path) => {

    const filePath = path;

    try {

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/download`, {
            params: { filePath},
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

const getFileName = (path) => {
  return path.substring(path.lastIndexOf('/') + 1);
};
  

  return (
    <>
      <div className="col-md-12 mt-4">
        <p className='ticket-detail-doc-page-title'><strong>Documents Uploaded:</strong></p>
        <ul className="personal-info-header-right ticket-detail-doc-page top-details">
          <li className="document-item">
                <div className="title">document</div>
                <div className="text" style={{ width: '10%' }}>
                 <IoDownloadOutline
  // size={25}
  style={{ cursor: 'pointer' }} size={20} color='#FA7E12'
  onClick={() => handleDownloadClickWithPath(documents)}
/>

                </div>
              </li>
        </ul>
      </div>
    </>
  );
}
