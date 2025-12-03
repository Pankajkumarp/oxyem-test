import Link from 'next/link';
import Footer from '../Components/Logincomponents/Footer';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head.js';
import { copyRightText as footercr } from '../../common/content_en';
import Navbar from '../Components/Navbar/index.page.jsx';
import PricingSection from "../Components/Pricing/PricingSection";
import SecTab from '../Components/Employee/SecTab';
import axios from "axios";
// const DynamicForm = dynamic(() => import('../../../Components/CommanForm'), {
// 	ssr: false
// });

export default function signup({ signupform }) {
	let AdduserContent = signupform;
const headingContent = "";

const getsubmitformdata = async (value) => {
		if (value) {
			let apiresponse = "";
			if (value.feature == "Signup") {
				try {
										apiresponse = error.response.data

				} catch (error) {
					apiresponse = error.response.data


				}
			}
			
		}
		}

	


	let footertext = footercr;
	const router = useRouter();
	const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
	const webpath = basepath + 'signup'
	return (
		<>
			<Head>
	<title>Sign Up</title>

				<link rel="canonical" href={webpath} />
			</Head>
		<div className="main-wrapper">
		<div className="content container-fluid g-0">
								<Navbar page={"home"}/>
			
			<div className="card border-0 rounded-0">
				<div className="card-body border-0 rounded-0">
					<div className="container signup-section">
						<div className="row align-items-center">
							{/* <!-- Left Side Text --> */}
							<div className="col-xl-6 col-lg-6 col-md-12 col-sm-6 mb-4 mb-md-0">
								<h2 className="left-text">
          Let us talk your
          company information
          to setup Oxyem
          account
        </h2> </div>
							{/* <!-- Right Side Form --> */}
							<div className="col-xl-6 col-lg-6 col-md-12 col-sm-6">
								<div className="form-box">
									<form>
									<SecTab AdduserContent={AdduserContent}  headingContent={headingContent} getsubmitformdata={getsubmitformdata} />
										
										{/* <div className="row mb-3"> */}
											{/* <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
												<input type="text" className="form-control" placeholder="First Name"> </div>
											<div className="col-lg-6 col-md-6 col-sm-12">
												<input type="text" className="form-control" placeholder="Last Name"> </div>
										</div>
										<div className="mb-3">
											<input type="text" className="form-control" placeholder="Company Name"> </div>
										<div className="mb-3">
											<input type="email" className="form-control" placeholder="Work Email"> </div>
										<div className="mb-3">
											<input type="text" className="form-control" placeholder="Company Size"> </div>
										<div className="mb-3">
											<input type="text" className="form-control" placeholder="Industry Type"> </div>
										<div className="form-check mb-3">
											<input className="form-check-input" type="checkbox" id="terms">
											<label className="form-check-label" for="terms"> I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a> </label>
										</div> */}
										{/* <button type="submit" className="btn btn-custom">Sign Up</button> */}
										{/* <p className="signin-link">Already have an account? <a href="#">Sign In</a></p> */}
										<p className="signin-link">
      Already have an account?{" "}
      <Link href="/signin" className="text-primary">
        Sign In
      </Link>
    </p>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id="freetrial">
							<PricingSection />
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
	const response = await axios.get(`${apiUrl}/getDynamicForm`, { params: { "formType": "Signup" } })
	let signupform = response.data.data
	
	return {
		props: { signupform },
	}
}
