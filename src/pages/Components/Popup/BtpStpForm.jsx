import ReactModal from 'react-modal';
import React, { useState, useEffect } from "react";
import Select from 'react-select';
import { MdClose } from "react-icons/md";
import Profile from '../commancomponents/profile';
import ButtonPrimary from '../common/Buttons/ButtonPrimaryComponent';
import SecTab from '../Employee/SecTab';
import Apialert from '../Errorcomponents/Apierror'
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
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


export default function BtpStpForm({ isOpen, closeModal, labelText, dynamicform, handleGetformvalueClick, idclient, btpstpvalue }) {
    const [AdduserContent, setAdduserContent] = useState([]);
    const [showfield, setshowfield] = useState(false);
    const [showerror, setShowError] = useState("");
    const [stpbtpvalue, setStpbtpvalue] = useState(btpstpvalue);
    const headingContent = '';
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const hitapidata = async () => {

        const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": dynamicform } })
        setAdduserContent(response.data.data)
        console.log("Response:", response.data);
    };

    const getstpOption = async (value) => {
        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, { params: { "isFor": "clientSTPlist", "id": value } })
        if (response) {
            const optionsData = response.data.data.map((item) => ({
                label: item.name,
                name: item.id,
                value: ""
            }));
            const stpdefaultvalue = optionsData[0]?.name;
            const updatedAdduserContent = { ...AdduserContent };
            const stpSection = updatedAdduserContent.section.find(section => section.SectionName === "STP");
            if (stpSection) {
                const stpSubsection = stpSection.Subsection.find(subsection => subsection.SubsectionName === "STP");
                if (stpSubsection) {
                    stpSubsection.fields = stpSubsection.fields.map(field => {
                        if (field.name === "STP") {
                            return { ...field, options: optionsData, value: stpbtpvalue?.STP || stpdefaultvalue };
                        }
                        return field;
                    });
                }
            }
            setAdduserContent(updatedAdduserContent);

        }
    };
    const getbtpOption = async (value) => {
        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, { params: { "isFor": "clientBTPlist", "id": value } })
        if (response) {
            const optionsData = response.data.data.map((item) => ({
                label: item.name,
                name: item.id,
                value: ""
            }));
            const btpdefaultvalue = optionsData[0]?.name;
            const updatedAdduserContent = { ...AdduserContent };
            const stpSection = updatedAdduserContent.section.find(section => section.SectionName === "BTP");
            if (stpSection) {
                const stpSubsection = stpSection.Subsection.find(subsection => subsection.SubsectionName === "BTP");
                if (stpSubsection) {
                    stpSubsection.fields = stpSubsection.fields.map(field => {
                        if (field.name === "BTP") {
                            return { ...field, options: optionsData, value: stpbtpvalue?.BTP || btpdefaultvalue };
                        }
                        return field;
                    });
                }
            }
            setAdduserContent(updatedAdduserContent);

        }
    };


    useEffect(() => {
        hitapidata();
    }, [isOpen]);
    useEffect(() => {
        setStpbtpvalue(btpstpvalue)
    }, [btpstpvalue]);
    useEffect(() => {
        if (isOpen) {
            getbtpOption(idclient)
            getstpOption(idclient)
            setshowfield(true)
            setTimeout(() => {
                const output = {
                    feature: AdduserContent.formType,
                    section: AdduserContent.section.map(section => ({
                        SectionName: section.SectionName,
                        fields: section.Subsection.flatMap(subsection =>
                            subsection.fields.map(field => ({
                                name: field.name,
                                attributeValue: field.value
                            }))
                        )
                    }))
                };
                handleGetformvalueClick(output)
            }, 1000);

        }
    }, [idclient, isOpen]);



    const getsubmitformdata = async (value) => {
        const transformedData = value.section.reduce((acc, section) => {
            section.fields.forEach(field => {
                acc[field.name] = field.attributeValue;
            });
            return acc;
        }, {});
        setStpbtpvalue(transformedData)
        handleGetformvalueClick(value)
        closeModal()
    };
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <div className="modal-dialog modal-lg oxyem-user-image-select btp-stp-popup-form">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <h4 className="modal-title" id="myLargeModalLabel" ><b>{labelText}</b></h4>

                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            {showerror ? (<><Apialert
                                type={"danger"}
                                message={showerror}
                                show={true} /></>) : (<></>)}
                            {showfield ? (
                                <SecTab AdduserContent={AdduserContent} headingContent={headingContent} getsubmitformdata={getsubmitformdata} />
                            ) : (null)}
                        </div>


                    </div>

                </div>
            </div>

        </ReactModal>

    )
}
