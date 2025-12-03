import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {useRouter} from 'next/router'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import SecTab from '../Components/Employee/SecTab';
import Leavepopup from '../Components/Popup/Leavepmodal';
import {updateFieldValue, getleaveoptionchange,removeFields,updateFieldValuearr,formFieldEditCase } from '../../common/commonFunctions';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';

export default function addleave({leaveFormdata }) {
  const fieldsToRemove =['idEmployee','status'];   
  const buttonsToRemove =['Recall'];   
  leaveFormdata = removeFields(leaveFormdata, fieldsToRemove,buttonsToRemove);
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const [AdduserContent, setAdduserContent] = useState(leaveFormdata)
    const [alert, setAlert] = useState({
      message: '',
      type: '',
      show: false
    });
  
    const showAlert = (errtype, msg) => {
      setAlert({ show: true, type:errtype, message:msg });
    };
    
   // console.log("db",AdduserContent);
    const [updateformfields, setupdateformfields] = useState("") 
    const router = useRouter();
    const { id } = router.query;  
    const [isLoading, setIsLoading] = useState(true);
	const data = router.query.data;  
  const [popupdata, setpopupdata] = useState({});	
 
    const headingContent = "";
    const [isModalOpeninput, setIsModalOpeninput] = useState(false);
   
    const closeModalInputselect = () => {    
        setIsModalOpeninput(false);  
    };
    const getAllEmployee = async() => {
          
      const response =  await axiosJWT.get(`${apiUrl}/employeesList`); 
      const responsedata = response.data.data || "";
      let employeeListarr = responsedata
      const updemplist = employeeListarr.map(item => ({
          label: item.employeeName,
          value: item.idEmployee
      }));
     return updemplist
     
  
}
useEffect(() => {  
  const fetchAndUpdateLeaveData = async () => {
    try {
      const leaveData = await geteditleave();
      const updatedObject = await formFieldEditCase(leaveFormdata, leaveData);
      setAdduserContent(updatedObject); // Update the state with the new form data
    } catch (error) {
      console.error('Error fetching employees or updating form data:', error);
    } finally {
      setIsLoading(false); // Set loading to false after async operations are complete
    }
  };

  fetchAndUpdateLeaveData();      
(async () => {
 try {
   const emplist = await getAllEmployee();
   const updatedObject = await updateFieldValuearr('idEmployee', 'options', emplist, leaveFormdata);
   setAdduserContent(updatedObject); // Update the state with the new form data
 } catch (error) {
   console.error('Error fetching employees or updating form data:', error);
 } finally {
   setIsLoading(false); // Set loading to false after async operations are complete
 }
})();
}, []);

    const geteditleave = async() => {
    try {
     
        const response =  await axiosJWT.get(`${apiUrl}/leave`, {
          params: {
            'idLeave': id
          }
        });  
         
        
      if (response && response.data && response.data.data) {
        const apiFields = response.data.data.formdata[0].section[0].fields;

        // Create a copy of the current form data to merge with API response
        const updatedContent = { ...AdduserContent };

        // Merge API data into the existing form data
        updatedContent.section.forEach((section) => {
          section.Subsection.forEach((subsection) => {
            subsection.fields.forEach((field) => {
              const apiField = apiFields.find((apiField) => apiField.name === field.name);
              if (apiField) {
                // Update the field value with the API's attributeValue
                field.value = apiField.attributeValue;
              }
            });
          });
        });

        // Update the state with the merged data
        setAdduserContent(updatedContent);
      }
      } catch (error) {
       
      }
  }
     
  
  useEffect(() => {
    const fetchAndUpdateLeaveData = async () => {
      try {
        const leaveData = await geteditleave();
        const updatedObject = await formFieldEditCase(leaveFormdata, leaveData);
        setAdduserContent(updatedObject); // Update the state with the new form data
      } catch (error) {
        console.error('Error fetching employees or updating form data:', error);
      } finally {
        setIsLoading(false); // Set loading to false after async operations are complete
      }
    };
  
    fetchAndUpdateLeaveData();
  }, []);
  

      
      
    const getleaveoption = async(getcurrentformdata,getformdata) => {
      console.log("AdduserContent",AdduserContent)
      console.log("getformdata",getformdata)
        const { leaveType } =  await getleaveoptionchange(getcurrentformdata,getformdata)
       let updateformfields = await updateFieldValue(AdduserContent,"leave", "Leave Information","","",getformdata,leaveType)
     setAdduserContent(updateformfields);
    }
	
	const [applyLeave, setApplyLeave] = useState(false);
    const [errorMessage, seterrorMessage] = useState("");
  const [LossOfPayApplicable, setLossOfPayApplicable] = useState('no');
  const getleavedetail = async (getvalue) => {
    setApplyLeave(false)
    seterrorMessage("")
    const payload = {
        "idEmployee": getvalue.idEmployee,
        "fromDate": getvalue.fromDate,
        "toDate": getvalue.toDate,
        "leaveType": getvalue.leaveType
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
            console.log("payload", payload.leaveType)
            console.log("apiresponse.data", apiresponse.data)
            let NumberofDays = apiresponse.data.NumberofDays
            let RemainingLeaves = apiresponse.data.RemainingLeaves
            let gettoDate = apiresponse.data.toDate
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
                                    field.value = gettoDate;
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
            if (apiresponse.data.isDisable === true) {
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
    
    const getsubmitformdata = async(value) => {
        seterrorMessage("")
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (applyLeave) {
            seterrorMessage("Birthday leave already availed")
            return; // Exit the function if applyLeave is true
        }	 
        const modifiedObject = {
            "idLeave": id,          
            ...value
          }
         // console.log("wewe",modifiedObject)
        const response = await axiosJWT.post(`${apiUrl}/leave`, modifiedObject)
     //   console.log("tttt",response)
        const apiresponse = response.data != "" ? response.data :"";  
        
        if(apiresponse.success==true){
            router.push('/leave')
        }else{
          
            const errormessage  = apiresponse.errors
            showAlert('danger', errormessage)	
             setTimeout(() => {
                 showAlert('','');
             }, 10000); 
        }  
       };
       
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
        <Leavepopup isOpen={isModalOpeninput} closeModal={closeModalInputselect} popupdata={popupdata} conformRequest={conformRequest} handleCancel={handleCancel}/>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                                                   {errorMessage !== "" ? (<div className="alert alert-danger alert-dismissible fade show" role="alert">{errorMessage}  <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button></div>) : (null)}
                                                    <SecTab AdduserContent={AdduserContent} headingContent={headingContent} getleavedetail={getleavedetail}  getsubmitformdata={getsubmitformdata}  getleaveoption={getleaveoption} showleave={"yes"}/>
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
export async function getServerSideProps(context) {	
	const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;    
  const leaveFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'addLeave' }, context);
        return {
            props: { leaveFormdata  },
          }
  }

