import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Drawer from 'react-modern-drawer';
import 'react-modern-drawer/dist/index.css';
import { IoMdAddCircleOutline } from "react-icons/io";
import Select from 'react-select';
import { FiMinusCircle } from "react-icons/fi";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import { toast } from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import { GiOvermind } from "react-icons/gi";
import { Tooltip } from 'react-tooltip';
import { FaRegCheckCircle} from "react-icons/fa";
const ImprovmentStrength = ({ isOpen, closeModal, id, refreshSummaryData, allStrengthImprove }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [fields, setFields] = useState([{ type: '', remarks: '' }]);
  const [selectOptions, setSelectOptions] = useState([]);
  const [error, setError] = useState('');
  const [removedFields, setRemovedFields] = useState([]);
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axiosJWT.get(`${apiUrl}/dropdowns`, {
          params: { isFor: 'strength_improve' },
        });
        if (response) {
          const optionsData = response.data.data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          setSelectOptions(optionsData);
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch options');
      }
    };

    fetchOptions();
    setRemovedFields([])
  }, [isOpen]);
  useEffect(() => {
    if (allStrengthImprove.length > 0) {
      setFields(allStrengthImprove);
    } else {
      setFields([{ type: '', remarks: '' }])
    }
  }, [allStrengthImprove]);

  const handleSelectChange = (index, value) => {
    const newFields = [...fields];
    newFields[index].type = value;
    setFields(newFields);
  };

  const handleTextChange = (index, value) => {
    const newFields = [...fields];
    newFields[index].remarks = value;
    newFields[index].isEdit = true;
    setFields(newFields);
  };

  const addField = () => {
    setFields([...fields, { type: '', remarks: '' }]);
  };

  const removeField = (index) => {
    if (fields.length > 1) {
      const removedFieldId = fields[index].id;
      setRemovedFields((prevRemovedFields) => [
        ...prevRemovedFields,
        removedFieldId,
      ]);
      const newFields = fields.filter((_, i) => i !== index);
      setFields(newFields);
    }
  };

  const validateFields = () => {
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].type) {
        setError('Please select a type for each field');
        return false;
      }
      if (!fields[i].remarks) {
        setError('Please enter remarks for each selected field');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    const isValid = validateFields();
    if (!isValid) return;
    const payload = {
      "idReview": id,
      "strengthsAndImprovements": fields,
      ...(removedFields.length > 0 && { removedlds: removedFields })
    }
    try {
      const response = await axiosJWT.post(`${apiUrl}/performance/addStrengthAndImprovements`, payload);
      if (response) {
        refreshSummaryData();
        closeModal();
        setRemovedFields([]);
        const message = "Strength and Improvement data added successfully !" 
        toast.success(({ id }) => (
          <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
            <FaRegCheckCircle style={{
							fontSize: '35px',
							marginRight: '10px',
							color: '#4caf50'
						}} />
            <span dangerouslySetInnerHTML={{ __html: message }}></span>
            <button
            onClick={() => toast.dismiss(id)}
            style={{
                background: 'none',
				border: 'none',
				color: '#4caf50',
				marginLeft: 'auto',
				cursor: 'pointer',
				fontSize: '20px',
            }}
          >
              <FaTimes />
            </button>
          </div>
        ), {
          icon: null, // Disable default icon
          duration: 7000,
          style: {
            border: '1px solid #4caf50',
            padding: '8px',
            color: '#4caf50',
          },
        });
      }
    } catch (error) {
      console.error('Submission failed:', error.message);
    }
  };

  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction='right'
      className='custom-drawer'
      overlayClassName='custom-overlay'
    >
      <div className="modal-dialog modal-lg oxyem_perfprmance_strength">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <h4 className="modal-title" id="myLargeModalLabel"> </h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <div className="modal-body">
            <div className="row t_per_area">
              <div className="col-1">
                <GiOvermind />
              </div>
              <div className="col-11">
                <h2>Add Your Strength or Areas of Improvement</h2>
                <p>Please add your Strengths and Improvement Areas to help us understand your key competencies and areas needing development. This will allow us to work together to enhance overall performance and efficiency.</p>
              </div>
            </div>
            <div className="row">
              <div className="col-12 text-end mb-4">
                <span
                  onClick={addField}
                  className="add_pbtn-performance"
                  data-tooltip-id="my-tooltip" data-tooltip-content={"Please add your Strength or Areas of Improvement"}
                >
                  <IoMdAddCircleOutline />
                </span>
              </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {fields.map((field, index) => (
              <div className="perform_imp_str_data" key={index}>
                <div className="sn_perform_index">
                  <span>{index + 1}</span>
                </div>
                <div className="sn_perform_select">
                  <Select
                    value={selectOptions.find(option => option.value === field.type)}
                    onChange={(selectedOption) => handleSelectChange(index, selectedOption ? selectedOption.value : '')}
                    options={selectOptions}
                    isDisabled={field.isMine === false}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder="Select Type"
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        borderColor: state.isFocused ? '#7030a0' : provided.borderColor,
                        boxShadow: state.isFocused ? 'var(--dropdownfocusboxshadow)' : provided.boxShadow,
                        '&:hover': {
                          borderColor: state.isFocused ? '#7030a0' : 'var(--dropdownhoverbordercolor)',
                        },
                        backgroundColor: state.isFocused ? 'var(--dropdownfocusbgcolor)' : provided.backgroundColor,
                      }),
                      indicatorSeparator: (provided, state) => ({
                        ...provided,
                        backgroundColor: '#7030a0',
                        fontWeight: 'var(--dropdownfontweight)',
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        padding: 'var(--dropdownpadding)',
                        cursor: 'var(--dropdowncursorstyle)',
                        fontWeight: 'var(--dropdownfontweight)',
                        backgroundColor: state.isSelected
                          ? '#7030a0'
                          : state.isFocused
                            ? '#7030a0'
                            : 'var(--dropdowntransparentcolor)',
                        color: state.isSelected ? '#ffffff' : 'var(--dropdowninheritcolor)',
                        ':hover': {
                          backgroundColor: '#7030a0',
                          color: '#ffffff',
                          fontWeight: 'var(--dropdownfontweight)',
                        },
                      }),
                    }}
                  />
                </div>
                <div className="sn_perform_text">
                  <input
                    type="text"
                    value={field.remarks}
                    onChange={(e) => handleTextChange(index, e.target.value)}
                    className="form-control"
                    placeholder="Enter Details"
                    disabled={field.isMine === false}
                  />
                </div>
                <div className="sn_perform_btn">
                  <button
                    onClick={() => removeField(index)}
                    className="remove-btn-p"
                    disabled={fields.length <= 1 || !field.isMine }
                  >
                    <FiMinusCircle />
                  </button>
                </div>
              </div>
            ))}
            <div className="row mt-4">
              <div className="col-12 text-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-performance"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Tooltip id="my-tooltip" style={{ maxWidth: "300px", backgroundColor: "#7030a0", background: "#7030a0" }} />
    </Drawer>
  );
};

export default ImprovmentStrength;
