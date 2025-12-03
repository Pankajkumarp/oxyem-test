import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../../Auth/AddAuthorization.jsx';
import Drawer from 'react-modern-drawer'
import Avatar from 'react-avatar';
//import styles 👇
import 'react-modern-drawer/dist/index.css'


const AssignmemberHistroy = ({ isOpen, closeModal, isHistroyId }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [assignMemberDetails, setAssignMemberDetails] = useState([]);

  const getAttendanceDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/timesheet/viewMembers`, {
        params: {
          idAssignTask: id,
        },
      });
      if (response && response.data && response.data.data) {
        setAssignMemberDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAttendanceDetails(isHistroyId);
		document.body.classList.add("hide-body-scroll");
    } else {
		document.body.classList.remove("hide-body-scroll");
    }
  }, [isOpen, isHistroyId]);



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
            <h4 className="modal-title" id="myLargeModalLabel"></h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>
          <div className="modal-body  oxyem-assign-member-popup">
            <h6>View Assign Members </h6>
            <div className="oxyem-assign-member-inner-box">
              <div className="row">
                <div className='oxyem-pop-up-member-assign-top'>
                  <div className='row'>
                  <div className='col-2'>
                      <span>SrNo</span>
                    </div>
                    <div className='col-6'>

                      <span>Name</span>
                    </div>
                    <div className='col-2 text-center'>
                      <span>%Alloc</span>
                    </div>
                    
                    <div className='col-2 text-center'>
                      <span>TStatus</span>
                    </div>
                    
                  </div>
                </div>
                {assignMemberDetails.map((detail, index) => (
                  <div className='oxyem-pop-up-member-assign'>
                    <div className='row align-items-center'>
                    <div className='col-2'>
                        {index + 1}
                      </div>
                      <div className='col-6'>
                        <div className="assign-profile-s">
                          <div className="assign-inner1">
                            <Avatar
                              name={detail.employeeName}
                              src={detail.profilePicPath}
                              size={40}
                              textSizeRatio={2}
                              round={true}
                              style={{
                                marginRight: '5px',
                                objectFit: 'cover' // Add object-fit
                              }}
                            />
                          </div>
                          <div className="assign-inner2">
                            {detail.profilelink ? (
                              <Link href={detail.profilelink}>
                                {detail.profilelink}
                              </Link>
                            ) : (
                              <span className="assign-profile-name-text">{detail.employeeName}</span>
                            )}

                            <span className="assign-profile-designation-text">{detail.designation}</span>
                          </div>
                        </div>
                      </div>
                      <div className='col-2 text-center'>
                        {detail.taskPercentage}
                      </div>
                      <div className='col-2 text-center'>
                        <span className={`oxyem-mark-${detail.status}`}>{detail.status}</span>
                      </div>
                      
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AssignmemberHistroy;
