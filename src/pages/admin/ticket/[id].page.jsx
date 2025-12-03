import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { axiosJWT } from '../../Auth/AddAuthorization';
import TrackingTicket from '../../Components/TrackingTicket/TrackingTicket';
import TicketComponent from '../../Components/Ticket/ticketdetail';
import TicketHistorySection from '../../Components/Ticket/tickethistory';
import TicketDocuments from '../../Components/Ticket/documentdetails';
import { ToastNotification, ToastContainer } from '../../Components/EmployeeDashboard/Alert/ToastNotification';
import { fetchWithToken } from '../../Auth/fetchWithToken';

const DynamicForm = dynamic(() => import('../../Components/CommanForm'), { ssr: false });
export default function VerifyTicketPage({ userFormdata }) {
  const router = useRouter();


  const handleChangess = () => { };
  const handleApprrovereqTicket = () => { };
  const [ticketDetails, setTicketDetails] = useState([]);
  const [statusTrack, setStatusTrack] = useState('');
  const [content, setContent] = useState(userFormdata);
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
        const response = await axiosJWT.get(`${apiUrl}/ticket/ticketDetails`, { params: { idTicket: value } });
        if (response.status === 200 && response.data.data) {
          const fetchedData = response.data.data;
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

  const submitaddnlinfo = async (value) => {
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
    formattedData2["actionFor"] = "addnlinfo";
    formattedData2["status"] = 'inforeq';
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/ticket/updateStatus';
      const response = await axiosJWT.post(apiUrl, formattedData2);
      if (response.status === 200) {

        ToastNotification({ message: response.data.message });
        router.push(`/admin/ticket`);
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
  const submitonhold = async (value) => {
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
    formattedData2["actionFor"] = "onhold";
    formattedData2["status"] = 'onhold';
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/ticket/updateStatus';
      const response = await axiosJWT.post(apiUrl, formattedData2);
      if (response.status === 200) {

        ToastNotification({ message: response.data.message });
        router.push(`/admin/ticket`);
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

 const submitformdata = async () => {
  const formattedData = {};

 
  content.section.forEach((section) => {
    section.Subsection.forEach((subsection) => {
      subsection.fields.forEach((field) => {
        
        if (typeof field.value === 'object' && field.value !== null && 'value' in field.value) {
          formattedData[field.name] = field.value.value;
        } else {
          formattedData[field.name] = field.value;
        }
      });
    });
  });

 
  formattedData["idTicket"] = [tId];
  formattedData["action"] = formattedData["ticketstatus"]; 

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/ticket/updateStatus';
    const response = await axiosJWT.post(apiUrl, formattedData);

    if (response.status === 200) {
      ToastNotification({ message: response.data.message });
      router.push(`/admin/ticket`);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.errors || 'Failed to submit the form. Please try again later.';
    ToastNotification({ message: errorMessage });
  }
};

  const cancelClickAction = () => {
    router.push(`/admin/ticket`);
  };


  useEffect(() => {
    if (ticketDetails?.status) {
      const allowedStatuses = ["submitted", "inforeq", "onhold",];
      const updatedForm = JSON.parse(JSON.stringify(userFormdata)); // deep clone

      if (!allowedStatuses.includes(ticketDetails.status.toLowerCase())) {
        updatedForm.section.forEach((section) => {
          section.Subsection.forEach((subsec) => {
            // Remove the field(s) with given label(s)
            subsec.fields = subsec.fields.filter(
              (field) => field.label !== "Assign To"
            );
          });
        });
      }

      setContent(updatedForm);
    }
  }, [ticketDetails, userFormdata]);

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

                          {/* {ticketDetails && ticketDetails.verifiedAmount && (
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
                          )} */}

                          {ticketDetails && ticketDetails.status !== 'closed' && (
                            <div className="mt-5">
                              {content && content.section && Array.isArray(content.section) ? (
                                content.section.map((section, index) => (
                                  <DynamicForm
                                    key={index}
                                    fields={section}
                                    submitformdata={submitformdata}
                                    submitaddnlinfo={submitaddnlinfo}
                                    submitonhold={submitonhold}
                                    handleChangeValue={handleChangeValue}
                                    handleChangess={() => handleChangess(index)}
                                    pagename="ticketInfo"
                                    isModule={content.formType}
                                    handleApprrovereqTicket={handleApprrovereqTicket}
                                    cancelClickAction={cancelClickAction}
                                  />
                                ))
                              ) : (
                                <div>No sections available</div>
                              )}
                            </div>
                          )}
                          <TicketHistorySection ticketId={tId} />
                        
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
  const userFormdata = await fetchWithToken(`${apiUrl}/getDynamicForm`, { formType: 'addTicketInfoAdmin' }, context);
  return {
    props: { userFormdata },
  }
}