import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RiMapPin2Line } from "react-icons/ri";
import { MdMailOutline, MdAddCall } from "react-icons/md";
import { CgLogIn } from "react-icons/cg";
import { IoMenu, IoCloseSharp } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

export default function privacypolicy() {
    const [menuOpen, setMenuOpen] = useState(false);

    async function handleOpenMenu() {
        setMenuOpen(prevState => !prevState);  // Toggle the state value
    }

    const [activeMenu, setActiveMenu] = useState(null);

    // Function to toggle the submenu (set the active menu)
    const handleToggleMenu = (menu) => {
        // If the clicked menu is already active, close it, otherwise open it
        setActiveMenu(activeMenu === menu ? null : menu);
    };
 

   const [isSticky, setIsSticky] = useState(false); // To handle sticky state
    const [lastScroll, setLastScroll] = useState(0); // To track last scroll position

    useEffect(() => {
        // Function to handle scroll event
        const handleScroll = () => {
            const currentScroll = window.scrollY; // Get current scroll position

            // If the scroll position is greater than 50px and scrolling down
            if (currentScroll > 50) {
                if (currentScroll > lastScroll) { // Scrolling down
                    setIsSticky(true); // Add sticky class
                } else { // Scrolling up
                    setIsSticky(false); // Remove sticky class
                }
            } else {
                setIsSticky(false); // Remove sticky class when near top
            }

            setLastScroll(currentScroll); // Update the last scroll position
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener when the component is unmounted
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScroll]);
    return (
        <>
            <div className={`navbar-area marketing-color ${isSticky ? 'is-sticky' : ''}`}>
                <div className="noke-responsive-nav">
                    <div className="container">
                        <div className="noke-responsive-menu">
                            <div className="logo">
                                <Link href="/"><img src="assets/img/oxyem-logo.png" alt="logo" /><span className='res_logo_text'>Oxyem</span></Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="noke-nav">
                    <div className="container-fluid">
                        <nav className="navbar navbar-expand-md navbar-light">
                            <Link className="navbar-brand" href="/"><img src="assets/img/oxyem-logo.png" alt="logo" /><span>Oxyem</span></Link>

                            <div className="collapse navbar-collapse mean-menu">
                                <ul className="navbar-nav">
                                    <li className="nav-item megamenu">
                                        <Link href="" className="nav-link active">Applications <IoIosArrowDown /></Link>
                                        <ul className="dropdown-menu">
                                            <li className="nav-item">
                                                <div className="row">
                                                    <div className="col-md-4 pb_oxyem">
                                                        <h6 className="submenu-title"><Link href="">Human Resources</Link></h6>

                                                        <ul className="megamenu-submenu">
                                                            <li>Employee Onboarding</li>
                                                            <li>Employee Management</li>
                                                            <li>Leave Management</li>
                                                            <li>Claim Management</li>
                                                            <li>Attendance Management</li>
                                                            <li>Shift Management</li>
                                                            <li>Employee Offboarding</li>
                                                            <li>Career Management</li>
                                                        </ul>
                                                    </div>

                                                    <div className="col-md-4 pb_oxyem">
                                                        <h6 className="submenu-title"><Link href="">Payroll</Link></h6>

                                                        <ul className="megamenu-submenu">
                                                            <li>Basket of Allowance</li>
                                                            <li>Payroll</li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-md-4 pb_oxyem">
                                                        <h6 className="submenu-title"><Link href="">Finance</Link></h6>

                                                        <ul className="megamenu-submenu">
                                                            <li>Invoicing</li>
                                                            <li>CRM</li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-md-4 pb_oxyem">
                                                        <h6 className="submenu-title"><Link href="">Reportings</Link></h6>

                                                        <ul className="megamenu-submenu">
                                                            <li>Dashboard</li>
                                                            <li>Reports</li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-md-4 pb_oxyem">
                                                        <h6 className="submenu-title"><Link href="">Enagagement & Feedbacks</Link></h6>

                                                        <ul className="megamenu-submenu">
                                                            <li>Automation Ideas</li>
                                                            <li>Employee Feedback</li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-md-4 pb_oxyem">
                                                        <h6 className="submenu-title"><Link href="">Services</Link></h6>

                                                        <ul className="megamenu-submenu">
                                                            <li>Policy Management</li>
                                                            <li>Timesheet Management</li>
                                                            <li>Project Management</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </li>

                                    <li className="nav-item">
                                        <Link href="" className=" nav-link">About Us</Link>
                                    </li>

                                </ul>

                                <div className="others-option d-flex align-items-center">

                                    <div className="option-item">
                                        <div className="social-links">
                                            <Link className="log_text_btn" href="/login"><CgLogIn /> Log In</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
                <div className="others-option-for-responsive">
                    <div className="container">
                        <div className="dot-menu">
                            <Link className="log_text_btn" href="/login"><CgLogIn /> Log In</Link>
                            <span className='menu_bar_ic' onClick={handleOpenMenu}>
                                {menuOpen ? (
                                    <IoCloseSharp />
                                ) : (
                                    <IoMenu />
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={menuOpen ? 'responsive-nav-box-open' : 'responsive-nav-box-close'}>
                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#Applications" aria-expanded="false" aria-controls="collapseOne">
                                    Applications
                                </button>
                            </h2>
                            <div id="Applications" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <div className="row">
                                        <div className="pb_oxyem">
                                            <h6 className="submenu-title" onClick={() => handleToggleMenu('humanResources')}>
                                                <Link href="">Human Resources</Link>
                                                {activeMenu === 'humanResources' ? (
                                                    <IoIosArrowUp />
                                                ) : (
                                                    <IoIosArrowDown />
                                                )}
                                            </h6>
                                            {activeMenu === 'humanResources' && (
                                                <ul className="megamenu-submenu">
                                                    <li>Employee Onboarding</li>
                                                    <li>Employee Management</li>
                                                    <li>Leave Management</li>
                                                    <li>Claim Management</li>
                                                    <li>Attendance Management</li>
                                                    <li>Shift Management</li>
                                                    <li>Employee Offboarding</li>
                                                    <li>Career Management</li>
                                                </ul>
                                            )}
                                        </div>

                                        <div className="pb_oxyem">
                                            <h6 className="submenu-title" onClick={() => handleToggleMenu('payroll')}>
                                                <Link href="">Payroll</Link>
                                                {activeMenu === 'payroll' ? (
                                                    <IoIosArrowUp />
                                                ) : (
                                                    <IoIosArrowDown />
                                                )}
                                            </h6>
                                            {activeMenu === 'payroll' && (
                                                <ul className="megamenu-submenu">
                                                    <li>Basket of Allowance</li>
                                                    <li>Payroll</li>
                                                </ul>
                                            )}
                                        </div>

                                        <div className="pb_oxyem">
                                            <h6 className="submenu-title" onClick={() => handleToggleMenu('finance')}>
                                                <Link href="">Finance</Link>
                                                {activeMenu === 'finance' ? (
                                                    <IoIosArrowUp />
                                                ) : (
                                                    <IoIosArrowDown />
                                                )}
                                            </h6>
                                            {activeMenu === 'finance' && (
                                                <ul className="megamenu-submenu">
                                                    <li>Invoicing</li>
                                                    <li>CRM</li>
                                                </ul>
                                            )}
                                        </div>

                                        <div className="pb_oxyem">
                                            <h6 className="submenu-title" onClick={() => handleToggleMenu('reportings')}>
                                                <Link href="">Reportings</Link>
                                                {activeMenu === 'reportings' ? (
                                                    <IoIosArrowUp />
                                                ) : (
                                                    <IoIosArrowDown />
                                                )}
                                            </h6>
                                            {activeMenu === 'reportings' && (
                                                <ul className="megamenu-submenu">
                                                    <li>Dashboard</li>
                                                    <li>Reports</li>
                                                </ul>
                                            )}
                                        </div>

                                        <div className="pb_oxyem">
                                            <h6 className="submenu-title" onClick={() => handleToggleMenu('engagementFeedback')}>
                                                <Link href="">Engagement & Feedbacks</Link>
                                                {activeMenu === 'engagementFeedback' ? (
                                                    <IoIosArrowUp />
                                                ) : (
                                                    <IoIosArrowDown />
                                                )}
                                            </h6>
                                            {activeMenu === 'engagementFeedback' && (
                                                <ul className="megamenu-submenu">
                                                    <li>Automation Ideas</li>
                                                    <li>Employee Feedback</li>
                                                </ul>
                                            )}
                                        </div>

                                        <div className="pb_oxyem">
                                            <h6 className="submenu-title" onClick={() => handleToggleMenu('services')}>
                                                <Link href="">Services</Link>
                                                {activeMenu === 'services' ? (
                                                    <IoIosArrowUp />
                                                ) : (
                                                    <IoIosArrowDown />
                                                )}
                                            </h6>
                                            {activeMenu === 'services' && (
                                                <ul className="megamenu-submenu">
                                                    <li>Policy Management</li>
                                                    <li>Timesheet Management</li>
                                                    <li>Project Management</li>
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                                <button className="accordion-button hide_icon_menu_r collapsed" type="button" data-bs-toggle="collapse" data-bs-target="" aria-expanded="false" aria-controls="collapseTwo">
                                    About Us
                                </button>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="privacy-policy-area ptb-100">
                <div className="container">
                    <div className="section-title">
                        <h1>Privacy and Cookie Notice</h1>
                    </div>

                    <div className="privacy-policy-content">
                        <h3>Information We Collect</h3>
                        <p>At Oxytal, we are committed to protecting your privacy and ensuring the security of your personal information.</p>
                        <p>This Privacy Policy is intended to inform you about our policies and practices regarding the collection, use, and disclosure of any personal information and usage data that you submit to us or that we collect through our Service.</p>
                        <h4 className='mt-5'>Information You Provide:</h4>
                        <p>We may collect personal information such as your name, email address and phone number when you voluntarily provide it to us through forms on our website such as Contact Us or Career page or during communication with our team.</p>
                        <h4 className='mt-5'>Information We Automatically Collect:</h4>
                        <p>When you use our Service, we may collect certain information automatically,
                        including:</p>
                        <p className='mb-5'><strong>1.</strong> Device information (e.g., IP address, device type, browser type).<br />
                            <strong>2.</strong> Usage data (e.g., pages visited, features used, interaction with content).<br />
                        </p>
                        <h3 className='mt-5'>How We Use Your Information:</h3>
                        <p>We may use the collected information for the following purposes.</p>
                        <ul className='mb-5'>
                            <li className='mb-2'>To provide and improve our Service.</li>
                            <li className='mb-2'>To personalize your experience.</li>
                            <li className='mb-2'>To communicate with you, respond to inquiries, and send service-related information.</li>
                            <li className='mb-2'>To analyze usage patterns and perform research and analytics.</li>
                            <li className='mb-2'>To ensure compliance with applicable laws and regulations.</li>
                        </ul>
                        <h3 className='mt-5'>Cookie Usage</h3>
                        <p>We use cookies and similar tracking technologies to enhance your browsing experience and collect information about how you use our website. Cookies are small files stored on your device that track your online activity.</p>
                        <h4 className='mt-5'>Types of Cookies:</h4>
                        <h4 className='mt-5'>Essential Cookies:</h4>
                        <p>These cookies are necessary for the proper functioning of our Service. They enable you to access secure areas and perform essential functions.</p>
                        <h4 className='mt-5'>Analytics Cookies:</h4>
                        <p>We use these cookies to understand how users interact with our Service, improve its performance, and analyze usage data.</p>
                        <h4 className='mt-5'>Advertising Cookies:</h4>
                        <p>We or third parties may use these cookies to show you relevant advertisements based on your interests.</p>
                        <p className='mt-5'>By using our website, you consent to the use of cookies in accordance with this Notice. You can manage your cookie preferences through your browser settings.</p>
                        <h3 className='mt-5'>Data Sharing, Security and Your Rights</h3>
                        <h4 className='mt-5'>Data Sharing and Security</h4>
                        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or as necessary to provide our services. We implement security measures to protect your data from unauthorized access, alteration, disclosure, or destruction.</p>
                        <h4 className='mt-5'>Your Rights</h4>
                        <p>You have the right to access, update, or delete your personal information at any time. If you have any questions or concerns about our Privacy and Cookie Notice or our data practices, please contact us at <a href="mailto:info@oxytal.com">info@oxytal.com</a></p>
                        <h4 className='mt-5'>Changes to This Notice</h4>
                        <p>We reserve the right to update or modify this Privacy and Cookie Notice at any time. Any changes will be effective immediately upon posting on our website.</p>
                    </div>
                </div>
            </div>
            <footer className="footer-area marketing-footer">
                <div className="container">
                    <div className="footer-top">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-xl-4 col-lg-4 col-md-12">
                                <Link href="home-marketing.html" className="logo">
                                    <img src="assets/img/oxyem-logo.png" alt="image" />
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
                        <p>Copyright © 2024 Oxytal Limited. All Rights Reserved </p>
                    </div>
                </div>
            </footer>
        </>
    )
}
