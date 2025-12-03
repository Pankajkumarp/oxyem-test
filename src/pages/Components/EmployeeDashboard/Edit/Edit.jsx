import React, { useState, useEffect } from "react";
import ReactModal from 'react-modal';
import dynamic from 'next/dynamic';
import { MdClose } from "react-icons/md";
import EmployeeSection from "../../Employee/EmployeeSection.jsx";
import Drawer from 'react-modern-drawer';

//import styles 👇
import 'react-modern-drawer/dist/index.css';

const DynamicForm = dynamic(() => import('../../CommanForm.jsx'), {
    ssr: false
});

const customStyles = {
  content: {
    background: '#fff',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export default function Edit({ isOpen, closeModal, formData, getsubmitformdata, empId ,error ,addressid ,Dependentid ,loaderSubmitButton}) {
    const [content, setContent] = useState(formData);
    const [empid, setempid] = useState(empId);

    useEffect(() => {
        setContent(formData); // Ensure content updates when formData prop changes
    }, [formData]);

    useEffect(() => {
        setempid(empId); // Ensure content updates when formData prop changes
    }, [empId]);

    

    const fetchBankDetails = async (ifscCode) => {
        try {
            const response = await fetch(`https://bank-apis.justinclicks.com/API/V1/IFSC/${ifscCode}`);
            const data = await response.json();
            updateFormData(data);
        } catch (error) {
            console.error('Error fetching bank details:', error);
        }
    };

    const updateFormData = (bankData) => {
        const updatedArray = JSON.parse(JSON.stringify(content)); // Create a deep copy of the original array

        for (let i = 0; i < updatedArray.section.length; i++) {
            const section = updatedArray.section[i];

            for (let j = 0; j < section.Subsection.length; j++) {
                const subsection = section.Subsection[j];

                for (let k = 0; k < subsection.fields.length; k++) {
                    const field = subsection.fields[k];

                    switch (field.name) {
                        case 'BankName':
                            updatedArray.section[i].Subsection[j].fields[k].value = bankData.BANK;
                            break;
                        case 'IFSCCode':
                            updatedArray.section[i].Subsection[j].fields[k].value = bankData.IFSC;
                            break;
                        case 'Address':
                            updatedArray.section[i].Subsection[j].fields[k].value = bankData.ADDRESS;
                            break;
                        // Add more cases if there are other fields to update
                        default:
                            break;
                    }
                }
            }
        }

        setContent(updatedArray);
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
                        // Update the value of the field with matching fieldName
                        updatedArray.section[i].Subsection[j].fields[k].value = value;

                        // Check if the field is IFSC Code and fetch bank details
                        if (fieldName === 'IFSCCode') {
                            if (value.length >= 10) {
                                fetchBankDetails(value);
                            }
                        }
                        
                        break; 
                    }
                }
            }
        }

        setContent(updatedArray);
    };

    const convertToArray = (sourceContent) => {
        const newArray = {
            idEmployee: empid,
            feature: sourceContent.formType,
            section: []
        };

        if (addressid) {
            newArray.idAddress = addressid;
        }
        if (Dependentid) {
            newArray.idDependent = Dependentid;
        }

        sourceContent.section.forEach(section => {
            const newSection = {
                SectionName: section.SectionName.replace(/\s/g, ''),
                fields: []
            };

            section.Subsection.forEach(subsection => {
                subsection.fields.forEach(field => {
                    let attributeValue = field.value;

                    if(field.name === 'reportManager' && typeof field.value === 'object' && 'value' in field.value) {
                        attributeValue = field.value.value;
                    }
                    else if(field.name === 'handoverEmp' && typeof field.value === 'object' && 'value' in field.value) {
                        attributeValue = field.value.value;
                    }  
                    else if (field.name === 'currencyType' && typeof field.value === 'object' && 'value' in field.value) {
                        attributeValue = field.value.value;
                    }
                    else if (field.name === 'isEligibleForPF' && typeof field.value === 'object' && 'value' in field.value) {
                        attributeValue = field.value.value;
                    }                  
                    else if (typeof field.value === 'object' && 'value' in field.value) {
                        attributeValue = field.value.label;
                    }
                    const newField = {
                        name: field.name,
                        attributeValue: attributeValue
                    };

                    newSection.fields.push(newField);
                });
            });

            newArray.section.push(newSection);
        });

        return newArray;
    };

    const submitformdata = () => {
        const newArray = convertToArray(content); // Use content instead of sourceArray to get the latest state
        getsubmitformdata(newArray);
    };

    const handleChangess = (currentIndex) => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < content.section.length) {
            setActiveTab(content.section[nextIndex].SectionName);
        }
    };



    return (
        <Drawer open={isOpen} onClose={closeModal} direction='right' className='custom-drawer' overlayClassName='custom-overlay' >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                    </div>
                    <div className="modal-body" id="profile-dashboard-edit-modal">
                        <p className="text-danger">{error}</p>
                    <span className="add-btn-circle" onClick={closeModal}>X</span>
                        {content && content.section && Array.isArray(content.section) ? (
                            content.section.map((section, index) => (
                                <div key={index} >
                                    <DynamicForm
                                        fields={section}
                                        submitformdata={submitformdata}
                                        handleChangeValue={handleChangeValue}
                                        handleChangess={() => handleChangess(index)}
                                        cancelClickAction={closeModal}
                                        loaderSubmitButton={loaderSubmitButton}
                                    />
                                </div>
                                ))
                                ) : (
                                    <div>No sections available</div>
                                )}
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
