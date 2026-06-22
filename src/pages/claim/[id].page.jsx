/* eslint-disable react-hooks/immutability */
import React, { useEffect, useState } from 'react'
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import { axiosJWT } from '../Auth/AddAuthorization';
import { ToastNotification } from '../../pages/Components/EmployeeDashboard/Alert/ToastNotification';
import VerifyClaimPage from './admin/verify-claim';

export default function ClaimId() {
    const router = useRouter();
    const [claimDetails, setClaimDetails] = useState([]);
    const [claimid, setClaimid] = useState('');

    useEffect(() => {
        const { id } = router.query;
        fetchInfo(id);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setClaimid(id)
        fetchclaimAdmin(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.id]);;

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

    const fetchInfo = async (value) => {
        try {
            if (value) {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/claims/claimDetails`, { params: { idClaim: value, isfor: 'self' } });
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

    const handleSubmit = async (value) => {
        try {
            let apiUrl;
            if (value.status === "infoprovided") {
                apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/claims/manageClaims';
            } else {
                if (value.actionFor === "addnlinfo") {
                    apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/claims/manageClaims';
                } else {
                    apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/claims/updateStatus';
                }
            }
            const repairInvoiceFiles = value.documents || [];
            const { ...payload } = value;
            const response = await axiosJWT.post(apiUrl, payload);
            if (response.status === 200) {
                if (value.status === "infoprovided") {
                    const idClaim = claimid
                    handeldocfilesUpdate(repairInvoiceFiles, idClaim)
                }
                ToastNotification({ message: response.data.message });
                router.push(`/claim`);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                const errorMessage = error.response.data.errors || 'Failed to submit the form. Please try again later.';
                ToastNotification({ message: errorMessage });
            } else {
                ToastNotification({ message: 'Failed to submit the form. Please try again later.' });
            }
        }
    };
    const handeldocfilesUpdate = async (files, moduleId) => {
        const apiUrl =
            process.env.NEXT_PUBLIC_API_BASE_URL + "/claims/uploadDocuments";

        const fileData = files.map((file) => ({
            type: "RequirementDocument",
            name: file.name
        }));

        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file); // binary
        });

        formData.append("fileData", JSON.stringify(fileData));
        formData.append("moduleId", moduleId);

        await axiosJWT.post(apiUrl, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    };
    return (
        <div className="main-wrapper">
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <Breadcrumbs maintext={"Verify Claim"} />
                    <VerifyClaimPage claimDetails={claimDetails} claimAdmin={claimAdmin} claimid={claimid} handleSubmit={handleSubmit} isfor={"employee"} />
                </div>
            </div>
        </div>
    )
}
