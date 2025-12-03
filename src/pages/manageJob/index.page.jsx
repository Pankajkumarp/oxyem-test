import React, { useState } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import View from '../Components/Popup/jobInfo';
import History from './history';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
export default function manageJob() {
    const router = useRouter();
    const [isModalOpenHistory, setIsModalOpenHistory] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isviewId, setIsViewId] = useState("");
    const onViewClick = async (id) => {
        setIsViewId(id)
        openDetailpopup()
    }
    const openDetailpopup = async () => {
        setIsModalOpen(true)
    }
    const closeDetailpopup = async () => {
        setIsModalOpen(false)
    }

    const onHistoryClick = (id) => {
        setIsViewId(id)
        setIsModalOpenHistory(true);
    };
    const closeDetailpopupHistory = async () => {
        setIsModalOpenHistory(false)
    }

    const onEditClick = (id) => {
        router.push('manageJob/' + id);
    };
    const handleApprrovereq = (id) => {

    };

    return (
        <>
        <Head><title>{pageTitles.ManageJob}</title></Head>
        <History isOpen={isModalOpenHistory} closeModal={closeDetailpopupHistory} isHistroyId={isviewId} section={"adminAttendance"}  datafor={'groups'}/>
        <View isOpen={isModalOpen} closeModal={closeDetailpopup} isviewId={isviewId} section={"employeeLeave"} />
            <div className="main-wrapper">
                <div className="page-wrapper" id="managejob">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Job Dashboard"} />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="text-end w-100">
                                                        <Link href="/newJobpost" className='add_post_btn'>Post New Job</Link>
                                                    </div>
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <CustomDataTable
                                                            title={""}
                                                            onViewClick={onViewClick}
                                                            onHistoryClick={onHistoryClick}
                                                            onEditClick={onEditClick}
                                                            handleApprrovereq={handleApprrovereq}
                                                            dashboradApi={'/jobs/vacancies'}
                                                        />
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
