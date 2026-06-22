import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../../Components/Datatable/tablewithApi';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { MdAdminPanelSettings } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { axiosJWT } from '../../Auth/AddAuthorization';
import ViewPermission from './search/viewPermission';


export default function Administrative() {
    const router = useRouter();
    const onDeleteClick = () => { };
    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'administrative-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);
    const [statData, setStatData] = useState({});
    const [activeTab, setActiveTab] = useState("SUPER_ADMIN");
    const [tabFillter, settabFillter] = useState({ roleType: "SUPER_ADMIN" });

    const handleTabChange = (tab) => {
        if (tab === activeTab) return; // ⛔ prevent unnecessary state update
        setActiveTab(tab);
        settabFillter({ roleType: tab });
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const onViewClick = (id, name) => {
        const payload ={
            "id": id,
            "name": name,
        }
        setSelectedGroup(payload);
      setIsModalOpen(true);
    };
    const handleCloseClick = () => {
      setIsModalOpen(false);
    };
    const onEditClick = (id) => {
        router.push(`/permissions/group/${id}`);
    };
    const fetchStatData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/permission/administrativeStats`);
            if (response) {
                const normalizedStats = response.data.data.reduce((acc, item) => {
                    acc[item.role_type] = item.role_count;
                    return acc;
                }, {});
                setStatData(normalizedStats);
            }
        } catch (error) {console.error(error)}
    };
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStatData();
    }, []);
    const ROLE_CARDS = [
        {
            key: "SUPER_ADMIN",
            label: "Super Admin",
            img: "/assets/img/admin.png"
        },
        {
            key: "ADMIN",
            label: "Admin",
            img: "/assets/img/computer-administrator.png"
        },
        {
            key: "NORMAL",
            label: "Group",
            img: "/assets/img/manager.png"
        }
    ];

    return (
        <>
            <Head>
                <title>Administrative Permissions | Admin Dashboard Management</title>
                <meta name="description" content={"Set and manage administrative permissions in your admin dashboard. Control user roles, access levels, and system security with streamlined tools."} />
            </Head>
            <ViewPermission isOpen={isModalOpen} closeModal={handleCloseClick} goupInfo={selectedGroup}/>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext="Administrative" addlink="/permissions/group/create" />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <div className='permission-description-text'>
                                                            <MdAdminPanelSettings />
                                                            <div className='core-text'>
                                                                <h3>Administrative Role Available</h3>
                                                                <p>The Administrative Role provides full access to manage system settings, users, permissions, and core administrative functions. Ideal for team members who oversee platform operations.</p>
                                                            </div>
                                                        </div>
                                                        <div className="permission-box">
                                                            {ROLE_CARDS.map(role => (
                                                                <div
                                                                    key={role.key}
                                                                    className="align-items-center gap-5 card-body-role"
                                                                >
                                                                    <img src={role.img} alt={role.label} />
                                                                    <div className="content gap-1">
                                                                        <p className="box_heading_per">{role.label}</p>
                                                                        <p className="box_heading_number">
                                                                            {statData?.[role.key] ?? 0}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
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
                                                        <div className="vertical-tabs-container table-tab list-tab-admin">
                                                            <div className="tabs">
                                                                <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab">
                                                                    <li className={`nav-item ${activeTab === "SUPER_ADMIN" ? 'active' : ''}`}>
                                                                        <a
                                                                            className={`nav-link`}
                                                                            onClick={() => handleTabChange("SUPER_ADMIN")}
                                                                        >Super Admin
                                                                        </a>
                                                                    </li>
                                                                    <li className={`nav-item ${activeTab === "ADMIN" ? 'active' : ''}`}>
                                                                        <a
                                                                            className={`nav-link`}
                                                                            onClick={() => handleTabChange("ADMIN")}
                                                                        >Admin
                                                                        </a>
                                                                    </li>
                                                                    <li className={`nav-item ${activeTab === "NORMAL" ? 'active' : ''}`}>
                                                                        <a
                                                                            className={`nav-link`}
                                                                            onClick={() => handleTabChange("NORMAL")}
                                                                        >Group
                                                                        </a>
                                                                    </li>

                                                                </ul>
                                                            </div>
                                                            <div className="tab-content">
                                                                {activeTab === "SUPER_ADMIN" ? (
                                                                    <>
                                                                        <div className='group-description-text'>
                                                                            <MdOutlineAdminPanelSettings />
                                                                            <div className='core-text'>
                                                                                <h3>Super Admin Users</h3>
                                                                                <p>View the users who have the highest-level permissions across the system.</p>
                                                                            </div>
                                                                        </div>
                                                                        <CustomDataTable
                                                                            title=""
                                                                            onDeleteClick={onDeleteClick}
                                                                            handleApprrovereq=""
                                                                            dashboradApi={'/permission/administrativeList'}
                                                                            tabParamsInObj={tabFillter}
                                                                        />
                                                                    </>
                                                                ) : activeTab === "ADMIN" ? (
                                                                    <>
                                                                        <div className='group-description-text'>
                                                                            <RiAdminFill />
                                                                            <div className='core-text'>
                                                                                <h3>Admin Users</h3>
                                                                                <p>View all users who have administrative access to manage the system.</p>
                                                                            </div>
                                                                        </div>
                                                                        <CustomDataTable
                                                                            title=""
                                                                            onDeleteClick={onDeleteClick}
                                                                            handleApprrovereq=""
                                                                            dashboradApi={'/permission/administrativeList'}
                                                                            tabParamsInObj={tabFillter}
                                                                        />
                                                                    </>
                                                                ) : activeTab === "NORMAL" ? (
                                                                    <>
                                                                        <div className='group-description-text'>
                                                                            <FaTasks />
                                                                            <div className='core-text'>
                                                                                <h3>System Groups</h3>
                                                                                <p>Groups help organize users with similar roles or access levels. Review each group to understand its permissions and members.</p>
                                                                            </div>
                                                                        </div>
                                                                        <CustomDataTable
                                                                            title=""
                                                                            onDeleteClick={onDeleteClick}
                                                                            handleApprrovereq=""
                                                                            dashboradApi={'/permission/administrativeList'}
                                                                            tabParamsInObj={tabFillter}
                                                                            onEditClick={onEditClick}
                                                                            onViewClick={onViewClick}
                                                                        />
                                                                    </>
                                                                ) : (null)
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}