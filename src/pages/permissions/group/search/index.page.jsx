import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaSearch } from "react-icons/fa";
import Select from "react-select";
import { MdFilterList } from "react-icons/md";
import MultiSelectionTable from './MultiSelectionTable';
import NormalTable from './NormalTable';
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import ViewPermission from './viewPermission';
const selectStyles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? 'var(--dropdownfocusbordercolor)' : provided.borderColor,
        boxShadow: state.isFocused ? 'var(--dropdownfocusboxshadow)' : provided.boxShadow,
        '&:hover': {
            borderColor: state.isFocused ? 'var(--dropdownfocusbordercolor)' : 'var(--dropdownhoverbordercolor)',
        },
        backgroundColor: state.isFocused ? 'var(--dropdownfocusbgcolor)' : provided.backgroundColor,
    }),
    indicatorSeparator: (provided, state) => ({
        ...provided, 
        backgroundColor: 'var(--dropdownhoverbg)',
        fontWeight: 'var(--dropdownfontweight)',
    }),
    option: (provided, state) => ({
        ...provided,
        padding: 'var(--dropdownpadding)',
        cursor: 'var(--dropdowncursorstyle)',
        fontWeight: 'var(--dropdownfontweight)',
        backgroundColor: state.isSelected
            ? 'var(--dropdownselectedbgcolor)'
            : state.isFocused
                ? 'var(--dropdowntransparentcolor)'
                : 'var(--dropdowntransparentcolor)',
        color: state.isSelected ? 'var(--dropdownselectedcolor)' : 'var(--dropdowninheritcolor)',
        ':hover': {
            backgroundColor: 'var(--dropdownhoverbg)',
            color: 'var(--dropdownhovercolor)',
            fontWeight: 'var(--dropdownfontweight)',
        },
    }),
};

