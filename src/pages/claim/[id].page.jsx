import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../Auth/AddAuthorization';
import TrackingClaim from '../Components/TrakingClaim/TrakingClaim';
import ClaimComponent from '../Components/Claim/claimdetail';
import HistoryComponent from '../Components/Claim/claimhistory';
import ClaimDocumentComponent from '../Components/Claim/documentdetails';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { fetchWithToken } from '../Auth/fetchWithToken';

const DynamicForm = dynamic(() => import('../Components/CommanForm'), { ssr: false });

export default function index({userFormdata}) {
    const router = useRouter();
    const [claimDetails, setClaimDetails] = useState([]);
    const [showButton, setShowButton] = useState(false);
    const [cid, setCId] = useState('');
    useEffect(() => {
          const { id } = router.query;
          fetchInfo(id);
          setCId(id)
      }, [router.query.id]);;

    // const fetchInfo = async (value) => {
    //     try {
    //       if (value) {
    //         const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    //         const response = await axiosJWT.get(`${apiUrl}/claims/claimDetails`, { params: { idClaim: value } });    
    //         if (response.status === 200 && response.data.data) { setClaimDetails(response.data.data); }
    //       }
    //     } catch (error) { }
    //   };

    const fetchInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/claims/claimDetails`, { params: { idClaim: value, isfor: 'self' } });
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
    
                    setContent(updatedContent);
                    setClaimDetails(fetchedData);
                   setShowButton(true);

                }
            }
        } catch (error) { 
            // console.error(error); 
        }
    };

    const initialContent = userFormdata
    const [content, setContent] = useState(initialContent);

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

    const submitformdata = async (formdata ,fileData) => {
        const formattedData = {};
        const formattedData2 = {};
        content.section.forEach(section => {
          section.Subsection.forEach(subsection => {
              subsection.fields.forEach(field => {
                  // Skip radio objects
                  if (field.type === 'Radiot&c' || field.type === 'ClaimDoc') { return; }
                  
                  if (typeof field.value === 'object' && 'value' in field.value) {
                      formattedData[field.name] = field.value.value;
                  } else {
                      formattedData[field.name] = field.value;
                  }
              });
          });
      });

     

        formattedData2["idClaim"] = cid; // Assuming 'cid' is the claim ID
        formattedData2["actionFor"] = "addnlinfo";
        formattedData2["status"] = 'infoprovided'; // Defaulting to "verified" if missing
        formattedData2["comment"] = formattedData.comment || "";
  
        try {
          
              const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/claims/manageClaims';
              const response = await axiosJWT.post(apiUrl, formattedData2);
  
              if (response.status === 200) {
                  
                  ToastNotification({ message: response.data.message });
                  const idClaim = cid;
                    handeldocfiles(fileData, idClaim);
                  if(formattedData.idEmployee) {
                      router.push(`/admin/claim`);
                  }else {
                      router.push(`/claim`);
                  }
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
  
  
    const handeldocfiles = async (formData, id) => {
      try {
        if (formData) {
          formData.append('moduleId', id);
          const apiUrle = process.env.NEXT_PUBLIC_API_BASE_URL;
          const apiUrl = apiUrle + '/claims/uploadDocuments';
          const response = await axiosJWT.post(apiUrl, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
      } catch (error) { }
    }

    const handleApprrovereqClaim = async (buttonType, formData) => {

        const formattedData = {};
        const formattedData2 = {};
        content.section.forEach(section => {
          section.Subsection.forEach(subsection => {
              subsection.fields.forEach(field => {
                  // Skip radio objects
                  if (field.type === 'ClaimDoc') { return; }
                  
                  if (typeof field.value === 'object' && 'value' in field.value) {
                      formattedData[field.name] = field.value.value;
                  } else {
                      formattedData[field.name] = field.value;
                  }
              });
          });
      });

        formattedData2["idClaim"] = [cid]; // Assuming 'cid' is the claim ID
        formattedData2["action"] = "recalled";
        formattedData2["comment"] = formattedData.comment || "";
  
        try {
          
              const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
              const response = await axiosJWT.post(`${apiUrl}/claims/updateStatus`, formattedData2)
            
              if (response.status === 200) {
                  
                  ToastNotification({ message: response.data.message });
                  if(formattedData.idEmployee) {
                      router.push(`/admin/claim`);
                  }else {
                      router.push(`/claim`);
                  }
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
  return (
        <div className="main-wrapper">
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <Breadcrumbs maintext={"Verify Claim"} />
                    <div className="row">
                        <div className="col-12 col-lg-12 col-xl-12">
                            <div className="row">
                                <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                    <div className="card flex-fill comman-shadow oxyem-index ">
                                        <div className="center-part">
                                            <div className="card-body oxyem-mobile-card-body card-oxyem-claim-card"> 
                                                <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-claim-page">
                                                    <div className="container mt-0">
                                                        <TrackingClaim claimDetails={claimDetails} />
                                                        <div className="mt-5">
                                                            <ClaimComponent claimDetails={claimDetails}/>

                                                            <div className="row">
                                                            <ClaimDocumentComponent documents={claimDetails.documents} claimDetails={claimDetails}/>
                                                            </div>
                                                            <div className="row">
                                                          <div className="col-md-12 mt-4">
                                                                <p className='claim-detail-doc-page-title' style={{marginBottom: '0px'}}><strong>Remarks :-</strong></p>
                                                                <ul className="personal-info-header-right claim-detail-doc-page top-details">
                                                                  <li key={index}>
                                                                    <div className="title"></div>
                                                                    <div className="text remark">{claimDetails?.remarks}</div>
                                                                  </li>
                                                                </ul>
                                                          </div>
                                                        </div>

                                                    { claimDetails && claimDetails.verifiedAmount && (
                                                        <div className="row">
                                                          <div className="col-md-12 mt-4">
                                                                <ul className="personal-info-header-right top-details">
                                                                  <li key={index}>
                                                                    <div className="title">Verified Amount</div>
                                                                    <div className="text">{claimDetails?.currsymbol} {claimDetails?.verifiedAmount}</div>
                                                                  </li>
                                                                </ul>
                                                          </div>
                                                        </div>
                                                    )}

                                                        {claimDetails && claimDetails.status !== 'paid' && showButton && (
                                                            <div className="mt-5">
                                                                {content && content.section && Array.isArray(content.section) ? (
                                                                    content.section.map((section, index) => (
                                                                        <div key={index} >
                                                                            <DynamicForm
                                                                                fields={section}
                                                                                submitformdata={submitformdata}
                                                                                handleChangeValue={handleChangeValue}
                                                                                handleChangess={() => handleChangess(index)}
                                                                                pagename={'claimInfo'}
                                                                                isModule={content.formType} 
                                                                                handleApprrovereqClaim={handleApprrovereqClaim}                                                     
                                                                            />
                                                                        </div>
                                                                    ))
                                                                ) : ( <div>No sections available</div> )}
                                                            </div>
                                                        )}
                                                            <HistoryComponent actionDetails={claimDetails?.actionDetails}/>
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
    )}

export async function getServerSideProps(context) {	
 
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'addClaimInfo' }, context);
    return {
      props: { userFormdata  },
    }
  }