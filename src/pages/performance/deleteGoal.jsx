import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { MdDeleteForever } from "react-icons/md";
const deleteGoal = ({ isOpen, closeModal, value, handleDelete }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [docummentDeleteData, setDocummentDelete] = useState({});
  console.log("docummentDeleteData", docummentDeleteData);
  useEffect(() => {
    if (isOpen) {
      setDocummentDelete(value);
      document.body.classList.add("hide-body-scroll");
    } else {
      setDocummentDelete({});
      document.body.classList.remove("hide-body-scroll");
    }
  }, [isOpen, value]);
  const allowedFields = ["goalName", "goalDetails", "goalScore", "idGoal"];
  return (
    <Drawer
      open={isOpen}
      onClose={closeModal}
      direction="right"
      className="custom-drawer-delete"
      overlayClassName="custom-overlay-delete"
    >
      <div className="modal-dialog modal-lg delete-perform-modal">
        <div className="modal-content">
          <div className="modal-header">
            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
            <h4 className="modal-title" id="myLargeModalLabel">
              <MdDeleteForever /> Are you Sure to Delete this Record ?
            </h4>
          </div>
          <div className="modal-body mt-4" >
            <div className="mb-3 top-info-section">
            <h3>Goal Information</h3>
            <hr/>
            </div>
            <div className="mt-2">
            {allowedFields.map((key) => {
              const item = docummentDeleteData[key];
              if (!item) return null;

              return (
                <div key={key}>
                  {item.attribute === "goalDetails" ? (
                    <div className="ck-content">
                      <div dangerouslySetInnerHTML={{ __html: item.value }} />
                    </div>
                  ) : item.attribute === "goalName" ? (
                    <h4>{String(item.value)}</h4>
                  ) :  item.attribute === "goalScore" ? (
                    <p>Goal Score: <b>{String(item.value)}</b></p>
                  ) :  item.attribute === "idGoal" ? (
                   <span className='oxyem-delete-btn-section text-end'>
              <button className='btn btn-no' onClick={() => handleDelete(item.value)}>Delete</button>
            </span>
                  ) : (
                    <>
                      <strong>{item.attribute}:</strong> {String(item.value)}
                    </>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default deleteGoal;
