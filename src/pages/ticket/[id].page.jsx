import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../Auth/AddAuthorization';
import TrackingTicket from '../Components/TrackingTicket/TrackingTicket';
import TicketComponent from '../Components/Ticket/ticketdetail';
import TicketHistorySection from '../Components/Ticket/tickethistory';
import TicketDocuments from '../Components/Ticket/documentdetails';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { fetchWithToken } from '../Auth/fetchWithToken';

const DynamicForm = dynamic(() => import('../Components/CommanForm'), { ssr: false });
export default function VerifyTicketPage({ userFormdata }) {
  const router = useRouter();
  const handleChangess = () => { };
  const handleApprrovereqTicket = () => { };
  const [ticketDetails, setTicketDetails] = useState([]);
   const [statusTrack, setStatusTrack] = useState(''); 
  const [tId, setTId] = useState('');
  useEffect(() => {
    const { id } = router.query;
    fetchInfo(id);
    setTId(id)
  }, [router.query.id]);

  const fetchInfo = async (value) => {
    try {
      if (value) {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axiosJWT.get(`${apiUrl}/ticket/ticketDetails`, { params: { idTicket: value } });    //, isfor: 'admin'
        if (response.status === 200 && response.data.data) {
          const fetchedData = response.data.data;
          console.log("fetched data", fetchedData)

          setTicketDetails(fetchedData);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setStatusTrack(ticketDetails.status);  
  }, [ticketDetails]); 

  // const [statusName, setStatusName] = useState("");

  // useEffect(() => {
  //   if (!ticketDetails.status) return;

  //   const fetchStatusName = async () => {
  //     try {
  //       const response = await axios.get(`${apiUrl}/dropdowns`, {
  //         params: { id: ticketDetails.status, isFor: "ticket_status" } // backend me filter karega
  //       });
  //       if (response.data?.data?.length > 0) {
  //         setStatusName(response.data.data[0].name); // first result ka name
  //       }
  //     } catch (error) {
  //       console.error("Error fetching status name:", error);
  //     }
  //   };

  //   fetchStatusName();
  // }, [ticketDetails.status]);

  const initialContent = userFormdata
  const [content, setContent] = useState(initialContent);

  const handleChangeValue = (fieldName, value) => {
    const updatedArray = JSON.parse(JSON.stringify(content)); // Create a deep copy of the original array
    for (let i = 0; i < updatedArray.section.length; i++) {
      const section = updatedArray.section[i];
      for (let j = 0; j < section.Subsection.length; j++) {
        const subsection = section.Subsection[j];
        for (let k = 0; k < subsection.fields.length; k++) {
          const field = subsection.fields[k];
          if (field.name === fieldName) {
            updatedArray.section[i].Subsection[j].fields[k].value = value;
            break;
          }
        }
      }
    }
    setContent(updatedArray);
  };

 const submitformdata = async (value) => {
  try {
    const formattedData2 = {};

    // Ticket id
    formattedData2["idTicket"] = [tId];

    // 🔹 If status is "inforeq", take comment + uploadDocument from form
    if (ticketDetails.status === "inforeq") {
      // value me dynamic form se values aa rahi hain
      const additionalInfo = {};
      content.section.forEach((section) => {
        section.Subsection.forEach((subsection) => {
          subsection.fields.forEach((field) => {
            if (field.name === "comment") {
              additionalInfo.comment = field.value || "";
            }
            if (field.name === "uploadDocument") {
              additionalInfo.uploadDocument = field.value || "";
            }
          });
        });
      });

      // backend ko bhejne ke liye merge karo
      formattedData2["comment"] = additionalInfo.comment;
      formattedData2["uploadDocument"] = additionalInfo.uploadDocument;
  formattedData2["actionFor"] = "infoprovided";
  formattedData2["idTicket"] = tId;

    }
   if (ticketDetails.status === "recalled") {
  // sirf actionFor me submitted bhejna hai
  formattedData2["actionFor"] = "submitted";
  formattedData2["idTicket"] = tId;
}

    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL + "/ticket/updateStatus";
    const response = await axiosJWT.post(apiUrl, formattedData2);

    if (response.status === 200) {
      ToastNotification({ message: response.data.message });
      router.push(`/ticket`);
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.errors ||
      "Failed to submit the form. Please try again later.";
    ToastNotification({ message: errorMessage });
  }
};




   const handleApprrovereqClaim = async (buttonType, formData) => {
  const formattedData = {};
      const formattedData2 = {};
      // Convert the data to the required format
      content.section.forEach(section => {
        section.Subsection.forEach(subsection => {
          subsection.fields.forEach(field => {
  
            // Check if the value is an object with a 'value' property
            if (typeof field.value === 'object' && 'value' in field.value) {
              formattedData[field.name] = field.value.value;
            } else {
              formattedData[field.name] = field.value;
            }
          });
        });
      });
  
      // Add additional keys
      formattedData2["idTicket"] = tId;
      formattedData2["actionFor"] = "recalled";
      formattedData2["status"] = 'recalled';
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/ticket/updateStatus';
        const response = await axiosJWT.post(apiUrl, formattedData2);
        if (response.status === 200) {
  
          ToastNotification({ message: response.data.message });
          router.push(`/ticket`);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          const errorMessage = error.response.data.errors || 'Failed to submit the form. Please try again later.';
          ToastNotification({ message: errorMessage });
        } else {
          ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
        }
      }
      };

  const cancelClickAction = () => {
             router.push(`/ticket`);
         };
useEffect(() => {
  if (ticketDetails?.status) {
    const updatedForm = JSON.parse(JSON.stringify(userFormdata)); // deep clone
    const allowedStatusForFields = "inforeq";
    const allowedStatusForRecall = "submitted";

    const statusLower = ticketDetails.status.toLowerCase();

    if (statusLower === "recalled") {
      // Keep only Submit & Cancel buttons, remove all fields
      if (Array.isArray(updatedForm.section)) {
        updatedForm.section.forEach((section) => {
          section.Subsection.forEach((subsec) => {
            subsec.fields = []; // remove all fields
          });

          section.buttons = (section.buttons || []).filter(
            (btn) => ["submit", "cancel"].includes(btn.type?.toLowerCase())
          );
        });
      }
    } 
    else if (statusLower !== allowedStatusForFields) {
      // Hide certain fields if not inforeq
      if (Array.isArray(updatedForm.section)) {
        updatedForm.section.forEach((section) => {
          if (Array.isArray(section.Subsection)) {
            section.Subsection.forEach((subsec) => {
              subsec.fields = (subsec.fields || []).filter(
                (field) =>
                  field.label !== "Additional Info" &&
                  field.label !== "Upload Document"
              );
            });
          }

          // Remove Submit button if not inforeq
          section.buttons = (section.buttons || []).filter(
            (btn) => btn.type?.toLowerCase() !== "submit"
          );

          // Remove Recall button if not submitted
          if (statusLower !== allowedStatusForRecall) {
            section.buttons = section.buttons.filter(
              (btn) => btn.label?.toLowerCase() !== "recall"
            );
          }
        });
      }
    } 
    else {
      // Inforeq case, still check recall button visibility
      updatedForm.section.forEach((section) => {
        if (statusLower !== allowedStatusForRecall) {
          section.buttons = (section.buttons || []).filter(
            (btn) => btn.label?.toLowerCase() !== "recall"
          );
        }
      });
    }

    setContent(updatedForm);
  }
}, [userFormdata, ticketDetails]);


  return (
    <div className="main-wrapper">
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs maintext="Verify Ticket" />
          <div className="row">
            <div className="col-12">
              <div className="card flex-fill comman-shadow oxyem-index">
                <div className="center-part">
                  <div className="card-body card-oxyem-ticket-card">
                    <div className="card border" id="sk-ticket-page">
                      <div className="container mt-0">
                        <TrackingTicket ticketDetails={statusTrack} />

                        <div className="mt-5">
                          <TicketComponent ticketDetails={ticketDetails} />

                          <div className="row">

                            <TicketDocuments documents={ticketDetails.Uploadfile} ticketDetails={ticketDetails} />


                          </div>

                          <div className="row">
                            <div className="col-md-12 mt-4">
                              <p className="ticket-detail-doc-page-title" style={{ marginBottom: 0 }}>
                                <strong>Remarks :-</strong>
                              </p>
                              <ul className="personal-info-header-right ticket-detail-doc-page top-details">
                                <li>
                                  <div className="text remark">{ticketDetails?.remarks}</div>
                                </li>
                              </ul>
                            </div>
                          </div>

                          {ticketDetails && ticketDetails.verifiedAmount && (
                            <div className="row">
                              <div className="col-md-12 mt-4">
                                <ul className="personal-info-header-right top-details">
                                  <li>
                                    <div className="title">Verified Amount</div>
                                    <div className="text">
                                      {ticketDetails?.currsymbol} {ticketDetails?.verifiedAmount}
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          )}

                          {ticketDetails && ticketDetails.status !== 'completed' && (
                            <div className="mt-5">
                              {content && content.section && Array.isArray(content.section) ? (
                                content.section.map((section, index) => (
                                  <DynamicForm
                                    key={index}
                                    fields={section}
                                    submitformdata={submitformdata}
                                    handleChangeValue={handleChangeValue}
                                    handleChangess={() => handleChangess(index)}
                                    pagename="ticketInfo"
                                    isModule={content.formType}
                                    handleApprrovereqTicket={handleApprrovereqTicket}
                                    handleApprrovereqClaim={handleApprrovereqClaim}
                                    cancelClickAction={cancelClickAction}
                                  />
                                ))
                              ) : (
                                <div>No sections available</div>
                              )}
                            </div>
                          )}
                          <TicketHistorySection ticketId={tId} />

                          {/* <TicketHistory actionDetails={ticketDetails?.actionDetails} /> */}
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
      <ToastContainer />
    </div>
  );
}

export async function getServerSideProps(context) {

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'addTicketInfo' }, context);
  return {
    props: { userFormdata },
  }
}