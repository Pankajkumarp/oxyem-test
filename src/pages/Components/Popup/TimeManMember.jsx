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
        minHeight: '350px'
    },
};

export default function SelectUser({ isOpen, closeModal, labelText, userdata, value, submitvaluerec, selectuser, submitdeleteval }) {
 
    const [options, setOptions] = useState([]);
    const [alloptions, setAllOptions] = useState([]);
    const [rows, setRows] = useState(value ? value : []);
    const selectRef = useRef();
    const FillterData = async () => {
        const convertdata = userdata.slice(0, 12).map(item => ({
            label: item.userName,
            value: item.id,
            designation: item.designation,
            image: item.imageUrl,
            isdisabled: rows.some(row => row.selectedOptions.value === item.id)
        }));
        setOptions(convertdata)
        setAllOptions(convertdata);
    }
    const handleConvert = async () => {
        FillterData();
    }
    const handleMenuOpen = (data) => {
        FillterData();
    };
    useEffect(() => {
        FillterData();
    }, [userdata, value]);
    useEffect(() => {
        FillterData();
    }, [isOpen]);



    useEffect(() => {
        if (!Array.isArray(value) || value.length < 1) {
            setRows([{ selectedOptions: [], taskPercentage: "" }]);
            return;
          }
        const matchedRows = value.map(val => {
            const option = alloptions.find(option => option.value === val.idEmployee);
            if (option) {
                return {
                    selectedOptions: option,
                    taskPercentage: val.taskPercentage
                };
            }
            return null;
        }).filter(Boolean);

        setRows(matchedRows);

    }, [isOpen]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const handleCheckboxChange = (userId) => {
        setSelectedUserIds(prevSelectedUserIds =>
            prevSelectedUserIds.includes(userId)
                ? prevSelectedUserIds.filter(id => id !== userId)
                : [...prevSelectedUserIds, userId]
        );
    };

    const handleCheckboxDelete = () => {
        submitdeleteval(selectedUserIds)
    };

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
                            <GrCheckboxSelected />
                            <span className="sub-text">Aready Select</span>
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
            isdisabled: rows.some(row => row.selectedOptions.value === item.id)

        }));

        setOptions(fetchedOptions);
    };

    const handleMultiSelectChange = (index, selectedValues) => {
        setRows(prevRows => {
            const updatedRows = [...prevRows];
            updatedRows[index].selectedOptions = selectedValues;
            return updatedRows;
        });
        FillterData();
    };

    const handlePercentageChange = (index, event) => {
        const { value } = event.target;

        if (value !== "" && (isNaN(value) || value < 0 || value > 100)) {
            return; // Exit the function if the non-empty value is invalid
        }

        setRows(prevRows => {
            const updatedRows = [...prevRows];
            updatedRows[index].taskPercentage = value;
            return updatedRows;
        });
    };

    const addRow = () => {
        setRows([...rows, { selectedOptions: [], taskPercentage: "" }]);
    };

    const removeRow = (index) => {
        if (index !== 0) {
            setRows(rows.filter((_, i) => i !== index));
        }
    };

    const sumbmitrecord = () => {
        const submittedData = rows.map(row => ({
            idEmployee: row.selectedOptions.value,
            taskPercentage: row.taskPercentage
        }));
        submitvaluerec(submittedData);
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <div className="modal-dialog modal-lg oxyem-user-time-select">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <h4 className="modal-title" id="myLargeModalLabel" >{labelText}</h4>
                        <button className="oxyem-btn-close" onClick={closeModal}><MdClose /></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <ul className="nav-tabs nav nav-tabs-bottom nav-justified skolrup-profile-follower-tab" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link active"
                                        id="home-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#home"
                                        type="button"
                                        role="tab"
                                        aria-controls="home"
                                        aria-selected="true"
                                    >
                                        Assign Member
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className="nav-link"
                                        id="profile-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#profile"
                                        type="button"
                                        role="tab"
                                        aria-controls="profile"
                                        aria-selected="false"
                                    >
                                        View Member ({selectuser.length})
                                    </a>
                                </li>
                            </ul>
                            <div className="tab-content" id="myTabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="home"
                                    role="tabpanel"
                                    aria-labelledby="home-tab"
                                >

                                    <div className="col-12 text-end">
                                        <span className='btn btn-primary breadcrum-btn' onClick={addRow}><FaPlus /></span>
                                    </div>
                                    {rows.map((row, index) => (
                                        <div className='oxyem-popup-sel-time-man' key={index}>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <Select
                                                        components={{ Option }}
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
                                                        styles={{
                                                            control: (provided, state) => ({
                                                                ...provided,
                                                                borderColor: state.isFocused ? 'var(--dropdownhoverbg)' : provided.borderColor, // Change border color when focused
                                                                boxShadow: state.isFocused ? 'var(--dropdownbgshadow)' : provided.boxShadow, // Change box shadow when focused
                                                                '&:hover': {
                                                                    borderColor: state.isFocused ? 'var(--dropdownhoverbg)' : provided.borderColor // Ensure hover state does not override focus state
                                                                }
                                                            }),
                                                            indicatorSeparator: (provided, state) => ({
                                                                ...provided,
                                                                backgroundColor: 'var(--dropdownhoverbg)' // Change border color when clicked to show options
                                                            }),
                                                            option: (provided, state) => ({
                                                                ...provided,
                                                                padding: 'var(--dropdownpadding)',
                                                                cursor: 'var(--dropdowncursorstyle)',
                                                                backgroundColor: state.isFocused || state.isSelected ? 'var(--dropdownhoverbg)' : 'var(--dropdowntransparentcolor)', // Change background color on hover and when selected
                                                                color: state.isSelected ? 'var(--dropdownselectcolor)' : 'var(--dropdowninheritcolor)', // Change text color of selected options
                                                                ':hover': {
                                                                    backgroundColor: 'var(--dropdownhoverbg)', // Change background color on hover
                                                                    color: 'var(--dropdownhovercolor)' // Change text color on hover
                                                                }
                                                            })
                                                        }}
                                                        maxMenuHeight={185}
                                                        onMenuClose={() => { handleConvert() }}
                                                        value={row.selectedOptions}
                                                        onChange={(selectedValues) => handleMultiSelectChange(index, selectedValues)}
                                                    />
                                                </div>
                                                <div className='col-md-5'>
                                                    <input
                                                        className='form-control'
                                                        value={row.taskPercentage}
                                                        placeholder={"% Allocation"}
                                                        onChange={(event) => handlePercentageChange(index, event)}
                                                    />
                                                </div>
                                                {index !== 0 && (
                                                    <div className='col-md-1'>
                                                        <button className='oxyem-custombutton-time-rem' onClick={() => removeRow(index)}><RiDeleteBinLine /></button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {rows.length > 0 && (
                                        <div className="float-end mt-4">
                                            <button className='oxyem-custombutton btn' onClick={sumbmitrecord}>Save</button>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="profile"
                                    role="tabpanel"
                                    aria-labelledby="profile-tab"
                                >
                                    {selectuser.length > 0 && (
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
                                    {selectuser.map((detail, index) => (
                                        <div className='oxyem-pop-up-del'>
                                            <div className='row'>
                                                <div className='col-6'>

                                                    <Profile name={detail.userName} imageurl={detail.imageUrl} size={"30"} profilelink={detail.profilelink} />
                                                    {detail.userName}
                                                </div>
                                                <div className='col-4 text-center'>
                                                    {detail.taskPercentage}
                                                </div>
                                                <div className='col-2 text-center'>
                                                    <input
                                                        type='checkbox'
                                                        checked={selectedUserIds.includes(detail.id)}
                                                        onChange={() => handleCheckboxChange(detail.id)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {selectuser.length > 0 && (
                                        <div className="float-end">
                                            <button className='oxyem-custombutton btn' onClick={handleCheckboxDelete}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
