import React, { useState } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi';
import { useRouter } from 'next/router';
import View from './history';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles';
export default function Index() {
    const router = useRouter();
    
    const [isHistroyId, setIsHistroyId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openDetailpopup = async () => { setIsModalOpen(true); };

    const closeDetailpopup = async () => {
        setIsModalOpen(false)
    }

    const handleHistoryClick = async (id) => { 
        setIsHistroyId(id); 
        openDetailpopup();
    };
    const onViewClick = (id) => { router.push(`/groups/${id}`); };
    const onDeleteClick = (id) => {};

    return (
        <>
        <Head>
        <title>{pageTitles.PermissionManagementGroupDashboard}</title>
        <meta name="description" content={pageTitles.PermissionManagementGroupDashboard} />
    </Head>
        <View isOpen={isModalOpen} closeModal={closeDetailpopup} isHistroyId={isHistroyId} section={"adminAttendance"}  datafor={'groups'}/>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext="Groups(Dashboard)" addlink="/create-group" />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <CustomDataTable
                                                            title=""
                                                            onViewClick={onViewClick}
                                                            onDeleteClick={onDeleteClick}
                                                            handleApprrovereq=""
                                                            onHistoryClick={handleHistoryClick}
                                                            dashboradApi={'/permission/getGroupList'}   
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