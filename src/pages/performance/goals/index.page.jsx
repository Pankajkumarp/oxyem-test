import React, { useEffect, useState } from 'react'
import CustomDataTable from '../../Components/Datatable/tablewithApi.jsx';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { FaPlus } from "react-icons/fa6";
import AddPerformanceGoal from '../../Components/Popup/AddPerformanceGoal';
import { FaAward } from "react-icons/fa";
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import GoalHistroy from '../../Components/Popup/goalHistroy';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
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

  const onDeleteClick = (id) => {
    // console.log(id)
  };
  const [listShow, setIslistShow] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalNameId, setGoalNameId] = useState("");
  const [clickType, setClickType] = useState("");
  const [isStatData, isSetStatData] = useState({});
  const onEditClick = (id) => {
    setGoalNameId(id)
    setClickType("edit")
    setIsModalOpen(true)
  };
  const onViewClick = (id) => {
    setGoalNameId(id)
    setClickType("view")
    setIsModalOpen(true)
  };
  const handleAddGoalName = async () => {
    setGoalNameId("")
    setIsModalOpen(true)
  };
  const handleAddGoalNameClose = async () => {
    setClickType("")
    setIsModalOpen(false)
  };
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const onHistoryClick = (id) => {
    setGoalNameId(id)
    setIsHistoryModalOpen(true)
  };
  const onCloseHistoryClick = (id) => {
    setIsHistoryModalOpen(false)
  };

  const [showGraph, setShowGraph] = useState(false);
  const [goalLevel, setGoalLevel] = useState();
  const [projectGoal, setProjectGoal] = useState();
  const [organizationGoal, setOrganizationGoal] = useState();
  const [goalStatus, setgoalStatus] = useState();
  const fetchStatData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/performance/adminManageGoalsStats`);
      if (response) {
        const goalLevel = response.data.data.goalLevel
        const projectGoal = response.data.data.ProjectGoal
        const organizationGoal = response.data.data.OrganizationGoal
        const goalStatus = response.data.data.goalStatus
        setGoalLevel({
          series: [
            {
              name: "Goal",
              data: goalLevel.data,
            },
          ],
          options: {
            chart: {
              type: "bar",
              height: 350,
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "55%",
                endingShape: "rounded",
                dataLabels: {
                  position: "top",
                },
              },
            },
            colors: ["#26AF48", "#2196F3", "#FA7E12"],
            dataLabels: {
              enabled: false,
            },
            title: {
              text: "",
              align: "left",
            },
            stroke: {
              show: true,
              width: 1,
              colors: ["transparent"],
            },
            xaxis: {
              categories: goalLevel.categories,
            },
            yaxis: {
              title: {
                text: "",
              },
            },
            fill: {
              opacity: 1,
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return "" + val + "";
                },
              },
            },
          },
        });
        setProjectGoal({
          series: projectGoal.data,
          options: {
            chart: {
              width: 450,
              type: 'pie',
            },
            labels: projectGoal.categories,
            colors: ['#26AF48', '#2196F3', '#FA7E12'],
            title: {
              text: '',
              align: 'center'
            },
            legend: {
              position: 'bottom',
            },
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom', 
                },
              },
            }],
          },
        })
        setOrganizationGoal({
          series: organizationGoal.data,
          options: {
            chart: {
              width: 450,
              type: 'pie',
            },
            labels: organizationGoal.categories,
            colors: ['#26AF48', '#2196F3', '#FA7E12'],
            title: {
              text: '',
              align: 'center'
            },
            legend: {
              position: 'bottom',
            },
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom', // Ensure it's also set for smaller screens
                },
              },
            }],
          },
        })
        setgoalStatus({
          series: goalStatus.data,
          options: {
            chart: {
              width: 450,
              type: 'pie',
            },
            labels: goalStatus.categories,
            colors: ['#26AF48', '#FA7E12'],
            title: {
              text: '',
              align: 'center'
            },
            legend: {
              position: 'bottom',
            },
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom', // Ensure it's also set for smaller screens
                },
              },
            }],
          },
        })
        setShowGraph(true)
      }
    } catch (error) {
    }
  };
  useEffect(() => {
    fetchStatData()
  }, []);
  
    const refreshData = async () => {
    setIslistShow(false)
	fetchStatData()
    setTimeout(() => {
      setIslistShow(true);
    }, 500);
  };
  return (
    <>
      <AddPerformanceGoal isOpen={isModalOpen} closeModal={handleAddGoalNameClose} refreshData={refreshData} goalNameId={goalNameId} clickType={clickType} />
	  <GoalHistroy isOpen={isHistoryModalOpen} closeModal={onCloseHistoryClick} goalNameId={goalNameId} />
      <Head>
        <title>Track and Manage Goals at the Organization or Project Level | Performance 360</title>
        <meta name="description" content={"Track and Manage Goals at the Organization or Project Level | Performance 360"} />
      </Head>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="page-header oxyem-custom-breadcrumb">
              <div className="row align-items-center">
                <div className="col-10">
                  <h3 className="page-title">Track and Manage Goals</h3>
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link href="/Dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item active">Track and Manage Goals</li>
                  </ul>
                </div>
                <div className="col-2 text-center">
                  <span className='btn btn-primary breadcrum-btn' onClick={handleAddGoalName}><FaPlus /></span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12 oxyem_perf oxyem_perf_pending">
                <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-main-perform_dashborad performance_head_box">
                  <h3 className='performance_head_text'><FaAward />  Track and Manage Goals</h3>
                  {showGraph ? (
                    <div className="row">
                      <div className="col-lg-3 col-md-12 col-sm-6">
                        <div className='graph-main-box'>
                          <div className='graph-top-head'>
                            <h3>Goal Level</h3>
                          </div>
                          <Chart options={goalLevel.options} series={goalLevel.series} type="bar" height={330} />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-12 col-sm-6">
                        <div className='graph-main-box'>
                          <div className='graph-top-head'>
                            <h3>Organization Goal</h3>
                          </div>
                          <Chart options={organizationGoal.options} series={organizationGoal.series} type="pie" height={330} />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-12 col-sm-6">
                        <div className='graph-main-box'>
                          <div className='graph-top-head'>
                            <h3>Project Goal</h3>
                          </div>
                          <Chart options={projectGoal.options} series={projectGoal.series} type="pie" height={330} />
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-12 col-sm-6">
                        <div className='graph-main-box'>
                          <div className='graph-top-head'>
                            <h3>Goal Status</h3>
                          </div>
                          <Chart options={goalStatus.options} series={goalStatus.series} type="pie" height={330} />
                        </div>
                      </div>
                    </div>
                  ) : (null)}
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
                                onEditClick={onEditClick}
                                onDeleteClick={onDeleteClick}
                                onHistoryClick={onHistoryClick}
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
