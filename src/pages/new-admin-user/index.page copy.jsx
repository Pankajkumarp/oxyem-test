import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbs';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { GoFileSubmodule } from "react-icons/go";
import Select from "react-select";
import Stepper from './Stepper';
import CompanyIdentity from './CompanyIdentity';
import LegalAddress from './LegalAddress';
import AssignModule from "./AssignModule";
import HolidayModule from "./HolidayModule";

const selectStyles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? 'var(--dropdownfocusbordercolor)' : provided.borderColor,
        boxShadow: state.isFocused ? 'var(--dropdownfocusboxshadow)' : provided.boxShadow,
        '&:hover': {
            borderColor: state.isFocused ? 'var(--dropdownfocusbordercolor)' : 'var(--dropdownhoverbordercolor)',
        },
        backgroundColor: state.isFocused ? 'var(--dropdownfocusbgcolor)' : provided.backgroundColor,
    }),
    indicatorSeparator: (provided, state) => ({
        ...provided,
        backgroundColor: 'var(--dropdownhoverbg)',
        fontWeight: 'var(--dropdownfontweight)',
    }),
    option: (provided, state) => ({
        ...provided,
        padding: 'var(--dropdownpadding)',
        cursor: 'var(--dropdowncursorstyle)',
        fontWeight: 'var(--dropdownfontweight)',
        backgroundColor: state.isSelected
            ? 'var(--dropdownselectedbgcolor)'
            : state.isFocused
                ? 'var(--dropdowntransparentcolor)'
                : 'var(--dropdowntransparentcolor)',
        color: state.isSelected ? 'var(--dropdownselectedcolor)' : 'var(--dropdowninheritcolor)',
        ':hover': {
            backgroundColor: 'var(--dropdownhoverbg)',
            color: 'var(--dropdownhovercolor)',
            fontWeight: 'var(--dropdownfontweight)',
        },
    }),
};
export default function createGroup() {
    const [companyLegalName, setCompanyLegalName] = useState("");
    const [brandName, setBrandName] = useState("");
    const [companyLogo, setCompanyLogo] = useState(null);
    const [industry, setIndustry] = useState(null);
    const [companyType, setCompanyType] = useState(null);
    const [incorporationYear, setIncorporationYear] = useState("");
    const [website, setWebsite] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");

    const isCompanyIdentityDone =
        companyLegalName.trim() !== "" &&
        industry !== null && industry !== undefined &&
        companyType !== null && companyType !== undefined &&
        companyLogo !== null && companyLogo !== undefined;


    // Legal info
    const [registeredCountry, setRegisteredCountry] = useState(null);
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [taxId, setTaxId] = useState("");
    const [gstVatEin, setGstVatEin] = useState("");
    const [pan, setPan] = useState("");

    // Registered address
    const [registeredAddress, setRegisteredAddress] = useState("");
    const [stateProvince, setStateProvince] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [additionalAddress, setAdditionalAddress] = useState("");

    // Corporate address
    const [sameAsRegistered, setSameAsRegistered] = useState(true);
    const [corporateAddress, setCorporateAddress] = useState("");
    const [corporateState, setCorporateState] = useState("");
    const [corporateCity, setCorporateCity] = useState("");
    const [corporatePostalCode, setCorporatePostalCode] = useState("");

    const isLegalAddressDone =
        registeredCountry &&
        registrationNumber &&
        registeredAddress &&
        stateProvince &&
        city &&
        postalCode; 
    const [moduleIds, setModuleIds] = useState([]);
    const isAsssignModule = moduleIds.length > 0;

    const [birthdayLeaveEnabled, setBirthdayLeaveEnabled] = useState(false);
const [birthdayLeaveCount, setBirthdayLeaveCount] = useState("");

// Earned Leave
const [earnedLeaveEnabled, setEarnedLeaveEnabled] = useState(false);
const [earnedLeaveCount, setEarnedLeaveCount] = useState("");

// Paid Leave
const [paidLeaveEnabled, setPaidLeaveEnabled] = useState(false);
const [paidLeaveCount, setPaidLeaveCount] = useState("");

// Maternity Leave
const [maternityLeaveEnabled, setMaternityLeaveEnabled] = useState(false);
const [maternityLeaveCount, setMaternityLeaveCount] = useState("");

const isLeaveDone =
        earnedLeaveCount &&
        paidLeaveCount;

    const [groupName, setGroupName] = useState("");
    const [roleIds, setRoleIds] = useState([]);
    const [userIds, setUserIds] = useState([]);

    const [activeTab, setActiveTab] = useState("companyInfo");
    const router = useRouter();
    const [error, setError] = useState("");
    useEffect(() => {
        const mainElement = document.querySelector('body');
        if (mainElement) {
            mainElement.setAttribute('id', 'administrative-module');
        }
        return () => {
            if (mainElement) {
                mainElement.removeAttribute('id');
            }
        };
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;

        if (value.length <= 100) { // Limit to 100 characters
            setGroupName(value);
            if (error) setError(""); // Clear error on typing
        }
    };
    const isGroupNameDone = groupName.trim() !== "";
    const isRoleDone = roleIds.length > 0;
    const isUserDone = userIds.length > 0;
    const isModuleDone = moduleIds.length > 0;
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({
        group: false,
        role: false,
        user: false,
        module: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        const newErrors = {
            group: !isGroupNameDone,
            role: !isRoleDone,
            module: !isModuleDone
        };

        setErrors(newErrors);
        if (Object.values(newErrors).includes(true)) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            return;
        }

        console.log("Group Created:", groupName, roleIds, userIds, moduleIds);
    };
    useEffect(() => {
        if (!submitted) return;
        setErrors(prev => ({ ...prev, group: groupName.trim() === "" }));
    }, [groupName]);

    useEffect(() => {
        if (!submitted) return;
        setErrors(prev => ({ ...prev, role: roleIds.length === 0 }));
    }, [roleIds]);

    useEffect(() => {
        if (!submitted) return;
        setErrors(prev => ({ ...prev, user: userIds.length === 0 }));
    }, [userIds]);

    useEffect(() => {
        if (!submitted) return;
        setErrors(prev => ({ ...prev, module: moduleIds.length === 0 }));
    }, [moduleIds]);
    return (
        <>
            <Head>
                <title>Configure Policies & Info – Admin Dashboard</title>
                <meta name="description" content={"Use the Admin Dashboard to create new user groups, manage roles, and organize access permissions efficiently and securely."} />
            </Head>
            <div className="main-wrapper" id="new-admin-comp">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext="Configure Policies & Info" />
                        <Stepper 
                        isCompanyIdentityDone={isCompanyIdentityDone} 
                        isLegalAddressDone={isLegalAddressDone} 
                        isLeaveDone={isLeaveDone} 
                        isAsssignModule={isAsssignModule} submitted={submitted} errors={errors} />
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <div className="row">
                                    <div className="col-12 col-lg-12 col-xl-12 d-flex">
                                        {activeTab === "companyInfo" ? (
                                            <CompanyIdentity
                                                companyLegalName={companyLegalName}
                                                setCompanyLegalName={setCompanyLegalName}
                                                brandName={brandName}
                                                setBrandName={setBrandName}
                                                incorporationYear={incorporationYear}
                                                setIncorporationYear={setIncorporationYear}
                                                website={website}
                                                setWebsite={setWebsite}
                                                companyDescription={companyDescription}
                                                setCompanyDescription={setCompanyDescription}
                                                industry={industry}
                                                setIndustry={setIndustry}
                                                companyType={companyType}
                                                setCompanyType={setCompanyType}
                                                companyLogo={companyLogo}
                                                setCompanyLogo={setCompanyLogo}
                                                selectStyles={selectStyles}
                                                onNext={(step) => setActiveTab(step)}
                                            />

                                        ) : activeTab === "legalAddress" ? (
                                            <LegalAddress
                                                selectStyles={selectStyles}
                                                registeredCountry={registeredCountry}
                                                setRegisteredCountry={setRegisteredCountry}
                                                registrationNumber={registrationNumber}
                                                setRegistrationNumber={setRegistrationNumber}
                                                taxId={taxId}
                                                setTaxId={setTaxId}
                                                gstVatEin={gstVatEin}
                                                setGstVatEin={setGstVatEin}
                                                pan={pan}
                                                setPan={setPan}
                                                registeredAddress={registeredAddress}
                                                setRegisteredAddress={setRegisteredAddress}
                                                stateProvince={stateProvince}
                                                setStateProvince={setStateProvince}
                                                city={city}
                                                setCity={setCity}
                                                postalCode={postalCode}
                                                setPostalCode={setPostalCode}
                                                additionalAddress={additionalAddress}
                                                setAdditionalAddress={setAdditionalAddress}
                                                sameAsRegistered={sameAsRegistered}
                                                setSameAsRegistered={setSameAsRegistered}
                                                corporateAddress={corporateAddress}
                                                setCorporateAddress={setCorporateAddress}
                                                corporateState={corporateState}
                                                setCorporateState={setCorporateState}
                                                corporateCity={corporateCity}
                                                setCorporateCity={setCorporateCity}
                                                corporatePostalCode={corporatePostalCode}
                                                setCorporatePostalCode={setCorporatePostalCode}
                                                onBack={() => setActiveTab("companyInfo")}
                                                onNext={() => setActiveTab("holidayStructure")}
                                            />
                                        ) : activeTab === "holidayStructure" ? (
                                            <HolidayModule
                                                birthdayLeaveEnabled={birthdayLeaveEnabled}
                                                setBirthdayLeaveEnabled={setBirthdayLeaveEnabled}
                                                birthdayLeaveCount={birthdayLeaveCount}
                                                setBirthdayLeaveCount={setBirthdayLeaveCount}
                                                earnedLeaveEnabled={earnedLeaveEnabled}
                                                setEarnedLeaveEnabled={setEarnedLeaveEnabled}
                                                earnedLeaveCount={earnedLeaveCount}
                                                setEarnedLeaveCount={setEarnedLeaveCount}
                                                paidLeaveEnabled={paidLeaveEnabled}
                                                setPaidLeaveEnabled={setPaidLeaveEnabled}
                                                paidLeaveCount={paidLeaveCount}
                                                setPaidLeaveCount={setPaidLeaveCount}
                                                maternityLeaveEnabled={maternityLeaveEnabled}
                                                setMaternityLeaveEnabled={setMaternityLeaveEnabled}
                                                maternityLeaveCount={maternityLeaveCount}
                                                setMaternityLeaveCount={setMaternityLeaveCount}
                                                onBack={() => setActiveTab("legalAddress")}
                                                onNext={() => setActiveTab("assignModule")}
                                            />
                                        ) : activeTab === "assignModule" ? (
                                            <AssignModule
                                                moduleIds={moduleIds}
                                                setModuleIds={setModuleIds}
                                                onBack={() => setActiveTab("holidayStructure")}
                                                onNext={() => setActiveTab("summary")}
                                            />
                                        ) : activeTab === "summary" ? (
                                            <>krrkk</>
                                        ) : (null)}
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