import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import ProjectList from '../Components/List/ProjectListadmin.jsx';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { Toaster, toast } from 'react-hot-toast';

export default function Leaveview({ }) {

    return (
        <>
        <Head><title>{pageTitles.ProjectDashboard}</title></Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext={"Dashboard (Project)"} addlink={"/Projectmanagement"} tooltipcontent={"Add New Project"} />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <ProjectList />
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
			<Toaster
                position="top-right"
                reverseOrder={false}

            />
        </>
    );
}