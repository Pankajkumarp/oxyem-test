import Link from 'next/link';
import Footer from '../Components/Logincomponents/Footer';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head.js';
import { copyRightText as footercr } from '../../common/content_en';
import Navbar from '../Components/Navbar/index.page.jsx';


export default function aboutus() {
	const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

	let footertext = footercr;
	const router = useRouter();
	const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
	const webpath = basepath + 'aboutus'
	return (
		<>
			<Head>
				<title>Access to Oxyem CRM platform</title>
				<meta name="description" content="Oxyem is a truely designed CRM platform to manage, monitor and process end to end employee management activities." />

				<link rel="canonical" href={webpath} />
			</Head>
			<div className="main-wrapper">
				<div className="about_page">
					<Navbar page={"home"}/>
					<div className="about_page_inner">
						<section className="about-section-bg-img">
							<div className="overlayer-about">
								<div className="container">
									<div className="row align-items-center">
										<div className="col-lg-12 col-xl-12 text-center">
											<h3 className="">About Us</h3>
											<p className="section-subtitle">Empowering Workplaces with Smart Employee Management</p>
											<p className="section-text">At Oxyem, we believe that managing employees should be effortless, efficient, and highly productive. Our advanced employee management system is designed to streamline HR processes, enhance team collaboration, and provide businesses with the tools they need to succeed.</p>
										</div>
									</div>
								</div>
							</div>
						</section>
						<section className="about-section-space">
							<div className="container">
								<div className="row align-items-center">
									<div className="col-md-12 col-lg-6">
										<h3 className="about-Single-section-title">Who We Are</h3>
										<hr className="about_left" />
										<p>Oxyem is a next-generation employee management platform developed by Oxytal, a leading digital agency known for its innovative and technology-driven solutions. We specialize in creating intuitive digital tools that simplify workforce management and improve operational efficiency.</p>
										<p>Know more about Oxytal at <Link target='_blank' href={"https://www.oxytal.com"}>www.oxytal.com</Link></p>
									</div>
									<div className="col-md-12 col-lg-6 text-center">
										<img src="assets/img/about-img4.png" alt="home-image-2" width={"65%"} />
									</div>
								</div>
							</div>
						</section>
						<div className="oxyem_about">
							<div className="container">
								<div className="oxyem_about_tittle_section">
									<h3 className="about-section-title">What We Do</h3>
									<p className="about-section-subtitle">Our platform offers a seamless experience for businesses to manage:</p>
								</div>
								<div className="row">
									<div className="col-lg-6 col-xl-4">
										<div className="about-box-single about-box-center">
											<div className="about-img-box">
												<img src="https://oxytal.s3.eu-west-1.amazonaws.com/Menu/allowance.png" alt="Payroll Management" />
											</div>
											<div className="icon-box-content">
												<h4 className="icon-box-title">Payroll & Compensation</h4>
												<hr />
												<p>Integrated payroll processing for hassle-free salary management.</p>
											</div>
										</div>
									</div>
									<div className="col-lg-6 col-xl-4">
										<div className="about-box-single about-box-center">
											<div className="about-img-box">
												<img src="https://oxytal.s3.eu-west-1.amazonaws.com/Menu/attendance.png" alt="Attendance Management" />
											</div>
											<div className="icon-box-content">
												<h4 className="icon-box-title">Leave & Attendance</h4>
												<hr />
												<p>Automated leave tracking, attendance monitoring, and shift scheduling.</p>
											</div>
										</div>
									</div>
									<div className="col-lg-6 col-xl-4">
										<div className="about-box-single about-box-center">
											<div className="about-img-box">
												<img src="https://oxytal.s3.eu-west-1.amazonaws.com/Menu/shift-management.png" alt="Shift Management" />
											</div>
											<div className="icon-box-content">
												<h4 className="icon-box-title">Employee Lifecycle Management</h4>
												<hr />
												<p>From onboarding to exit, manage employee data efficiently.</p>
											</div>
										</div>
									</div>
									<div className="col-lg-6 col-xl-4">
										<div className="about-box-single about-box-center">
											<div className="about-img-box">
												<img src="https://oxytal.s3.eu-west-1.amazonaws.com/Menu/user.png" alt="Performance Management" />
											</div>
											<div className="icon-box-content">
												<h4 className="icon-box-title">Performance & Productivity</h4>
												<hr />
												<p>Track employee performance and optimize workforce efficiency.</p>
											</div>
										</div>
									</div>
									<div className="col-lg-6 col-xl-4">
										<div className="about-box-single about-box-center">
											<div className="about-img-box">
												<img src="https://oxytal.s3.eu-west-1.amazonaws.com/Menu/report.png" alt="Reporting Management" />
											</div>
											<div className="icon-box-content">
												<h4 className="icon-box-title">Reporting</h4>
												<hr />
												<p>Manage multiple reports to get useful data.</p>
											</div>
										</div>
									</div>
									<div className="col-lg-6 col-xl-4">
										<div className="about-box-single about-box-center">
											<div className="about-img-box">
												<img src="https://oxytal.s3.eu-west-1.amazonaws.com/Menu/policy_mangment.png" alt="Policy Management" />
											</div>
											<div className="icon-box-content">
												<h4 className="icon-box-title">Claim & Policy Management </h4>
												<hr />
												<p>Track and manage employee claims and policies</p>
											</div>
										</div>
									</div>

								</div>
							</div>
						</div>
						<section className="about-section-space about_white">
							<div className="container">
								<div className="row align-items-center">
								<div className="col-md-12 col-lg-6 text-center">
										<img src="assets/img/innovation.webp" alt="home-image-2" width={"85%"} />
									</div>
									<div className="col-md-12 col-lg-6">
										<h3 className="about-Single-section-title">Our Vision</h3>
										<hr className="about_left" />
										<p>To revolutionize the way businesses manage their employees by providing a <b>smart, data-driven, and automation-powered</b> HR platform that enhances productivity and employee satisfaction.</p>
									</div>
									
								</div>
							</div>
						</section>

						<div className="oxyem_about">
							<div className="container">
								<div className="oxyem_about_tittle_section">
									<h3 className="about-section-title">Join the Future of Workforce Management</h3>
									<p className="about-section-subtitle">Experience a smarter way to manage your employees with Oxyem. Visit <Link target='_blank' href={"https://www.oxyem.io"}>www.oxyem.io</Link> to explore our features and transform your HR processes today!</p>
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

