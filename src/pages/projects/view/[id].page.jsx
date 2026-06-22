/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { axiosJWT } from "../../Auth/AddAuthorization.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs/Breadcrumbs";
import { useRouter } from "next/router";
import CompletionBar from "../../Components/CompletionBar.jsx";
import { toast } from 'react-hot-toast';
import { FaTimes } from "react-icons/fa";
import ImportantNotifications from "../../Components/Notifications/ProjectNotifications.jsx"
import Profile from "../../Components/commancomponents/profile.jsx";
import ProjectIndicator from "../../Components/ProjectIndicator.jsx";
import Delay from '../../Components/Popup/DelayModal';
import ApproveModal from '../../Components/Popup/ApproveModal';
import Avatar from "react-avatar";
import { FaRegCommentDots } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import CustomDataTable from "../../Components/Datatable/tablewithApi.jsx";
import { MdDownload } from "react-icons/md";
import dynamic from "next/dynamic";
const Notes = dynamic(
  () => import("../../Components/Popup/Notes"),
  { ssr: false, loading: () => null }
);
import { IoArrowBackOutline } from "react-icons/io5";

export default function Projectview() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [getID, setGetID] = useState("");
  const [opportunityId, setOpportunityId] = useState("");
  const [projectDetail, setProjectDetail] = useState({});
  const [isApproveOpen, setIsApproveOpen] = useState(false);
