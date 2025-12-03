import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import dynamic from 'next/dynamic';
import { ToastNotification, ToastContainer } from '../../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { useRouter } from 'next/router';
import TrackingClaim from '../../Components/TrakingClaim/TrakingClaim';
import ClaimComponent from '../../Components/Claim/claimdetail';
import HistoryComponent from '../../Components/Claim/claimhistory';
import ClaimDocumentComponent from '../../Components/Claim/documentdetails';
import ClaimlistComponent from '../../Components/Claim/Education';
import { fetchWithToken } from '../../Auth/fetchWithToken';

import CustomDataTable from '../../Components/Datatable/tablewithApi.jsx';
import FieldRenderer from '../../performance/FieldRenderer.jsx';
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
const DynamicForm = dynamic(() => import('../../Components/CommanForm'), { ssr: false });
 
export default function index({userFormdata}) {
    const router = useRouter();
    const [claimDetails, setClaimDetails] = useState([]);
    const [content, setContent] = useState(userFormdata);
    const [cid, setCId] = useState('');
    const [showButton, setShowButton] = useState(false);
    useEffect(() => {
          const { id } = router.query;
          fetchInfo(id);
          setCId(id);
          fetchclaimAdmin(id)
      }, [router.query.id]);
 

 
    const fetchInfo = async (value) => {
      try {
          if (value) {
              const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
              const response = await axiosJWT.get(`${apiUrl}/claims/claimDetails`, { params: { idClaim: value, isfor: 'admin' } });
              if (response.status === 200 && response.data.data) {
                  const fetchedData = response.data.data;
 
                  // Extract the status from fetchedData
                  const claimStatus = fetchedData.status;
 
                  // Map fetched data to form fields and remove fields based on status
                  const updatedContent = { ...content };
 
                  updatedContent.section.forEach(section => {
                      section.Subsection.forEach(subsection => {
                          // Filter fields based on claim status
                          subsection.fields = subsection.fields.filter(field => {
                              // Remove field if status is 'Verified' or 'Approved'
                              if ((claimStatus === 'verified' || claimStatus === 'approved') && field.name === 'VerifyAmount') {
                                  return false; // Remove all fields if the status is Verified or Approved
                              }
                              // Otherwise, map each field to the corresponding value from fetchedData
                              if (fetchedData[field.name]) {
                                  field.value = fetchedData[field.name];
                              }
                              return true; // Keep the field if not filtered out
                          });
                      });
                  });
 
                  // Filter buttons based on the isEnable property
                  const enabledButtons = content.section[0].buttons.filter(button => {
                      return fetchedData.buttons.some(apiButton => apiButton.type.toLowerCase() === button.type.toLowerCase() && apiButton.isEnable);
                  });
 
                  // Update the content state with the filtered buttons
                  updatedContent.section[0].buttons = enabledButtons;
  console.log("Updated Content:", updatedContent);
                  setContent(updatedContent);
                  setClaimDetails(fetchedData);
                  setShowButton(true);
              }
          }
      } catch (error) {
          console.error(error);
      }
  };
 
 
    const handleChangeValue = (fieldName, value) => {
        const updatedArray = JSON.parse(JSON.stringify(content)); // Create a deep copy of the original array
        for (let i = 0; i < updatedArray.section.length; i++) {
            const section = updatedArray.section[i];
            for (let j = 0; j < section.Subsection.length; j++) {
                const subsection = section.Subsection[j];
                for (let k = 0; k < subsection.fields.length; k++) {
                    const field = subsection.fields[k];
                    if (field.name === fieldName) {
                        updatedArray.section[i].Subsection[j].fields[k].value = value;
                        break;
                    }
                }
            }
        }
        setContent(updatedArray);
    };
 
    const submitaddnlinfo = async (value) => {
        const formattedData = {};
        const formattedData2 = {};
        // Convert the data to the required format
        content.section.forEach(section => {
          section.Subsection.forEach(subsection => {
            subsection.fields.forEach(field => {
     
              // Skip the value if the field type is 'verifyAmount'
              if (field.type === 'verifyAmount') {
                return;
              }
     
              // Check if the value is an object with a 'value' property
              if (typeof field.value === 'object' && 'value' in field.value) {
                formattedData[field.name] = field.value.value;
              } else {
                formattedData[field.name] = field.value;
              }
            });
          });
        });
     
        // Add additional keys
        formattedData2["idClaim"] = cid;
        formattedData2["actionFor"] = "addnlinfo";
        formattedData2["comment"] = formattedData.comment;
        formattedData2["status"] = 'RequiredAddInfo';
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/claims/manageClaims';
          const response = await axiosJWT.post(apiUrl, formattedData2);
          if (response.status === 200) {
           
            ToastNotification({ message: response.data.message });
            router.push(`/claim/admin`);
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            const errorMessage = error.response.data.errors || 'Failed to submit the form. Please try again later.';
            ToastNotification({ message: errorMessage });
          } else {
            ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
          }
        }
      };
 
      const submitformdata = async (value) => {
        const formattedData = {};
        const formattedData2 = {};
     
        // Convert the data to the required format
        content.section.forEach((section) => {
          section.Subsection.forEach((subsection) => {
            subsection.fields.forEach((field) => {
              // Skip the value if the field type is 'verifyAmount'
              if (field.type === 'verifyAmount') {
                return;
              }
     
              // Check if the value is an object with a 'value' property
              if (typeof field.value === 'object' && 'value' in field.value) {
                formattedData[field.name] = field.value.value;
              } else {
                formattedData[field.name] = field.value;
              }
            });
          });
        });
     
        // Add additional keys for the API request
        formattedData2["idClaim"] = [cid]; // Assuming 'cid' is the claim ID
        formattedData2["action"] = "verified";
        formattedData2["verifiedAmount"] = formattedData.VerifyAmount || ""; // Defaulting to "200" if missing
        formattedData2["comment"] = formattedData.comment || ""; // Defaulting to "verified" if missing
     
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/claims/updateStatus';
          const response = await axiosJWT.post(apiUrl, formattedData2);
     
          if (response.status === 200) {
            ToastNotification({ message: response.data.message });
            router.push(`/claim/admin`);
          }
        } catch (error) {
          const errorMessage = error.response?.data?.errors || 'Failed to submit the form. Please try again later.';
          ToastNotification({ message: errorMessage });
        }
      };
 
      const handleApprrovereqClaim = async (buttonType, formData) => {
 
        if (buttonType === 'approve') {
          const apipayload ={
            "action": 'approved',
            "idClaim": [cid],
            "comment":formData.comment
        }
 
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await axiosJWT.post(`${apiUrl}/claims/updateStatus`, apipayload);
         
          router.push(`/claim/admin`);
 
      } catch (error) {
          // Handle the error if any
      }
        } else if (buttonType === 'reject') {
          const apipayload ={
            "action": 'rejected',
            "idClaim": [cid],
            "comment":formData.comment
        }
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/claims/updateStatus`, apipayload);
            router.push(`/claim/admin`);
 
        } catch (error) {
            // Handle the error if any
        }
        }
 
        else if (buttonType === 'paid') {
          const apipayload ={
            "action": 'paid',
            "idClaim": [cid],
            "comment":formData.comment
        }
          try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/claims/updateStatus`, apipayload);
            router.push(`/claim/admin`);
 
        } catch (error) {
            // Handle the error if any
        }
        }
 
       
 
       
    }
     
    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'claim-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);

    const [claimAdmin, setclaimAdmin] = useState({});
        const fetchclaimAdmin = async (value) => {
          try {
              if (value) {
                  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                  const response = await axiosJWT.get(`${apiUrl}/claims/getLatest`, { params: { idClaim: value } });
                  if (response.status === 200 && response.data.data) {
                      const fetchedData = response.data.data;
      
                      setclaimAdmin(fetchedData);
                     

                  }
              }
          } catch (error) { 
              console.error(error); 
          }
      };

      const [showTable, setShowTable] = useState(true); // initially show
  const handleToggle = () => setShowTable(prev => !prev);
  return (
    <div className="main-wrapper" id="admin-claim-view-page">
        <div className="page-wrapper">
            <div className="content container-fluid">
               <Breadcrumbs maintext={"Verify Claim"} />
                <div className="row">
                    <div className="col-12 col-lg-12 col-xl-12">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                <div className="card flex-fill comman-shadow oxyem-index">
                                    <div className="center-part">
                                        <div className="card-body oxyem-mobile-card-body">
                                            <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border " id="sk-create-page">                                                        
                                                <div className="container mt-0">
                                                    <TrackingClaim claimDetails={claimDetails} />
                                                    <div className="mt-5">
                                                      <div className="col-12">
                                                        <div className="row">
                                                      <div className="col-xl-7 col-md-12 col-sm-7 mb-4 mobile-landscape-fix claim-viewbutton" id="sk-create-page">                                                        
                                                        <ClaimComponent claimDetails={claimDetails}/>
  { claimDetails && claimDetails.verifiedAmount && (
                                                        <div className="row">
                                                          <div className="col-md-12 mt-0">
                                                                <ul className="personal-info-header-right top-details">
                                                                  <li key={index}>
                                                                    <div className="title">Verified Amount</div>
                                                                    <div className="text">{claimDetails?.currsymbol} {claimDetails?.verifiedAmount}</div>
                                                                  </li>
                                                                </ul>
                                                          </div>
                                                        </div>
                                                    )}
                             <div className="row">
                                                        <ClaimDocumentComponent documents={claimDetails.documents} claimDetails={claimDetails}/>
                                                        </div>

                                                        <div className="row">
                                                          <div className="col-md-12 mt-3 claim-doc">
                                                                <p className='claim-detail-doc-page-title' style={{marginBottom: '0px'}}><strong>Remarks :</strong></p>
                                                                <ul className="personal-info-header-right claim-detail-doc-page top-details">
                                                                  <li key={index}>
                                                                    <div className="title"></div>
                                                                    <div className="text remark">{claimDetails?.remarks}</div>
                                                                  </li>
                                                                </ul>
                                                          </div>
                                                        </div>
                                                        
                                                      
 
                                                    { claimDetails && claimDetails.status !== 'paid' && showButton && (
                                                        <div className="mt-4">
                                                            {content && content.section && Array.isArray(content.section) ? (
                                                                content.section.map((section, index) => (
                                                                    <div key={index} >
                                                                        <DynamicForm
                                                                            fields={section}
                                                                            submitformdata={submitformdata}
                                                                            submitaddnlinfo={submitaddnlinfo}
                                                                            handleChangeValue={handleChangeValue}
                                                                            handleChangess={() => handleChangess(index)}
                                                                            pagename={'adminclaimInfo'}
                                                                            isModule={content.formType}    
                                                                            claimstatus={claimDetails?.status}  
                                                                            handleApprrovereqClaim={handleApprrovereqClaim}  
                                                                                                                               
                                                                        />
                                                                    </div>
                                                                ))
                                                            ) : ( <div>No sections available</div> )}
                                                        </div>
                                                      )}
</div>
<div className="col-xl-5 col-md-12 col-sm-5 mobile-landscape-fix">
      <div className="claim-bg">
        <h3 className="card-title">
          List of last submitted claims
          <span className="float-end" onClick={handleToggle} style={{ cursor: 'pointer' }}>
            {showTable ? <RiArrowUpSLine size={25}/> : <RiArrowDownSLine size={25}/>}
          </span>
        </h3>

        {showTable && (
          <ClaimlistComponent
            allData={claimAdmin}
            activeTab="claimAdmin"
          />
        )}
      </div>
    </div>
                                                   </div></div>
                            
 
                                                        <HistoryComponent actionDetails={claimDetails.actionDetails}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
 
export async function getServerSideProps(context) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'addClaimInfoAdmin' }, context);
  return {
    props: { userFormdata  },
  }
  }