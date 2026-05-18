import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import ReactModal from "react-modal";
import { FaPlus, FaTrash } from "react-icons/fa";
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Profile from '../../../Components/commancomponents/profile';
import { RiDeleteBinLine } from "react-icons/ri";
import { IoPersonAddOutline } from "react-icons/io5";
import { GrCheckboxSelected } from "react-icons/gr";
import { reactSelectStyles } from "./dateUtils";
import { MdClose } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { FaUserGroup } from "react-icons/fa6";
ReactModal.setAppElement("#__next");

export default function AssignUserPopup({ value = [], onChange, projectid }) {
    const selectRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [userdata, setuserdetails] = useState([]);
    const [rows, setRows] = useState([]);
    const [rowErrors, setRowErrors] = useState([]); // Row-wise error array
    const [selectedUsers, setSelectedUsers] = useState([]);
    const toggleUserSelection = (idEmployee) => {
        setSelectedUsers(prev =>
            prev.includes(idEmployee)
                ? prev.filter(id => id !== idEmployee)
                : [...prev, idEmployee]
        );
    };
    const clampPercentage = (value) => {
        if (value === "") return "";
        let num = Number(value);
        if (isNaN(num)) return "";
        if (num < 1) return 1;
        if (num > 100) return 100;
        return num;
    };
    const deleteSelectedUsers = () => {
        // 🚫 Step 1: Validate input
        if (selectedUsers.length === 0) {
            alert("Please select at least one member to delete.");
            return;
        }

        // 🗑 Step 2: Remove checked users from array
        const updatedValue = value.filter(
            member => !selectedUsers.includes(member.idEmployee)
        );


        onChange(updatedValue, { deletedIds: selectedUsers });
        setSelectedUsers([]);
        setIsOpen(false);
    };

    const enrichValueWithUserData = (value, userdata) => {
        return value.map(v => {
            const user = userdata.find(u => u.id === v.idEmployee);

            return {
                ...v,
                employeeName: user?.userName || "",
                imageUrl: user?.imageUrl || "",
                designation: user?.designation || ""
            };
        });
    };

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

                const response = await axiosJWT.get(`${apiUrl}/project/getResource`, { params: { "idProject": projectid } })
                const optionsData = response.data.data.map((item) => ({ // Access response.data.data
                    userName: item.employeeName,
                    id: item.idEmployee,
                    imageUrl: item.profilePicPath ? item.profilePicPath : '',
                    designation: item.designation ? item.designation : '',
                }));
                setuserdetails(optionsData)
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };
        fetchOptions();
    }, [projectid]);

    // Initialize rows once from existing value
    useEffect(() => {
        if (!value || value.length === 0) {
            setRows([{ employee: null, percentage: "", isPrimary: false }]);
            setRowErrors([{ employee: "", percentage: "" }]);
            return;
        }

        // 🔥 Enrich value
        const enrichedValue = enrichValueWithUserData(value, userdata);


        setRows(
            enrichedValue.map(v => ({
                employee: {
                    value: v.idEmployee,
                    label: v.employeeName
                },
                percentage: v.taskPercentage,
                isPrimary: v.isPrimary || false
            }))
        );

        setRowErrors(enrichedValue.map(() => ({ employee: "", percentage: "" })));
    }, [value, userdata]);



    const addRow = () => {
        setRows([...rows, { employee: null, percentage: "", isPrimary: false }]);
        setRowErrors([...rowErrors, { employee: "", percentage: "" }]);
    };

    const removeRow = (index) => {
        setRows(rows.filter((_, i) => i !== index));
        setRowErrors(rowErrors.filter((_, i) => i !== index));
    };

    const updateRow = (index, key, val) => {
        const updated = [...rows];
        updated[index][key] = val;
        setRows(updated);

        // Reset error for this field
        const errors = [...rowErrors];
        if (key === "employee") errors[index].employee = "";
        if (key === "percentage") errors[index].percentage = "";
        setRowErrors(errors);
    };

    const handleSave = () => {
        let hasError = false;
        const errors = rows.map(row => ({ employee: "", percentage: "" }));

        rows.forEach((row, index) => {
            if (!row.employee) {
                errors[index].employee = "Please select an employee.";
                hasError = true;
            }
            const percent = Number(row.percentage);

            if (!row.percentage || percent < 1 || percent > 100) {
                errors[index].percentage = "Percentage must be between 1 and 100.";
                hasError = true;
            }
        });

        setRowErrors(errors);

        if (hasError) return;

        // All valid, pass to parent
        const formatted = rows.map(r => ({
            idEmployee: r.employee.value,
            employeeName: r.employee.label,
            taskPercentage: r.percentage,
            isPrimary: r.isPrimary
        }));
        onChange(formatted);
        setIsOpen(false);
    };
    const [options, setOptions] = useState([]);
    const [alloptions, setAllOptions] = useState([]);
    const filterData = () => {
        const convertdata = userdata.slice(0, 12).map(item => ({
            label: item.userName,
            value: item.id,
            designation: item.designation,
            image: item.imageUrl,
            isdisabled: rows.some(row => row.employee?.value === item.id)
        }));
        setOptions(convertdata)
        setAllOptions(convertdata);
    }
    const handleConvert = async () => {
        filterData();
    }
    const handleMenuOpen = (data) => {
        filterData();
    };
    useEffect(() => {
        filterData();
    }, [userdata, rows, isOpen]);

    const Option = ({ innerProps, label, data }) => (
        <div {...innerProps} className={`oxyem-react-select-custom position-relative ${data.isdisabled ? 'disabled-class-dropdown' : ''}`}>
            <div className="oxyem-cus-select-section">
                <div className="dropdown_section_1" style={{ borderRadius: '50%', margin: '4px 10px' }}>
                    <Profile name={label} imageurl={data.image} size={"36"} />
                </div>
                <div className="oxyem-user-text dropdown_section_2">
                    <h6><span className="main-text">{label}</span></h6>
                    <p className="">
                        <span className="sub-text">{data.designation}</span>
                    </p>


                </div>
                <div className="dropdown_section_3">
                    {data.isdisabled === true ? (
                        <p className="oxyem_dropdown_selected_icon">
                            <span className="sub-text">(Assigned)</span>
                        </p>
                    ) : (null)}
                </div>
            </div>
        </div>
    );

    const fetchOptionscollb = async (inputValue) => {
        const filteredData = userdata ? userdata.filter((item) =>
            item.userName.toLowerCase().includes(inputValue.toLowerCase())
        )
            : [];

        const fetchedOptions = filteredData.slice(0, 12).map(item => ({
            label: item.userName,
            value: item.id,
            designation: item.designation,
            image: item.imageUrl,
            isdisabled: rows.some(row => row.employee?.value === item.id)

        }));

        setOptions(fetchedOptions);
    };
    const userCount = value.length;
    const closeModal = () => {
        setIsOpen(false);
    };
    const [enrichedMembers, setEnrichedMembers] = useState([]);
    useEffect(() => {
        if (!value || value.length === 0) {
            setEnrichedMembers([]);
            return;
        }

        const enriched = value.map(v => {
            const user = userdata.find(u => u.id === v.idEmployee);

            return {
                ...v,
                employeeName: v.employeeName || user?.userName || "Unknown",
                imageUrl: v.imageUrl || user?.imageUrl || ""
            };
        });

        setEnrichedMembers(enriched);
    }, [value, userdata]);

    return (
        <>
            <div className="oxyem-project-members">
                <ul className="oxyem-team-members">
                    {enrichedMembers.slice(0, 4).map((detail, index) => (
                        <li key={index}>
                            <Profile
                                name={detail.employeeName}
                                imageurl={detail.imageUrl || ""}
                                size="30"
                            />
                        </li>
                    ))}

                    {enrichedMembers.length > 4 && (
                        <li className='countaddicon'> +{userCount - 4}</li>
                    )}
                    <span className='addicon' onClick={() => setIsOpen(true)}><IoPersonAddOutline /></span>
                </ul>
            </div>
            <ReactModal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                style={{
                    content: { top: "50%", left: "50%", right: "auto", bottom: "auto", transform: "translate(-50%, -50%)", width: "600px", maxHeight: "80vh", overflowY: "auto" },
                    overlay: { backgroundColor: "rgba(0,0,0,0.5)" }
                }}
            >
                <div className="timesheet-assign-popup-m">
                    <h2 className="task-assign-user-heading"><FaUserGroup /> Assign Member</h2>
                    <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>

                    <ul
                        className="nav nav-tabs nav-tabs-bottom nav-justified skolrup-profile-follower-tab"
                        id="myTab"
                        role="tablist"
                    >
                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link active"
                                id="assign-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#assign"
                                role="tab"
                                aria-controls="assign"
                                aria-selected="true"
                            >
                                Assign Member
                            </a>
                        </li>

                        <li className="nav-item" role="presentation">
                            <a
                                className="nav-link"
                                id="view-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#view"
                                role="tab"
                                aria-controls="view"
                                aria-selected="false"
                            >
                                View Member ({value.length})
                            </a>
                        </li>
                    </ul>

                    <div className="tab-content mt-3" id="myTabContent">
                        <div
                            className="tab-pane fade show active"
                            id="assign"
                            role="tabpanel"
                            aria-labelledby="assign-tab"
                        >
                            <div className="col-12 text-end">
                                <span className='btn btn-primary breadcrum-btn' onClick={addRow}><FaPlus /> Add Member</span>
                            </div>
                            <div className="input-box-inner">
                                {rows.map((row, index) => (
                                    <div className="row mb-3 align-items-center input-box-inner-input" key={index}>
                                        <div className="col-md-4">
                                            <Select
                                                components={{ Option }}
                                                value={row.employee}
                                                isMulti={false}
                                                ref={selectRef}
                                                //...
                                                onMenuOpen={() => {
                                                    handleMenuOpen();

                                                }}
                                                onInputChange={(value) => {
                                                    fetchOptionscollb(value);
                                                }}
                                                options={options}
                                                isOptionDisabled={(options) => options.isdisabled}
                                                onChange={(val) => updateRow(index, "employee", val)}
                                                placeholder="Select Employee"
                                                data-tooltip-content={"Select Employee"}
                                                data-tooltip-id={`my-tooltip-datatable_h`}
                                                maxMenuHeight={185}
                                                onMenuClose={() => { handleConvert() }}
                                                styles={reactSelectStyles}
                                            />

                                        </div>

                                        <div className="col-md-2">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="%"
                                                min={1}
                                                max={100}
                                                step={1}
                                                value={row.percentage}
                                                onKeyDown={(e) => {
                                                    // Block invalid characters
                                                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const value = clampPercentage(e.target.value);
                                                    updateRow(index, "percentage", value);
                                                }}
                                            />


                                        </div>
                                        <div className="col-md-6 btn-set">
                                            <input
                                                type="checkbox"
                                                checked={row.isPrimary}
                                                onChange={(e) => updateRow(index, "isPrimary", e.target.checked)}
                                            />Apply the same assignee and allocation to all sub-tasks?
                                        </div>
                                        <Tooltip id="my-tooltip-datatable_h" place="top" />
                                        <span className="c-r-p">
                                            {rows.length > 1 && (
                                                <FaTrash
                                                    className="text-danger cursor-pointer"
                                                    onClick={() => removeRow(index)}
                                                />
                                            )}
                                        </span>
                                        {rowErrors[index]?.employee && (
                                            <small className="text-danger mt-1">{rowErrors[index].employee}</small>
                                        )}
                                        {rowErrors[index]?.percentage && (
                                            <small className="text-danger mt-1">{rowErrors[index].percentage}</small>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex justify-content-end btn-popup-sec-bottom">
                                <button className="btn btn-secondary me-2" onClick={() => setIsOpen(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSave}>Save</button>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="view"
                            role="tabpanel"
                            aria-labelledby="view-tab"
                        >
                            <div className="input-box-inner input-box-inner-list">
                                {value.length > 0 && (
                                    <div className='oxyem-pop-up-del-top'>
                                        <div className='row'>
                                            <div className='col-6'>

                                                <span>Employee Name</span>
                                            </div>
                                            <div className='col-4 text-center'>
                                                <span>% Allocation</span>
                                            </div>
                                            <div className='col-2 text-center'>
                                                <span>Action</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {enrichedMembers.length === 0 ? (
                                    <p className="text-muted">No members assigned.</p>
                                ) : (
                                    enrichedMembers.map((member, index) => (
                                        <div key={index} className='row align-items-center add-employee-list-mb'>
                                            <div className='col-6 d-flex align-items-center'>
                                                <Profile
                                                    name={member.employeeName}
                                                    imageurl={member.imageUrl || ""}
                                                    size="30"
                                                /><h6 className="mb-0">{member.employeeName}</h6>
                                            </div>
                                            <div className="col-4 text-center">
                                                {member.taskPercentage}
                                            </div>
                                            <div className="col-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(member.idEmployee)}
                                                    onChange={() => toggleUserSelection(member.idEmployee)}
                                                />

                                            </div>


                                        </div>
                                    ))
                                )}
                            </div>
                            {enrichedMembers.length > 0 && (
                                <div className="d-flex justify-content-end mt-3">
                                    <button
                                        className="btn btn-danger"
                                        disabled={selectedUsers.length === 0}
                                        onClick={deleteSelectedUsers}
                                    >
                                        <RiDeleteBinLine className="me-1" />
                                        Delete Selected
                                    </button>
                                </div>

                            )}
                        </div>
                    </div>

                </div>
            </ReactModal>
        </>
    );
}
