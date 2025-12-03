import Link from 'next/link';
import Footer from '../Components/Logincomponents/Footer';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head.js';
import { copyRightText as footercr } from '../../common/content_en';
import Navbar from '../Components/Navbar/index.page.jsx';
import PricingSection from "../Components/Pricing/PricingSection";


export default function pricing() {

	let footertext = footercr;
	const router = useRouter();
	const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
	const webpath = basepath + 'pricing'
	return (
		<>
			<Head>
	            <title>Pricing</title>

				<link rel="canonical" href={webpath} />
			</Head>
				<div className="main-wrapper">
		<div className="content container-fluid px-0">
								<Navbar page={"home"}/>
			
			<div id="freetrial">
				<div className="card">
					<div className="card-body px-0 py-0">
						<div className="hero-section">
							<div className="hero-content text-left">
								<div className="row">
									<div className="col-xl-7 col-lg-6 col-md-12 col-sm-6">
										<h2 className="section-label">Employee management system</h2>
										<h1 className="hero-title">Manage your global employee data effortlessly</h1>
										<p className="hero-description"> Redefine the employee experience with a streamlined and secure HR software that helps manage your global workforce seamlessly, from adding and maintaining employee records to assisting team members with their daily HR work, all while ensuring compliance. </p>
										<div className="cta-buttons">
											<div className="cta-wrap"> <a href="/signup" className="cta-btn primary">
    Sign up for free trial <span className="arrow">→</span>
  </a> <a href="/" className="cta-btn secondary">
    Request Demo <span className="arrow">→</span>
  </a> </div>
  
										</div>
									</div>
									<div className="col-xl-5 col-lg-6 col-md-12 col-sm-6"><img src="assets/img/18959.png" />
									</div>
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

