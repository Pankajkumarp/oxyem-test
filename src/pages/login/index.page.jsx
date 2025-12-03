import Link from 'next/link';
import Image from 'next/image'
import Footer from '../Components/Logincomponents/Footer';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head.js';
import Cookies from 'js-cookie';
import { LoginPageContent as enContent, logoContent as logoText, copyRightText as footercr } from '../../common/content_en';
import axios from "axios";
import SecTab from '../Components/Employee/SecTab';
import Qrcode from '../Components/Logincomponents/Qrcode.jsx';
import OTPInput from '../Components/Logincomponents/OTPInput.jsx';
import Navbar from '../Components/Navbar/index.page.jsx';
import LoginButton from "./login-button.jsx";


export default function Login({ loginFormdata1 }) {
	const router = useRouter();
	const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	let footertext = footercr;
	const [showlogin, setshowlogin] = useState(true);
	const [showOTP, setShowOTP] = useState(false);
	const [showQRCode, setShowQRCode] = useState(false);
	const [apiData, setApiData] = useState({});
	const [errorres, setErrorres] = useState('');

	const getleaveoption = async (value) => {
	}
	function waitForCookie(cookieName, timeout = 3000, interval = 100) {
	return new Promise((resolve, reject) => {
		const maxTries = timeout / interval;
		let attempts = 0;

		const check = () => {
			const value = Cookies.get(cookieName);
			if (value) {
				resolve(value);
			} else if (++attempts >= maxTries) {
				reject(new Error('Cookie not set in time.'));
			} else {
				setTimeout(check, interval);
			}
		};

		check();
	});
}

	const getsubmitformdata = async (value) => {
		if (value) {
			let apiresponse = "";
			if (value.feature == "Login") {
				try {
					const response = await axios.post(`${apiUrl}/users/login`, value)
					apiresponse = response.data != "" ? response.data : "";
					setApiData(apiresponse)
				} catch (error) {
					apiresponse = error.response.data


				}
			}
			apiresponse = apiresponse != "" ? apiresponse : value;

			setApiData(apiresponse)
			if (apiresponse.showotp == 1) {
				setshowlogin(false)
				setShowOTP(true)
				setShowQRCode(false)

			} else if (apiresponse.qrimage != "" && apiresponse.qrimage != undefined) {

				setshowlogin(false)
				setShowQRCode(true)
			} else if (apiresponse.accessToken != "" && apiresponse.accessToken != undefined) {
				const refreshTokenName = 'refreshToken';
				const refreshTokenDays = 7;
				const refreshTokenValue = apiresponse.refreshToken;

				const isViewAllName = 'isViewAll';
				const isViewAllDays = 7;
				const isViewAllValue = apiresponse.isViewAll;

				const accessTokenName = 'accessToken';
				const accessTokenMinutes = 20;
				const accessTokenValue = apiresponse.accessToken;

				// Set cookies
				Cookies.set(accessTokenName, accessTokenValue, {
				  secure: true,
				  path: '/',
				  expires: new Date(Date.now() + accessTokenMinutes * 60 * 1000), // 20 minutes
				});

				Cookies.set(refreshTokenName, refreshTokenValue, {
				  secure: true,
				  path: '/',
				  expires: new Date(Date.now() + refreshTokenDays * 24 * 60 * 60 * 1000), // 7 days
				});

				Cookies.set(isViewAllName, isViewAllValue, {
				  secure: true,
				  path: '/',
				  expires: new Date(Date.now() + isViewAllDays * 24 * 60 * 60 * 1000), // 7 days
				});
				// Wait for cookie and redirect
				try {
				  await waitForCookie('accessToken');
				  const target = isViewAllValue ? '/admin/user-list' : '/employeeDashboard';
				  router.push(target); // or router.replace(target)
				} catch (err) {
				  console.error('Access token was not set in time', err);
				}			
			} else {

				setErrorres(apiresponse.message)
				setTimeout(() => {
					setErrorres('');
				}, 10000);
			}
		}

	};
	let AdduserContent = loginFormdata1;

	const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
	const webpath = basepath + 'login'
	const headingContent = "";
	return (
		<>
			<Head>
				<title>Access to Oxyem CRM platform</title>
				<meta name="description" content="Oxyem is a truely designed CRM platform to manage, monitor and process end to end employee management activities." />

				<link rel="canonical" href={webpath} />
			</Head>
			<div className="main-wrapper">
				<div className="login-wrapper auth_page">
					<div className="sk-loginbox">
						{/* <Navbar /> */}
						<div className="sk-log-container">
							<div className="">
								<div className="row">
									

									<div className="col-xl-6 col-lg-6 col-md-12 col-sm-6 p-r d-flex align-items-center justify-content-center" >
									
									<div className="login-right">
									
									          <Link
      href="/home"
      className="text-decoration-none text-dark mb-4 mt-4 d-block small back-home-btn"
    >
      ← Back to Home
    </Link> 
		
		<div className="d-flex align-items-center mb-3">
          
          <div className="auth-header">
  <div className="auth-logo-wrap">
    <div className="auth-logo-icon">
	
	<Image
												src="/assets/img/oxyem-logo.png"
												alt="Logo"
												layout='fill'
												objectFit='contain'
											/>
    </div>
    <div className="logo_text_oxy"><p className="logo_text_oxyem">Oxy<span>em</span></p></div>
  </div>
  <p className="auth-subtitle small">Efficient Workforce and Smarter Management Application</p>
</div>
        </div>
										<div className="login-right-wrap auth_page_form">
											{errorres && <div id="messages-container"><div className="alert alert-danger  mb-4" role="alert">{errorres}</div></div>}
											{showlogin &&
												<>
													<h3 className='auth_page_heading'>Welcome Back!</h3>
													<p className='auth_page_text'> Please login to your account</p>
													<SecTab AdduserContent={AdduserContent} getleaveoption={getleaveoption} headingContent={headingContent} getsubmitformdata={getsubmitformdata} isPageType="withoutToken"/>
													
		
													
													
													<div className="forgotpass">
														<Link href="/passwordreset">Forgot Password?</Link>
													</div>
													<LoginButton />
												</>

											}

											{showQRCode &&
												<div>
													<Qrcode apiData={apiData} getsubmitformdata={getsubmitformdata} />

												</div>
											}
											{showOTP &&
												<div>
													<OTPInput lenth={6} apiData={apiData} getsubmitformdata={getsubmitformdata} />
												</div>
											}
											<p className='diclaimer_log_in'>By logging in, you agree to comply with company policies and data protection regulations. Unauthorized access may lead to disciplinary or legal action.</p>
										</div>
									</div>
								</div>



<div className="col-xl-6 col-lg-6 col-md-12 col-sm-6 login-left" style={{
    
	
	background: 'linear-gradient(135deg, #002E5D, #004D95, #0073E6)',
  }}>
										<div className='oxyem-login-screen-right'>
										
										<div className="auth-feature-section  d-lg-flex align-items-center justify-content-center p-5">
  <div className="auth-feature-content text-white text-center">
    <h2 className="auth-feature-title fw-bold mb-3 text-left">Transform Your Workforce Management</h2>
    <p className="auth-feature-subtext mb-5">
      Join Oxyem to simplify employee management, payroll, and project tracking and many others —all in one powerful platform.
 
    </p>

    <div className="auth-feature-list">
      <div className="auth-feature-item d-flex align-items-start justify-content-start gap-3 mb-4">
        <div className="feature-icon">
          <div className="feature-dot"></div>
        </div>
        <div className="text-start">
          <h4 className="fw-semibold mb-1 text-white">Easy Setup</h4>
          <p className="small mb-0 text-white">Get started in minutes with our intuitive interface</p>
        </div>
      </div>

      <div className="auth-feature-item d-flex align-items-start justify-content-start gap-3 mb-4">
        <div className="feature-icon">
          <div className="feature-dot"></div>
        </div>
        <div className="text-start">
          <h4 className="fw-semibold mb-1 text-white">Powerful Analytics</h4>
          <p className="small mb-0 text-white">Make data-driven decisions with real-time insights</p>
        </div>
      </div>

      <div className="auth-feature-item d-flex align-items-start justify-content-start gap-3">
        <div className="feature-icon">
          <div className="feature-dot"></div>
        </div>
        <div className="text-start">
          <h4 className="fw-semibold mb-1 text-white">24/7 Support</h4>
          <p className="small mb-0 text-white">Our team is always here to help you succeed</p>
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
				</div>
				<Footer footercr={footertext} />
			</div>
		</>
	)
}
export async function getServerSideProps(context) {

	const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	const response = await axios.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "Login" } })
	let loginFormdata1 = response.data.data
	return {
		props: { loginFormdata1 },
	}
}
