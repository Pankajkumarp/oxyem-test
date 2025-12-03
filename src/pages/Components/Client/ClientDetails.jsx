import React, { useState, useEffect, useRef } from 'react';
import { IoDownloadOutline } from "react-icons/io5";
import { axiosJWT } from "../../Auth/AddAuthorization.jsx";

export default function ClientDetailView({ clientinfodata, pricingDocument }) {
  if (!clientinfodata) return null;
    console.log(clientinfodata,"in client info")
  const { businessType, clientId, clientName, emailAddress } = clientinfodata;
  const [businessTypeName, setBusinessTypeName] = useState("");

useEffect(() => {
  if (!businessType) return;
  console.log("useEffect triggered with businessType:", businessType);
  const fetchBusinessType = async () => {
  console.log("1234")

    try {
  console.log("12345")
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
        params: {
          isFor: "businessType",
        },
      });
console.log(response,"thisssssssss")
      const list = response.data?.data || [];
      const match = list.find((item) => item.id === businessType);
      if (match) {
        setBusinessTypeName(match.name);
      } else {
        setBusinessTypeName("N/A");
      }
    } catch (error) {
      console.error("Error fetching business type:", error);
    }
  };

  fetchBusinessType();
}, [businessType]);


  const handleDownloadClickWithPath = async (path) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/download`, {
        params: { filePath: path },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", getFileName(path));
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };

  const getFileName = (path) => path.substring(path.lastIndexOf("/") + 1);

  return (
    <div className="row">
      {/* Left column */}
      <div className="col-md-6">
        <ul className="personal-info-header-right claim-detail-v-page top-details">
          {clientId && (
            <li>
              <div className="title">Client ID :</div>
              <div className="text">{clientId}</div>
            </li>
          )}
          {clientName && (
            <li>
              <div className="title">Client Name :</div>
              <div className="text">{clientName}</div>
            </li>
          )}
          {emailAddress && (
            <li>
              <div className="title">Email Address :</div>
              <div className="text">{emailAddress}</div>
            </li>
          )}
        </ul>
      </div>

      {/* Right column */}
      <div className="col-md-6">
        <ul className="personal-info-header-right claim-detail-v-page top-details">
          {businessTypeName  && (
            <li>
              <div className="title">Business Type :</div>
              <div className="text">{businessTypeName }</div>
            </li>
          )}

          {/* Pricing Documents */}
          {pricingDocument && pricingDocument.length > 0 ? (
            pricingDocument.map((docPath, index) => (
              <li key={index} className="document-item">
                <div className="title">{`Pricing Document :`}</div>
                <div className="text" style={{ width: "10%" }}>
                  <IoDownloadOutline
                    style={{ cursor: "pointer" }}
                    size={20}
                    color="#004D95"
                    onClick={() => handleDownloadClickWithPath(docPath)}
                  />
                </div>
              </li>
            ))
          ) : (
            <li>
              <div className="title">Pricing Document :</div>
              <div className="text">No documents uploaded</div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
