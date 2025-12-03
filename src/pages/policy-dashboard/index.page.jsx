import React, { useState } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import CustomDataTable from '../Components/Datatable/tablewithApi';
import { useRouter } from 'next/router';
import { ToastNotification, ToastContainer } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import { axiosJWT } from '../Auth/AddAuthorization';
import DeleteModal from '../Components/Popup/PolicyDeleteModal';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
export default function policydashboard() {
  const router = useRouter();
  const [isHistroyId, setIsHistroyId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenInfo, setIsModalInfoOpen] = useState(false);

  const onViewClick = (id) => {
    setIsHistroyId(id);
    setIsModalInfoOpen(true)
  };

  const openDetailpopup = async () => { setIsModalOpen(true); };

  const closeDetailpopup = async () => { setIsModalOpen(false) }

  const closeInfopopup = async () => { setIsModalInfoOpen(false) }

  const onHistoryClick = async (id) => {
    setIsHistroyId(id);
    openDetailpopup();
  };

  const onEditClick = (id) => {
    {
      router.push(`policy-management/${id}`);

    }
  };
  const handleApprrovereq = (id) => { };

  const handleDecommissionreq = async (data) => {
    const formattedData = {
      idAsset: [data.idEmployee] // Set idEmployee in idAsset array
    };

    data.section.forEach(section => {
      section.fields.forEach(field => {
        // Skip radio objects
        if (field.type === 'Radiot&c' || field.type === 'ClaimDoc') { return; }

        if (typeof field.attributeValue === 'object' && 'value' in field.attributeValue) {
          formattedData[field.name] = field.attributeValue.value;
        } else {
          formattedData[field.name] = field.attributeValue;
        }
      });
    });

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/asset/decommissionAsset';
      const response = await axiosJWT.post(apiUrl, formattedData);

      if (response.status === 200) {
        ToastNotification({ message: response.data.message });
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


  const [isPolicyId, setIsPolicyId] = useState("");
  const [isPModalOpen, setPIsModalOpen] = useState(false);

  const onDeleteClick = (id) => {
    setIsPolicyId(id);
    setPIsModalOpen(true)
  };
  const closeDetailpopupRe = (id) => {
    setPIsModalOpen(false)
  };
  const [isDeleted, setIsDeleted] = useState(true);
  const CallDeleteApi = async (data) => {
    setIsDeleted(false)
    const apiUrle = process.env.NEXT_PUBLIC_API_BASE_URL;
        const apiUrl = apiUrle + '/policy/policyDeallocate';
        const response = await axiosJWT.post(apiUrl, data);
        if(response){
          setPIsModalOpen(false)
          setIsDeleted(true)
        }
  };

    

  return (
    <>
    <Head><title>{pageTitles.PolicyDashboard}</title></Head>
    <DeleteModal isOpen={isPModalOpen} closeModal={closeDetailpopupRe} policyid={isPolicyId} CallDeleteApi={CallDeleteApi}/>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <Breadcrumbs maintext={"Policy Dashboard"} addlink={"/policy-management"} />
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                          {isDeleted && (
                            <CustomDataTable
                              title={""}
                              onViewClick={onViewClick}
                              onHistoryClick={onHistoryClick}
                              onEditClick={onEditClick}
                              handleApprrovereq={handleApprrovereq}
                              handleDecommissionreq={handleDecommissionreq}
                              pagename={"addpayroll"}
                              dashboradApi={'/policy/policylist'}
                              onDeleteClick={onDeleteClick}
                            />
                          )}
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
      <ToastContainer />

    </>

  );
}
