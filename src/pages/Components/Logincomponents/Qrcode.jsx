import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import axios from "axios";
export default function Qrcode({apiData,username,getsubmitformdata}) {
   const apiurl =  process.env.NEXT_PUBLIC_API_BASE_URL
   const [getapidata, setGetApiData] = useState(apiData);
    {/*const handleScanner = async (e) => {
        e.preventDefault();
        const resp = {"showotp":true}
        gethandleChange(resp)
    }*/}

   const handleScanner = async (e) => {
            e.preventDefault();
            try {                  
            const response = await axios.post(`${apiurl}/users/enableMFA`,{"userName":getapidata.idUser,"mfaSecret":apiData.mfaSecret} )
             const apiresponse = response.data != "" ? response.data :"";           
             getsubmitformdata(apiresponse)
        } catch (error) {         
          	
          }
    }

  return (
    <div className="text-center oxyem_auth_scan" >   
    <h2 className=''>Welcome to Oxyem</h2>  
    <span className='auth_scan_subheading'>Scan this image with the Google Authenticator App to configure your device.</span>
			<img src={apiData.qrimage}/>
			  <div className="alert alert-borderless alert-warning" role="alert">
			<div className="pass_list">
                              <h6 className='auth_scan_heading'>Activate the authenticator App</h6>
                                 <h6 className='auth_scan_text'>Steps to Configure QR Code</h6>
																<ul>
                                <li>Download and install the Google Authenticator app from your mobile device's app store</li>
																<li>Setup a new account using the QR code</li>
																<li>Under "Authenticator app," tap Set up.On some devices, under “Authenticator app,” tap Get Started.</li>
																<li>Follow the on-screen steps.</li>
																</ul>
															</div>
														</div>
		
            <form onSubmit={handleScanner}>
       
		
        <div className="sk-login-form-button" style={{ padding: '20px'}}>
			<button type="submit" className="btn btn-primary btn-block" >
            QR Code Scanned</button></div>
		
		
      </form>
	</div>
  )
}
