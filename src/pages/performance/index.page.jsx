import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { Toaster, toast } from 'react-hot-toast';
import Head from 'next/head';
import Rating from 'react-rating';
import { FaRegStar, FaStar, FaTimes, FaAward } from 'react-icons/fa';
import Profile from '../Components/commancomponents/profile';
import Link from 'next/link';
import SecTab from '../Components/Employee/AssetTab.jsx';
import axios from "axios";
import StatusComponent from './StatusInput.jsx';
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";
import StatComponent from '../Components/Performace/StatComponent.jsx';
import authenticatedRequest from '../Auth/authenticatedRequest.jsx';
import { FaRegCheckCircle } from "react-icons/fa";
export default function performanceReview({ }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("active");
    const handleTabClick = (index) => {
        setActiveTab(index); // Update active tab index when a tab is clicked
    };
    const imgUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL
    const [activeTabData, setActiveTabData] = useState([]);
    const fetchActiveTabData = async () => {
        try {

            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/performance/getReviews`)
            if (response) {
                const responseData = response.data.data
                setActiveTabData(responseData)
            }
        } catch (error) {
        }
    };
    const [historicalTabData, setHistoricalTabData] = useState([]);
    const fetchHistoricalTabData = async () => {
        try {

            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.get(`${apiUrl}/performance/getReviews`, {
                params: { isFor: "history" }
            });
            if (response) {
                const responseData = response.data.data
                setHistoricalTabData(responseData)
            }
        } catch (error) {
        }
    };
    useEffect(() => {
        if (activeTab === "historical") {
            fetchHistoricalTabData();
        } else {
            fetchActiveTabData();
        }
    }, [activeTab]);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const handleSearchClick = () => {
        fetchForm();
        if (!isSearchVisible) {
            fetchForm();
        }
        setIsSearchVisible(!isSearchVisible);
    };
    const [AdduserContent, setAdduserContent] = useState();
    const [isFormShow, setisFormShow] = useState(false);
    const fetchForm = async () => {
        try {
            const response = await authenticatedRequest({
                method: 'GET',
                url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/getDynamicForm`,
                params: {
                    formType: 'performanceReview'
                }
            });
            if (response) {
                setAdduserContent(response.data.data)
                setisFormShow(true)
            }
        } catch (error) {
            setError(error.message || 'Failed to fetch options');
        }
    };

    const getsubmitformdata = async (value) => {
        const payload = value.section.reduce((acc, section) => {
            section.fields.forEach(field => {
                acc[field.name] = field.attributeValue;
            });
            return acc;
        }, {});
         if (payload.reviewer && payload.approver && payload.reviewer === payload.approver) {
    toast.error("Reviewer and Approver cannot be the same person.");
    return;  
  }

  const duplicateCycle = activeTabData.some(item => item.cycleRating === payload.cycleRating);
    if (duplicateCycle) {
        toast.error(`A cycle with rating "${payload.cycleRating}" has already been initiated.`);
        return;
    }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await axiosJWT.post(`${apiUrl}/performance/initiateCycle`, payload);
                
            if (response) {
                
                const message = response.data?.errorMessage;
console.log(message)
                setisFormShow(false)
                setIsSearchVisible(false)
                fetchActiveTabData()
                fetchHistoricalTabData()
                    toast.error(message || "Initiate Created successfully.");

                fetchActiveTabData();
                fetchHistoricalTabData();
            } else {
                console.error("Failed to fetch totalCost. Status:", response.status);
                return null;
            }
        } catch (error) {
            console.error("Error fetching totalCost:", error);
            return null; // Return null in case of error
        }
    };
    const getChangesValue = (fieldName, value) => {
        let reviewerId;
        const updatedContent = { ...AdduserContent };
        updatedContent.section = updatedContent.section.map((section) => {
            section.Subsection = section.Subsection.map((subsection) => {
                subsection.fields = subsection.fields.map((field) => {
                    if (fieldName === "reviewer") {
                        reviewerId = value;
                    }
                    if (field.name === fieldName) {
                        return {
                            ...field,
                            value: value
                        };
                    }
                    if (field.name === "approver") {
                        return {
                            ...field,
                            dependentId: reviewerId
                        };
                    }
                    return field;
                });
                return subsection;
            });
            return section;
        });
        setAdduserContent(updatedContent);
    }
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
    const [showButton, setshowButton] = useState(false);
    const initiateCycleBtn = (value) => {
        setshowButton(value)
    }

    return (
        <>
            <Head>
                <title>360° Performance Review | Track & Manage Evaluations</title>
                <meta name="description" content={"360° Performance Review | Track & Manage Evaluations"} />
            </Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">

                        <Breadcrumbs maintext={"Employee Performance Review & Rating"} />
                        <StatComponent initiateCycleBtn={initiateCycleBtn} />
                        <div className="row ">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-perform_dashborad oxyem-main-perform_active_his">
                                    {showButton ? (
                                        <div className="text-end w-100 mt-4 pe-4 box-intiate-btn-section">
                                            <button type="submit" className="btn btn-performance" onClick={handleSearchClick}>Initiate Cycle</button>
                                        </div>
                                    ) : (null)}
                                    <ul className="nav-tabs nav nav-tabs-bottom  oxyem-graph-tab">
                                        <li class={`nav-item ${activeTab === "active" ? 'active' : ''}`}>
                                            <a class={`nav-link`} onClick={() => handleTabClick("active")}>
                                                <div className="skolrup-profile-tab-link">Active</div>
                                            </a>
                                        </li>
                                        <li class={`nav-item ${activeTab === "historical" ? 'active' : ''}`}>
                                            <a class={`nav-link`} onClick={() => handleTabClick("historical")}>
                                                <div className="skolrup-profile-tab-link">Historical</div>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="tab-content">

                                        {activeTab === "active" &&
                                            <div className='tab_section_performance'>
                                                <div className={`performace_search_input ${isSearchVisible ? 'performace_form_visible' : 'performace_form_hide'}`}>
                                                    {isFormShow ? (
                                                        <>
                                                            <div className="text-end w-100 form_btn_status">
                                                                <StatusComponent pagename={"initiate"} value={"8641f749-5601-45c2-bce0-1f34b2e262d2"} />
                                                            </div>
                                                            <SecTab
                                                                AdduserContent={AdduserContent}
                                                                getsubmitformdatahitApi={getsubmitformdata}
                                                                getChangessField={getChangesValue}
                                                                pagename={"addGoalValue"}
                                                            />
                                                        </>
                                                    ) : (null)}
                                                </div>
                                                <div className='row'>
                                                    {activeTabData.map((item) => (
                                                        <div key={item.id} className="col-md-4 col-lg-3">
                                                            <div className="performace_dashborad_box">
															<span class={`finacial_year_box`}>{item.financialYear}</span>
																<span class={`box_status_bar_s oxyem-mark-${item.status}`}>{item.status}</span>
                                                                <div className="performace_dashborad_box_img">
                                                                    <img src="/assets/img/star-comment.png" alt="star-comment" />
                                                                </div>
                                                                <h3 className="main_text_perform">{item.cycleRating}</h3>
                                                                <div className="row bottom_text_per">
                                                                    <div className="col-7 perform_l">
                                                                        <span className="oxyem-custom-table-profile">
                                                                            <Profile
                                                                                name={item.reviewerName}
                                                                                imageurl={`${imgUrl}/${item.profilePicPath}`}
                                                                                size="30"
                                                                                profilelink={`employeeDashboard/${item.reviewer}`}
                                                                            />
                                                                            {item.reviewerName}
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-5 perform_r">
                                                                        <span className="oxyem-perform-date">{item.submissionClosingDate}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="bottom_bt_perform_sec">
                                                                    <Link href={`/performance/${item.idReview}`} className="btn btn-performance">
                                                                        View
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        }
                                        {activeTab === "historical" &&
                                            <div className='tab_section_performance'>
                                                <div className='row'>
                                                    {historicalTabData.map((item) => (
                                                        <div key={item.id} className="col-md-6 col-lg-4">
                                                            <div className="performace_dashborad_box">
															<span class={`finacial_year_box`}>{item.financialYear}</span>
																<span class={`box_status_bar_s oxyem-mark-${item.status}`}>{item.status}</span>
                                                                <div className="performace_dashborad_box_img">
                                                                    <img src="/assets/img/star-comment.png" alt="star-comment" />
                                                                </div>
                                                                <h3 className="main_text_perform">{item.cycleRating}</h3>
                                                                <div className="row bottom_text_per">
                                                                    <div className="col-7 perform_l">
                                                                        <span className="oxyem-custom-table-profile">
                                                                            <Profile
                                                                                name={item.reviewerName}
                                                                                imageurl={`${imgUrl}/${item.profilePicPath}`}
                                                                                size="30"
                                                                                profilelink={`employeeDashboard/${item.reviewer}`}
                                                                            />
                                                                            {item.reviewerName}
                                                                        </span>
                                                                    </div>
                                                                    <div className="col-5 perform_r">
                                                                        <span className="oxyem-perform-date">{item.submissionClosingDate}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="bottom_bt_perform_sec">
                                                                    <Link href={`/performance/${item.idReview}`} className="btn btn-performance">
                                                                        View
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        }
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
