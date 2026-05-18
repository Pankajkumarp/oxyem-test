import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { axiosJWT } from '../../../Auth/AddAuthorization.jsx';
import { format } from "date-fns";
import Drawer from 'react-modern-drawer'
import Avatar from 'react-avatar';
//import styles 👇
import 'react-modern-drawer/dist/index.css'


const timesheetComment = ({ isOpen, closeModal, SubTaskInfo }) => {
  const [SubTask, setSubTask] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return Number.isNaN(d) ? "" : format(d, "dd MMM yyyy");
  };
  const getCommentDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/timesheet/getSubTaskInfoWithComments`, {
        params: {
          idSubTask: id,
        },
      });
      if (response?.data?.data) {
        setSubTask(response?.data?.data)
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
    }
  };
  useEffect(() => {
    if (isOpen) {
      if (SubTaskInfo?.idSubTask) {
        getCommentDetails(SubTaskInfo?.idSubTask)
      }
      document.body.classList.add("hide-body-scroll");
    } else {
      document.body.classList.remove("hide-body-scroll");
    }
  }, [isOpen, SubTaskInfo?.idSubTask]);
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
          <div className="modal-body">
            <div className="main-view-box-opportunity">
              <div className="drawer-container" >
                <div className="drawer-header" style={{ padding: '0px' }}>
                  <h5 className="task-title">{SubTask?.taskName}</h5>
                  <div className={`o-x-t-s oxyem-mark-${SubTask?.status}`}>
                    {SubTask?.status}
                  </div>
                  <button className="close-btn" onClick={closeModal}>
                    <MdClose />
                  </button>
                </div>
                <div className="drawer-body">
                  <div className="task-meta">
                    <p style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <span className="subtask-code">{SubTask?.generatedSubTaskCode}</span>
                      <span style={{ fontSize: '.75rem', color:'#64748b', display:'flex', alignItems:'center' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style={{ width: '14px', height: '14px', marginRight: '5px' }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        {formatDate(SubTask?.startDate)} - {formatDate(SubTask?.endDate)}</span>
                    </p>
                    <p>

                    </p>
                    <div className="section" style={{display:'flex', alignItems:'center'}}>
                      <h6 style={{marginRight:'10px', marginBottom:0}}>Assignee</h6>
                      <div className="avatar-group">
                        <div className="avatar-item">
                          <Avatar
                            src={SubTask?.assignedTo?.ProfilePic}
                            name={SubTask?.assignedTo?.employeeName}
                            size="28"
                            round
                            textSizeRatio={2}
                          /><span className="mx-2">{SubTask?.assignedTo?.employeeName}</span>
                        </div>

                      </div>
                    </div>
                    <div className="desc  ck-content">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: SubTask?.description,
                        }}
                      >
                      </div>
                    </div>
                  </div>
                  <div className="section">
                    <h6>Comments</h6>

                    {SubTask?.comments?.length > 0 ? (
                      SubTask.comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <Avatar name={comment?.user?.name} src={comment?.user?.ProfilePic} size="28" round textSizeRatio={2} />
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="user">{comment?.user?.name}</span>
                              <span className="date">{formatDate(comment.date)}</span>
                            </div>
                            <div className="ck-content">
                            <div style={{fontSize:'.75rem'}}
                        dangerouslySetInnerHTML={{
                          __html: comment?.description,
                        }}
                      />
                          </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-comments">No comments available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
.drawer-container {padding: 25px 5px;}
.drawer-header{top:auto;}
.drawer-header {position: relative;border-bottom: 1px dotted #ccc; margin-bottom: 15px}
.task-title {font-size: 1.1rem; font-weight: 600; color: #1f2937;  width: 80%; line-height: 1.4;}
.close-btn {position: absolute; right: -10px; top: -40px; border: none; background: transparent; font-size: 1.4rem; cursor: pointer;}
.o-x-t-s{position: absolute; top: 0; right: 0px;}
.drawer-body {font-size: 14px;}
.task-meta p {margin-bottom: 10px; font-size: 0.85rem;}
.desc {color: #6b7280; margin-top: 8px;}
.section {margin-top: 18px;}
.section h6 {font-size: 14px; font-weight: 600; margin-bottom: 10px;}
.avatar-group { display: flex; gap: 8px;}
.comment-item { display: flex; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f1f5f9;}
.comment-content { flex: 1;}
.comment-header {display: flex; justify-content: space-between; font-size: 13px;}
.comment-header .user {font-weight: 600; color: #111827;}
.comment-header .date {color: #9ca3af; font-size: 12px;}
.avatar-group {display: flex; align-items: center;}
.avatar-item {margin-left: -15px; border: 2px solid #fff; border-radius: 50%;}
.avatar-item:first-child { margin-left: 0;}
p.no-comments {
    font-size: .8rem;
    color: gray;
    text-align: center;
    padding: 10px;
    border: 1px solid #e9e8e8;
    border-radius: .375rem;
    margin-top: 10px;
}
.avatar-more { margin-left: -15px; width: 38px; height: 38px; background: #e5e7eb; color: #111827; font-size: 12px; font-weight: 600; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff;}
.comment-content .text {margin: 4px 0;color: #374151;font-size: .75rem;
}`}
      </style>
    </Drawer>
  );
};

export default timesheetComment;
