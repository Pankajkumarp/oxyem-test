import React from 'react'
import Link from 'next/link';
import { RiMapPin2Line } from "react-icons/ri";
import { MdMailOutline, MdAddCall } from "react-icons/md";
import Navbar from '../Components/Navbar/index.page';

export default function home() {
    const currentYear = new Date().getFullYear();
    return (
        <>
        <Navbar page={"home"}/>
            <div className="marketing-banner-area">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12">
                            <div className="marketing-banner-content">
                                <h1 className='mb-4'>Oxyem – Unified Employee Management & CRM Portal</h1>
                                <p>A robust and intuitive platform designed to streamline employee management and enhance customer relationship management.</p>
                                <p>With a user-friendly interface and real-time tracking capabilities, it empowers businesses to drive efficiency and deliver exceptional employee and customer experiences.</p>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <div className="marketing-banner-image">
                                <img src="assets/img/marketing-banner.png" alt="home-image" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="marketing-about-area pb-100">
                <div className="container">
                    <div className="section-title">
                        <h2>Advanced HR Management Solution</h2>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12">
                            <div className="marketing-about-image">
                                <img src="assets/img/about-img4.png" alt="home-image-2" />
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <div className="marketing-about-content">
                                <p>Streamline HR operations with Oxyem, an all-in-one platform for managing payroll, attendance, leave, and shift schedules, designed to boost efficiency and enhance workforce engagement.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="marketing-banner-area">
                <div className="container">
                    <div className="section-title">
                        <h2>Simple and Customizable Solution</h2>
                    </div>
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12">
                            <div className="marketing-banner-content">
                                <p>With easily customizable features to adapt to your organization’s unique needs.</p>
                            </div>
                        </div>

                        <div className="col-lg-6 col-md-12">
                            <div className="marketing-banner-image">
                                <img src="assets/img/about-img2.png" alt="home-image-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="process-area pb-70">
                <div className="container">
                    <div className="section-title">
                        <h2>Empower Your Organization, Inspire Your People</h2>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-process-box">
                                <img src="assets/img/process/process1.png" alt="home-image-4" />
                                <h3>Streamlined Workforce Management</h3>
                                <p>Centralize payroll, attendance, leave, and shift management, enabling smoother operations and reducing administrative overhead.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-process-box">
                                <img src="assets/img/process/process2.png" alt="home-image-5" />
                                <h3>Actionable Insights and Analytics</h3>
                                <p>Leverage powerful analytics to make data-driven decisions, track performance, and identify areas for improvement.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-process-box">
                                <img src="assets/img/process/process3.png" alt="home-image-6" />
                                <h3>Customizable and Scalable Features</h3>
                                <p>Tailor the portal to meet your organization's unique needs and scale seamlessly as your team grows.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-process-box">
                                <img src="assets/img/process/process1.png" alt="home-image-7" />
                                <h3>Seamless Collaboration and Communication</h3>
                                <p>Connect teams effortlessly with integrated communication tools, ensuring alignment and fostering a culture of collaboration.</p>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-process-box">
                                <img src="assets/img/process/process2.png" alt="home-image-8" />
                                <h3>Enhanced Employee Engagement</h3>
                                <p>Foster a positive work culture with self-service tools, transparent processes, and real-time updates that keep employees informed and motivated.</p>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-process-box">
                                <img src="assets/img/process/process3.png" alt="home-image-9" />
                                <h3>Future-Ready Technology</h3>
                                <p>Equip your organization with cutting-edge technology, empowering your workforce to adapt to evolving business demands and drive success.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="footer-area marketing-footer">
                <div className="container">
                    <div className="footer-top">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-xl-4 col-lg-4 col-md-12">
                                <Link href="/" className="logo">
                                    <img src="assets/img/oxyem-logo.png" alt="home-image-10" />
									<span className="footer_logo_tx">Oxyem</span>
                                </Link>
                            </div>

                            <div className="col-xl-8 col-lg-8 col-md-12">
                                <div className="content d-flex justify-content-between align-items-center">
                                    <h3>Have any questions? Contact us, and we’ll be happy to help.</h3>
                                    <Link href="" className="default-btn marketing-color">Contact Us</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-footer-widget">
                                <h3>Get In Touch</h3>
                                <ul className="footer-contact">
                                    <li>
                                        <div className="row">
                                            <div className="col-1"><RiMapPin2Line /></div>
                                            <div className="col-11">Ballydeague, Ballyhooly, Co Cork, Ireland</div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row">
                                            <div className="col-1"><MdMailOutline /></div>
                                            <div className="col-11"><Link href=""><span>info@oxytal.com</span></Link></div>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="row">
                                            <div className="col-1"><MdAddCall /></div>
                                            <div className="col-11"><Link href="tel:353866034988">( 353 ) 86 603 4988</Link></div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-footer-widget pl-4">
                                <h3>Useful Links</h3>
                                <ul className="info-links">
                                    <li><Link href="/login">Log In</Link></li>
                                    <li><Link href="/">Applications</Link></li>
                                    <li><Link href="/">About</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-footer-widget">
                                <h3>Company</h3>
                                <ul className="info-links">
                                    <li><Link href="/Privacy-policy">Privacy Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="single-footer-widget">
                                <h3>Follow us</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="copyright-area">
                    <div className="container">
                        <p>Copyright © {currentYear} Oxytal Limited. All Rights Reserved </p>
                    </div>
                </div>
            </footer>
        </>
    )
}
