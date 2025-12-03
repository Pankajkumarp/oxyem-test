import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from "axios";
import Cookies from 'js-cookie';
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Networkerror from '../Errorcomponents/Networkerror.jsx';
{/*import {PayloadProtector} from '../../Auth/PayloadProtector';
import Modal from './../Popup/Verify';
import Googlelogin from './../Uicomponents/Googlelogin';*/}
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Loginform() {
	const router = useRouter()
	const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	const Vtoken = Cookies.get('V-token');
	const Oldpath = Cookies.get('Oldpath');
	const [verfiyerror, Setverfiyerror] = useState();
	const [verfiyclick, Setverfiyclick] = useState();
	const [verfiymailsuccess, Setverfiymailsuccess] = useState();
	const [verfiysuccess, Setverfiysuccess] = useState();
	const [errornet, setErrorNet] = useState(false);
	const [errornetgmail, setErrorNetGmail] = useState(false);
	const [errorres, setErrorres] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [datamess, setdatamess] = useState();


	useEffect(() => {
		setdatamess(router.query.data)

		Cookies.set('previousPath', router.asPath)
	}, [router.asPath])
	if (Vtoken) {
		const fetchData = () => {
			axios.get(`${apiUrl}/verifyaccount`, {
				params: {
					'token': Vtoken,
				}
			})
				.then((response) => {
					setErrorNet(false)
					Setverfiyerror(false)
					Setverfiyclick("")
					Setverfiymailsuccess("")
					setErrorNetGmail(false)
					setErrorres("")
					setdatamess()
					Setverfiysuccess(response.data.message)
					Cookies.remove('V-token');
				})
				.catch((error) => {
					setdatamess()
					console.error("Error fetching data:", error);
					Setverfiyerror(error.response.data.message);

					setTimeout(() => {
						//Setverfiyerror('');
					}, 15000);
					Cookies.remove('V-token');
				});
		};
		fetchData();
	}
	const { executeRecaptcha } = useGoogleReCaptcha();
	const [loading, setLoading] = useState(false);

	const validationSchema = Yup.object().shape({
		email: Yup.string()
			.required('Email is required')
			.email('Email is invalid'),
		password: Yup.string()
			.required('Password is required')
			.min(6, 'Password must be at least 6 characters')
			.max(40, 'Password must not exceed 40 characters'),

		//acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required')
	});

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm({
		resolver: yupResolver(validationSchema)
	});


	const onSubmit = data => {
		setLoading(true);

		if (!executeRecaptcha) {
			console.log("Execute recaptcha not yet available");
			return;
		}


		executeRecaptcha("enquiryFormSubmit").then((gReCaptchaToken) => {
			data['gReCaptchaToken'] = gReCaptchaToken;
			axios.post(`${apiUrl}/signin`, data)

				.then(response => {
					console.log("jo1")
					const oneDay = 24 * 60 * 60 * 1000
					const cookieName = 'accessToken';
					const cookieName1 = 'refreshToken';
					const accessToken1 = response.data.accessToken;
					const refreshToken1 = response.data.refreshToken;
					Cookies.set(cookieName, accessToken1, { secure: true });
					Cookies.set(cookieName1, refreshToken1, { secure: true });
					const accessToken = Cookies.get('accessToken');
					//console.log(accessToken)
					if (Oldpath) {
						router.push(Oldpath);
						Cookies.remove('Oldpath');
					} else {
						router.push('/Dashboard');
					}
				})

				.catch(error => {
					console.log("jo")
					const errormessage = error.response.data.message;

					if (error.code === 'ERR_NETWORK') {
						setErrorNet(true)
						Setverfiyerror("")
						Setverfiyclick("")
						Setverfiymailsuccess("")
						Setverfiysuccess("")
						setErrorNetGmail(false)
						setErrorres("")
						setdatamess()
					}
					else {

						const action = error.response.data.action;
						setLoading(false);
						if (action === "notverify") {
							setdatamess()
							Setverfiyerror("")
							Setverfiymailsuccess("")
							Setverfiysuccess("")
							setErrorNet(false)
							setErrorNetGmail(false)
							setErrorres("")
							Setverfiyclick(errormessage)
						} else {
							setdatamess()
							setErrorres(errormessage);
							Setverfiyerror("")
							Setverfiyclick("")
							Setverfiymailsuccess("")
							Setverfiysuccess("")
							setErrorNet(false)
							setErrorNetGmail(false)
							setTimeout(() => {
								setErrorres('');
							}, 10000);
						}
					}
				});
		});






	};
	const [isModalOpen, setIsModalOpen] = useState(false);
	const closeModal = () => {
		setIsModalOpen(false);
	};
	const handleClick = () => {
		setIsModalOpen(true);
	};
	const handlegetmessage = (value) => {
		Setverfiyerror("")
		Setverfiyclick("")
		Setverfiysuccess("")
		setErrorNet(false)
		setErrorNetGmail(false)
		setErrorres("")
		Setverfiymailsuccess(value);

	};
	const [value, setValue] = useState('');
	const handleFormSubmit = (values) => {

	};
	const errorvalueget = (value) => {
		setErrorNetGmail(true)
		Setverfiyerror("")
		Setverfiyclick("")
		Setverfiymailsuccess("")
		Setverfiysuccess("")
		setErrorNet(false)
		setErrorres("")
	};


	return (
		<>
			{datamess !== undefined && (
				<div id="messages-container ">
					<div className="alert alert-success p-2 mb-4" role="alert">{datamess}</div>
				</div>
			)}
			{verfiysuccess && <div id="messages-container"><div className="alert alert-success  mb-4" role="alert">{verfiysuccess}</div></div>}
			{verfiyerror && <div id="messages-container"><div className="alert alert-danger  mb-4" role="alert">Verification link has expired. <button className="sk-resend-verify-link" onClick={handleClick}>Resend</button></div></div>}
			{verfiyclick && <div id="messages-container"><div className="alert alert-danger  mb-4" role="alert">Your account is not verified, Please click on the link to verify <button className="sk-resend-verify-link sk-resend-verify-link1" onClick={handleClick}>verify</button></div></div>}
			{errornet ? <><Networkerror /></> : <></>}
			{errornetgmail ? <><div id="messages-container"><div className="alert alert-danger  mb-4" role="alert">Email already exist, Choose another account.</div></div></> : <></>}
			{verfiymailsuccess && <div id="messages-container"><div className="alert alert-success  mb-4" role="alert">{verfiymailsuccess}</div></div>}
			<div className="tab-pane show active" id="Log-in">
				{/*<Modal isOpen={isModalOpen} closeModal={closeModal}  onSubmit={handleFormSubmit} handlegetmessage={handlegetmessage}/>*/}
				<form onSubmit={handleSubmit(onSubmit)}>

					{errorres && <div id="messages-container"><div className="alert alert-danger  mb-4" role="alert">{errorres}</div></div>}
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
							type={showPassword ? 'text' : 'password'}
							{...register('password')}
							className={`form-control ${errors.password ? 'is-invalid' : ''}`}
						/>
						<span
							type="button"
							className="sk-profile-pass-views feather-eye toggle-password"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <FaEye /> : <FaEyeSlash />}
						</span>
					</div>


					<div className="forgotpass">
						<div className="remember-me">
							<input
								name="acceptTerms"
								type="checkbox"
								className="form-check-input"
							/>
							<label htmlFor="acceptTerms" className="form-check-label">
								Remember me
							</label>
						</div>
						<Link href="/Forgot-password">Forgot Password?</Link>
						<div className="invalid-feedback">{errors.acceptTerms?.message}</div>
					</div>
					<div className="sk-login-form-button">
						<button type="submit" className="btn btn-primary btn-block" >
							{loading ? (
								<div className="spinner">
									<div className="bounce1"></div>
									<div className="bounce2"></div>
									<div className="bounce3"></div>
								</div>
							) : ('Login'
							)}
						</button>

					</div>
				</form>
			</div>
		</>
	)
}
