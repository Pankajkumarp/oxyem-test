import React from "react";
import Drawer from "react-modern-drawer";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/router";
import CustomDataTable from "../Datatable/tablewithApi.jsx";

export default function AutomationIdeaDetailsDrawer({
  isOpen,
  closeModal
}) {
  const router = useRouter();

  const onViewClick = (id) => {
    router.push(`/automation-ideas/${id}`); 
  };

  return (
    <Drawer open={isOpen} onClose={closeModal} direction="right" className="custom-drawer">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header mb-2">
            <h4 className="modal-title">
              Automation Ideas Submitted
            </h4>

            <button className="oxyem-btn-close" onClick={closeModal}>
              <MdClose />
            </button>
          </div>

          {/* Body */}
          <div className="modal-body employee-table-popup">
            <CustomDataTable
              title={""}
              onViewClick={onViewClick}
              dashboradApi={"/automationIdea/myIdeaslist"}   
            />
          </div>

        </div>
      </div>
    </Drawer>
  );
}
