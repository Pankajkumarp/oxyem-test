import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SecTab from '../Components/Employee/SecTab';
import Leavepopup from '../Components/Popup/Leavepmodal';
import Apialert from '../Components/Errorcomponents/Apierror'
import { updateFieldValue, getleaveoptionchange, removeFields, updateFieldValuearr } from '../../common/commonFunctions';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { Toaster, toast } from 'react-hot-toast';
import { ImUserCheck } from "react-icons/im";
import { FaRegClock, FaTimes } from "react-icons/fa";
import { fetchWithToken  } from '../Auth/fetchWithToken.jsx';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { FaRegCheckCircle} from "react-icons/fa";
export default function addleave({ leaveFormdata }) {
    
    const fieldsToRemove = ['idEmployee', 'status'];
    const buttonsToRemove = ['Recall'];
    leaveFormdata = removeFields(leaveFormdata, fieldsToRemove, buttonsToRemove);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({
        message: '',
        type: '',
        show: false
    });

    const showAlert = (errtype, msg) => {
        setAlert({ show: true, type: errtype, message: msg });
    };
    const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

    const router = useRouter();
    const data = router.query.data;
    const [AdduserContent, setAdduserContent] = useState(leaveFormdata);

    const [popupdata, setpopupdata] = useState({});
    const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;

    const headingContent = "";
    const [isModalOpeninput, setIsModalOpeninput] = useState(false);

    const closeModalInputselect = () => {
        setIsModalOpeninput(false);
    };
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const getAllEmployee = async () => {

        const response = await axiosJWT.get(`${apiUrl}/employeesList`);
        const responsedata = response.data.data || "";
        let employeeListarr = responsedata
        const updemplist = employeeListarr.map(item => ({
            label: item.employeeName,
            value: item.idEmployee
        }));
        return updemplist


    }
    const getleaveoption = async (getcurrentformdata, getformdata) => {
        //        
        const { leaveType, idEmployee } = await getleaveoptionchange(getcurrentformdata, getformdata)

        let updateformfields = await updateFieldValue(AdduserContent, "leave", "Leave Information", "", "", getformdata, leaveType)
        
        setAdduserContent(updateformfields);
    }
	
	const [applyLeave, setApplyLeave] = useState(false);
    const [errorMessage, seterrorMessage] = useState("");

    const [LossOfPayApplicable, setLossOfPayApplicable] = useState('no');

    const getleavedetail = async (getvalue) => {
		setApplyLeave(false)
        seterrorMessage("")
        const payload ={
            "idEmployee": getvalue.idEmployee,
            "fromDate": getvalue.fromDate,
            "toDate": getvalue.toDate,
            "leaveType": getvalue.leaveType 
        }

        if(payload.fromDate === "" || payload.toDate === "" ){  
            return;
        }
        let leaveType = ""
        let idEmployee = ""
        if (getvalue.leaveType != undefined && typeof getvalue.leaveType === 'object' && getvalue.leaveType !== null && !Array.isArray(getvalue.leaveType)) {
            leaveType = getvalue.leaveType.value
        } else if (getvalue.leaveType !== null && getvalue.leaveType != undefined && typeof getvalue.leaveType === 'string') {
            leaveType = getvalue.leaveType
        }
        if (getvalue.idEmployee != undefined && typeof getvalue.idEmployee === 'object' && getvalue.idEmployee !== null && !Array.isArray(getvalue.idEmployee)) {
            idEmployee = getvalue.idEmployee.value
        } else if (getvalue.idEmployee !== null && getvalue.idEmployee != undefined && typeof getvalue.idEmployee === 'string') {
            idEmployee = getvalue.idEmployee
        }

        try {

            const response = await axiosJWT.post(`${apiUrl}/leave/getNoOfLeaves`, payload)
            const apiresponse = response.data != "" ? response.data : "";

            if (apiresponse.data.status == "ok") {
                
                let NumberofDays = apiresponse.data.NumberofDays
                let RemainingLeaves = apiresponse.data.RemainingLeaves
				let getvtoDate = apiresponse.data.toDate
                //let updateformfields = updateFieldValue(AdduserContent, "leave", "Leave Information", NumberofDays, RemainingLeaves, getvalue, leaveType, idEmployee);
                const mergeData = (data) => {
                    data.section.forEach(section => {
                        section.Subsection.forEach(subsection => {
                            subsection.fields.forEach(field => {
                                if (field.name.trim() === "leaveType") {
                                    field.value = getvalue.leaveType;
                                }
                                if (field.name.trim() === "fromDate") {
                                    field.value = getvalue.fromDate;
                                }
                                if (getvalue.leaveType === "Maternity" || getvalue.leaveType === "Paternity") {
                                    if (field.name.trim() === "toDate") {
                                        field.value = getvtoDate;
                                    }
                                } else {
                                    if (field.name.trim() === "toDate") {
                                        field.value = getvalue.toDate;
                                    }
                                }
                                if (field.name.trim() === "numberofDays") {
                                    field.value = NumberofDays;
                                }
                                if (field.name.trim() === "remaingLeaves") {
                                    field.value = RemainingLeaves;
                                }
                            });
                        });
                    });
                    return data;
                };

                // Merge the data
                const mergedArray = mergeData(leaveFormdata);
                
                setAdduserContent(mergedArray);
            } else if (apiresponse.data.status == "notOk") {
				if(apiresponse.data.isDisable === true){
                    seterrorMessage("Birthday leave already availed")
                    setApplyLeave(true)
                }
                let NumberofDays = apiresponse.data.NumberofDays
                let RemainingLeaves = apiresponse.data.RemainingLeaves != "" ? apiresponse.data.RemainingLeaves : 0;
                let updateformfields = updateFieldValue(AdduserContent, "leave", "Leave Information", NumberofDays, RemainingLeaves, getvalue);
                setAdduserContent(updateformfields);
                setpopupdata(apiresponse.data)
                setIsModalOpeninput(true);
                setLossOfPayApplicable(apiresponse.data.isLossOfPayApplicable);
            }
        } catch (error) {
            const errormessage = error.response.data.message
            showAlert('danger', errormessage)
            setTimeout(() => {
                showAlert('', '');
            }, 10000);
        }

    }

    const [SubmitButtonLoading, setSubmitButtonLoading] = useState(false);
    const getsubmitformdata = async (value) => {
        seterrorMessage("")
        setSubmitButtonLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (applyLeave) {
            seterrorMessage("Birthday leave already availed")
            return; // Exit the function if applyLeave is true
        }
        try {
            const response = await axiosJWT.post(`${apiUrl}/leave`, value)
            const apiresponse = response.data != "" ? response.data : "";
            const message = 'You have successfully <strong>Add </strong> Leave!';
            const errormessage = 'Error connecting to the backend. Please try after Sometime.';
            if (apiresponse.success == true) {
                toast.success(({ id }) => (
                    <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
                        <FaRegCheckCircle style={{
							fontSize: '35px',
							marginRight: '10px',
							color: '#4caf50'
						}} />
                        <span dangerouslySetInnerHTML={{ __html: message }}></span>
                        <button
            onClick={() => toast.dismiss(id)}
            style={{
                background: 'none',
				border: 'none',
				color: '#4caf50',
				marginLeft: 'auto',
				cursor: 'pointer',
				fontSize: '20px',
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
                    router.push('/leave')
                    setSubmitButtonLoading(false);
                

            } else {
                setSubmitButtonLoading(false);
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
                showAlert('danger', apiresponse.errors)
                setTimeout(() => {
                    showAlert('', '');
                }, 10000);
            }
        } catch (error) {
            const errormessage = error.response.data.errors
            showAlert('danger', errormessage)
            setTimeout(() => {
                showAlert('', '');
            }, 10000);
            // Handle network error or other exceptions
        }
    };
    useEffect(() => {
        (async () => {
            try {
                const emplist = await getAllEmployee();
                const mergearraydata = await updateFieldValuearr('idEmployee', 'options', emplist, leaveFormdata);
                setAdduserContent(mergearraydata); // Update the state with the new form data
            } catch (error) {
                
            } finally {
                setIsLoading(false); // Set loading to false after async operations are complete
            }
        })();
    }, []);
	
	const conformRequest = () => {
        closeModalInputselect();
    };
    const handleCancel = () => {
        closeModalInputselect();
        window.location.reload();
    };
	const onClose = async () => {
        seterrorMessage("")
    }
    return (
        <>
        <Head><title>{pageTitles.LeavesApplyLeave}</title></Head>
            <Leavepopup isOpen={isModalOpeninput} closeModal={closeModalInputselect} popupdata={popupdata} conformRequest={conformRequest} handleCancel={handleCancel}/>

            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="col">
                                    <h3 className="page-title">Apply Leaves</h3>
                                    <ul className="breadcrumb">
                                        <li className="breadcrumb-item"><Link href="/">Dashboard</Link></li>
                                        <li className="breadcrumb-item active">Apply Leaves</li>
                                    </ul>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                        <Apialert
                                                            type={alert.type}
                                                            message={alert.message}
                                                            show={alert.show} />
                                                        {errorMessage !== "" ? (<div className="alert alert-danger alert-dismissible fade show" role="alert">{errorMessage}  <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button></div>) : (null)}
                                                        <SecTab AdduserContent={AdduserContent} headingContent={headingContent} getleavedetail={getleavedetail} getsubmitformdata={getsubmitformdata} getleaveoption={getleaveoption} showleave={"yes"} LossOfPayApplicable={LossOfPayApplicable} loaderSubmitButton={SubmitButtonLoading}/>
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
    // const response = await axios.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "addLeave" } })
    const leaveFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'addLeave' }, context);
    // let leaveFormdata = response.data.data
    return {
        props: { leaveFormdata },
    }
}

