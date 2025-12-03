import React, { useState, useEffect } from "react";
import SecTab from "../../Components/Employee/SecTab";
import { axiosJWT } from "../../Auth/AddAuthorization.jsx";
import Breadcrumbs from "../../Components/Breadcrumbs/Breadcrumbs";
import { useRouter } from "next/router";
import { FaEdit } from "react-icons/fa";
import { fetchWithToken } from "../../Auth/fetchWithToken.jsx";
import Profile from "../../Components/commancomponents/profile.jsx";
import Avatar from 'react-avatar';
import { FaUsers } from "react-icons/fa";
import CustomDataTable from '../../Components/Datatable/tablewithApi.jsx';
import { MdDownload } from 'react-icons/md';

export default function Projectview({ userFormdata }) {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [getID, setGetID] = useState("")
    const [totalsum, settotalsum] = useState()
    const [projectDetail, setProjectDetail] = useState({})
    const [teamMembers, setTeamMembers] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
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
                setProjectDetail(apiResponse.projectDetail)
                setTeamMembers(apiResponse.teamMembers)
            }
        } catch (error) { }
    };
    useEffect(() => {
        const { id } = router.query; // Extract the "id" parameter from the query object
        setGetID(id);
        getProjectValue(id);
    }, [router.query.id]);



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


    const InfoRow = ({ label, value }) => (
        <div className="d-flex align-items-center value-info">
            <div className="tittle-text">{label}:</div>
            <div className="tittle-value">{value}</div>
        </div>
    );
    const InfoHeader = ({ label, status }) => (
        <div className="d-flex justify-content-between mb-3 top-heading-section">
            <div className="d-flex flex-row align-items-center">
                <div className="c-details">
                    <h6 className="mb-0 main-heading">{label}</h6>
                </div>
            </div>
            {status ? (
                <span className={`badge bg-c-${status}`}>{projectDetail.status}</span>
            ) : null}
        </div>
    );
    const GroupAvatar = ({ users, maxVisible = 3 }) => {
        const visibleUsers = users?.slice(0, maxVisible);
        const remaining = users?.length - maxVisible;

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {visibleUsers?.map((user, index) => (
                    <div key={index} style={{ marginLeft: index === 0 ? 0 : -10 }}>
                        <Avatar
                            name={user.name}
                            src={user.imageUrl}
                            size={30}
                            textSizeRatio={2}
                            round={true}
                            style={{
                                objectFit: 'cover' // Add object-fit
                            }} />
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
                                objectFit: 'cover' // Add object-fit
                            }} />
                    </div>
                )}
            </div>
        );
    };
    const GetTotalSum = (totalSum, totalCount) => {
        setTotalPrice(totalSum)
        const count = (Array.isArray(totalCount) && totalCount.length > 0) ? totalCount[0] : 0;
        setTotalCount(count)
    };
    const [documentData, setDocumentData] = useState([]);
    const getUploadList = async (id) => {
        try {
            const response = await axiosJWT.get(`${apiUrl}/getDocumentList`, {
                params: {
                    'id': id,
                    'isFor': "projectDocs",
                },
            });
            if (response && response.data) {
                setDocumentData(response.data.data)
            }
        } catch (error) {
            console.error("Error occurred while fetching attendance details:", error);
        }
    };
    useEffect(() => {
        const { id } = router.query;
        getUploadList(id);
    }, [router.query.id]);
    const getFileName = (path) => {
        return path.substring(path.lastIndexOf('/') + 1);
    };

    const handleDownloadClickWithPath = async (path) => {
        const filePath = path;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/download`, {
                params: { filePath },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = getFileName(filePath);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading the file', error);
        }
    };
    return (
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
                                                    <div className="row">
                                                        <div className="col-lg-4">
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    {projectDetail ?
                                                                        <div className="project-card p-3 mb-3">
                                                                            <InfoHeader
                                                                                label="Project Details"
                                                                                status={projectDetail.status}
                                                                            />
                                                                            <div className="">
                                                                                <InfoRow
                                                                                    label="Project ID"
                                                                                    value={
                                                                                        projectDetail.projectId && projectDetail.projectId.length >= 8
                                                                                            ? `${projectDetail.projectId.slice(0, 3)}*********${projectDetail.projectId.slice(-3)}`
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
                                                                            </div>
                                                                            <div className="d-flex align-items-center mt-3">
                                                                                <div className="text1 me-5">
                                                                                    <FaUsers /> {projectDetail?.memberAllocate?.length} Member
                                                                                </div>
                                                                                <GroupAvatar users={projectDetail?.memberAllocate} maxVisible={3} />
                                                                            </div>
                                                                        </div> : null}
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <div className="project-card p-3 mb-3">
                                                                        <InfoHeader
                                                                            label="Allocations Details"
                                                                            status={""}
                                                                        />
                                                                        {teamMembers ?
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
                                                                                            <div className={`member-box-project member-${member.status}`}></div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div> : null}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-8">
                                                            <div className="project-card p-3 mb-3">
                                                                <div className="oxyem-top-box-design design-only-attendence claim-top-data-main mx-0 row stats-grid">
                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 ps-md-0">
                                                                        <div className="stats-info stats-info-cus ">
                                                                            <div className="ox-colored-box-3">
                                                                                <h4 className="notsubmit_attendence">{totalCount}</h4></div>
                                                                            <div className="ox-box-text">
                                                                                <h6>No. of Opportunity</h6></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 pe-md-0">
                                                                        <div className="stats-info stats-info-cus " >
                                                                            <div className="ox-colored-box-4 amountText">
                                                                                <h4 className="week_attendence">{totalPrice}</h4></div>
                                                                            <div className="ox-box-text">
                                                                                <h6>Total Amount</h6></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <InfoHeader
                                                                    label="Pricing Details"
                                                                    status={""}
                                                                />
                                                                {getID ?
                                                                    <CustomDataTable
                                                                        title={""}
                                                                        data={[]}
                                                                        columnsdata={[]}
                                                                        isShowFor="view"
                                                                        idProject={getID}
                                                                        GetTotalSum={GetTotalSum}
                                                                        documentFor="pricing"
                                                                        dashboradApi={'/opportunity/summaryListForPrice'}
                                                                        perPage={5}
                                                                    /> : null}
                                                                <div className="mt-4">
                                                                    <InfoHeader
                                                                        label="Project Documment"
                                                                        status={""}
                                                                    />
                                                                    {documentData && documentData.length > 0 ? (
                                                                        <div className='file_table_data_f'>
                                                                            <table>
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th className='f_h'>Title</th>
                                                                                        <th className='d_h'>Download</th>
                                                                                        <th className='s_h'>Info</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {documentData.map((file, index) => (
                                                                                        <tr className='bottom_table_line' key={file.Id}>
                                                                                            <td className='name_ic'>
                                                                                                <div className='highlight_t_s'>{file["Uploaded Date"]}</div>
                                                                                                <div>{file["Title"]}</div>
                                                                                            </td>
                                                                                            <td className='svg_ic'>
                                                                                                <span onClick={() => handleDownloadClickWithPath(file["download"])}>
                                                                                                    <MdDownload />
                                                                                                </span>
                                                                                            </td>
                                                                                            <td className='type_ic'><div>{file["Doc Type"]}</div><div>({file["Size"]})</div></td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    ) : (<div className="no-documents">
                                                                        No previous document found
                                                                    </div>)}
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
    );
}