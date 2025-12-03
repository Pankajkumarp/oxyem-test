import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SecTabNonemp from '../add-payrollemp/NewFormSecTab.jsx';
import SecTab from '../add-payroll/NewFormSecTab.jsx';
import { axiosJWT } from '../Auth/AddAuthorization';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import { Toaster, toast } from 'react-hot-toast';
import { FaRegClock, FaTimes } from "react-icons/fa";
import { fetchWithToken } from '../Auth/fetchWithToken.jsx';
export default function EditPolicy({ userFormdata, forNonEmpFormdata}) {
  const router = useRouter();
  const headingContent = '';
  const [AdduserContent, setAdduserContent] = useState(userFormdata || forNonEmpFormdata);
    // const [ForNonemp, setForNonemp] = useState(forNonEmpFormdata);

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [showForm, setshowForm] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [fetchedData, setFetchedData] = useState({});
  const [userdetail, setUserdetail] = useState({});
  const [idsalary, setIdSalary] = useState(null);
  const [emptype, setEmpType] = useState(null);

  useEffect(() => {
    const { id } = router.query;
    setIdSalary(id)
    fetchInfo(id)
  }, [router.query.id]);

  const fetchInfo = async (value) => {
    try {
      if (value) {
        const  response = await axiosJWT.get(`${apiUrl}/payroll/getSalaryDtlsForEdit`, {
          params: { idSalary: value },
        });
        if (response) {
          const fetchedData = response.data.data;
          setFetchedData(fetchedData.empType);
const baseFormData = fetchedData.empType !== 'NonEmployee'
          ? userFormdata
          : forNonEmpFormdata;
                  const updatedContent = JSON.parse(JSON.stringify(baseFormData));

                   // console.log(fetchedData.empType);
          // Merge response data into the AdduserContent state
        //  const updatedContent = { ...AdduserContent };

          // Check if fetched data matches fields in the array and update them
          updatedContent.section.forEach((section) => {
            section.Subsection.forEach((subsection) => {
              subsection.fields.forEach((field) => {
                
                if (field.name === 'idEmployee' || field.name === 'applicableFrom') {
                  field.isDisabled = true;  // Add isDisabled attribute
                }

                if (fetchedData[field.name]) {
                  // Update the value of the matching field
                  field.value = fetchedData[field.name];
                }
              });
            });
          });
        setshowForm(true);
          // Update the state with the modified content
          setAdduserContent(updatedContent);
        }
      }
    } catch (error) {

    }
  };
  

  function extractFields(data) {
    const result = {};
    result.isWithoutActualTax = false
    result.idSalary = idsalary

    data.section.forEach(section => {
    section.fields.forEach(field => {
      result[field.name] = field.attributeValue;
    });
    });

 if ('basicSalary' in result && result.basicSalary != null) {
    result.isFor = "Employee";
  } else {
    result.isFor = "NonEmployee";
  }

    if(idsalary !== null && idsalary !== undefined && idsalary !== "") {
        result.isWithoutActualTax = false;
    }
    data.section.forEach(section => {
        section.fields.forEach(field => {
            result[field.name] = field.attributeValue;
        });

        result.deductionOtherAllowance = section.deductionOtherAllowance.map(allowance => ({
            name: allowance.name,
            attributeValue: allowance.attributeValue
        }));

        // Collect otherAllowance as an array
        result.otherAllowance = section.otherAllowance.map(allowance => ({
            name: allowance.name,
            attributeValue: allowance.attributeValue
        }));

    });

    return result;
}

  useEffect(() => {
    if (AdduserContent && AdduserContent.section && AdduserContent.section[0]) {
      // Get current month and year in the format YYYY-MM
      const currentYear = new Date().getFullYear();
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
      const currentMonthYear = `${currentYear}-${currentMonth}`;
      // Check if applicableFrom is empty
      const updatedContent = { ...AdduserContent };
      const section = updatedContent.section[0];
      if (section.Subsection && section.Subsection[0]) {
        const subsection = section.Subsection[0];
        const fields = subsection.fields.map(field => {
          if (field.name === 'applicableFrom' && !field.value) {
            return { ...field, value: currentMonthYear };
          }
          return field;
        });
  
        // Update the content
        subsection.fields = fields;
        setAdduserContent(updatedContent);
        // setshowForm(true);
      }
    }
  }, []);
  

  const getsubmitformdata = async (newArray, value) => {
    const updatedArray = {
        ...newArray,
        section: newArray.section
            .filter(section => section.SectionName !== "Preview") // Exclude Preview section
            .map((section) => {
                section.fields = section.fields.filter((field) => {
                    return field.name !== "deductionOtherAllowance" && field.name !== "otherAllowance";
                });
                return section;
            }),
    };
    // Mapping values
    updatedArray.section = updatedArray.section.map((section) => {
        section.deductionOtherAllowance = value.deductions;
        section.otherAllowance = value.earning;
        return section;
    });
    // Convert section values to arrays
    const result = extractFields(updatedArray);
    // Sending to API
    submitformdata(result);
};


const submitformdata = async (value) => {

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
        const response = await axiosJWT.post(`${apiUrl}/payroll/reCalculateTax`, value);
        const apiresponse = response.data || "";
        if (response) {
            setPreviewData(apiresponse.data);
                      console.log(previewData);

        } else {           
        }
    } catch (error) {
        toast.error('Error connecting to the backend. Please try after Sometime.');
    }
};
  
  const getChangessField = async (value) => {
    const filteredFields = value[0].fields.filter(item => item.name === "idEmployee" || item.name === "applicableFrom");

    const result = {};
    filteredFields.forEach(item => {
        if (item.name === "applicableFrom" && !item.value) {
            const currentYear = new Date().getFullYear();
            const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
            result[item.name] = `${currentYear}-${currentMonth}`;
        } else {
            result[item.name] = item.value && typeof item.value === 'object' ? item.value.value : item.value || "";
        }
    });
    setUserdetail(result)
};

