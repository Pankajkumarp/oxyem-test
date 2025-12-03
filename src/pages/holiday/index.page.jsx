import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Tooltip } from 'react-tooltip';
import CustomDataTable from '../Components/Datatable/tablewithApi.jsx';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import SelectOptionComponent from '../Components/common/SelectComponent/SelectOptionComponent.jsx';
const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate, onView }) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('TODAY')}>Current Month</button>
        <button type="button" onClick={() => onNavigate('PREV')}>Previous Month</button>
        <button type="button" onClick={() => onNavigate('NEXT')}>Next Month</button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onView('month')}>Month</button>
        <button type="button" onClick={() => onView('agenda')}>Upcoming holidays</button>
      </span>
    </div>
  );
};

const Holiday = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('month');
  const [holidays1, setholidays] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("2025-26");
  const fetchInfo = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/holiday`, { params: { isFor: 'year' } });
      if (response.status === 200 && response.data.data) {
        const fetchedData = response.data.data;
        setholidays(fetchedData);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const colorcode = [
    '#FF5733', '#0EBC6B', '#3357FF', '#FFBD33', '#FF33B2',
    '#5733FF', '#F733FF', '#FF6F33', '#33FFB2', '#FF33A6',
    '#7DFF33', '#FF3333', '#33FF6F', '#B233FF', '#33FFC4',
    '#6B33FF'
  ];

  const events = holidays1.map((holiday, index) => ({
    title: holiday.name,
    start: new Date(holiday.date),
    end: new Date(holiday.date),
    allDay: true,
    color: colorcode[index % colorcode.length],
    name: holiday.name,
    date: moment(holiday.date).format('D MMM YYYY'),
    day: moment(holiday.date).format('dddd'),
    type: holiday.type,
    tooltip: `${holiday.name} (${holiday.type}) - ${moment(holiday.date).format('dddd, MMMM D, YYYY')}`,
  }));

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color;
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const onEditClick = (value) => {
    router.push(`/holiday/edit/${value}`);
  };

  const CustomEvent = ({ event }) => (
    <span data-tooltip-id="my-tooltip-datatable_h"
      data-tooltip-html={`
        <div className="tooltip_holiday_m">
          <p> Name: <strong style="color: ${event.color}">${event.name}</strong></p>
          <p>Date: ${event.date}</p>
          <p> Day: ${event.day}</p>
          <p>Type: ${event.type}</p>
        </div>
      `}
    >
      {event.title}
    </span>
  );

  const renderMonthCalendars = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return (
      <div className="year-calendar">
        {months.map((month) => (
          <div key={month} className="month-calendar">
            <h3>{moment().month(month).format('MMMM')}</h3>
            <Calendar
              localizer={localizer}
              events={events.filter(event => moment(event.start).month() === month)}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 300 }}
              // date={new Date(2025, month, 1)}
              date={new Date(new Date().getFullYear(), month, 1)}
              eventPropGetter={eventStyleGetter}
              views={{ month: true, agenda: true }}
              messages={{ agenda: 'Holiday' }}
              components={{
                event: CustomEvent
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  const handleGoalChange = async (value) => {

    setSelectedGoal(value);
    if (value !== null && value !== undefined && value !== "") {
      setSelectedGoal(value.value)
    }
  };



  const [holidayStats, setHolidayStats] = useState({});

  const fetchHolidayStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/holiday/stats` , { params: { isFor: 'year' }});
      const responsedata = response.data.data || {};

      setHolidayStats(responsedata);
    } catch (error) {
      console.error("Error fetching holiday stats:", error);
    }
  };
  useEffect(() => {
    fetchHolidayStats();
  }, []);

  const [searchfilter, setSearchfilter] = useState({});
const [activeStatus, setActiveStatus] = useState(null);
const [activeTableTab, setActiveTableTab] = useState("");

