import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbs';
import { axiosJWT } from '../../Auth/AddAuthorization';
import { useRouter } from 'next/router';
import VerifyClaimPage from './verify-claim.jsx';
import { ToastNotification, ToastContainer } from '../../../pages/Components/EmployeeDashboard/Alert/ToastNotification';

export default function index() {
    const router = useRouter();
    const [claimDetails, setClaimDetails] = useState([]);
    const [claimid, setCalimId] = useState('');
    useEffect(() => {
        const { id } = router.query;
        fetchInfo(id);
        setCalimId(id);
        fetchclaimAdmin(id)
    }, [router.query.id]);



    const fetchInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/claims/claimDetails`, { params: { idClaim: value, isfor: 'admin' } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;

                    setClaimDetails(fetchedData);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'claim-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);

    const [claimAdmin, setclaimAdmin] = useState({});
    const fetchclaimAdmin = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/claims/getLatest`, { params: { idClaim: value } });
                if (response.status === 200 && response.data.data) {
                    const fetchedData = response.data.data;
                    setclaimAdmin(fetchedData);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleSubmit = async (value) => {   
        try {
            let apiUrl;
            if(value.actionFor === "addnlinfo"){
                apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/claims/manageClaims';
            }else{
                apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/claims/updateStatus';
            }
          const response = await axiosJWT.post(apiUrl, value);
          if (response.status === 200) {
           
            ToastNotification({ message: response.data.message });
            router.push(`/claim/admin`);
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
    return (
        <div className="main-wrapper" id="admin-claim-view-page">
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <Breadcrumbs maintext={"Verify Claim"} />
                    <VerifyClaimPage claimDetails={claimDetails} claimAdmin={claimAdmin} claimid={claimid} handleSubmit={handleSubmit}/>
                </div>
            </div>
        </div>
    )
}