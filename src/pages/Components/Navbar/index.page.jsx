import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { CgLogIn } from "react-icons/cg";
import { IoMenu, IoCloseSharp } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Logo from '../Header/Headercompnents/Logo.jsx';
export default function Navbar({ page }) {



    const [menuOpen, setMenuOpen] = useState(false);

    async function handleOpenMenu() {
        setMenuOpen(prevState => !prevState);
    }

    const [activeMenu, setActiveMenu] = useState(null);
    const handleToggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };
    const [isSticky, setIsSticky] = useState(false);
    const [lastScroll, setLastScroll] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 50) {
                if (currentScroll > lastScroll) {
                    setIsSticky(true);
                } else {
                    setIsSticky(false);
                }
            } else {
                setIsSticky(false);
            }

            setLastScroll(currentScroll);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScroll]);
    return (
        <div className={`navbar-area marketing-color ${isSticky ? 'is-sticky' : ''}`}>
            <div className="noke-responsive-nav">
                <div className="container">
                    <div className="noke-responsive-menu">
                        <Logo />
                    </div>
                </div>
            </div>
            <div className="noke-nav">
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-md navbar-light">
                        <Logo />

                        <div className="collapse navbar-collapse mean-menu">
                            <ul className="navbar-nav">
                                <li className="nav-item megamenu">
                                    <Link href="" className="nav-link">Applications <IoIosArrowDown /></Link>
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
                                    <Link href="/pricing" className=" nav-link">Pricing</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href="/aboutus" className=" nav-link">About Us</Link>
                                </li>

                            </ul>
                            {page === "home" ? (
                                <div className="others-option d-flex align-items-center">

                                    <div className="option-item">
                                        <div className="social-links">
                                            <Link className="log_text_btn" href="/login"><CgLogIn /> Log In</Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (null)}
                        </div>
                    </nav>
                </div>
            </div>
            <div className="others-option-for-responsive">
                <div className="container">
                    <div className="dot-menu">
                        {page === "home" ? (
                            <Link className="log_text_btn" href="/login"><CgLogIn /> Log In</Link>
                        ) : (null)}
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
                        <h2 className="accordion-header" id="headingThree">
                            {/* <Link href={"/pricing"} className="accordion-button hide_icon_menu_r collapsed" type="button" data-bs-toggle="collapse" data-bs-target="" aria-expanded="false" aria-controls="collapseTwo">
                                Pricing
                            </Link> */}
                            <Link legacyBehavior href="/pricing">
    <a className="accordion-button hide_icon_menu_r collapsed">Pricing</a>
</Link>

                        </h2>
                    </div>
                     <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                            {/* <Link href={"/aboutus"} className="accordion-button hide_icon_menu_r collapsed" type="button" data-bs-toggle="collapse" data-bs-target="" aria-expanded="false" aria-controls="collapseTwo">
                                About Us
                            </Link> */}

                                                   <Link legacyBehavior href="/aboutus">
    <a className="accordion-button hide_icon_menu_r collapsed">About Us</a>
</Link>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}
