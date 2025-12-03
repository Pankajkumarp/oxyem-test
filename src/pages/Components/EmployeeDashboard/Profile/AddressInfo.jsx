import React, { useState, useEffect } from 'react';
import { GrFormNext } from 'react-icons/gr';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import { FaRegEdit } from "react-icons/fa";
import Edit from '../Edit/Edit';
import { ToastNotification, ToastContainer } from '../Alert/ToastNotification';

export default function AddressInfo({ empId, apiBaseUrl ,refressAddressApi }) {
    const [isEditOpenRe, setIsEditOpenRe] = useState(false);
    const [Info, setInfo] = useState([]);
    const [addressId, setAddressId] = useState('');
    const [openSection, setOpenSection] = useState(null); 
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState([]);
    const [formType, setFormType] = useState(''); 

    const openEditModalRe = (type, id) => {
        setIsEditOpenRe(true); 
        setAddressId(id);
        setFormType(type);
        if (type === 'Residential') {
        populateFormData();
        }else {
            populateFormData2();
        }
    };

    const closeEditModalRe = () => {
        setIsEditOpenRe(false);
    };

    const fetchInfo = async () => {
        try {
            if (empId) {
                const response = await axiosJWT.get(`${apiBaseUrl}/address`, {
                    params: { idEmployee: empId },
                });

                if (response.status === 200 && response.data.data) {
                    setInfo(response.data.data);
                }
            }
        } catch (error) {
            
        }
    };

    useEffect(() => {
        if (empId || refressAddressApi) {
            fetchInfo();
        }
    }, [empId, refressAddressApi]);

    const formResidential = {
        ResidentialAddress: {
            section: [
                {
                    SectionName: "Residential Address",
                    name: "residentialAddress",
                    isVisible: true,
                    Subsection: [
                        {
                            SubsectionName: "Residential Address",
                            name: "residentialAddress",
                            isVisible: true,
                            fields: [
                                {
                                    type: "Text",
                                    col: "6",
                                    label: "Address Line1",
                                    name: "addressLine1",
                                    placeholder: "Flat, House no.,Building, Company, Apartment",
                                    value: "",
                                    validations: [
                                        {
                                            type: "required",
                                            message: "Address Line1 is required"
                                        }
                                    ]
                                },
                                {
                                    type: "Text",
                                    col: "6",
                                    label: "Address Line2",
                                    name: "addressLine2",
                                    placeholder: "Area, Street, Sector, Village",
                                    value: "",
                                    validations: [
                                        {
                                            type: "required",
                                            message: "Address Line2 is required"
                                        }
                                    ]
                                },
                                {
                                    type: "Number",
                                    col: "6",
                                    label: "Pin Code",
                                    name: "pincode",
                                    placeholder: "Enter Pin Code",
                                    value: "",
                                    validations: [
                                        {
                                            type: "required",
                                            message: "Pincode is required"
                                        }
                                    ]
                                },
                                {
                                    type: "Text",
                                    col: "6",
                                    label: "Country",
                                    name: "country",
                                    placeholder: "Enter country",
                                    value: "",
                                    otherAttributes: [
                                        {
                                            name: "disabled",
                                            value: true
                                        }
                                    ],
                                    validations: [
                                        {
                                            type: "required",
                                            message: "Country is required"
                                        }
                                    ]
                                },
                                {
                                    type: "Text",
                                    col: "6",
                                    label: "City",
                                    name: "city",
                                    placeholder: "Enter City",
                                    value: "",
                                    otherAttributes: [
                                        {
                                            name: "disabled",
                                            value: true
                                        }
                                    ],
                                    validations: []
                                },
                                {
                                    type: "Text",
                                    col: "6",
                                    label: "State",
                                    name: "state",
                                    placeholder: "Enter state",
                                    value: "",
                                    otherAttributes: [
                                        {
                                            name: "disabled",
                                            value: true
                                        }
                                    ],
                                    validations: [
                                        {
                                            type: "required",
                                            message: "State is required"
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    buttons: [
                        {
                            type: "Cancel",
                            col: "3 float-end",
                            class: "btn-oxyem mx-2",
                            buttontype: "",
                            label: "Cancel",
                            placeholder: "Cancel",
                            value: "Cancel",
                            validations: []
                        },
                        {
                            type: "Next",
                            col: "3 float-end",
                            class: "btn-primary",
                            buttontype: "",
                            label: "Submit",
                            placeholder: "Next",
                            value: "Next",
                            validations: []
                        }
                    ]
                }
            ]
        },
        CorrespondenceAddress: {
            section: [
                {
                    SectionName: "Correspondence Address",
                    name: "correspondenceAddress",
                    isVisible: true,
                    Subsection: [
                        {
                            SubsectionName: "Correspondence Address",
                            name: "correspondenceAddress",
                            isVisible: true,
                            fields: [
                                {
                                    type: "Text",
                                    col: "6",
                                    label: "Address Line1",
                                    name: "addressLine1",
                                    placeholder: "Flat, House no.,Building, Company, Apartment",
                                    value: "",
                                    validations: [
                                        {
                                            type: "required",
                                            message: "Address Line1 is required"
                                        }
                                    ]
                                },
                                {
                                    type: "Text",
                                    col: "6",
                                    label: "Address Line2",
                                    name: "addressLine2",
                                    placeholder: "Area, Street, Sector, Village",
                                    value: "",
                                    validations: [
                                        {
                                            type: "required",
                                            message: "Address Line2 is required"
                                        }
                                    ]
                                },
                                {
                                    type: "Number",
                                    col: "6",
                                    label: "Pin Code",
                                    name: "pincode",
                                    placeholder: "Enter Pin Code",
                                    value: "",
                                    validations: [
                                        {
                                            type: "required",
                                            message: "Pincode is required"
                                        }
                                    ]
                                },
                                {
                                    type: "Text",
                                    col: "6",
                                    label: "Country",
                                    name: "country",
                                    placeholder: "Enter country",
                                    value: "",
                                    otherAttributes: [
                                        {
                                            name: "disabled",
                                            value: true
                                        }
                                    ],
                                    validations: [
                                        {
                                            type: "required",
                                            message: "Country is required"
                                        }
                                    ]
                                },
                                {
                                    type: "Text",
                                    col: "6",
                                    label: "City",
                                    name: "city",
                                    placeholder: "Enter City",
                                    value: "",
                                    otherAttributes: [
                                        {
                                            name: "disabled",
                                            value: true
                                        }
                                    ],
                                    validations: []
                                },
                                {
                                    type: "Text",
                                    col: "6",
                                    label: "State",
                                    name: "state",
                                    placeholder: "Enter state",
                                    value: "",
                                    otherAttributes: [
                                        {
                                            name: "disabled",
                                            value: true
                                        }
                                    ],
                                    validations: [
                                        {
                                            type: "required",
                                            message: "State is required"
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    buttons: [
                        {
                            type: "Cancel",
                            col: "3 float-end",
                            class: "btn-oxyem mx-2",
                            buttontype: "",
                            label: "Cancel",
                            placeholder: "Cancel",
                            value: "Cancel",
                            validations: []
                        },
                        {
                            type: "Next",
                            col: "3 float-end",
                            class: "btn-primary",
                            buttontype: "",
                            label: "Submit",
                            placeholder: "Next",
                            value: "Next",
                            validations: []
                        }
                    ]
                }
            ]
        }
    };


    
const populateFormData = () => {
    const updatedFormData = { ...formResidential };
    const addressData = Info;

    const populateFields = (section, addressType) => {
        const subsection = section.Subsection.find(sub => sub.SubsectionName === addressType);

        if (subsection) {
            subsection.fields.forEach(field => {
                const matchingInfo = addressData.find(info => info['ResidentialAddress']?.some(addr => addr.lebel === field.label));

                if (matchingInfo) {
                    const fieldValue = matchingInfo['ResidentialAddress'].find(addr => addr.lebel === field.label)?.value;

                    if (fieldValue !== undefined) { // Check if value is defined (not undefined or null)
                        field.value = fieldValue;
                    }
                }
            });
        }
    };

    const residentialSection = updatedFormData.ResidentialAddress.section.find(sec => sec.SectionName === "Residential Address");
    if (residentialSection) {
        populateFields(residentialSection, "Residential Address"); // Pass "Residential Address" as addressType
    }

    setFormData(updatedFormData); // Assuming setFormData is a function to update state with updatedFormData
};

const populateFormData2 = () => {
    const updatedFormData = { ...formResidential };
    const addressData = Info;

    const populateFields = (section, addressType) => {
        const subsection = section.Subsection.find(sub => sub.SubsectionName === addressType);

        if (subsection) {
            subsection.fields.forEach(field => {
                const matchingInfo = addressData.find(info => info['CorrespondenceAddress']?.some(addr => addr.lebel === field.label));

                if (matchingInfo) {
                    const fieldValue = matchingInfo['CorrespondenceAddress'].find(addr => addr.lebel === field.label)?.value;

                    if (fieldValue !== undefined) { // Check if value is defined (not undefined or null)
                        field.value = fieldValue;
                    }
                }
            });
        }
    };

    const correspondenceSection = updatedFormData.CorrespondenceAddress.section.find(sec => sec.SectionName === "Correspondence Address");
    if (correspondenceSection) {
        populateFields(correspondenceSection, "Correspondence Address");
    }

    setFormData(updatedFormData); // Assuming setFormData is a function to update state with updatedFormData
};

    
    const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
    const getSubmitFormDataput = async (value) => {
        try {
            setSubmitButtonLoading(true);
            if (value) {
                const apiUrl = `${apiBaseUrl}/address`;
                const response = await axiosJWT.put(apiUrl, value);

                if (response.status === 200) {
                    closeEditModalRe();
                    fetchInfo();
                    ToastNotification({ message: response.data.message });
                    setSubmitButtonLoading(false);
                }
            }
        } catch (error) {
            setSubmitButtonLoading(false);
            setError("Something went wrong");
        }
    };

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    
    return (
        <>
            <Edit 
                isOpen={isEditOpenRe} 
                closeModal={closeEditModalRe} 
                formData={formType === 'Residential' ? formData.ResidentialAddress : formData.CorrespondenceAddress}
                getsubmitformdata={getSubmitFormDataput}
                empId={empId} 
                addressid={addressId}
                error={error} 
                loaderSubmitButton={SubmitButtonLoading}
            />
            <div className="card-body">
                <h3 className="card-title">Address Information</h3>

                {Info.length === 0 ? (
                    <div>No records found</div>
                ) : (
                    Info.map((info, index) => {
                        const addressType = info.ResidentialAddress ? 'Residential' : 'Correspondence';
                        return (
                            <div key={index} className="accordion-item mt-1">
                                <div 
                                    className="accordion-header" 
                                    onClick={() => toggleSection(index)} 
                                    style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                                >
                                    <span style={{width:'80%'}}>{`${addressType} Address ${''}`}</span>
                                    <span><FaRegEdit className='edit-icon-color' style={{ cursor:'pointer' ,float:'right'}} size={15} onClick={() => openEditModalRe(addressType, info.idAddress)} /></span>
                                    <GrFormNext size={20} style={{ transform: openSection === index ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                                </div>

                                {openSection === index && (
                                    <div className="accordion-body mt-0">
                                        <div className="accordion-body-content">
                                            {info.ResidentialAddress && (
                                                <ul className="personal-info">
                                                    {info.ResidentialAddress.map((resInfo, resIndex) => (
                                                        <li key={resIndex}>
                                                            <div className="text">{resInfo.value}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {info.CorrespondenceAddress && (
                                                <ul className="personal-info">
                                                    {info.CorrespondenceAddress.map((corInfo, corIndex) => (
                                                        <li key={corIndex}>
                                                            <div className="text">{corInfo.value}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
            <ToastContainer />
        </>
    );
}
