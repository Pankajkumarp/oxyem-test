import ReactModal from 'react-modal';
import React, { useState, useEffect } from "react";
import Select from 'react-select';
import { MdClose } from "react-icons/md";
import Profile from '../commancomponents/profile';
import ButtonPrimary from '../common/Buttons/ButtonPrimaryComponent';


const customStyles = {
    content: {
        background: '#fff',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};


export default function selectuser({ isOpen, closeModal, labelText, userdata, value, submitvaluerec, selectuser, submitdeleteval }) {
    const [options, setOptions] = useState([]);
    useEffect(() => {
        const convertdata = userdata.slice(0, 3).map(item => ({
            label: item.userName,
            value: item.id,
            designation: item.designation,
            image: item.imageUrl
        }));
        setOptions(convertdata);
    }, [userdata]);

    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        if (!Array.isArray(value)) {
            setSelectedOptions([]);
            return;
        }
        const selectedOptions = value.map(val => options.find(option => option.value === val)).filter(Boolean);
        setSelectedOptions(selectedOptions);
    }, [value]);


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
        <div {...innerProps} className='oxyem-react-select-custom position-relative'>
            <div className="oxyem-cus-select-section">
                <div style={{ borderRadius: '50%', margin: '4px 10px' }}>
                    <Profile name={label} imageurl={data.image} size={"36"} />
                </div>
                <div className="oxyem-user-text">
                    <h6><span className="main-text">{label}</span></h6>
                    <p className="">
                        <span className="sub-text">{data.designation}</span>
                    </p>
                </div>
            </div>

        </div>
    );
    const fetchOptionscollb = async (inputValue) => {
        const filteredData = userdata ? userdata.filter((item) =>
            item.userName.toLowerCase().includes(inputValue.toLowerCase())
        )
            : [];

        const fetchedOptions = filteredData.slice(0, 3).map(item => ({
            label: item.userName,
            value: item.id,
            designation: item.designation,
            image: item.imageUrl
        }));
        setOptions(fetchedOptions);
    };
    const handleMultiSelectChange = (selectedValues) => {
        const validSelectedOptions = selectedValues
        setSelectedOptions(validSelectedOptions);
    };
    const sumbmitrecord = () => {
        submitvaluerec(selectedOptions)
    };
    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Modal"
            style={customStyles}
        >
            <div className="modal-dialog modal-lg oxyem-user-image-select">
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
                                        Add Team
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
                                        Teams ({selectuser.length})
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
                                    <div className='oxyem-popup-sel'>
                                        <Select
                                            components={{ Option }}
                                            isMulti
                                            onInputChange={(value) => {
                                                fetchOptionscollb(value);
                                            }}
                                            options={options}

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
                                                    //margin: '5px 0px',
                                                    cursor: 'var(--dropdowncursorstyle)',
                                                    backgroundColor: state.isFocused || state.isSelected ? 'var(--dropdownhoverbg)' : 'var(--dropdowntransparentcolor)', // Change background color on hover and when selected
                                                    color: state.isSelected ? 'var(--dropdownselectcolor)' : 'var(--dropdowninheritcolor)', // Change text color of selected options
                                                    ':hover': {
                                                        backgroundColor: 'var(--dropdownhoverbg)', // Change background color on hover
                                                        color: 'var(--dropdownhovercolor)' // Change text color on hover
                                                    }
                                                })
                                            }}
                                            value={selectedOptions}
                                            onChange={handleMultiSelectChange}
                                        />
                                    </div>
                                    {selectedOptions.length > 0 && (
                                        <div className="float-end">
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
                                    {selectuser.map((detail, index) => (
                                        <div className='oxyem-pop-up-del'>
                                            <div className='row'>
                                                <div className='col-8'>
                                                    <Profile name={detail.userName} imageurl={detail.imageUrl} size={"30"} profilelink={detail.profilelink} />
                                                    {detail.userName}
                                                </div>
                                                <div className='col-4 text-center'>
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

    )
}
