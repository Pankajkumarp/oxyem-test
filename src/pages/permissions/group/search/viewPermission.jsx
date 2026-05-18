import ReactModal from 'react-modal';
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { MdGroupAdd } from "react-icons/md";
import { VscDiffRenamed } from "react-icons/vsc";
import { GoFileSubmodule } from "react-icons/go";
import NormalTable from './NormalTable';
import MultiSelectionTable from './MultiSelectionTable';

export default function viewPermission({ isOpen, closeModal, goupInfo }) {
    const [isMobile, setIsMobile] = useState(false);
	const [searchfilter, setSearchfilter] = useState({});

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768);

        const handleResize = () =>
            setIsMobile(window.innerWidth <= 768);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
	useEffect(() => {
  if (!goupInfo?.id) return;

  setSearchfilter({ idGroup: goupInfo.id });
}, [goupInfo?.id]);

    const customStyles = {
        content: {
            background: "#fff",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95vw" : "80vw",
            maxWidth: "1250px",
        },
    };
    const [activeTab, setActiveTab] = useState("role");

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <div className="modal-dialog modal-xxl ">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <h4 className="modal-title" id="myLargeModalLabel" ></h4>
                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body ">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <div className='group-description-text'>
                                                            <VscDiffRenamed />
                                                            <div className='core-text'>
                                                                <h3>Group Information</h3>
                                                                <p>Review the name of the group currently selected for viewing or permission management.</p>
                                                            </div>
                                                        </div>
                                                        <div className="group_name_display">
                                                            <strong>{goupInfo?.name}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body">
                                                    <div className="vertical-tabs-container table-tab">
                                                        <div className="tabs">
                                                            <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab">
                                                                <li className={`nav-item ${activeTab === "role" ? 'active' : ''}`}>
                                                                    <a
                                                                        className={`nav-link`}
                                                                        onClick={() => setActiveTab("role")}
                                                                    >Role
                                                                    </a>
                                                                </li>
                                                                <li className={`nav-item ${activeTab === "user" ? 'active' : ''}`}>
                                                                    <a
                                                                        className={`nav-link`}
                                                                        onClick={() => setActiveTab("user")}
                                                                    >User
                                                                    </a>
                                                                </li>

                                                            </ul>
                                                        </div>
                                                        <div className="tab-content">
                                                            {activeTab === "role" ? (
                                                                <>
                                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                                        <div className='group-description-text'>
                                                                            <MdGroupAdd />
                                                                            <div className='core-text'>
                                                                                <h3>Assigned Roles</h3>
                                                                                <p>This section shows the roles currently associated with this group. Role assignments cannot be modified in view mode.</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <NormalTable apiPath={"/permission/getAssignedRolesDetails"} searchfilter={searchfilter} showCheckbox={true}/>
                                                                </>
                                                            ) : (
                                                                <> 
                                                                <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                                    <div className='group-description-text'>
                                                                        <MdGroupAdd />
                                                                        <div className='core-text'>
                                                                            <h3>Assigned Users</h3>
                                                                            <p>Review the users who belong to this group and follow its permissions and access rules.</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                    <NormalTable apiPath={"/permission/getAssignedUserDetails"} searchfilter={searchfilter} showCheckbox={true}/>
																</>
                                                            )

                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <div className='group-description-text'>
                                                            <GoFileSubmodule />
                                                            <div className='core-text'>
                                                                <h3>Modules Linked to This Group</h3>
                                                                <p>Review the modules that define this group’s access to system functionalities.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <MultiSelectionTable apiPath={"/permission/getAssignedPermissions"} searchfilter={searchfilter}/>

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

        </ReactModal>

    )
}
