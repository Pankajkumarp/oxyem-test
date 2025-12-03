import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {useRouter} from 'next/router'
import React, { useState, useEffect } from 'react';
import axios from "axios";
import Cookies from 'js-cookie';
import Qrcode  from './Qrcode.jsx';
import OTPInput  from './OTPInput.jsx';
import dynamic from 'next/dynamic';
const DynamicForm = dynamic(() => import('../DynamicInput.jsx'), {
  ssr: false
});

export default function Loginform({languageContent,formDataArr}) {
	const router = useRouter()	
	const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL+'/users/login';

	const [showlogin, setshowlogin] = useState(true);
	const [showOTP, setShowOTP] = useState(false);
	const [showQRCode, setShowQRCode] = useState(false);
	const [datamess, setdatamess] = useState();	
	const [apiData, setApiData] = useState({});
	const [errorres, setErrorres] = useState('');
	const gethandleChange = (value) => {
		setApiData(value)
		
		if(value.showotp == 1){			
		   setshowlogin(false)
			setShowOTP(true)
			setShowQRCode(false)
		}else if(value.qrimage != "" && value.qrimage != undefined){
			
		setshowlogin(false)
		setShowQRCode(true)
		}else if(value.accessToken != "" && value.accessToken != undefined){		
			const oneDay = 24 * 60 * 60 * 1000
			const cookieName = 'accessToken';
			const cookieName1 = 'refreshToken';
			const accessToken1 = value.accessToken;
			const refreshToken1 = value.refreshToken;
			Cookies.set(cookieName, accessToken1, { secure: true});
			Cookies.set(cookieName1, refreshToken1, { secure: true});
			const accessToken = Cookies.get('accessToken');
			router.push('/Dashboard');
		}else{
			
			setErrorres(value.message)
			setTimeout(() => {
				setErrorres('');
			}, 10000);
		}
		
	}	
	
  const [errors, setErrors] = useState({});	

	


  return (
<>
	  <h1>{languageContent.formAboveText}</h1>
	  {errorres && <div id="messages-container"><div className="alert alert-danger  mb-4" role="alert">{errorres}</div></div>}
											{/*	{datamess !== undefined && (
												<div id="messages-container ">
													<div className="alert alert-success p-2 mb-4" role="alert">{datamess}</div>
												</div>
											)}
	{verfiysuccess && <div id="messages-container"><div className="alert alert-success  mb-4" role="alert">{verfiysuccess}</div></div>}
	{verfiyerror && <div id="messages-container"><div className="alert alert-danger  mb-4" role="alert">Verification link has expired. <button className="sk-resend-verify-link" onClick={handleClick}>Resend</button></div></div>}
	{verfiyclick && <div id="messages-container"><div className="alert alert-danger  mb-4" role="alert">Your account is not verified, Please click on the link to verify <button className="sk-resend-verify-link sk-resend-verify-link1" onClick={handleClick}>verify</button></div></div>}
	{errornet ? <><Networkerror /></> :<></> }
	{errornetgmail ? <><div id="messages-container"><div className="alert alert-danger  mb-4" role="alert">Email already exist, Choose another account.</div></div></> :<></> }
	{verfiymailsuccess && <div id="messages-container"><div className="alert alert-success  mb-4" role="alert">{verfiymailsuccess}</div></div>}
    <div className="tab-pane show active" id="Log-in">
<Modal isOpen={isModalOpen} closeModal={closeModal}  onSubmit={handleFormSubmit} handlegetmessage={handlegetmessage}/>*/}
		
{showlogin &&
			<>
			 {formDataArr.section.map((section, index) => (
				<div key={index}>
							<DynamicForm fields={section} apiurl ={apiUrl} gethandleChange={gethandleChange} />
							</div>
						))}
						 <div className="">
			 <Link href="/passwordreset">{languageContent.ForgotPassword}</Link> 
          <div className="invalid-feedback">{errors.acceptTerms?.message}</div>
        </div>
                
				</>
				
			}
			
				{showQRCode && 
        <div>			
			<Qrcode apiData = {apiData}   gethandleChange={gethandleChange} />        
         
        </div>
        }        
        {showOTP && 
        <div>
         <OTPInput lenth ={6} apiData = {apiData} gethandleChange={gethandleChange} />
        </div>
        }
	
   
		</>
  )
}
