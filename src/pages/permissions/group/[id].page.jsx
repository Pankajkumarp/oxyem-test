import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import NormalTable from './NormalTable';
import MultiSelectionTable from './MultiSelectionTable';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { MdGroupAdd } from "react-icons/md";
import { VscDiffRenamed } from "react-icons/vsc";
import { GoFileSubmodule } from "react-icons/go";
import { MdErrorOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { Toaster, toast } from 'react-hot-toast';
export default function createGroup() {
    const [groupName, setGroupName] = useState("");
    const [roleIds, setRoleIds] = useState([]);
    const [userIds, setUserIds] = useState([]);
    const [moduleIds, setModuleIds] = useState([]);
    const [IdgroupId, setIdgroupId] = useState("");

    const [activeTab, setActiveTab] = useState("role");
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
    const { id } = router.query;
    const fetchpermissionInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/permission/groupEdit`, { params: { idGroup: value } });
                if (response) {
                    setGroupName(response?.data?.data?.groupName)
                    setRoleIds(response?.data?.data?.roleIds)
                    setUserIds(response?.data?.data?.userIds)
                    setModuleIds(response?.data?.data?.permissionIds)
                }
            }
        } catch (error) {

        }
    };

    useEffect(() => {
        const { id } = router.query;
        fetchpermissionInfo(id);
        setIdgroupId(id);
    }, [id]);
    const handleChange = (e) => {
        const value = e.target.value;

        if (value.length <= 100) { // Limit to 100 characters
            setGroupName(value);
            if (error) setError(""); // Clear error on typing
        }
    };
    const isGroupNameDone = groupName.trim() !== "";
    const isRoleDone = roleIds.length > 0;
    const isUserDone = userIds.length > 0;
    const isModuleDone = moduleIds.length > 0;
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({
        group: false,
        role: false,
        user: false,
        module: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        const newErrors = {
            group: !isGroupNameDone,
            role: !isRoleDone,
            module: !isModuleDone
        };

        setErrors(newErrors);
        if (Object.values(newErrors).includes(true)) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            return;
        }
        const payload = {
            groupName,
            roles: roleIds,
            modules: moduleIds,
            groupId:IdgroupId,
            ...(Array.isArray(userIds) && userIds.length > 0 && { users: userIds }),
        };
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        try {
            const response = await axiosJWT.post(`${apiUrl}/permission/addGroup`, payload);
    
            if (response) {
               toast.success("Group created successfully 🎉");
               router.push(`/permissions/group`);
            }
        } catch (error) {
            const message =
            error?.response?.data?.message ||
            "Failed to create group. Please try again.";

        toast.error(message);
        }
    };
    useEffect(() => {
        if (!submitted) return;
        setErrors(prev => ({ ...prev, group: groupName.trim() === "" }));
    }, [groupName]);

    useEffect(() => {
        if (!submitted) return;
        setErrors(prev => ({ ...prev, role: roleIds.length === 0 }));
    }, [roleIds]);

    useEffect(() => {
        if (!submitted) return;
        setErrors(prev => ({ ...prev, user: userIds.length === 0 }));
    }, [userIds]);

    useEffect(() => {
        if (!submitted) return;
        setErrors(prev => ({ ...prev, module: moduleIds.length === 0 }));
    }, [moduleIds]);


    return (
        <>
            <Head>
                <title>User Group Management | Create & Manage User Groups – Admin Dashboard</title>
                <meta name="description" content={"Use the Admin Dashboard to create new user groups, manage roles, and organize access permissions efficiently and securely."} />
            </Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext="Create User Group" />
                        {submitted && (errors.group || errors.role || errors.module) && (
                            <div className="alert alert-danger custom-error-per">
                                <MdErrorOutline />
                                <div>
                                    {errors.group && <p>Group name cannot be empty — please provide one.</p>}
                                    {errors.role && <p>Assign at least one role before proceeding.</p>}
                                    {errors.module && <p>Choose at least one module to give this group access.</p>}
                                </div>
                            </div>
                        )}

                        <div className="stepper">
                            <div style={{ width: "100px", maxWidth: "100px" }} className={`line ${isGroupNameDone ? "active" : ""} ${submitted && errors.group ? "error-p" : ""}`}></div>
                            <div className={`step ${isGroupNameDone ? "active" : ""} ${submitted && errors.group ? "error-p" : ""}`}>
                                <div className="circle">
                                    {isGroupNameDone ? (
                                        <span className="icon"><FaCheck /></span>
                                    ) : submitted && errors.group ? (
                                        <span className="icon"><IoMdClose /></span>
                                    ) : null}
                                </div>
                                <div className="label">Step 1: Group Name<span className='error'>*</span></div>
                            </div>
                            <div className={`line ${isGroupNameDone ? "active" : ""} ${submitted && errors.group ? "error-p" : ""}`}></div>
                            <div className={`step ${isRoleDone ? "active" : ""} ${submitted && errors.role ? "error-p" : ""}`}>
                                <div className="circle">
                                    {isRoleDone ? (
                                        <span className="icon"><FaCheck /></span>
                                    ) : submitted && errors.role ? (
                                        <span className="icon"><IoMdClose /></span>
                                    ) : null}
                                </div>
                                <div className="label">Step 2: Add Roles<span className='error'>*</span></div>
                            </div>
                            <div className={`line ${isRoleDone ? "active" : ""} ${submitted && errors.role ? "error-p" : ""}`}></div>
                            <div className={`step ${isUserDone ? "active" : ""} ${submitted && errors.user ? "error-p" : ""}`}>
                                <div className="circle">
                                    {isUserDone ? (
                                        <span className="icon"><FaCheck /></span>
                                    ) : submitted && errors.user ? (
                                        <span className="icon"><IoMdClose /></span>
                                    ) : null}
                                </div>
                                <div className="label">Step 3: Add Users</div>
                            </div>
                            <div className={`line ${isUserDone ? "active" : ""} ${submitted && errors.user ? "error-p" : ""}`}></div>
                            <div className={`step ${isModuleDone ? "active" : ""} ${submitted && errors.module ? "error-p" : ""}`}>
                                <div className="circle">
                                    {isModuleDone ? (
                                        <span className="icon"><FaCheck /></span>
                                    ) : submitted && errors.module ? (
                                        <span className="icon"><IoMdClose /></span>
                                    ) : null}
                                </div>
                                <div className="label">Step 4: Assign Modules<span className='error'>*</span></div>
                            </div>
                            <div style={{ width: "100px", maxWidth: "100px" }} className={`line ${isModuleDone ? "active" : ""} ${submitted && errors.module ? "error-p" : ""}`}></div>
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
                                                            <VscDiffRenamed />
                                                            <div className='core-text'>
                                                                <h3>Name of Group</h3>
                                                                <p>Choose a clear, unique name for the user group so it’s easy to manage and assign roles.</p>
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <input
                                                                type="text"
                                                                className={`form-control ${error ? "is-invalid" : ""}`}
                                                                placeholder="Enter group name"
                                                                value={groupName}
                                                                onChange={handleChange}
                                                                style={{ maxWidth: "500px" }}
                                                            />
                                                            {error && <div className="invalid-feedback">{error}</div>}


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
                                                                                <h3>Add Role to the Group</h3>
                                                                                <p>Search and select users to add them to this group. Users added will follow the group’s permissions and access rules.</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <NormalTable
                                                                        selectedIds={roleIds}
                                                                        setSelectedIds={setRoleIds}
                                                                        apiPath={"/permission/getRolesDetails"}
                                                                    />
                                                                </>
                                                            ) : (
                                                                <> <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                                    <div className='group-description-text'>
                                                                        <MdGroupAdd />
                                                                        <div className='core-text'>
                                                                            <h3>Add User to the Group</h3>
                                                                            <p>Search and select users to add them to this group. Users added will follow the group’s permissions and access rules.</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                    <NormalTable
                                                                        selectedIds={userIds}
                                                                        setSelectedIds={setUserIds}
                                                                        apiPath={"/permission/getAllUserDetails"}
                                                                    /></>
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
                                                                <h3>Add modules to the Group</h3>
                                                                <p>Select and assign modules to the group to control which functionalities and system areas its users can access.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <MultiSelectionTable
                                                        selectedIds={moduleIds}
                                                        setSelectedIds={setModuleIds}
                                                        apiPath={"/permission/tree"}
                                                    />
                                                    <div className="col-12 col-md-12 text-end">
                                                        <button
                                                            className="btn btn-primary mt-2"
                                                            onClick={handleSubmit}
                                                        >
                                                            Edit Group
                                                        </button>
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
            <Toaster position="top-right" reverseOrder={false}  
               autoClose={3000}
                closeOnClick
                pauseOnHover
                draggable/>
        </>
    );
}