import React, { useState, useEffect } from 'react';
import SecTab from '../../Components/Employee/SecTab';
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router'
import { FaEdit } from "react-icons/fa";
import { fetchWithToken } from '../../Auth/fetchWithToken.jsx';
export default function Projectallocation({ userFormdata }) {
    const router = useRouter(); 

    const headingContent = '';
    const [btpdata, setBtpData] = useState([]); // State to hold the content
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [getID, setGetID] = useState("")

    const [AdduserContent, setAdduserContent] = useState(userFormdata);
    const [apiResponse, setapiResponse] = useState();


    const getProjectValue = async (id) => {
        try {

            const response = await axiosJWT.get(`${apiUrl}/project/getProject`, {
                params: {
                    'idProject': id
                }
            });
            if (response) {
                const apiResponse = response.data.data
                const mergedArray = mergeData(userFormdata, apiResponse);
				const summarySection = mergedArray.section.find(section => section.SectionName === "Summary");
                // Check if the section exists and update the value
                if (summarySection) {
                    // Update the value inside the Summary section
                    summarySection.Subsection.forEach(subsection => {
                        if (subsection.name === "summary") {
                            subsection.value = response.data.data.priceSummary; // Set the value to true
                        }
                    });
                }
                setAdduserContent(mergedArray)
                setapiResponse(apiResponse); 
            }

        } catch (error) {

        }
    }
    useEffect(() => {
        const { id } = router.query; // Extract the "id" parameter from the query object
        setGetID(id)
        getProjectValue(id)

    }, [router.query.id]);

    const handlesubmitApiData = async (value) => {
        const sendData = mergeSections(value.section, btpdata);
    const apipayload = {
      "feature": value.feature,
	  "idProject":getID,
      "section": sendData
    }
        try {
            const response = await axiosJWT.put(`${apiUrl}/project`, apipayload);
            // Handle the response if needed
            console.log("Response:", response.data);
            router.push(`/Project-dashborad`);    

        } catch (error) {
            // Handle the error if any
            console.error("Error occurred:", error);
        }
    };

    const handleBTPformvalue = (value) => {
        const newSections = value.section;
        setBtpData(newSections)

    };
  // Function to merge the new sections into the existing sections
  const mergeSections = (existingSections, newSections) => {
    // Convert existing sections to a map for easy lookup
    const sectionMap = new Map(existingSections.map(section => [section.SectionName, section]));

    // Iterate over new sections
    newSections.forEach(newSection => {
      sectionMap.set(newSection.SectionName, newSection);
    });

    // Convert the map back to an array
    return Array.from(sectionMap.values());
  };


  const converttoenable = async () => {
    try {

        const response = await axiosJWT.get(`${apiUrl}/project/getProject`, {
            params: {
                'idProject': getID
            }
        });
        if (response) {
            const apiResponse = response.data.data
            const mergedArray = mergeDataen(userFormdata, apiResponse);
			const summarySection = mergedArray.section.find(section => section.SectionName === "Summary");
                if (summarySection) {
                    // Update the value inside the Summary section
                    summarySection.Subsection.forEach(subsection => {
                        if (subsection.name === "summary") {
                            subsection.value = response.data.data.priceSummary; // Set the value to true
                        }
                    });
                }
            setAdduserContent(mergedArray)
            setapiResponse(apiResponse); 
        }

    } catch (error) {

    }
}

const [showButton, setShowButton] = useState("hide")
    // Function to merge data
    function mergeData(formArray, dataArray) {
        console.log("formData", formArray)
        console.log("dataArray", dataArray)
        // Iterate over each section in the dataArray
        dataArray.section.forEach(dataSection => {
            // Iterate over each field in the section
            dataSection.fields.forEach(dataField => {
                // Find the corresponding section and field in the formArray
                formArray.section.forEach(formSection => {
                    formSection.Subsection.forEach(subSection => {
                        subSection.fields.forEach(formField => {
                            if (formField.name === dataField.name) {
                                formField.value = dataField.attributeValue;
                            
                            }
                        });
                    });
                });
            });
        });
        formArray.section.forEach(formSection => {
            formSection.Subsection.forEach(subSection => {
                subSection.fields.forEach(formField => {
                    if (!formField.hasOwnProperty('isDisabled')) {
                        formField.isDisabled = "true";
                    }
                });
            });
        });
        setShowButton("hide")
        console.log("meargdata", formArray)
        return formArray;
    }

    // Merge the data



    // Function to merge data
    function mergeDataen(formArray, dataArray) {
        // Iterate over each section in the dataArray
        dataArray.section.forEach(dataSection => {
            // Iterate over each field in the section
            dataSection.fields.forEach(dataField => {
                // Find the corresponding section and field in the formArray
                formArray.section.forEach(formSection => {
                    formSection.Subsection.forEach(subSection => {
                        subSection.fields.forEach(formField => {
                            if (formField.name === dataField.name) {
                                formField.value = dataField.attributeValue;
                            
                            }
                        });
                    });
                });
            });
        });
        formArray.section.forEach(formSection => {
            formSection.Subsection.forEach(subSection => {
              subSection.fields.forEach(formField => {
                formField.isDisabled = ""; // Set isDisabled to false for each field
              });
            });
          });
      
          setShowButton("")
        return formArray;
    }

    return (
        <>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row"> 
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs maintext={"Project Allocation"} />
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <SecTab AdduserContent={AdduserContent} headingContent={headingContent} handlesubmitApiData={handlesubmitApiData} actionid={getID} handleBTPformvalue={handleBTPformvalue} pagename="view_allowcation" showButton={showButton} converttoenable={converttoenable}/>
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


        </>

    );
}
export async function getServerSideProps(context) {

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'Project_allocation' }, context);
    return {
        props: { userFormdata },
    }
}
