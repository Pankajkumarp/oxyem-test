import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { IoDownloadOutline } from "react-icons/io5";
import { axiosJWT } from '../../Auth/AddAuthorization';
import Finance from './Finance';
import CustomDataTable from '../../Components/Datatable/tablewithApi.jsx';
import SendEmailModal from '../../Components/Popup/SendEmailModal.jsx';
export default function ClaimDetail({ applicantDetails ,activeTab,applicantid }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDownloadClickWithPath = async (path) => {

        const filePath = path;
    
        try {
    
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/download`, {
                params: { filePath},
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const fileName = getFileName(filePath);
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
    
        } catch (error) {
            
        }
    };
    
    const getFileName = (path) => {
      return path.substring(path.lastIndexOf('/') + 1);
    };

    const onViewClick = (id) => { };
    const onDeleteClick = (id) => { };

    const handleApprrovereq = (id) => {};
    const handleHistoryClick = (id) => {};

    const onEmailClick = (id) => {
        setIsOpen(true)
    };

    const closeModal = (id) => {
        setIsOpen(false);
    };

    const handleSendEmail = async (data) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.post(`${apiUrl}/jobs/offerLetterDispatch`, data);
        if (response) {
            setIsOpen(false);
            router.push('/onboardDashboard');
        }
    }

    return (
        <div className="row">
            
            {isExpanded && Array.isArray(applicantDetails) && applicantDetails.map((applicant, index) => {
                const {
                    appliedOn = '',
                    fullName = '',
                    idDepartment = '',
                    idRoles = '',
                    jobApplicantNo = '',
                    status = '',
                    documentPath='',
                    email='',
                    linkedInProfile='',
                    skolrupProfile='',
                    isBoaGenerated='',
                    isOfferLetterGenerated=''
                } = applicant;

                return (
                    <>
                    <SendEmailModal isOpen={isOpen} closeModal={closeModal} pagename={'onboardingProcess'} email={email} handleSendEmail={handleSendEmail} id={applicantid}/>
                    <div key={index} className="row mb-3">
                        <div className="col-md-6">
                            <ul className="personal-info-header-right claim-detail-v-page top-details">
                                {fullName !== '' && fullName !== null && 
                                <li>
                                    <div className="title">Name :</div>
                                    <div className="text">{fullName}</div>
                                </li> }
                                {jobApplicantNo !== '' && jobApplicantNo !== null && 
                                <li>
                                    <div className="title">Job Id :</div>
                                    <div className="text">{jobApplicantNo}</div>
                                </li>}

                                {idRoles !== '' && idRoles !== null && 
                                <li>
                                    <div className="title">Role :</div>
                                    <div className="text">{idRoles}</div>
                                </li>}

                                {documentPath !== '' && documentPath !== null && 
                                <li>
                                    <div className="title">Resume :</div>
                                    <div className="text">
                                        <IoDownloadOutline style={{ cursor: 'pointer' }} size={20} color='#FA7E12' onClick={() => handleDownloadClickWithPath(documentPath)} /></div>
                                </li>}

                                {linkedInProfile !== '' && linkedInProfile !== null && 
                                <li>
                                    <div className="title">LinkedIn Profile :</div>
                                    <div className="text"><a href={`${linkedInProfile}`} target="_blank" rel="noopener noreferrer">{linkedInProfile}</a></div>

                                </li>}

                                {skolrupProfile !== '' && skolrupProfile !== null && 
                                <li>
                                    <div className="title">Skolrup Profile :</div>
                                    <div className="text"><a href={`${skolrupProfile}`} target="_blank" rel="noopener noreferrer">{skolrupProfile}</a></div>
                                </li>}

                            </ul>
                        </div>
                        <div className="col-md-6">
                            <ul className="personal-info-header-right claim-detail-v-page top-details">
                                {idDepartment !== '' && idDepartment !== null && 
                                <li>
                                    <div className="title">Department :</div>
                                    <div className="text">{idDepartment}</div>
                                </li>}
                                {appliedOn !== '' && appliedOn !== null && 
                                <li>
                                    <div className="title">Applied On :</div>
                                    <div className="text">{appliedOn}</div>
                                </li>}
                                {status !== '' && status !== null && 
                                <li>
                                    <div className="title">Status :</div>
                                    <div className="text">{status}</div>
                                </li>}
                            </ul>
                        </div>

                        {activeTab === 'O' && status !== 'rejected' && !isOfferLetterGenerated &&(
                                <Finance applicantid={applicantid} fullName={fullName} isBoaGenerated={isBoaGenerated} isOfferLetterGenerated={isOfferLetterGenerated}/>
                        )}
                    <hr className='mt-3'/>
                    </div>
                    <div className='mb-3'>
                    {activeTab === 'O' && (
                        <>
                        <h2 className='mt-3'>Basket of allowance</h2>
                        <CustomDataTable                            
                            onViewClick={onViewClick}
                            onDeleteClick={onDeleteClick}
                            handleApprrovereq={handleApprrovereq}
                            onHistoryClick={handleHistoryClick}
                            dashboradApi={'/jobs/boaList'}
                            idJobApplicant={applicantid}
                        />
                        </>
                    )}
                    {activeTab === 'O' && isOfferLetterGenerated && (
                        <>
<h2 className='mt-3'>Offer letter</h2>
                        <CustomDataTable                            
                            onViewClick={onViewClick}
                            onDeleteClick={onDeleteClick}
                            handleApprrovereq={handleApprrovereq}
                            onHistoryClick={handleHistoryClick}
                            dashboradApi={'/jobs/offerLetterList'}
                            idJobApplicant={applicantid}
                            onEmailClick={onEmailClick}
                        />
                        </>
                    )}
                    </div>
                    </>
                );
            })}
        </div>
    );
}
