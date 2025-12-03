import React, { useState, useEffect, useRef } from 'react';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Profile from '../../commancomponents/profile';
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";
import LabelMandatory from '../Label/LabelMandatory';
import LabelNormal from '../Label/LabelNormal';

export default function AssignMemberComponent({
  label,
  isDisabled,
  validations = [],
  value,
  onChange,
  documentType,
  placeholder
}) {
  const isRequired = validations.some(validation => validation.type === "required");
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(value);
  const [selectOptionLabel, setSelectOptionLabel] = useState(placeholder);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const imgUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  // Ref for the dropdown container
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/getAssignMembers`);
        if (response) {
          const optionsData = response.data.data.map((item) => ({
            label: item.name,
            value: item.id,
            profilePic: item.profilePicPath ? `${imgUrl}/${item.profilePicPath}` : "",
            profileLink: item.idEmployee ? `/employeeDashboard/${item.idEmployee}` : ""
          }));
          setOptions(optionsData);
          setFilteredOptions(optionsData);
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch options');
      }
    };
    fetchOptions();
  }, [label]);

  useEffect(() => {
    const getLabelOption = options.find(option => option.value === selectedOption);
    if (getLabelOption) {
      setSelectOptionLabel(getLabelOption.label);
      setSearchQuery(getLabelOption.label);
    }
  }, [selectedOption, options]);

  useEffect(() => {
    if (value !== selectedOption) {
      setSelectedOption(value);
    }
  }, [value]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectChange = (selectedValue) => {
    if (isDisabled) return;

    setSelectedOption(selectedValue);
    onChange(selectedValue);
    setIsOpen(false);
  };

  const toggleSelectDropdown = () => {
    if (isDisabled) return;

    setIsOpen(!isOpen);
  };

  const dropdownBtnClass = isDisabled
    ? 'member-dropdown-btn disabled'
    : isOpen
      ? 'member-dropdown-btn active'
      : 'member-dropdown-btn';
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(query)
    );

    setFilteredOptions(filtered);
  };

  return (
    <div className="member-assign-custom-dropdown" ref={dropdownRef}>
      {isRequired ? <LabelMandatory labelText={label} /> : <LabelNormal labelText={label} />}
      <div className="member-assign-input-b">
        <input
          type="text"
          className={dropdownBtnClass}
          placeholder={selectOptionLabel || placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={toggleSelectDropdown}
          disabled={isDisabled}
        />
        {isOpen ? <FaAnglesUp /> : <FaAnglesDown />}
      </div>

      {isOpen && !isDisabled && (
        <div className="dropdown-content">
          <ul className="dropdown-list">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="dropdown-item"
                onClick={() => handleSelectChange(option.value)}
              >
                <Profile name={option.label} imageurl={option.profilePic} size={32} profilelink={option.profileLink} />
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
