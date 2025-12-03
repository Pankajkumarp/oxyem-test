import React, { useState, useEffect } from "react";
import ReactModal from 'react-modal';
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../Auth/AddAuthorization.jsx';

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
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [activeTab, setActiveTab] = useState(tabs[0]?.value);

    const getDetails = async (id) => {
        try {
            const response = await axiosJWT.get(`${apiUrl}/asset/assetInfo`, { params: { id: id, isFor: 'self' } });
            if (response && response.data && response.data.data) {
                setTabs(response.data.data.tabs);
                setTabdata(response.data.data.tabdata);
                setActiveTab(response.data.data.tabs[0]?.value);
            }
        } catch (error) {
            console.error("Error occurred while fetching attendance details:", error);
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
                                        {Object.keys(tabdata).length === 0 ? (
                                            <div>No data available</div>
                                        ) : (
                                            Object.entries(tabdata[tab.value]).map(([section, details], idx) => (
                                                <div key={idx} className="asset_tab_table_content">
                                                    <h4>{section}</h4>
                                                    <table className="table-asset-info-t">
                                                        <tbody>
                                                            {Object.entries(details).map(([key, value], subIndex) => (
                                                                <tr key={subIndex}>
                                                                    <th>{key}</th>
                                                                    <td>{value}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ))
                                        )}
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
