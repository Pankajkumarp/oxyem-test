import React, { useEffect, useState } from 'react'
import CustomDataTable from '../../Components/Datatable/tablewithApi.jsx';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FaPlus } from "react-icons/fa6";
import AddPerformanceGoal from '../../Components/Popup/AddPerformanceGoal';
export default function index() {
    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'performance-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);
    const router = useRouter();
    const onViewClick = (id) => {
        //router.push(`/employeeDashboard/${id}`);
    };
    const onDeleteClick = (id) => {
        // console.log(id)
    };
    const [listShow, setIslistShow] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleAddGoalName = async () => {
        setIsModalOpen(true)
    };
    const handleAddGoalNameClose = async () => {
        setIsModalOpen(false)
    };
    const refreshData = async () => {
        setIslistShow(false)
        setTimeout(() => {
            setIslistShow(true);
        }, 700);
    };
    return (
        <>
            <AddPerformanceGoal isOpen={isModalOpen} closeModal={handleAddGoalNameClose} refreshData={refreshData} />
            <Head><title>Admin - Add New Goal Name</title></Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="page-header oxyem-custom-breadcrumb">
                            <div className="row align-items-center">
                                <div className="col-10">
                                    <h3 className="page-title">Goal Name</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link href="/Dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active">Goal Name</li>
                                    </ul>
                                </div>
                                <div className="col-2 text-center">
                                    <span className='btn btn-primary breadcrum-btn' onClick={handleAddGoalName}><FaPlus /></span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        {listShow ? (
                                                            <CustomDataTable
                                                                title={""}
                                                                onViewClick={onViewClick}
                                                                onDeleteClick={onDeleteClick}
                                                                dashboradApi={'/performance/getGoalNameDetails'}
                                                            />
                                                        ) : (null)}
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
    )
}
