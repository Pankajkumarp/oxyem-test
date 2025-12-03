import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import Drawer from 'react-modern-drawer';

//import styles 👇
import 'react-modern-drawer/dist/index.css';

const AssetHistory = ({ isOpen, closeModal, isHistroyId }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  

  useEffect(() => {
    if (isOpen) {
     
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
      overlayClassName='custom-overlay'
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header mb-2">
            <h4 className="modal-title" id="myLargeModalLabel"></h4>
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>

          <div className="modal-body" id="assetshistroy">
            <div className="main-view-box-leave">
              <div className="top-box-leave">
                <h5 className="text_top_l">Asset History</h5>
                

              </div>
             
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AssetHistory;
