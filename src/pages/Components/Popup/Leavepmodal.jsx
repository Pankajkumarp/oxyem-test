import React, { useState, useEffect } from "react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import Apialert from '../Errorcomponents/Apierror';
import Drawer from 'react-modern-drawer'

//import styles 👇
import 'react-modern-drawer/dist/index.css'
export default function LeavePopup({
  open,
  popupdata,
  conformRequest,
  handleCancel
}) {

  const [alert, setAlert] = useState({});
useEffect(() => {
  if (popupdata?.message) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAlert({ show: true, type: 'warning', message: popupdata.message });
  }
}, [popupdata]);

  let earnedLeave = popupdata?.EarnedLeaves
  let lossOfPay = popupdata?.LossOfPay
  const combinedLeaves = [
    { ...earnedLeave, leaveType: "earnedLeave" },
    { ...lossOfPay, leaveType: "lossOfPay" }
  ];
  

  
  const handleConfirm = () => {


    conformRequest();
};
  return (
    <Drawer
      open={open}
      onClose={handleCancel}
      direction='right'
      className='custom-drawer'
      overlayClassName='custom-overlay' // Apply the custom overlay class
    >
      <div className="modal-dialog modal-lg ">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <h4 className="modal-title" id="myLargeModalLabel" >Leave</h4>
            <button className="oxyem-btn-close" onClick={handleCancel}>
              <MdClose />
            </button>



          </div>
          <div className="modal-body">
            <Apialert
              type={alert.type}
              message={alert.message}
              show={alert.show} />

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Leave Type</th>
                  <th scope="col">Leave From</th>
                  <th scope="col">Leave To</th>
                  <th scope="col">No. of days</th>
                </tr>
              </thead>
              <tbody>
                {combinedLeaves.map((item) => (
                  <tr key={item.leaveType}>
                    <td>{item.leaveType}</td>
                    <td>{item.fromDate}</td>
                    <td>{item.toDate}</td>
                    <td>{item.numberOfDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='sk-delete-button sk-delete-popup text-end w-100 mt-4'>
              <button type="reset" className="btn btn-oxyem mx-2" onClick={handleCancel}><AiFillCloseCircle /> Cancel</button>
              <button className="btn btn btn-primary" onClick={handleConfirm}><AiFillCheckCircle /> Confirm</button>
            </div>
          </div>
        </div>
      </div>

    </Drawer>
  );
}