const tdsoveridevalue = async (value) => { submitformdata(value); }

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
                                <Breadcrumbs maintext={"Add Payroll"} />
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        <div className="card flex-fill comman-shadow oxyem-index">
                                            <div className="center-part">
                                                <div className="card-body oxyem-mobile-card-body">
                                                    <div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="oxyem-pay-page">
													                  {/* {errorMessage !== "" ? (<div className="alert alert-danger alert-dismissible fade show" role="alert">{errorMessage}  <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button></div>) : (null)} */}
                                                        {showForm  && AdduserContent ? (
                                                          fetchedData !== 'NonEmployee' ? (

                                                            <SecTab
                                                                AdduserContent={AdduserContent}
                                                                getsubmitformdata={getsubmitformdata}
                                                                getChangessField={getChangessField}
                                                                pagename={"addPayRollNonemp"}
                                                                // tdsAmount={tdsAmount}
                                                                // salaryAmount={salaryAmount}
                                                                previewData={previewData}
                                                                tdsoveridevalue={tdsoveridevalue}
                                                                pageedit={'edit'}
                                                            />
                                                             ) : (
                                                              <SecTabNonemp
      AdduserContent={AdduserContent}
      getsubmitformdata={getsubmitformdata}
      getChangessField={getChangessField}
      pagename={"addPayRollNonemp"}
      previewData={previewData}
      tdsoveridevalue={tdsoveridevalue}
      pageedit={'edit'}
    />
                                                             )
                                                        ) : (null)}
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

            <Toaster
                position="top-right"
                reverseOrder={false}
            />
        </>
  );
}

export async function getServerSideProps(context) {

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      // if (fetchedData !== 'NonEmployee') {
      const userFormdata = await fetchWithToken(
          `${apiUrl}/getDynamicForm`,
          { formType: 'addPayroll' },
          context
        );
      // } else {
        const forNonEmpFormdata = await fetchWithToken(
          `${apiUrl}/getDynamicForm`,
          { formType: 'addPayrollNonEmp' },
          context
        );
     // }
    

    return {
    props: { userFormdata , forNonEmpFormdata},
  }
}


  
