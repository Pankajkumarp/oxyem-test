import React, { useState, useEffect } from 'react';
import { IoIosCheckmarkCircleOutline, IoIosCloseCircleOutline } from 'react-icons/io';
import { axiosJWT } from '../../../Auth/AddAuthorization';

export default function MandatorydocumentsTable({ documents, experience, onAllUploaded }) {
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
          params: { isFor: 'employeeMaster' }
        });

        // Get only 3 mandatory documents
        const optionsData = response.data.data
          .filter(item => {
            if (!experience && item.isExperience) return false;
            return ['Pan card', 'Aadhaar card', 'Qualification Document'].includes(item.name);
          })
          .slice(0, 3);

        setList(optionsData);
      } catch (error) {
        console.error('Error fetching options:', error);
        setError(error.message || 'Failed to fetch options');
      }
    };

    fetchOptions();
  }, [experience]);

  // Check if all required documents are uploaded
  const allUploaded =
    list.length > 0 &&
    list.every(item =>
      documents.some(
        doc =>
          doc.type?.value === item.id &&
          doc.files &&
          Object.keys(doc.files).length > 0
      )
    );

  // ✅ Notify parent about the upload status
  useEffect(() => {
    if (onAllUploaded) {
      onAllUploaded(allUploaded);
    } else {
      // if parent didn’t pass the prop, just disable button via DOM as fallback
      const nextButton = document.querySelector('button[type="submit"], button[btntype="submit"]');
      if (nextButton) {
        nextButton.disabled = !allUploaded;
        nextButton.style.opacity = !allUploaded ? '0.6' : '1';
        nextButton.style.cursor = !allUploaded ? 'not-allowed' : 'pointer';
      }
    }
  }, [allUploaded, onAllUploaded]);

  return (
    <>
      <h5>Mandatory documents</h5>
      <div className="mandatory-doc-table">
        <table className="table">
          <thead>
            <tr>
              {/* <th>#</th>
              <th>Document Name</th>
              <th>Count</th>
              <th>Status</th> */}
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => {
              const filteredDocuments = documents.filter(
                doc => doc.type && doc.type.value === item.id
              );

              const uploadedDocs = filteredDocuments.filter(
                doc => doc.files && Object.keys(doc.files).length > 0
              );

              return (
                <tr key={item.id || index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{uploadedDocs.length > 0 ? `(${uploadedDocs.length})` : ''}</td>
                  <td>
                    {uploadedDocs.length > 0 ? (
                      <IoIosCheckmarkCircleOutline size={20} color="green" title="Uploaded" />
                    ) : (
                      <IoIosCloseCircleOutline size={20} color="red" title="Missing" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {error && <p className="text-danger">⚠️ {error}</p>}

        {allUploaded ? (
          <p className="text-success mt-2">All mandatory documents uploaded ✅</p>
        ) : (
          <p className="text-danger mt-2">
            Please upload all 3 mandatory documents to continue.
          </p>
        )}
      </div>
    </>
  );
}
