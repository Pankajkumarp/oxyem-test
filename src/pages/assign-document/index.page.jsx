import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs'
import CustomDataTable from '../Components/Datatable/tablewithApi.jsx';
import Histroy from './history';
import View from './view';
import StautsModal from './stautsModal';
import Head from 'next/head';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';

export default function assignDocument() {
  const router = useRouter();
  const [isDoc, setIsDoc] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onHistoryClick = (id) => {
    setIsDoc(id);
    setIsModalOpen(true);
  };
  const closeDetailpopup = async () => {
    setIsModalOpen(false);
  };
  const [isViewDoc, setIsViewDoc] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const onViewClick = (id) => {
    setIsViewDoc(id);
    setIsViewModalOpen(true);
  };
  const closeViewpopup = async () => {
    setIsViewModalOpen(false);
  };
  const [isProcessDoc, setIsProcessDoc] = useState("");
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const onProcessClick = (id) => {
    setIsProcessDoc(id);
    setIsProcessModalOpen(true);
  };
  const closeProcesspopup = async () => {
    setIsProcessModalOpen(false);
  };
  const [refreshtable, setRefreshtable] = useState("");
  const CallStatusApi = async (value) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await axiosJWT.post(`${apiUrl}/docuSign/update`, value);
    if (response) {
      closeProcesspopup()
      setRefreshtable("refresh");
      setTimeout(() => {
          setRefreshtable("");
      }, 2000);
    }

  };

  useEffect(() => {
    const mainElement = document.querySelector('body');
    if (mainElement) {
      mainElement.setAttribute('id', 'assignDoc-module');
    }
    return () => {
      if (mainElement) {
        mainElement.removeAttribute('id');
      }
    };
  }, []);

  return (
    <>
      <Head><title>Oxyem - Document Assign</title></Head>
      <Histroy isOpen={isModalOpen} closeModal={closeDetailpopup} isDoc={isDoc} />
      <View isOpen={isViewModalOpen} closeModal={closeViewpopup} isDoc={isViewDoc} />
      <StautsModal isOpen={isProcessModalOpen} closeModal={closeProcesspopup} isDoc={isProcessDoc} CallStatusApi={CallStatusApi} />
      <div className="main-wrapper">
        <div className="page-wrapper" id="assignDocument-page">
          <div className="content container-fluid">
            <Breadcrumbs maintext={"Document assign"} />
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <div className="row">
                  <div className="col-12 col-lg-12 col-xl-12 d-flex">
                    <div className="card flex-fill comman-shadow oxyem-index payroll_page_main">
                      <div className="center-part">
                        <div className="card-body oxyem-mobile-card-body">
                          <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                            <CustomDataTable
                              title={""}
                              refreshtable={refreshtable}
                              onViewClick={onViewClick}
                              onHistoryClick={onHistoryClick}
                              onProcessClick={onProcessClick}
                              dashboradApi={'/docuSign/list'}
                              valueFor={'docAssign'}
                            />
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
