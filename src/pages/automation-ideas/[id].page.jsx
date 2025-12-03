import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../Auth/AddAuthorization';
import { fetchWithToken } from '../Auth/fetchWithToken';
import Tracking from './Traking/Traking';
import ClaimComponent from '../Components/Automation/claimdetail';
import HistoryComponent from '../Components/Automation/claimhistory';
import ClaimDocumentComponent from '../Components/Automation/documentdetails';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';

const DynamicForm = dynamic(() => import('../Components/CommanForm'), { ssr: false });

export default function index({userFormdata}) {
    const router = useRouter();
    const [claimDetails, setClaimDetails] = useState([]);
    const [cid, setCId] = useState('');
    useEffect(() => {
          const { id } = router.query;
          fetchInfo(id);
          setCId(id)
      }, [router.query.id]);;


    const fetchInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/automationIdea/viewIdea`, { params: { idAutomationIdea: value } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
                    setClaimDetails(fetchedData);
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

     

        formattedData2["idAutomationIdea"] = cid; // Assuming 'cid' is the claim ID        
        formattedData2["status"] = formattedData.status || ""; // Defaulting to "verified" if missing
        formattedData2["description"] = formattedData.description || "";
  
        try {
          
              const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/automationIdea/update';
              const response = await axiosJWT.post(apiUrl, formattedData2);
  
              if (response.status === 200) {
                ToastNotification({ message: response.data.message });                    
                router.push(`/automation-ideas`);
                  
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
  
  
  return (
        <div className="main-wrapper">
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <Breadcrumbs maintext={"Idea State"} />
                    <div className="row">
                        <div className="col-12 col-lg-12 col-xl-12">
                            <div className="row">
                                <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                    <div className="card flex-fill comman-shadow oxyem-index ">
                                        <div className="center-part">
                                            <div className="card-body oxyem-mobile-card-body card-oxyem-claim-card"> 
                                                <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-claim-page">
                                                    <div className="container mt-0">

                                                        <Tracking claimDetails={claimDetails} />
                                                        <div className="mt-5">
                                                            <ClaimComponent claimDetails={claimDetails}/>

                                                        {claimDetails && claimDetails.status !== 'Approved' && (
                                                            <div className="mt-2" id="automation-create-page">
                                                                {content && content.section && Array.isArray(content.section) ? (
                                                                    content.section.map((section, index) => (
                                                                        <div key={index} >
                                                                            <DynamicForm
                                                                                fields={section}
                                                                                submitformdata={submitformdata}
                                                                                handleChangeValue={handleChangeValue}
                                                                                handleChangess={() => handleChangess(index)}
                                                                                pagename={'add-automation-ideas'}
                                                                                isModule={content.formType}                                                   
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
    const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'useraddIdeaInfo' }, context);	
	return {
	  props: { userFormdata  },
	}
  }