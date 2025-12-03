import React, { useState, useEffect } from 'react';
import SecTab from '../Components/Employee/SecTab';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import { FaEdit } from "react-icons/fa";
import { Toaster, toast } from 'react-hot-toast';
import { FaTimes } from "react-icons/fa";
import moment from 'moment-timezone';
import { fetchWithToken  } from '../Auth/fetchWithToken.jsx';
const getCurrentTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const convertUtcToLocalTime = (utcTime, timeZone) => {
    // Early return for invalid or empty time
    if (!utcTime || utcTime.trim() === "") return "";

    try {
        const today = moment.utc().format('YYYY-MM-DD');  // Get today's date in UTC
        const utcDateTime = `${today}T${utcTime}Z`;  // Combine date and time to form a full date-time string
        const localTime = moment.utc(utcDateTime).tz(timeZone).format('HH:mm:ss');  // Convert to local time

        if (localTime === "Invalid date") return ""; // Return empty string if the date is invalid
        return localTime;
    } catch (error) {
        return ""; // Return empty string in case of any error during conversion
    }
};

export default function Projectallocation({ userFormdata }) {
    const timeZone = getCurrentTimeZone();
    const router = useRouter();
    const headingContent = '';
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [getID, setGetID] = useState("");
    const [AdduserContent, setAdduserContent] = useState(userFormdata);
    const [codeMerge, setCodeMerge] = useState("");
    const [idEmployee, setidEmployee] = useState("");

    const getProjectValue = async (id) => {
        try {
            const response = await axiosJWT.get(`${apiUrl}/attendance`, {
                params: {
                    'idAttendance': id
                }
            });
            if (response) {
                const punchIn = response.data.data.details[0].punchIn;
                const punchOut = response.data.data.details[0].punchOut;
                const punchInLocation = response.data.data.details[0].punchInLocation;
                const punchhours = response.data.data.noOfhrs;
                setidEmployee(response.data.data.idEmployee)
                // Split the punchIn value to separate date and time
                const [apiResponseDate, apiResponseTime] = punchIn.split(' ');
                const [apiResponseDatepunchOut, apiResponseTimepunchOut] = punchOut.split(' ');
                const startT = convertUtcToLocalTime(apiResponseTime, timeZone)
                const mergeData = (data) => {
                    data.section.forEach(section => {
                        section.Subsection.forEach(subsection => {
                            subsection.fields.forEach(field => {
                                if (field.name.trim() === "location") {
                                    field.value = punchInLocation;
                                }
                                if (field.name.trim() === "attendancedate") {
                                    field.value = apiResponseDate;
                                }
                                if (field.name.trim() === "startTime") {
                                    field.value = convertUtcToLocalTime(apiResponseTime, timeZone)
                                }
                                if (field.name.trim() === "endTime") {
                                    field.value = convertUtcToLocalTime(apiResponseTimepunchOut, timeZone)
                                }
                                if (field.name.trim() === "numberOfHrsworked") {
                                    field.value = punchhours;
                                }
                            });
                        });
                    });
                    return data;
                };

                // Merge the data
                const mergedArray = mergeData(userFormdata);
                setAdduserContent(mergedArray);
                setCodeMerge("Merge")
            }
        } catch (error) {
            console.error("Error occurred while fetching project value:", error);
        }
    };

    useEffect(() => {
        const { id } = router.query; // Extract the "id" parameter from the query object
        if (id) {
            setGetID(id);
            getProjectValue(id);
        }
    }, [router.query.id]);

    const handlesubmitApiData = async (value) => {
        const apipayload = {
            "feature": value.feature,
            "idAttendance": getID,
            "idEmployee":idEmployee,
            "mode": "custom",
            "section": value.section
          }
        try {
            const response = await axiosJWT.post(`${apiUrl}/attendance`, apipayload);
            // Handle the response if needed
			const message = `You have successfully <strong>Update</strong> Attendance`;
			const errormessage = 'Error connecting to the backend. Please try after Sometime.';
			if(response){
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
				router.push(`/attendance/admin`);
			}
        } catch (error) {
			toast.success(({ id }) => (
                <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                    <img src='/assets/img/wrong.png' style={{ marginRight: '10px', width: '30px' }} alt='icon' />
                    <span dangerouslySetInnerHTML={{ __html: errormessage }}></span>
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
            // Handle the error if any
            console.error("Error occurred:", error);
        }
    };
  useEffect(() => {
    const mainElement = document.querySelector('body');
    if (mainElement) {
      mainElement.setAttribute('id', 'attendance-module');
    }
    return () => {
      if (mainElement) {
        mainElement.removeAttribute('id');
      }
    };
  }, []);
    return (
        <>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col">
                                        <Breadcrumbs maintext={"Edit Attendance"} />
                                    </div>
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        {codeMerge==="Merge" ?(
                                                        <SecTab
                                                            AdduserContent={AdduserContent}
                                                            headingContent={headingContent}
                                                            handlesubmitApiData={handlesubmitApiData}
                                                            actionid={getID}
                                                            pagename="edit_attendances"
                                                        />
                                                        ):(<></>)}
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

export async function getServerSideProps(context) {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'Edit_Attendance' }, context);
    return {
        props: { userFormdata },
    };
}
