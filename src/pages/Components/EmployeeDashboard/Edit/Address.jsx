import React, { useState, useEffect } from "react";
import ReactModal from 'react-modal';
import dynamic from 'next/dynamic';

const DynamicForm = dynamic(() => import('../../AddressFrom'), {
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

export default function Edit({ isOpen, closeModal, formData, getsubmitformdata, empId }) {
    const [content, setContent] = useState(formData);
    const [empid, setEmpId] = useState(empId);
    const [countryOptions, setCountryOptions] = useState([]);
    useEffect(() => {
        setContent(formData); // Update content when formData changes
    }, [formData]);

    useEffect(() => {
        console.log("empId changed:", empId);
        setEmpId(empId); // Update empid when empId changes
    }, [empId]);

    // const fetchAddDetails = async (pinCode) => {
    //     try {
    //         const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
    //         const data = await response.json();

    //         // Extract city, state, and country from API response
    //         let city = "";
    //         let state = "";
    //         let country = "";

    //         if (data && Array.isArray(data) && data[0].PostOffice && data[0].PostOffice.length > 0) {
    //             city = data[0].PostOffice[0].District;
    //             state = data[0].PostOffice[0].State;
    //             country = data[0].PostOffice[0].Country;
    //         }

    //         // Update form data with city, state, and country
    //         updateFormData({ city, state, country });
    //     } catch (error) {
    //         // console.error('Error fetching details:', error);
    //     }
    // };
const findCountryOption = async (countryName) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const response = await axiosJWT.get(`${apiUrl}/location`, {
            params: { isFor: "country" }
        });
console.log("findCountryOption response:", response);
        const countryList = response.data || [];
        setCountryOptions(countryList);

        if (!countryName) return null;

        console.log("Finding:", countryName);
        console.log("Options:", countryList);

        const match = countryList.find(c =>
            c.name.toLowerCase().includes(countryName.toLowerCase()) ||
            countryName.toLowerCase().includes(c.name.toLowerCase())
        );

        return match ? { label: match.name, value: match.id } : null;

    } catch (err) {
        console.error("findCountryOption API error:", err);
        return null;
    }
};


const fetchAddDetails = async (pinCode,countryOptions) => {
    try {
        const cleanPin = pinCode.trim();

        
        if (cleanPin.length !== 6 && cleanPin.length !== 3) {
            return; 
        }

        const apiKey = "3fa9d640-cb84-11f0-841e-11ab8cd4bfb0";

        let city = "";
        let state = "";
        let country = "";

        // 🇮🇳 INDIA → length must be 6
        if (cleanPin.length === 6) {
            const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
            const data = await response.json();

            if (data?.[0]?.PostOffice?.length) {
                city = data[0].PostOffice[0].District;
                state = data[0].PostOffice[0].State;
                country = "India"

            }
        }

        // 🇮🇪 IRELAND → length must be 7
        else if (cleanPin.length === 3) {
            const url = `https://app.zipcodebase.com/api/v1/search?apikey=${apiKey}&codes=${cleanPin}&country=IE`;

            const response = await fetch(url);
            const data = await response.json();

            console.log("Ireland response:", data);

            const result = data?.results?.[cleanPin]?.[0];
            if (result) {
                city = result.city;
                state = result.state;
                country = "Ireland";
            }
        }
        
        const selectedCountry = await findCountryOption(country);
        console.log("selectedCountry", selectedCountry);
        updateFormData({ city, state, country:selectedCountry });

    } catch (err) {
        console.error("Error:", err);
    }
};

    const updateFormData = (bankData) => {
        const updatedArray = JSON.parse(JSON.stringify(content)); // Deep copy of original array

        for (let i = 0; i < updatedArray.section.length; i++) {
            const section = updatedArray.section[i];

            for (let j = 0; j < section.Subsection.length; j++) {
                const subsection = section.Subsection[j];

                for (let k = 0; k < subsection.fields.length; k++) {
                    const field = subsection.fields[k];

                    switch (field.name) {
                        case 'state':
                            updatedArray.section[i].Subsection[j].fields[k].value = bankData.state;
                            break;
                        case 'city':
                            updatedArray.section[i].Subsection[j].fields[k].value = bankData.city;
                            break;
                        case 'country':
                            updatedArray.section[i].Subsection[j].fields[k].value = bankData.country;
                            break;
                        // Add more cases for other fields if needed
                        default:
                            break;
                    }
                }
            }
        }

        setContent(updatedArray);
    };

    const fetchAddDetailsxp = async (pinCode) => {
       try {
        const cleanPin = pinCode.trim();

        // 🔒 PREVENT API CALL UNTIL LENGTH MATCHES
        if (cleanPin.length !== 6 && cleanPin.length !== 3) {
            return; // do nothing
        }

        const apiKey = "3fa9d640-cb84-11f0-841e-11ab8cd4bfb0";

        let city = "";
        let state = "";
        let country = "";

        // 🇮🇳 INDIA → length must be 6
        if (cleanPin.length === 6) {
            const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
            const data = await response.json();

            if (data?.[0]?.PostOffice?.length) {
                city = data[0].PostOffice[0].District;
                state = data[0].PostOffice[0].State;
                country = "India";
            }
        }

        // 🇮🇪 IRELAND → length must be 7
        else if (cleanPin.length === 3) {
            const url = `https://app.zipcodebase.com/api/v1/search?apikey=${apiKey}&codes=${cleanPin}&country=IE`;

            const response = await fetch(url);
            const data = await response.json();

            console.log("Ireland response:", data);

            const result = data?.results?.[cleanPin]?.[0];
            if (result) {
                city = result.city;
                state = result.state;
                country = "Ireland";
            }
        }

        updateFormDataxp({ city, state, country });

    } catch (err) {
        console.error("Error:", err);
    }
    };
    // const fetchAddDetailsxp = async (pinCode) => {
    //     try {
    //         const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
    //         const data = await response.json();

    //         // Extract city, state, and country from API response
    //         let city = "";
    //         let state = "";
    //         let country = "";

    //         if (data && Array.isArray(data) && data[0].PostOffice && data[0].PostOffice.length > 0) {
    //             city = data[0].PostOffice[0].District;
    //             state = data[0].PostOffice[0].State;
    //             country = data[0].PostOffice[0].Country;
    //         }

    //         // Update form data with city, state, and country
    //         updateFormDataxp({ city, state, country });
    //     } catch (error) {
    //         // console.error('Error fetching details:', error);
    //     }
    // };
  const updateFormDataxp = (bankData) => {
        const updatedArray = JSON.parse(JSON.stringify(content)); // Deep copy of original array

        for (let i = 0; i < updatedArray.section.length; i++) {
            const section = updatedArray.section[i];

            for (let j = 0; j < section.Subsection.length; j++) {
                const subsection = section.Subsection[j];

                for (let k = 0; k < subsection.fields.length; k++) {
                    const field = subsection.fields[k];

                    switch (field.name) {
                        case 'xpstate':
                            updatedArray.section[i].Subsection[j].fields[k].value = bankData.state;
                            break;
                        case 'xpcity':
                            updatedArray.section[i].Subsection[j].fields[k].value = bankData.city;
                            break;
                        case 'xpcountry':
                            updatedArray.section[i].Subsection[j].fields[k].value = bankData.country;
                            break;
                        // Add more cases for other fields if needed
                        default:
                            break;
                    }
                }
            }
        }

        setContent(updatedArray);
    };

    const handleChangeValue = (fieldName, value) => {
        const updatedArray = JSON.parse(JSON.stringify(content)); 

        for (let i = 0; i < updatedArray.section.length; i++) {
            const section = updatedArray.section[i];

            for (let j = 0; j < section.Subsection.length; j++) {
                const subsection = section.Subsection[j];

                for (let k = 0; k < subsection.fields.length; k++) {
                    const field = subsection.fields[k];

                    if (field.name === fieldName) {
                        updatedArray.section[i].Subsection[j].fields[k].value = value;

                        // Fetch details based on pincode
                        if (fieldName === 'pincode') {
                            fetchAddDetails(value,countryOptions);
                        }

                        else if (fieldName === 'xppincode') {
                            fetchAddDetailsxp(value);
                        }



                        // Handle showing/hiding Correspondence Address section
                        if (fieldName === 'addressSame') {
                            const correspondenceAddress = updatedArray.section[i].Subsection.find(
                                sub => sub.name === 'correspondenceAddress'
                            );
                            if (correspondenceAddress) {
                                correspondenceAddress.isVisible = !value; // Hide if 'Yes', show if 'No'
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
    
        sourceContent.section.forEach(section => {
            section.Subsection.forEach(subsection => {
                // Check if this is the "Correspondence Address" section and if addressSame is true
                const isCorrespondenceAddress = subsection.SubsectionName.includes("Correspondence");
                const addressSameField = sourceContent.section[0].Subsection[0].fields.find(field => field.name === 'addressSame');
                const addressSame = addressSameField ? addressSameField.value : false;
    
                // Skip the "Correspondence Address" section if addressSame is true
                if (isCorrespondenceAddress && addressSame) {
                    return;
                }
    
                const newSection = {
                    SectionName: subsection.SubsectionName.replace(/\s+/g, ''), // Remove spaces in SectionName
                    fields: []
                };
    
                subsection.fields.forEach(field => {
                    if (field.name === 'addressSame') {
                        // Skip the addressSame field
                        return;
                    }
    
                    let attributeValue = field.value;
    
                    // Always push the current field to newSection
                    newSection.fields.push({
                        name: field.name.replace(/^xp/, ''),
                        attributeValue: attributeValue
                    });
                });
    
                // Push the newSection to newArray
                newArray.section.push(newSection);
            });
    
            // If addressSame is true, populate a combined correspondence address section
            const addressSameField = sourceContent.section[0].Subsection[0].fields.find(field => field.name === 'addressSame');
            if (addressSameField && addressSameField.value === true) {
                const combinedSection = {
                    SectionName: 'CorrespondenceAddress', // Ensure correct SectionName
                    fields: []
                };
    
                // Copy fields from Residential Address to Correspondence Address section
                sourceContent.section[0].Subsection[0].fields.forEach(resField => {
                    if (resField.name !== 'addressSame') {
                        combinedSection.fields.push({
                            name: resField.name.replace(/^xp/, ''),
                            attributeValue: resField.value
                        });
                    }
                });
    
                newArray.section.push(combinedSection);
            }
        });
    
        return newArray;
    };
    
    const submitformdata = () => {
        const newArray = convertToArray(content); // Convert content to array format

        getsubmitformdata(newArray); // Pass newArray to parent component
    };

    const handleChangess = (currentIndex) => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < content.section.length) {
            setActiveTab(content.section[nextIndex].SectionName);
        }
    };

    return (
        <ReactModal isOpen={isOpen} onRequestClose={closeModal} contentLabel="Modal" style={customStyles} ariaHideApp={false}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        {/* Header content if needed */}
                    </div>
                    <div className="modal-body">
                        <span className="add-btn-circle" onClick={closeModal}>X</span>
                        {content && content.section && Array.isArray(content.section) ? (
                            content.section.map((section, index) => (
                                <div key={index}>
                                    <DynamicForm
                                        fields={section}
                                        submitformdata={submitformdata}
                                        handleChangeValue={handleChangeValue}
                                        handleChangess={() => handleChangess(index)}
                                    />
                                </div>
                            ))
                        ) : (<div>No sections available</div>)}
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
