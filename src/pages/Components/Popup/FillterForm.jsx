import ReactModal from 'react-modal';
import React, { useState, useEffect } from "react";
import Select from 'react-select';
import { MdClose } from "react-icons/md";
import Profile from '../commancomponents/profile';
import ButtonPrimary from '../common/Buttons/ButtonPrimaryComponent';
import SecTab from '../Employee/SecTab';
import Apialert from '../Errorcomponents/Apierror'
import { Toaster, toast } from 'react-hot-toast';
import { FaRegClock, FaTimes } from "react-icons/fa";
import CustomDataTable from '../Datatable/tablewithApi.jsx';
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
        minWidth: '75vw',
        minHeight: '300px'
    },
};


export default function FillterForm({ isOpen, closeModal,updateForm }) {
    const [AdduserContent, setAdduserContent] = useState([]);
    const [showerror, setShowError] = useState("");
    const [assetsparms, setAssetsparms] = useState("");
    
    const headingContent = '';
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const hitapidata = async () => {
        const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "assetsFilter" } })
        setAdduserContent(response.data.data)
    };

    useEffect(() => {
        hitapidata();
    }, [isOpen]);

    const getsubmitformdata = async (value) => {
        // Process `value` to create `filterParams`
        const filterParams = value.section
            .flatMap((section) =>
                section.fields
            .filter(
                (field) => 
                    field.attributeValue !== null && 
                    field.attributeValue !== undefined && 
                    field.attributeValue !== "" // Only include non-null, non-undefined, and non-empty values
                    )
                    .map(
                        (field) =>
                            `${encodeURIComponent(field.name)}=${encodeURIComponent(
                                field.attributeValue
                            )}`
                    )
            )
            .join("&");
    

        setAssetsparms(filterParams);
    
    };
    

    const handleApprrovereq = (id) => {};

    const handleSubmitAllocation = async (idArray, type, data, onSuccess) => {
        const id = idArray[0];
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/asset/getAssetForSearch`, { params: { "idAsset": id } })

            // Handle the response if needed
            
            if(response.data.data){
                updateForm(response.data.data);
                closeModal();
            }

        } catch (error) {
        
            
        }
    }

    
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
            ariaHideApp={false}
        >
            <div className="modal-dialog oxyem-user-image-select">
                <div className="modal-content" id="filter_asset_data">
                    <div className="modal-header mb-2">
                        <h4 className="modal-title" id="myLargeModalLabel" ></h4>

                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <SecTab AdduserContent={AdduserContent} headingContent={headingContent} getsubmitformdata={getsubmitformdata} />

                            <CustomDataTable
                                title={""}
                                handleApprrovereq={handleApprrovereq}
                                handleSubmitAllocation={handleSubmitAllocation}
                                pagename={"filter"}
                                dashboradApi={'/asset/searchAsset'}
                                assetsparms={assetsparms}
                            />
                        </div>


                    </div>

                </div>
            </div>

        </ReactModal>

    )
}
