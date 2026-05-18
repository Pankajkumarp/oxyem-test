import ReactModal from 'react-modal';
import React, { useState, useEffect } from "react";
import Select from 'react-select';
import { MdClose } from "react-icons/md";
import Profile from '../commancomponents/profile';
import { RiDeleteBinLine } from "react-icons/ri";
import { RiTeamLine } from "react-icons/ri";
import DateHolidayWeekendComponent from '../common/Inputfiled/DateHolidayWeekendComponent';

ReactModal.setAppElement("#__next");

const customStyles = {
    content: {
        background: '#fff',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '900px'
    }
};

export default function selectuserAllocate({
    isOpen,
    closeModal,
    labelText = "Allocate Team Members",
    userdata = [],
    submitvaluerec,
    projectStartDate,
    projectEndDate
}) {

    /* ---------------- STATES ---------------- */

    const [options, setOptions] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [errors, setErrors] = useState({});
    // errors shape: { [userId]: { allocation, startDate, endDate } }

    /* ---------------- MAP USERS ---------------- */

    useEffect(() => {
        setOptions(
            userdata.map(u => ({
                label: u.userName,
                value: u.id,
                designation: u.designation,
                imageUrl: u.imageUrl
            }))
        );
    }, [userdata]);

    /* ---------------- SELECT CHANGE ---------------- */
    const handleMultiSelectChange = (selected) => {
        const users = selected || [];
        setSelectedUsers(users);

        const updated = users.map(user => {
            const existing = allocations.find(a => a.id === user.value);
            return existing || {
                id: user.value,
                userName: user.label,
                designation: user.designation,
                imageUrl: user.imageUrl,
                allocation: '',
                startDate: '',
                endDate: ''
            };
        });

        setAllocations(updated);
        setErrors(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(id => {
                if (!users.find(u => u.value === Number(id))) delete next[id];
            });
            return next;
        });
    };


    /* ---------------- FIELD CHANGE ---------------- */

    const updateAllocation = (index, field, value) => {
        const updated = [...allocations];
        updated[index][field] = value;
        setAllocations(updated);

        const userId = updated[index].id;

        // clear error on change
        setErrors(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [field]: ''
            }
        }));
    };

    /* ---------------- DELETE ROW ---------------- */

    const removeAllocation = (id) => {
        setAllocations(prev => prev.filter(a => a.id !== id));
        setSelectedUsers(prev => prev.filter(u => u.value !== id));

        setErrors(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    /* ---------------- VALIDATION ---------------- */

    const validate = () => {
        const newErrors = {};

        allocations.forEach(row => {
            const rowErrors = {};

            if (!row.allocation) rowErrors.allocation = 'Required';
            else if (row.allocation < 1 || row.allocation > 100)
                rowErrors.allocation = '1–100 only';

            if (!row.startDate) rowErrors.startDate = 'Required';
            if (!row.endDate) rowErrors.endDate = 'Required';
            if (row.startDate && row.endDate && row.endDate < row.startDate)
                rowErrors.endDate = 'End date must be after start date';

            if (Object.keys(rowErrors).length)
                newErrors[row.id] = rowErrors;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ---------------- SUBMIT ---------------- */

    const submitAllocation = () => {
        if (!validate()) return;
        submitvaluerec(allocations);
        closeModal();
    };

    /* ---------------- CUSTOM OPTION ---------------- */

    const Option = ({ innerProps, label, data }) => (
        <div {...innerProps} className="oxyem-react-select-custom">
            <div className="d-flex align-items-center gap-2 p-2">
                <Profile name={label} imageurl={data.image} size="36" />
                <div>
                    <div><b>{label}</b></div>
                    <small className="">{data.designation}</small>
                </div>
            </div>
        </div>
    );
    useEffect(() => {
        if (!isOpen || !Array.isArray(userdata)) return;

        // If modal opened with previous data
        if (userdata.length && userdata[0]?.allocation !== undefined) {
            setAllocations(userdata);

            setSelectedUsers(
                userdata.map(u => ({
                    label: u.userName,
                    value: u.id,
                    designation: u.designation,
                    imageUrl: u.imageUrl
                }))
            );
        }
    }, [isOpen]);

    /* ---------------- RENDER ---------------- */
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('assign-multiple-user');
        } else {
            document.body.classList.remove('assign-multiple-user');
        }

        // Cleanup on unmount
        return () => {
            document.body.classList.remove('assign-multiple-user');
        };
    }, [isOpen]);

    return (
        <ReactModal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
            <div className="modal-content">

                {/* HEADER */}
                <div className="modal-header modal-header-with-icon">
                    <RiTeamLine />
                    <div className="modal-title">
                        <h4>Allocate Team Members</h4>
                        <p>Assign team members to this project with allocation percentage and duration.</p>
                    </div>
                    <button className="oxyem-btn-close" onClick={closeModal}>
                        <MdClose />
                    </button>
                </div>

                {/* BODY */}
                <div className="modal-body mt-2">

                    <Select
                        isMulti
                        options={options}
                        value={selectedUsers}
                        components={{ Option }}
                        onChange={handleMultiSelectChange}
                        placeholder="Select team members..."
                        maxMenuHeight={170}
                    />

                    {allocations.length > 0 && (
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text-center">#</th>
                                        <th className='big-row-m'>Member</th>
                                        <th className='small-row-m'>Alloc %</th>
                                        <th className='medi-row-m'>Start Date</th>
                                        <th className='medi-row-m'>End Date</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allocations.map((row, index) => {
                                        const rowErrors = errors[row.id] || {};
                                        return (
                                            <tr key={row.id}>
                                                <td className="text-center fw-semibold">
                                                    {index + 1}
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Profile name={row.userName} imageurl={row.imageUrl} size="30" />
                                                        <div>
                                                            <div>{row.userName}</div>
                                                            <small className="text-muted">{row.designation}</small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        min={1}
                                                        max={100}
                                                        value={row.allocation}
                                                        onKeyDown={(e) => {
                                                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            let value = e.target.value;

                                                            if (value === '') {
                                                                updateAllocation(index, 'allocation', '');
                                                                return;
                                                            }

                                                            value = Math.max(1, Math.min(100, Number(value)));
                                                            updateAllocation(index, 'allocation', value);
                                                        }}
                                                    />

                                                    {rowErrors.allocation && (
                                                        <div className="invalid-feedback-error">
                                                            {rowErrors.allocation}
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    <DateHolidayWeekendComponent
                                                        label=""
                                                        placeholder="Start Date"
                                                        value={row.startDate}
                                                        name="startDate"
                                                        isModule="AssignTaskNew"
                                                        projectStartDate={projectStartDate}
                                                        otherAttributes={""}
                                                        projectEndDate={projectEndDate}
                                                        onChange={(date) =>
                                                            updateAllocation(index, 'startDate', date)
                                                        }
                                                    />

                                                    {rowErrors.startDate && (
                                                        <div className="invalid-feedback-error">
                                                            {rowErrors.startDate}
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    <DateHolidayWeekendComponent
                                                        label=""
                                                        placeholder="End Date"
                                                        value={row.endDate}
                                                        name="endDate"
                                                        isModule="AssignTaskNew"
                                                        otherAttributes={""}
                                                        projectStartDate={projectStartDate}
                                                        projectEndDate={projectEndDate}
                                                        startDateValue={row.startDate}
                                                        onChange={(date) =>
                                                            updateAllocation(index, 'endDate', date)
                                                        }
                                                    />

                                                    {rowErrors.endDate && (
                                                        <div className="invalid-feedback-error">
                                                            {rowErrors.endDate}
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="text-center">
                                                    <span
                                                        className="text-danger mx-2 cursor-pointer btn-delete-member"
                                                        onClick={() => removeAllocation(row.id)}
                                                    >
                                                        <RiDeleteBinLine />
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="text-end">
                                <button onClick={submitAllocation} className="btn btn-primary">Save Allocation</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ReactModal>
    );
}
