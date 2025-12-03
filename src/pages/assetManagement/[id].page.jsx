import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import SecTab from '../Components/Employee/AssetTab.jsx';

import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';



export default function index({userFormdata}) {
    const router = useRouter();
    const [details, setClaimDetails] = useState([]);
    const [cid, setCId] = useState('');
    const headingContent = 'Edit Assets';
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/permission/addGroup';

    useEffect(() => {
          const { id } = router.query;
          fetchInfo(id);
          setCId(id)
      }, [router.query.id]);

      

    const fetchInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/asset/editAsset`, { params: { idAsset: value } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
                    setClaimDetails(fetchedData);
                }
            }
        } catch (error) { 
            
        }
    };

    const initialContent = userFormdata
    const [content, setContent] = useState(initialContent || {});
    const [storeArray, setStoreArray] = useState(content);
    useEffect(() => {
        if (details && details.section && Array.isArray(details.section)) {
            const updatedFormData = { ...content }; // Shallow copy of content
        
            // Find the section in the form data
            const section = updatedFormData.section.find(sec => sec.SectionName === "Assets Information");
            const section2 = updatedFormData.section.find(sec => sec.SectionName === "Purchase Information");
            const section3 = updatedFormData.section.find(sec => sec.SectionName === "Warranty Information");
    
            // Find the section in the details data
            const detailssection = details.section.find(sec => sec.SectionName === "AssetsInformation");
            const detailssection2 = details.section.find(sec => sec.SectionName === "PurchaseInformation");
            const detailssection3 = details.section.find(sec => sec.SectionName === "WarrantyInformation");
    
            // Check if the sections exist
            if (section && detailssection) {
                section.Subsection.forEach(subsection => {
                    subsection.fields.forEach(field => {
                        // Find the matching field from the details section
                        const matchingField = detailssection.fields.find(detailField => detailField.name === field.name);
    
                        if (matchingField) {
                            // Update the value if a matching field is found
                            field.value = matchingField.attributeValue;
                        }
                    });
                });
            }
    
            // If the other sections are required to be updated in the same way:
            if (section2 && detailssection2) {
                section2.Subsection.forEach(subsection => {
                    subsection.fields.forEach(field => {
                        const matchingField = detailssection2.fields.find(detailField => detailField.name === field.name);
                        if (matchingField) {
                            field.value = matchingField.attributeValue;
                        }
                    });
                });
            }
    
            if (section3 && detailssection3) {
                section3.Subsection.forEach(subsection => {
                    subsection.fields.forEach(field => {
                        const matchingField = detailssection3.fields.find(detailField => detailField.name === field.name);
                        if (matchingField) {
                            field.value = matchingField.attributeValue;
                        }
                    });
                });
            }
    
            // Update the state with the modified content
            getChangessField(updatedFormData)
            setContent(updatedFormData);
            setStoreArray(updatedFormData);
            
        } else {
        }
    }, [details]); // The effect depends on details only, since content is updated internally
    
    

    const filterSectionsBasedOnAssetType = (content, assetType) => {

        // Ensure 'content' and 'content.section' are arrays
        if (!content || !Array.isArray(content.section)) {
            return content; // Return the original content if it's not in the expected format
        }

        return content.section.map(section => {
            if (section.SectionName === "Assets Information") {
                // Ensure section.Subsection is an array
                if (!Array.isArray(section.Subsection)) {
                    section.Subsection = []; // Initialize to an empty array or handle the error as needed
                }

                // Update subsections based on the asset type
                section.Subsection = section.Subsection.map(subsection => {
                    let shouldBeVisible = true;

                    if (assetType === "Laptop" || assetType === "Desktop") {
                        if (subsection.name === "printerConfig" || subsection.name === "otherConfig") {
                            shouldBeVisible = false;
                        }
                    } else if (assetType === "Printer") {
                        if (subsection.name === "assetConfigLaptop" || subsection.name === "otherConfig") {
                            shouldBeVisible = false;
                        }
                    } else if (assetType === "Others") {
                        if (subsection.name === "printerConfig" || subsection.name === "assetConfigLaptop") {
                            shouldBeVisible = false;
                        }
                    } else if (assetType !== "Laptop" || assetType !== "Desktop"  || assetType !== "Printer" || assetType !== "Others") {
                        if (subsection.name === "assetConfigLaptop" || subsection.name === "printerConfig" || subsection.name === "otherConfig") {
                            shouldBeVisible = false;
                        }
                    }


                    // Set the attribute based on visibility
                    return {
                        ...subsection,
                        isFieldVisiblef: shouldBeVisible
                    };
                });
            }
            return section;
        });
    };
    const filterSectionsWarrantyType = (content, assetType) => {

        // Ensure 'content' and 'content.section' are arrays
        if (!content || !Array.isArray(content.section)) {
            return content; // Return the original content if it's not in the expected format
        }

        return content.section.map(section => {
            if (section.SectionName === "Warranty Information") {
                // Ensure section.Subsection is an array
                if (!Array.isArray(section.Subsection)) {
                    section.Subsection = []; // Initialize to an empty array or handle the error as needed
                }

                // Update subsections based on the asset type
                section.Subsection = section.Subsection.map(subsection => {
                    let shouldBeVisible = true;

                    if (assetType === false) {
                        if (subsection.name === "extendedWarrantyInfo") {
                            shouldBeVisible = false;
                        }
                    } else if (assetType === true) {
                        if (subsection.name === "extendedWarrantyInfo") {
                            shouldBeVisible = true;
                        }
                    }


                    // Set the attribute based on visibility
                    return {
                        ...subsection,
                        isFieldVisiblef: shouldBeVisible
                    };
                });
            }
            return section;
        });
    };
    
    const getChangessField = async (value) => {
        const subsectionName = value.section[2].Subsection[0].SubsectionName; // Subsection Name
        const warrantyInfo = value.section[2].Subsection[0].fields?.find(field => field.name === "additionalWarranty")?.value; // Warranty Information
        // const warrantyInfo = value.section[2];
        const type = value.section[0].Subsection[0].fields.find(field => field.name === "typeOfAsset").value.label;
        
        let filteredContent = [];
    
        // Filter sections based on the type of asset
        if (type !== undefined) {
            filteredContent = filterSectionsBasedOnAssetType(storeArray, type);
    
            const changeV = {
                "formType": "createAssets",
                "section": filteredContent,
            };
    
            setContent(changeV);
        }
        // Filter sections based on warranty information
        if (subsectionName === "Warranty Information" && warrantyInfo !== undefined) {
            
            filteredContent = filterSectionsWarrantyType(storeArray, warrantyInfo);
            const changeV = {
                "formType": "createAssets",
                "section": filteredContent,
            };
            setContent(changeV);
        }
    };

    const getChangessField1 = async (value) => {

        const type = value[0].fields[1].value.label
        const Warranty = value[0].SubsectionName
        
        if (type !== undefined) {
            const filteredContent = filterSectionsBasedOnAssetType(storeArray, type);

            const changeV = {
                "formType": "createAssets",
                "section": filteredContent
            }
            setContent(changeV)
        }
        if (Warranty === "Warranty Information") {
            const Warrantyinfo = value[0].fields[3].value
            
            const filteredContent = filterSectionsWarrantyType(AdduserContent, Warrantyinfo);
            const changeV = {
                "formType": "createAssets",
                "section": filteredContent
            }
            
            setContent(changeV)
        }

    };

    const completehandleSubmit = async (value ,myFile) => {
        
        try {
            if (value) {
                // Extract the relevant dates for validation
                let purchaseDate, startDateWarranty, startDateExtendWarranty;
    
                value.section.forEach(section => {
                    section.fields.forEach(field => {
                        if (field.name === 'purchaseDate') {
                            purchaseDate = new Date(field.attributeValue);
                        }
                        if (field.name === 'startDateWarranty') {
                            startDateWarranty = new Date(field.attributeValue);
                        }
                        if (field.name === 'startDateExtendWarranty') {
                            startDateExtendWarranty = new Date(field.attributeValue);
                        }
                    });
                });
    
                // Validate the dates
                if (purchaseDate) {
                    if (startDateWarranty && startDateWarranty < purchaseDate) {
                        // Show validation error for startDateWarranty
                        ToastNotification({ message: 'Warranty start date cannot be before the purchase date.' });
                        return;
                    }
    
                    if (startDateExtendWarranty && startDateExtendWarranty < purchaseDate) {
                        // Show validation error for startDateExtendWarranty
                        ToastNotification({ message: 'Extended warranty start date cannot be before the purchase date' });
                        return;
                    }
                }
    
                // Proceed with form submission if validation passes
                const formData = new FormData();
    
                const filteredValue = {
                    ...value,
                    section: value.section.filter(section => section.SectionName !== 'Preview' && section.SectionName !== 'Documents')
                };
    
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/asset/add';
                formData.append('formData', JSON.stringify(filteredValue));

                

                
                if (Array.isArray(myFile)) {
                    myFile.forEach((file) => {
                      formData.append('file', file);
                    });
                  } else {
                    
                  }
    
                const response = await axiosJWT.post(apiUrl, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
    
                if (response.status === 200) {
                    ToastNotification({ message: response.data.message });
                    router.push(`/assetManagement`);
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data.errors || [];
                const errorMessage = errors.map(err => err.msg).join('.</br>') || 'Failed to submit the form. Please try again later.';
                
                ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
            } else {
                // ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
            }
        }
    };
    

  return (
        <>
        <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        
                                                    <SecTab
                                                            AdduserContent={content}
                                                            getsubmitformdatahitApi={completehandleSubmit}
                                                            getChangessField={getChangessField1}
                                                            pagename={"addAsset"}
                                                            assetid={cid}
                                                        />
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
            <ToastContainer />
        </>
    )}

export async function getServerSideProps(context) {	
 
	const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'createAssets' }, context);
	return {
	  props: { userFormdata  },
	}
  }