const [approveId, setApproveId] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
      const [isdelayId, setIsDelayId] = useState("");
    const [isModalOpenDe, setIsModalOpenDe] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const getProjectValue = async (id) => {
    try {
      const response = await axiosJWT.get(
        `${apiUrl}/project/getprojectDetail`,
        {
          params: {
            idProject: id,
          },
        }
      );
      if (response) {
        const apiResponse = response.data.data;
        setProjectDetail(apiResponse.projectDetail);
        setTeamMembers(apiResponse.teamMembers);
      }
    } catch (error) {console.error(error)}
  };
  const { id } = router.query;
  useEffect(() => {
 // Extract the "id" parameter from the query object
    setGetID(id);
    getProjectValue(id);
  }, [id]);
  const handleApproveClick = (id) => {
  setApproveId(id);
  setIsApproveOpen(true);
};

 const handlerdelayvalueClick = async (id) => {
        setIsDelayId(id)
        openDelaypopup()
    }
    const openDelaypopup = async () => {
        setIsModalOpenDe(true)
    }
    const closeDetailpopupDe = async () => {
        setIsModalOpenDe(false)
    }
    //need to check
   const handleApproveSubmit = async () => {
    const message = 'Milestone approved successfully updated';

    const payload = {
        action: "approved",
        idMilestone: approveId,
        projectId: getID,
    };

    try {
        const response = await axiosJWT.post(
            `${apiUrl}/opportunity/updateMilestones`,
            payload
        );

        if (response?.status === 200) {
            // Close modal and refresh project data
            setIsApproveOpen(false);
            getProjectValue(getID);

            // Show success toast
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <img src='/assets/img/proposal-icon.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                    <span dangerouslySetInnerHTML={{ __html: message }}></span>
                    <button
                        onClick={() => toast.dismiss(id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#4caf50',
                            marginLeft: 'auto',
                            cursor: 'pointer'
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>
            ), {
                icon: null,
                duration: 7000,
                style: {
                    border: '1px solid #4caf50',
                    padding: '8px',
                    color: '#4caf50',
                },
            });
        } else {
            // If backend responds but not 200, throw error to trigger catch
            throw new Error(response?.data?.message || 'Approval failed.');
        }
    } catch (error) {
        console.error("Approve API Error:", error);

        // Show proper error toast
        toast.error(({ id }) => (
            <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                <span dangerouslySetInnerHTML={{ __html: error?.message || 'Error connecting to the backend. Please try again later.' }}></span>
                <button
                    onClick={() => toast.dismiss(id)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#FF000F',
                        marginLeft: 'auto',
                        cursor: 'pointer'
                    }}
                >
                    <FaTimes />
                </button>
            </div>
        ), {
            icon: null,
            duration: 7000,
            style: {
                border: '1px solid #FF000F',
                padding: '8px',
                color: '#FF000F',
            },
        });
    }
};

  useEffect(() => {
    const mainElement = document.querySelector("body");
    if (mainElement) {
      mainElement.setAttribute("id", "project-module");
    }
    return () => {
      if (mainElement) {
        mainElement.removeAttribute("id");
      }
    };
  }, []);
      //need to check

 const handleSubmitData = async (data) => {
const message = 'Milestone delayed updated!';
  const formattedDate = data.date
    ? data.date.toISOString().split("T")[0]
    : null;

  const delayPostdata = {
    action: "delayed",
    idMilestone: isdelayId,
    delayDate: formattedDate,
    reason: data.delayreason,
    projectId: getID
  };
try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/opportunity/updateMilestones`, delayPostdata)

            if (response) {
                 setIsModalOpenDe(false);
    getProjectValue(getID);

                toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                        <img src='/assets/img/proposal-icon.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                        <span dangerouslySetInnerHTML={{ __html: message }}></span>
                        <button
                            onClick={() => toast.dismiss(id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#4caf50',
                                marginLeft: 'auto',
                                cursor: 'pointer'
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
            const errormessagel = 'Error connecting to the backend. Please try after Sometime.';
            toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                    <span dangerouslySetInnerHTML={{ __html: errormessagel }}></span>
                    <button
                        onClick={() => toast.dismiss(id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#FF000F',
                            marginLeft: 'auto',
                            cursor: 'pointer'
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>
            ), {
                icon: null, // Disable default icon
                duration: 7000,
                style: {
                    border: '1px solid #FF000F',
                    padding: '8px',
                    color: '#FF000F',
                },
            });
            console.error(error)
        }

    };
    
  const InfoRow = ({ label, value }) => (
    <div className="d-flex align-items-center value-info">
      <div className="tittle-text">{label}:</div>
      <div className="tittle-value">{value}</div>
    </div>
  );
  const InfoHeader = ({ label, status, projindicator }) => (
    <div className="d-flex justify-content-between mb-3 top-heading-section">
      <div className="d-flex flex-row align-items-center">
        <div className="c-details">
          {label === "Project Details" ? (
            <h6 className="mb-0 main-heading">{label}</h6>
          ) : (
            <h6 className="mb-0 main-heading ml-3">{label}</h6>
          )}
        </div>
      </div>
      <div className="project_indicator_oxyem">
      {status ? (
        <ProjectIndicator projindicator={projindicator || "unknown"} />
      ) : null}

      {status ? (
        <span className={`badge bg-c-${status}`}>{projectDetail.status}</span>
      ) : null}
      </div>
    </div>
  );
  const GroupAvatar = ({ users, maxVisible = 3 }) => {
    const visibleUsers = users?.slice(0, maxVisible);
    const remaining = users?.length - maxVisible;

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {visibleUsers?.map((user, index) => (
          <div key={index} style={{ marginLeft: index === 0 ? 0 : -10 }}>
            <Avatar
              name={user.name}
              src={user.imageUrl}
              size={30}
              textSizeRatio={2}
              round={true}
              style={{
                objectFit: "cover", // Add object-fit
              }}
            />
          </div>
        ))}
        {remaining > 0 && (
          <div className="pending-avtar" style={{ marginLeft: -10 }}>
            <Avatar
              name={`+ ${remaining}`}
              size={30}
              textSizeRatio={2}
              round={true}
              style={{
                objectFit: "cover", // Add object-fit
              }}
            />
          </div>
        )}
      </div>
    );
  };
  // completion

  const totalMilestones = 10;
  const completedMilestones = 4;

  const completion = Math.round((completedMilestones / totalMilestones) * 100);
  const GetTotalSum = (totalSum, totalCount) => {
    setTotalPrice(totalSum);
    const count =
      Array.isArray(totalCount) && totalCount.length > 0 ? totalCount[0] : 0;
    setTotalCount(count);
  };
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const openNotesModal = async () => {
    setIsNotesModalOpen(true);
  };
  const closeNotesModal = async () => {
    setIsNotesModalOpen(false);
  };
  const [documentData, setDocumentData] = useState([]);
  const getUploadList = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/getDocumentList`, {
        params: {
          id: id,
          isFor: "projectDocs",
        },
      });
      if (response && response.data) {
        setDocumentData(response.data.data);
      }
    } catch (error) {
      console.error("Error occurred while fetching attendance details:", error);
    }
  };

  useEffect(() => {
    const { id } = router.query;
    setOpportunityId(id);
    getUploadList(id);
  }, [router.query.id]);
  const getFileName = (path) => {
    return path.substring(path.lastIndexOf("/") + 1);
  };

  const handleDownloadClickWithPath = async (path) => {
    const filePath = path;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/download`, {
        params: { filePath },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = getFileName(filePath);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };
      const handleBack = () => {
        router.back();
    };
  return (
    <>
      {" "}
      <Notes
        isOpen={isNotesModalOpen}
        closeModal={closeNotesModal}
        id={opportunityId}
        type={"opportunity"}
      />
                  <Delay isOpen={isModalOpenDe} closeModal={closeDetailpopupDe} onSubmit={handleSubmitData} />
      <ApproveModal
  isOpen={isApproveOpen}
  closeModal={() => setIsApproveOpen(false)}
  onSubmit={handleApproveSubmit}
/>

      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col">
                    <Breadcrumbs maintext={"Project Allocation"} />
                  </div>
                  <div
                    className="col-12 col-lg-12 col-xl-12 d-flex"
                    id="project-view"
                  >
                    <div className="card flex-fill comman-shadow oxyem-index oxyem-project-view-page">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                          <div
                            className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border"
                            id="sk-create-page"
                          >
                            <div className="top-card-icon-b">
                                                                                    <span className='back-btn' onClick={handleBack}>
                                                                                        <IoArrowBackOutline />Back
                                                                                    </span>
                                                                                    </div>
                            <div className="row">
                              <div className="col-lg-4">
                                <div className="row">
                                  <div className="col-md-12">
                                    {projectDetail ? (
                                      <div className="project-card p-3 mb-3">
                                        <InfoHeader
                                          label="Project Details"
                                          projindicator={
                                            projectDetail.projindicator
                                          }
                                          status={projectDetail.status}
                                        />

                                        <div className="">
                                          <InfoRow
                                            label="Project ID"
                                            value={
                                              projectDetail.projectId &&
                                              projectDetail.projectId.length >=
                                                8
                                                ? `${projectDetail.projectId.slice(
                                                    0,
                                                    3
                                                  )}*********${projectDetail.projectId.slice(
                                                    -3
                                                  )}`
                                                : projectDetail.projectId
                                            }
                                          />
                                          <InfoRow
                                            label="Project Name"
                                            value={projectDetail.projectName}
                                          />
                                          <InfoRow
                                            label="Clinet Name"
                                            value={projectDetail.clientName}
                                          />
                                          <InfoRow
                                            label="Start Date"
                                            value={projectDetail.startDate}
                                          />
                                          <InfoRow
                                            label="End Date"
                                            value={projectDetail.endDate}
                                          />
                                          <InfoRow
                                            label="Billing Type"
                                            value={projectDetail.project_billing_type}
                                          />
                                        </div>
                                        <div className="d-flex align-items-center mt-3">
                                          <div className="text1 me-5">
                                            <FaUsers />{" "}
                                            {
                                              projectDetail?.memberAllocate
                                                ?.length
                                            }{" "}
                                            Member
                                          </div>
                                          <GroupAvatar
                                            users={
                                              projectDetail?.memberAllocate
                                            }
                                            maxVisible={3}
                                          />
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className="col-md-12">
                                    <div className="project-card p-3 mb-3">
                                      <InfoHeader
                                        label="Allocations Details"
                                        status={""}
                                      />
                                      {teamMembers ? (
                                        <div className="">
                                          {teamMembers?.map((member, index) => (
                                            <div
                                              key={index}
                                              className="d-flex align-items-center value-info mb-3"
                                            >
                                              <div className="profile-section-info me-1">
                                                <div className="d-flex align-items-center">
                                                  <Profile
                                                    name={member.name}
                                                    imageurl={member.imageUrl}
                                                    size="30"
                                                  />
                                                  <div className="ms-2">
                                                    <div className="info-text-format">
                                                      {member.name}
                                                    </div>
                                                    <div className="small-text-format">
                                                      {member.role}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="assign-section-info me-2">
                                                <div className="light-text-format">
                                                  {member.startDate}
                                                </div>
                                                <div className="light-text-format dark-t">
                                                  {member.endDate}
                                                </div>
                                              </div>

                                              <div className="status-section-info">
                                                <div
                                                  className={`member-box-project member-${member.status}`}
                                                ></div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-8">
                                <div className="project-card p-3 mb-3">
                                  <div className="d-flex date-info-sec">
                                    <CompletionBar value={completion} />
                                  </div>
                                  <div className="oxyem-top-box-design design-only-attendence claim-top-data-main mx-0 row stats-grid">
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 ps-md-0">
                                      <div className="stats-info stats-info-cus ">
                                        <div className="ox-colored-box-1">
                                          <h4 className="all_attendence">
                                            {totalCount}
                                          </h4>
                                        </div>
                                        <div className="ox-box-text">
                                          <h6>Pending Milestones</h6>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 ps-md-0">
                                      <div className="stats-info stats-info-cus ">
                                        <div className="ox-colored-box-3">
                                          <h4 className="notsubmit_attendence">
                                            {totalCount}
                                          </h4>
                                        </div>
                                        <div className="ox-box-text">
                                          <h6>No. of Opportunity</h6>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 pr-0">
                                      <div className="stats-info stats-info-cus ">
                                        <div className="ox-colored-box-4 amountText">
                                          <h4 className="week_attendence">
                                            {totalPrice}k
                                          </h4>
                                        </div>
                                        <div className="ox-box-text">
                                          <h6>Total Amount</h6>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                   {/* start of notes section */}
                                  <div className="combo_btn_opp">
                                    <span
                                      className="btn-notes-opp1"
                                      onClick={openNotesModal}
                                    >
                                        <FaRegCommentDots size={35} color="#555"/>

                                    </span>
                                  </div>
                                
                                  {/* end of notes section */}
                                  <div className="row">
                                    <div className="col-md-7">
                                      <div className="project-notification_section_div ox-scroll-mytask  claim-top-data-main mx-0 stats-grid" id="project-milestone">
                                        <InfoHeader
                                          label="Milestone Details for next 2 weeks"
                                          status={""}
                                        />
                                        {getID ? (
                                            
                                          <CustomDataTable
                                            title={""}
                                            data={[]}
                                            columnsdata={[]}
                                            idMilestone={isdelayId}
                                            idProject={getID}
                                            onApproveClick={handleApproveClick}
                                             onDelayClick={handlerdelayvalueClick}
                                            dashboradApi={
                                              "/opportunity/getMilestones"
                                            }
                                          />
                                        ) : null}
                                      </div>{" "}
                                    </div>
                                    {/* Start of Notifications section*/}
                                    <div className="col-md-5">
                                      <div className="project-notification_section_div bg-Soft-Blue-Tint project-left-border ox-scroll-mytask  claim-top-data-main mx-0 stats-grid">
                                        <InfoHeader
                                          label="Important Notifications"
                                          status={""}                                         
                                          
                                        />
                                        {/* Start of important component section. Need to just change the API below and consider attributes as mentioned in component*/}
                                        <ImportantNotifications
                                            apiUrl="/api/notifications/project/1116"
                                            height="320px"
                                            />
  {/* End of important component section*/}
                                    
                        {/* Remove this static Notifications code from here*/}
                                    <div className="notification-list">
                                    <div className="notification-item highlighted">
                                        <div className="notification-content">
                                        <h6 className="mb-1">Timesheet submitted</h6>
                                        <p className="mb-0 text-muted">
                                            Amit Sharma submitted for week ending 01 Jan 2026
                                        </p>
                                        </div>
                                        <span className="notification-time">1 hour ago</span>
                                    </div>
                                    
                                    <div className="notification-item">
                                        <div className="notification-content">
                                        <h6 className="mb-1">Interview feedback submitted</h6>
                                        <p className="mb-0 text-muted">
                                            Sandeep – Marketing Specialist feedback
                                        </p>
                                        </div>
                                        <span className="notification-time">4 hour ago</span>
                                    </div>

                                    </div>
                        {/* end of Remove this static Notifications code from here*/}
                        
{/* end of notification code*/}


                                      </div>
                                    </div>

                                    {/* End of Notifications section*/}
                                  </div>
                                         {/* Start of pricing section*/}
                            <div className="mt-4">
                                  <InfoHeader
                                    label="Deal Pricing Details"
                                    
                        
                                  />
                                  {getID ? (
                                    <CustomDataTable
                                      title={""}
                                      data={[]}
                                      columnsdata={[]}
                                      isShowFor="view"
                                      idProject={getID}
                                      GetTotalSum={GetTotalSum}
                                      documentFor="pricing"
                                      dashboradApi={
                                        "/opportunity/summaryListForPrice"
                                      }
                                      perPage={5}
                                    />
                                  ) : null}
                            </div>
                                  <div className="mt-4">
                                    <InfoHeader
                                      label="Project Documents"
                                      status={""}
                                    />
                                    {documentData && documentData.length > 0 ? (
                                      <div className="file_table_data_f">
                                        <table>
                                          <thead>
                                            <tr>
                                              <th className="f_h">Title</th>
                                              <th className="d_h">Download</th>
                                              <th className="s_h">Info</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {documentData.map((file) => (
                                              <tr
                                                className="bottom_table_line"
                                                key={file.Id}
                                              >
                                                <td className="name_ic">
                                                  <div className="highlight_t_s">
                                                    {file["Uploaded Date"]}
                                                  </div>
                                                  <div>{file["Title"]}</div>
                                                </td>
                                                <td className="svg_ic">
                                                  <span
                                                    onClick={() =>
                                                      handleDownloadClickWithPath(
                                                        file["download"]
                                                      )
                                                    }
                                                  >
                                                    <MdDownload />
                                                  </span>
                                                </td>
                                                <td className="type_ic">
                                                  <div>{file["Doc Type"]}</div>
                                                  <div>({file["Size"]})</div>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    ) : (
                                      <div className="no-documents">
                                        No previous document found
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
