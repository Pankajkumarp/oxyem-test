import React, { useState, useEffect } from 'react';
import { axiosJWT } from '../Auth/AddAuthorization.jsx';
import { useRouter } from 'next/router';
import CustomDataTable from '../Components/Datatable/tablewithApi.jsx';
import { Toaster, toast } from 'react-hot-toast';
import View from '../Components/Popup/BasketofAllowance';
import Topdata from './topdata.jsx';

export default function DataTable({ empID, section }) {
  const router = useRouter();
  const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
  const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [salaryStructue, setSalaryStructue] = useState([]);
  const [allocationInfo, setallocationInfo] = useState([]);
  const [finaceErrorF, setErrorF] = useState("");
  const [Id, setId] = useState(empID);
  const [loading, setLoading] = useState(true);
  const [Heading, setallocationHeading] = useState("");
  

  const fetchtabledata = async (value) => {
    setErrorF("");
    setLoading(true);
    try {
      let response;
      if (section === "userlist") {
        response = await axiosJWT.get(`${apiUrl}/payroll/getMyBoaHistory`, {
          params: {
            idEmployee: value,
          },
        });
      } else {
        response = await axiosJWT.get(`${apiUrl}/payroll/viewBoa`, {
          params: {
            idBoa: value,
          },
        });
      }
      if (response) {
        const salaryInfoe = response.data.data.salaryInfo;
        const empInfoe = response.data.data.empInfo;
        if (salaryInfoe.length === 0 || empInfoe.length === 0) {
          if (section === "userlist") {
            setErrorF('Finance data is not available');
          }
        }
        setSalaryStructue(response.data.data.salaryInfo);
        setallocationInfo(response.data.data.empInfo);
        setallocationHeading(response.data.data.heading);
        
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (empID !== "") {
        setId(empID);
        await fetchtabledata(empID);
      }
    };
    initialize();
  }, [empID]);

  const onViewClick = (id) => {
    router.push(`/employeeAllowance/${id}`);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isviewId, setIsViewId] = useState("");
  const onHistoryClick = async (id) => {
    setIsViewId(id);
    openDetailpopup();
  };
  const openDetailpopup = async () => {
    setIsModalOpen(true);
  };
  const closeDetailpopup = async () => {
    setIsModalOpen(false);
  };

  let idProps = section === "userlist" ? { empId: Id } : { idBoa: Id };

  return (
    <>
      {loading ? (
        <div></div>
      ) : (
        <>
          {finaceErrorF === "" ? (
            <div className="col-12 col-lg-12 col-xl-12">
              <View isOpen={isModalOpen} closeModal={closeDetailpopup} isviewId={isviewId} section={"employeeLeave"} />
              <div className="row">
                <div className="col-12 col-lg-12 col-xl-12 d-flex">
                  <div className="card flex-fill comman-shadow oxyem-index">
                    <div className="center-part">
                      <div className="card-body oxyem-mobile-card-body">
                        <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                          <Topdata data={salaryStructue} allocationInfo={allocationInfo} Heading={Heading}/>
                        </div>
                      </div>
                    </div>
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
                              <CustomDataTable
                                title={""}
                                pagename={"basketofallow"}
                                onViewClick={onViewClick}
                                onHistoryClick={onHistoryClick}
                                dashboradApi={'/payroll/boaList'}
                                {...idProps}
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
          ) : (
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12 d-flex">
                <div className="card flex-fill comman-shadow oxyem-index">
                  <div className="center-part">
                    <div className="card-body oxyem-mobile-card-body">
                      <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-create-page">
                        {finaceErrorF}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
