import React from 'react';
import { IoDownloadOutline } from 'react-icons/io5';

export default function DocumentDetails({ documents ,claimDetails}) {
  const handleDownload = (filePath) => {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    const fileUrl = `${baseUrl}/${filePath}`;
    window.open(fileUrl, '_blank');
  };

  return (
    <>
      <div className="col-md-12 mt-4">
        <p className='claim-detail-doc-page-title'><strong>Documents Uploaded:</strong></p>
        <ul className="personal-info-header-right claim-detail-doc-page top-details">
          {documents && documents.length > 0 ? (
            documents.map((doc, index) => (
              <li key={index} className="document-item">
                <div className="title">{index + 1}. {doc.split('/').pop()}</div>
                <div className="text" style={{ width: '10%' }}>
                  <IoDownloadOutline size={25} onClick={() => handleDownload(doc)} />
                </div>
              </li>
            ))
          ) : (
            <p>No documents Uploaded</p>
          )}
        </ul>
        {claimDetails && claimDetails.status === 'paid' && (
        <div className="image-container-claim">
            <img src='/assets/img/paidIcon.png' className="absolute-image-claim" alt='icon' />
        </div>
        )}
      </div>

    </>
  );
}
