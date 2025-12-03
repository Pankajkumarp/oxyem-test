import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import Textarea from '../common/Inputfiled/TextAreaComponentcomman';
const FormalitiesView = ({ isOpen, closeModal, id, handleApproveSubmit, approvalLevel }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [remarks, setRemarks] = useState('');
  const [formalitiesValue, setFormalitiesValue] = useState([]);
  const [selectvalue, setSelectvalue] = useState("");
  const [validationrError, setValidationRError] = useState('');
  const [validationError, setValidationError] = useState('');
  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/separation/viewFormality`, {
        params: {
          id: id,
        },
      });
      if (response) {
        setFormalitiesValue(response.data.data)
        setSelectvalue("")
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAttendanceDetails(id);
    }
  }, [isOpen, id]);


  function handleClick(event) {
    if (event.target.id === "option-1") {
      setSelectvalue("submitted");
      setValidationRError("")
    } else if (event.target.id === "option-2") {
      setSelectvalue("notSubmitted");
      setValidationRError("")
    }
  }
  function handleCancel() {
    closeModal();
  }

  function handleSubmit() {
    if (selectvalue.trim() === "") {
      setValidationRError("Please select at Status field to submit.");
      return;
    }
    if (selectvalue === "notSubmitted" && remarks.trim() === "") {
      setValidationError("Remarks are required.");
      return;
    }

    setValidationError("");
    const convertValue = {
      selectvalue: selectvalue,
      id: id,
      remarks: remarks
    }
    handleApproveSubmit(convertValue)
  }
  const onChange = (newValue) => {
    setRemarks(newValue);
    if (newValue.trim() !== "") {
      setValidationError('');
    } else {
      setValidationError("Remarks are required.");
    }
  };
  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction='right'
      className='custom-drawer'
      overlayClassName='custom-overlay' // Apply the custom overlay class
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <div className="modal-body">
            <div className="main-view-box-leave main-view-box-formalities">
              <div className="top-box-leave">
                <h5 className="text_top_l">Formalities List ( {formalitiesValue.type} )</h5>
                <div className={`top-box-leave-right oxyem-mark-${formalitiesValue.status}`}>{formalitiesValue.status}</div>
              </div>

              {validationrError &&
                <div className="alert alert-danger alert-dismissible fade show error_formalties" role="alert">
                  {validationrError}
                </div>
              }
              <div className="inner-text-formalitie">
                <p><span className="lable_formalitie_text">Type : </span><span>{formalitiesValue.type}</span></p>
                <p><span className="lable_formalitie_text">Allocation Start :</span> <span>{formalitiesValue.allocationStartDate}</span></p>
                <p><span className="lable_formalitie_text">Allocation End :</span> <span>{formalitiesValue.allocationEndDate}</span></p>
              </div>
              <div className="conformbtn_radio">
                Is the {formalitiesValue.type} returned to the company?
                <div className="oxyem_radio_btn_f">
                  <input
                    type="radio"
                    name="select"
                    id="option-1"
                    checked={selectvalue === "submitted"}
                    onClick={handleClick}
                  />
                  <input
                    type="radio"
                    name="select"
                    id="option-2"
                    checked={selectvalue === "notSubmitted"}
                    onClick={handleClick}
                  />
                  <label htmlFor="option-1" className="option option-1">
                    <span>Yes</span>
                  </label>
                  <label htmlFor="option-2" className="option option-2">
                    <span>No</span>
                  </label>
                </div>
              </div>
              {selectvalue === "notSubmitted" ? (
                <div className="form-group remark_field_formalties">
                  <Textarea
                    label={"Remarks"}
                    placeholder={"Enter Your Remarks"}
                    name={"remarks"}
                    onChange={onChange}
                    value={remarks}
                    validations={
                      [{
                        "message": "Remarks Reason is required",
                        "type": "required"
                      }]
                    }
                  />
                  {validationError && <div className="text-danger mt-2">{validationError}</div>}
                </div>
              ) : (null)}
              {approvalLevel === "2" ? (
                <div className="text-end w-100 btn-section">
                  <button type="button" className={`btn btn-oxyem mx-2`} onClick={handleCancel}>Cancel</button>
                  <button type="button" className={`btn btn-primary`} onClick={handleSubmit}>Submit</button>
                </div>
              ) : (null)}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default FormalitiesView;
