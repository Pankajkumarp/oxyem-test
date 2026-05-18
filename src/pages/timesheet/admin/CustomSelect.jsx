"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function CustomSelect({ options, value, onChange, placeholder = "Select an option", }) {
  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  const selected =
    options.find((opt) => opt.value === value) || options[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="custom-select-oxyem-box">
      {/* Trigger */}
      <div
        className="custom-select-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={!value ? "placeholder-oxyem" : ""}>
          {value ? selected.label : placeholder}
        </span>
        <FiChevronDown className={open ? "rotate" : ""} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="custom-select-menu">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`custom-select-option ${
                value === opt.value ? "active" : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
