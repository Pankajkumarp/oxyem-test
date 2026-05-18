import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Breadcrumbs from "../../../Components/Breadcrumbs/Breadcrumbsdiscription";
import { CLAIM_MANAGEMENT_TEXT } from "../../../../constants/ClaimManagementText";
import ClaimSidebarPanel from "../../ClaimSidebarPanel";

import { Toaster, toast } from 'react-hot-toast';
import { axiosJWT } from "../../../Auth/AddAuthorization";
import { useRouter } from "next/router";
import Head from "next/head";
import pageTitles from "../../../../common/pageTitles";
import FormRenderer from "../../../Components/FormRender/TemplateOne/FormRenderer";
export default function AddAdminClaim() {
  const router = useRouter();
  const [content, setContent] = useState([]);
  const [formShow, setFormShow] = useState(false);

  useEffect(() => {
    fetchForm();
  }, []);

  const fetchForm = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await axiosJWT.get(`${apiUrl}/getDynamicForm`, {
        params: { formType: "createClaimAdmin" },
      });

      if (response.status === 200 && response.data.data) {
        setContent(response.data.data);
        setFormShow(true)
      }
    } catch (error) {
    }
  };

  const [SubmitLoading, setSubmitLoading] = useState(false);
const submitformdata = async (data) => {
  setSubmitLoading(true)
  try {
    const repairInvoiceFiles = data.repairInvoice || [];
    const { repairInvoice, ...formattedData } = data;

    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL + "/claims/manageClaims";
    const response = await axiosJWT.post(apiUrl, formattedData);

    if (response.status === 200) {
      const idClaim = response.data.data.idClaim;
      if (repairInvoiceFiles.length > 0) {
        await handeldocfiles(repairInvoiceFiles, idClaim);
      }
       toast.success(response.data.message);
      setSubmitLoading(false)
      if (formattedData.idEmployee) {
        router.push(`/claim/admin`);
      } else {
        router.push(`/claim`);
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.errors ||
                "Failed to submit the form. Please try again later.");
    } else {
      toast.error("Failed to submit the form. Please try again later.");
    }
  } finally {
    setSubmitLoading(false);
  }
};


const handeldocfiles = async (files, moduleId) => {
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
const handleCancelClick = async () => {
 router.push(`/claim/admin`);
};


  useEffect(() => {
    const mainElement = document.querySelector("body");
    if (mainElement) {
      mainElement.setAttribute("id", "claim-module");
    }
    return () => {
      if (mainElement) {
        mainElement.removeAttribute("id");
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitles.ClaimApplyClaimAdmin}</title>
        <meta name="description" content={pageTitles.ClaimApplyClaimAdmin} />
    </Head>
      <div className="main-wrapper">
        <div className="page-wrapper">
          <div className="content container-fluid">
            <div className="row">
              <div className="col-12 col-lg-12 col-xl-12" id="add-claim-form-page">
                <div className="col-md-12 col-12">
                  <Breadcrumbs
                    maintext={CLAIM_MANAGEMENT_TEXT.ADD_RECORDS.TITLE}
                    discription={CLAIM_MANAGEMENT_TEXT.ADD_RECORDS.SUB_TITLE}
                  />

                </div>
                <div className="row">
                  <div className="col-lg-8 col-xl-8 d-flex">
                    {formShow?(
                    <FormRenderer schema={content} handeSubmit={submitformdata} sumbitStart={SubmitLoading} handleCancelClick={handleCancelClick}/>
                    ):(null)}
                  </div>
                  <div className="col-lg-4 col-xl-4">
                    <div className="card-body card-bg-gray card-body-custom-change">
                      <ClaimSidebarPanel />
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
