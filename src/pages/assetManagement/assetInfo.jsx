import React, { useState, useEffect } from "react";
import ReactModal from 'react-modal';
import { MdClose } from "react-icons/md"; // Import the download icon
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { IoDownloadOutline } from "react-icons/io5";

const customStyles = {
    content: {
        background: '#fff',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minHeight: '75vh',
        maxHeight: '75vh',
        minWidth: '75vw'
    },
};

export default function AssetInfo({ isOpen, closeModal, isHistroyId }) {
    const [tabs, setTabs] = useState([]);
    const [tabdata, setTabdata] = useState({});
    const [activeTab, setActiveTab] = useState(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const getDetails = async (id) => {
        try {
            const response = await axiosJWT.get(`${apiUrl}/asset/assetInfo`, { params: { id } });
            if (response && response.data && response.data.data) {
                const { tabs, tabdata } = response.data.data;
                setTabs(tabs);
                setTabdata(tabdata);
                setActiveTab(tabs[0]?.value || null);
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        if (isOpen) {
            getDetails(isHistroyId);
            document.body.classList.add("hide-body-scroll");
        } else {
            document.body.classList.remove("hide-body-scroll");
        }
    }, [isOpen, isHistroyId]);

    const handleDownload = async (path) => {
        const filePath = path;
        try {
    
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/download`, {
                params: { filePath},
                responseType: 'blob', // Important for file download
            });
    
            // Create a URL for the file and download it
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = getFileName(filePath);
            link.setAttribute('download', fileName); // or extract the file name from the response
            document.body.appendChild(link);
            link.click();
    
        } catch (error) {
        }
    };

    const getFileName = (path) => {
        return path.substring(path.lastIndexOf('/') + 1);
      };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <div className="modal-dialog oxyem-user-time-select">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <h4 className="modal-title" id="myLargeModalLabel">Asset Information</h4>
                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab" id="myTab" role="tablist">
                                {tabs.map((tab, index) => (
                                    <li className="nav-item" role="presentation" key={index}>
                                        <a
                                            className={`nav-link ${activeTab === tab.value ? 'active' : ''}`}
                                            id={`${tab.value.toLowerCase()}-tab`}
                                            data-bs-toggle="tab"
                                            data-bs-target={`#${tab.value.toLowerCase()}`}
                                            type="button"
                                            role="tab"
                                            aria-controls={tab.value.toLowerCase()}
                                            aria-selected={activeTab === tab.value}
                                            onClick={() => setActiveTab(tab.value)}
                                        >
                                            {tab.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                {tabs.map((tab, index) => (
                                    <div
                                        className={`tab-pane fade ${activeTab === tab.value ? 'show active' : ''}`}
                                        id={tab.value.toLowerCase()}
                                        role="tabpanel"
                                        aria-labelledby={`${tab.value.toLowerCase()}-tab`}
                                        key={index}
                                    >
                                        {tabdata[tab.value] && Object.entries(tabdata[tab.value]).map(([section, details], idx) => (
                                            <div key={idx} className="asset_tab_table_content">
                                                <h4>{section}</h4>
                                                <table className="table-asset-info-t">
                                                    <tbody>
                                                        {Object.entries(details).map(([key, value], subIndex) => (
                                                            <tr key={subIndex}>
                                                                <th>{key}</th>
                                                                <td>
                                                                    {key === 'Upload Invoice' ? (
                                                                        <>
                                                                            {/* {value} */}
                                                                            <IoDownloadOutline style={{ cursor: 'pointer' }} size={20} color='#FA7E12' onClick={() => handleDownload(value)} />
                                                                            {/* <button onClick={() => handleDownload(value)} className="download-button">
                                                                                <MdDownload />
                                                                            </button> */}
                                                                        </>
                                                                    ) : (
                                                                        value
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
