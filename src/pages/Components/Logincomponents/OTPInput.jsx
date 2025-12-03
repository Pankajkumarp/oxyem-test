import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { IoIosLock } from "react-icons/io";
import { BsShieldLock } from "react-icons/bs";
const OTPInput = ({ length = 6, apiData, username, getsubmitformdata }) => {
    const apiurl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [otp, setOTP] = useState(Array(length).fill(''));
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const inputRefs = useRef([...Array(length)].map(() => React.createRef()));
    const [getapidata, setGetApiData] = useState(apiData);

    const handleInputChange = (index, value) => {
        // Ensure only one character is entered in each field
        if (value.length > 1) {
            value = value.charAt(0); // Keep only the first character if more than one is entered
        }

        const newOTP = [...otp];
        newOTP[index] = value;
        setOTP(newOTP);

        // Move to the next input field if the current field is filled
        if (value && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }

        // Check if all OTP fields are filled to enable/disable the submit button
        const isAllFilled = newOTP.every(val => val !== '');
        setIsSubmitDisabled(!isAllFilled); 
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && otp[index] === '') {
            // If the field is already empty, move focus to the previous field
            if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.target.value.length >= 1 && event.key !== 'Backspace') {
            event.preventDefault();
        }
    };

    const handleInputPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();
        
        const newOTP = otp.map((_, index) => {
            return index < pastedData.length ? pastedData.charAt(index) : ''; 
        });

        setOTP(newOTP);

        // Check if all fields are filled after paste
        const isAllFilled = newOTP.every(val => val !== '');
        setIsSubmitDisabled(!isAllFilled);
        handleSubmit();
    };

    useEffect(() => {
        const isAllFilled = otp.every(val => val !== '');
        setIsSubmitDisabled(!isAllFilled);
    }, [otp]);

    useEffect(() => {
        const handleEnterKey = (e) => {
            if (e.key === 'Enter') {
                const isAllFilled = otp.every(val => val !== '');
                if (isAllFilled) {
                    handleSubmit(e);
                }
            }
        };
    
        window.addEventListener('keydown', handleEnterKey);
        return () => window.removeEventListener('keydown', handleEnterKey);
    }, [otp]);
    

    const handleSubmit = async (e) => {
        // e.preventDefault();
        if (e && e.preventDefault) e.preventDefault();
        try {
            const numbersString = otp.join("");
            const response = await axios.post(`${apiurl}/users/verifyMFA`, { "userName": getapidata.idUser, "mfaotp": numbersString });
            const apiresponse = response.data || "";
            getsubmitformdata(apiresponse);
            setIsSubmitDisabled(true);
        } catch (error) {
            const errormessage = error.response ? error.response.data : "";
            getsubmitformdata(errormessage);
        }
    };

    return (
        <div className='oxyem_auth_otp'>
            <div className="text-center">
                <div className="lock_icon_oxyem-otp-page">
                   <p className='security-otp-lock'><BsShieldLock className='lock_icon' /></p>
                </div>
                <h4 className='auth_otp_subtext mt-2'>One Time Password (OTP)</h4>
                <p className='auth_otp_text'>Please enter the 6 digit code generated on Google Authenticator</p>
                <form onSubmit={handleSubmit}>
                    <div id="otp" className="inputs d-flex flex-row justify-content-center mt-2">
                        {otp.map((value, index) => (
                            <span key={index}>
                                <input 
                                    className="m-2 text-center form-control rounded inputStyle"
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1} 
                                    id={index}
                                    value={value}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onPaste={handleInputPaste}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onKeyPress={handleKeyPress}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                />
                            </span>
                        ))}
                    </div>
                    <div className="mt-4">
                        <button type="submit" className="validate btn btn-primary btn-block btnotpvalidate" disabled={isSubmitDisabled}>Validate</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPInput;
