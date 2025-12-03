import React from "react";
import Drawer from "react-modern-drawer";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/router";
import CustomDataTable from "../Datatable/tablewithApi.jsx";

export default function AttendanceAdminDetailsDrawer({ isOpen, closeModal, selectedFilter, activeStatus, handleClearFilter }) {
    const router = useRouter();

    const handleEditClick = (id) => {
        router.push(`/attendance/${id}`);
    };

    return (
        <Drawer open={isOpen} onClose={closeModal} direction="right" className="custom-drawer">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header mb-2">
                        <h4 className="modal-title">Attendance - {Object.values(selectedFilter || {})[0]}</h4>
                        <button className="oxyem-btn-close" onClick={closeModal}>
                            <MdClose />
                        </button>
                    </div>

                    <div className="modal-body employee-table-popup">
                        {activeStatus !== null && (
                            <div className="active-filter-tag">
                                <span>
                                    {typeof activeStatus === "string"
                                        ? activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)
                                        : activeStatus}
                                </span>
                                <button onClick={handleClearFilter} className="remove-filter-btn">×</button>
                            </div>
                        )}

                        <CustomDataTable
                            title={""}
                            onEditClick={handleEditClick}
                            dashboradApi={'/attendance'}
                            utctimeconditionpage={'userAttendance'}
                            searchfilter={selectedFilter}
                        />
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
