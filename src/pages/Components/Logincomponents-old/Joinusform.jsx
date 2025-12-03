import Link from 'next/link';
import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/router'
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { PayloadProtector } from "@/pages/Auth/PayloadProtector";

export default function Joinusform() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter()
  const [firstname, setFirstName] = useState("");
  const EMAIL_REGX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    email: Yup.string()
      .required('Email is required')
      .matches(EMAIL_REGX, "Invalid email address"),
      // .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(16, 'Password must not exceed 16 characters')
      .matches(
        /^(?=.*[a-z])/,
        " Must Contain One Lowercase Character"
      )
      .matches(
        /^(?=.*[A-Z])/,
        "  Must Contain One Uppercase Character"
      )
      .matches(
        /^(?=.*[0-9])/,
        "  Must Contain One Number Character"
      )
      .matches(
        /^(?=.*[!@#\$%\^&\*])/,
        "  Must Contain  One Special Case Character"
      ),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
	  
	//  dob: Yup.string()
  //   .required('DOB is required')
  //   .test('dob', 'Invalid date of birth', value => {
  //     if (!value) return false;

  //     const currentDate = new Date();
  //     const dobDate = new Date(value);

  //     return dobDate < currentDate;
  //   }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)

  });
  const [errorres, setErrorres] = useState('');
   const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const onSubmit = async (data) => {

    console.log("Execute recaptcha not yet availableaa");

    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    executeRecaptcha("enquiryFormSubmit").then((gReCaptchaToken) => {

      data['gReCaptchaToken']=gReCaptchaToken;
      
    //reset()
    PayloadProtector.post(`${apiUrl}/account`, data)
    .then(response => {
      const data = "An email has been sent to your registered email address for verification. Please verify your email account before login."
      router.push({
        pathname: '/Log-in',	
        query: { data: data },		
      }, '/Log-in');
    })

    .catch(error => {
      const data = error.response.data;
      setErrorres(data.message);
  
      //console.log(data.message)
      setTimeout(() => {
        setErrorres('');
      }, 20000);
    });
    });


  }


  return (
    <>

      <div className="tab-pane" id="Join-us">

        <form onSubmit={handleSubmit(onSubmit)}  >
          {errorres && <div id="messages-container"><div className="alert alert-danger  mb-4" role="alert">{errorres}</div></div>}
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>First Name: <span className="login-danger">*</span></label>
                <input
                  name="firstname"
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}


                  {...register('firstname')}
                  className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
                />
                <div className="invalid-feedback">{errors.firstname?.message}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Last Name: <span className="login-danger">*</span></label>
                <input
                  name="lastname"
                  type="text"
                  {...register('lastname')}
                  className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
                />
                <div className="invalid-feedback">{errors.lastname?.message}</div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Email <span className="login-danger">*</span></label>
            <input
              name="email"
              type="text"
              {...register('email')}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>

          <div className="form-group">
            <label>Password <span className="login-danger">*</span></label>
            <input
              name="password"
              type="password"
              {...register('password')}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </div>

          <div className="form-group">
            <label>Confirm Password <span className="login-danger">*</span></label>
            <input
              name="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''
                }`}
            />
            <div className="invalid-feedback">
              {errors.confirmPassword?.message}
            </div>
          </div>

			<p>By clicking Join, you agree to the Skolrup <Link href="/T&c" rel="noopener noreferrer" target="_blank">Terms and Conditions Policy</Link> and <Link href="/Privacy-policy" rel="noopener noreferrer" target="_blank">Privacy and Cookie Policy.</Link></p>
          <div className="form-group mb-0">
            <button className="btn btn-primary btn-block" type="submit">Join</button>
          </div>

        </form>
      </div>
    </>
  )
}
