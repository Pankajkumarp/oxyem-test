import React, { useState, useEffect, useRef } from "react";
import ReactModal from 'react-modal';
import Select from 'react-select';
import { MdClose } from "react-icons/md";
import Profile from '../commancomponents/profile';
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrCheckboxSelected } from "react-icons/gr";
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

export default function assetInfo({ isOpen, closeModal }) {

    const tabs = [
        { label: 'Asset Information', value: 'Asset' },
        { label: 'Purchase Information', value: 'Purchase' },
        { label: 'Warranty Information', value: 'Warranty' },
    ];

    const tabdata = {
        "Asset": {
            "Asset Information": {
                "Asset Category": "Software/Hardware",
                "Asset Name": "Laptop",
                "Asset ID": "ASB-131-AWD",
                "Manufacturer": "HP",
                "Product No.": "131",
                "Serial No.": "131"
            },
            "Asset Configuration (Laptop / Desktop)": {
                "Processor": "Intel Core(TM) i5",
                "Screen Size": "13 inch",
                "Installed RAM": "16 GB",
                "System Type": "HP",
                "Operating System": "MS Windows 11 Home",
                "Hard Disk": "256 GB",
                "Graphic Card": "AMD Radeon RX 7900 XTX"
            }
        },
        "Purchase": {
            "Purchase Information": {
                "Mode": "Offline",
                "Supplier": "HP",
                "Purchase Currancy": "INR",
                "Total Purchase Amount": "",
                "GST Amount": "40000",
                "Date of Purchase": "22 Jun 2023",
                "Invoice": ""
            },
        },
        "Warranty": {
            "Warranty Information": {
                "Manufacturer Warranty": "1 Year",
                "Warranty Start Date": "14 Jun 2022",
                "Warranty End Date": "14 Jun 2023",
            },
        }
    };
    const [activeTab, setActiveTab] = useState(tabs[0].value);
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
                        <h4 className="modal-title" id="myLargeModalLabel" >Asset Information</h4>
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
                                        {Object.entries(tabdata[tab.value]).map(([section, details], idx) => (
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
