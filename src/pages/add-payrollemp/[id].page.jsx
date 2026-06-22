import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbsdiscription';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { Toaster } from 'react-hot-toast';
import PayrollEdit from './PayrollEdit.jsx';
export default function EditPolicy() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [allData, setAllData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    const { id } = router.query;
    if (id) {
      const fetchInfo = async (value) => {
        try {
          if (value) {
            const response = await axiosJWT.get(`${apiUrl}/payroll/getSalaryDtlsForEdit`, {
              params: { idSalary: value },
            });
            if (response) {
              const fetchedData = response.data.data;
              setAllData(fetchedData)
              setShowForm(true)
            }
          }
        } catch (error) {
          console.error(error)
        }
      };
      fetchInfo(id)
    }
  }, [apiUrl, router.query, router.query.id]);

  return (
    <>
      <Head>
        <title>{pageTitles.PayrollAddPayroll}</title>
        <meta name="description" content={pageTitles.PayrollAddPayroll} />
      </Head>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12">
                <Breadcrumbs maintext={"Edit Employee Payroll"} discription={"Generate and manage salary details for an employee for the selected month. Add earnings, allowances, attendance, and deductions to calculate the final net payable amount."} />
                {showForm ? (<PayrollEdit allData={allData} />) : null}
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