export default function assignGroup() {
	const [searchfilter, setSearchfilter] = useState({
  idGroup: "",
  idRole: "",
  idUser: "",
});

const handleFilterChange = (key) => (selected) => {
  setSearchfilter((prev) => ({
    ...prev,
    [key]: selected ? selected.value : "",
  }));
};

    const [activeTab, setActiveTab] = useState("group");
    const router = useRouter();
    const [error, setError] = useState("");
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
    const [groupnameOptions, setGroupnameOptions] = useState([]);
    const fetchGroupData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            const response = await axiosJWT.get(`${apiUrl}/permission/getGroupDropdown`);

            if (response?.data?.data) {
                    const groupList = response.data.data
                    const groupnameOptions = groupList.map((group) => ({
                        value: group.id,
                        label: group.name,
                    }));
                setGroupnameOptions(groupnameOptions);
            }
        } catch (error) {
            console.error("Failed to fetch modules:", error);
        }
    };
    const [rolenameOptions, setRolenameOptions] = useState([]);
    const fetchRoleData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            const response = await axiosJWT.get(`${apiUrl}/permission/getRoleDropDown`);

            if (response?.data?.data) {
                    const roleList = response.data.data
                    const rolenameOptions = roleList.map((role) => ({
                        value: role.id,
                        label: role.name,
                    }));
                setRolenameOptions(rolenameOptions);
            }
        } catch (error) {
            console.error("Failed to fetch modules:", error);
        }
    };
    const [usernameOptions, setUsernameOptions] = useState([]);
    const fetchUserData = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/permission/getUserDropDown`);
            if (response?.data?.data) {
                    const userList = response.data.data
                    const usernameOptions = userList.map((user) => ({
                        value: user.id,
                        label: user.name,
                    }));
                setUsernameOptions(usernameOptions);
            }
        } catch (error) {
            console.error("Failed to fetch modules:", error);
        }
    };

    useEffect(() => {
        fetchGroupData();
        fetchRoleData();
        fetchUserData();
    }, []);

const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedGroup, setSelectedGroup] = useState(null);
const handleViewClick = (type, rowObj) => {
  setSelectedGroup(rowObj);
  setIsModalOpen(true);
};
const handleCloseClick = () => {
  setIsModalOpen(false);
};
const handleEditClick = (type, rowObj) => {
  router.push(`/permissions/group/${rowObj.id}`);
};

const handleHistryClick = (type, rowObj) => {
  setSelectedGroup(rowObj);
  setIsModalOpen(true);
};
    return (
        <>
            <Head>
                <title>Search Groups, Roles, and Modules by Username | Oxyem</title>
                <meta name="description" content={"Quickly search and find groups, roles, and modules associated with any username. Streamline user management, access control, and role assignments in Oxyem."} />
            </Head>
			<ViewPermission isOpen={isModalOpen} closeModal={handleCloseClick} goupInfo={selectedGroup}/>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext="User Permission Lookup | Groups, Roles & Modules" />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <div className='group-description-text'>
                                                            <FaSearch />
                                                            <div className='core-text'>
                                                                <h3>Access Management Search</h3>
                                                                <p>Refine your search by group, role, or username to audit user permissions efficiently.</p>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                <Select
																	options={groupnameOptions}
																	placeholder="Select Group Name"
																	isClearable
																	value={
																		searchfilter.idGroup
																		? groupnameOptions.find(opt => opt.value === searchfilter.idGroup)
																		: null
																	}
																	onChange={handleFilterChange("idGroup")}
																	styles={selectStyles}
																/>

                                                            </div>
                                                            <div className="col-md-4">
															<Select
																options={rolenameOptions}
																placeholder="Select Role"
																isClearable
																value={
																	searchfilter.idRole
																	? rolenameOptions.find(opt => opt.value === searchfilter.idRole)
																	: null
																}
																onChange={handleFilterChange("idRole")}
																styles={selectStyles}
															/>

                                                            </div>
                                                            <div className="col-md-4">
															<Select
																options={usernameOptions}
																placeholder="Select User name"
																isClearable
																value={
																	searchfilter.idUser
																	? usernameOptions.find(opt => opt.value === searchfilter.idUser)
																	: null
																}
																onChange={handleFilterChange("idUser")}
																styles={selectStyles}
															/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <div className='group-description-text'>
                                                            <MdFilterList />
                                                            <div className='core-text'>
                                                                <h3>Your Filtered Access Information</h3>
                                                                <p>Based on your selection, we’ve listed all related groups, roles, and module permissions below.</p>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="vertical-tabs-container table-tab">
                                                                <div className="tabs">
                                                                    <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab">
                                                                        <li className={`nav-item ${activeTab === "group" ? 'active' : ''}`}>
                                                                            <a
                                                                                className={`nav-link`}
                                                                                onClick={() => setActiveTab("group")}
                                                                            >
                                                                                Group
                                                                            </a>
                                                                        </li>
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
                                                                        <li className={`nav-item ${activeTab === "permission" ? 'active' : ''}`}>
                                                                            <a
                                                                                className={`nav-link`}
                                                                                onClick={() => setActiveTab("permission")}
                                                                            >Permission
                                                                            </a>
                                                                        </li>

                                                                    </ul>
                                                                </div>
                                                                <div className="tab-content">
                                                                    {activeTab === "group" ? (
                                                                        <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                                            <NormalTable apiPath={"/permission/getAllGroups"} onclickButton={handleViewClick} onclickHistroy={handleHistryClick} handleEditClick={handleEditClick} searchfilter={searchfilter} showCheckbox={false}/>
                                                                        </div>
                                                                    ) : activeTab === "role" ? (
                                                                        <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
																			<NormalTable apiPath={"/permission/getAssignedRolesDetails"} searchfilter={searchfilter} showCheckbox={true}/>
                                                                        </div>
                                                                    ) : activeTab === "user" ? (
                                                                        <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
																		    <NormalTable apiPath={"/permission/getAssignedUserDetails"} searchfilter={searchfilter} showCheckbox={true}/>
                                                                        </div>
                                                                    ) : activeTab === "permission" ? (
                                                                        <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                                            <MultiSelectionTable
                                                                                searchfilter={searchfilter}
																				apiPath={"/permission/getAssignedPermissions"}
                                                                            />
                                                                        </div>
                                                                    ) : null}

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
            </div>
        </>
    );
}