const handleShowDataForStatus = (filterKey) => {
  setActiveTableTab(filterKey);
  setActiveStatus(filterKey);

  if (filterKey === "clr") {
    setSearchfilter({});
    setActiveStatus(null);
  } else {
    let filter = {};

    switch (filterKey) {
      case "Total":
        // Show all holidays
        // filter = {};
        break;

      case "Mandatory":
                      // setSearchfilter({ type: "Mandatory" });

        break;

      case "Optional":
      
              // setSearchfilter({ type: "Optional" });

        break;

      case "Upcoming":
       
              // setSearchfilter({ type: "Upcoming" });

        break;

      default:
        filter = {};
        break;
    }

  }
};


  return (
    <>
      <Head><title>{pageTitles.Holidays}</title></Head>
      <div className="main-wrapper" id="holiday_page">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col">
                    <Breadcrumbs maintext={"Holidays"} addlink={"/holiday/addHoliday"} />
                  </div>
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                            <div className="view-toggle-buttons ms-auto">
                              <div className="card flex-fill comman-shadow oxyem-index  oxyem-main-graph-sec ">
                                <ul className="nav-tabs nav nav-tabs-bottom oxyem-graph-tab ">
                                  <li className={`nav-item ${viewMode === "month" ? 'active' : ''}`}>
                                    <a className="nav-link" onClick={() => setViewMode('month')}>
                                      <div className="skolrup-profile-tab-link">Month View</div>
                                    </a>
                                  </li> 
                                  <li className={`nav-item ${viewMode === "year" ? 'active' : ''}`}>
                                    <a className="nav-link" onClick={() => setViewMode('year')}>
                                      <div className="skolrup-profile-tab-link">Year View</div>
                                    </a>
                                  </li>
                                  <li className={`nav-item ${viewMode === "allHolidays" ? 'active' : ''}`}>
                                    <a className="nav-link" onClick={() => setViewMode('allHolidays')}>
                                      <div className="skolrup-profile-tab-link">Show All Holidays</div>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="col-md-4 ms-auto mt-1 ">
                              <div className="form-group mb-0 mt-1">
                                {viewMode === "allHolidays" ? (

                                  <SelectOptionComponent
                                    label="Financial Year"
                                    name="financialYear"
                                    documentType="financialYear"
                                    onChange={handleGoalChange}

                                  />

                                ) : (
                                  <div />
                                )

                                }
                              </div></div>
                            {viewMode === "allHolidays" ? (

                              <div className="">
                                <div>
                                  {holidayStats && Object.keys(holidayStats)?.length > 0 && (
                                    <div className="oxyem-top-box-design design-only-attendence leave-top-data-main mx-0 row stats-grid">

                                      {/* 🔹 Total Holidays */}
                                      <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                        <div className="stats-info stats-info-cus text-center" onClick={() => handleShowDataForStatus("Total")}>
                                          <img src='/assets/img/holiday.png' alt="total-holidays" />
                                          <div className='ox-colored-box-1'>
                                            <h4 className='all_attendence'>
                                              {holidayStats.totalHolidays}<br />
                                            </h4>
                                          </div>
                                          <div className='ox-box-text'><h6>Total Holidays</h6></div>
                                        </div>
                                      </div>

                                      {/* 🔹 Mandatory Holidays */}
                                      <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                        <div className="stats-info stats-info-cus text-center" onClick={() => handleShowDataForStatus("Mandatory")}>
                                          <img src='/assets/img/mandatory.png' alt="mandatory-holidays" />
                                          <div className='ox-colored-box-2'>
                                            <h4 className='month_attendence'>
                                              {holidayStats.mandatoryHolidays}<br />
                                            </h4>
                                          </div>
                                          <div className='ox-box-text'><h6>Mandatory</h6></div>
                                        </div>
                                      </div>

                                      {/* 🔹 Optional Holidays */}
                                      <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                        <div className="stats-info stats-info-cus text-center" onClick={() => handleShowDataForStatus("Optional")}>
                                          <img src='/assets/img/optional.png' alt="optional-holidays" />
                                          <div className='ox-colored-box-3'>
                                            <h4 className='notsubmit_attendence'>
                                              {holidayStats.optionalHolidays}<br />
                                            </h4>
                                          </div>
                                          <div className='ox-box-text'><h6>Optional</h6></div>
                                        </div>
                                      </div>

                                      {/* 🔹 Upcoming Holidays */}
                                      <div className='col-xl-3 col-lg-6 col-md-6 col-sm-6'>
                                        <div className="stats-info stats-info-cus text-center" >     
                                          <img src='/assets/img/upcoming.png' alt="upcoming-holidays" />
                                          <div className='ox-colored-box-4 '>
                                            <h4 className='week_attendence'>
                                              {holidayStats.upcomingHolidays}
                                            </h4>
                                          </div>
                                          <div className='ox-box-text'><h6>Upcoming</h6></div>
                                        </div>
                                      </div>

                                    </div>
                                  )}


                                </div>
                              </div>

                            ) : (
                              <div />
                            )

                            }

                            {viewMode === 'month' && (
                              <div className='month_cal'>
                                <Calendar
                                  localizer={localizer}
                                  events={events}
                                  startAccessor="start"
                                  endAccessor="end"
                                  style={{ height: 500 }}
                                  eventPropGetter={eventStyleGetter}
                                  views={{ month: true, agenda: true }}
                                  messages={{ agenda: 'Upcoming holidays' }}
                                  components={{
                                    event: CustomEvent,
                                    toolbar: CustomToolbar
                                  }}
                                />
                              </div>
                            )}
                            <div className='year_cal'>
                              {viewMode === 'year' && renderMonthCalendars()}
                            </div>
                             <div className="col-md-6">{activeStatus !== null && (
                                <div className="active-filter-tag">
                                  <span> {typeof activeStatus === "string"
                                    ? activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)
                                    : activeStatus}</span>
                                  <button onClick={() => handleShowDataForStatus('clr')} className="remove-filter-btn">×</button>
                                </div>
                              )}</div>
                            <div className='all_cal'>
                              {viewMode === 'allHolidays' &&
                                <CustomDataTable
                                  title={""}
                                  onEditClick={onEditClick}
                                  filename={"Holidays List"}
                                  showAddButton={true}
                                  dashboradApi={'/holiday'}
                                  ifForvalue={'all'}
                                  year={selectedGoal}
                                />
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <Tooltip id="my-tooltip-datatable_h" place="top" />
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
};

export default Holiday;