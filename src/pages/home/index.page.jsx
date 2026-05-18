import { useState, useEffect  } from "react";
import Link from 'next/link';
import { RiMapPin2Line } from "react-icons/ri";
import { MdMailOutline, MdAddCall } from "react-icons/md";
import Navbar from '../Components/Navbar/index.page';
import Head from 'next/head';

export default function home() {
     useEffect(() => {
    const items = document.querySelectorAll(".animate");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.3 }
    );

    items.forEach((el) => observer.observe(el));

    // Cleanup (VERY important in React)
    return () => {
      items.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  useEffect(() => {
    const fadeElements = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("show");
            }, index * 120); // stagger delay
          }
        });
      },
      { threshold: 0.15 }
    );

    fadeElements.forEach((el) => observer.observe(el));

    // Cleanup
    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

    const currentYear = new Date().getFullYear();
    const [activeIndex, setActiveIndex] = useState(0);

    const toggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
    const faqs = [
        {
            q: "Is Oxyem suitable for small and large businesses?",
            a: "Yes. Oxyem is built to scale seamlessly from early-stage startups to large enterprises."
        },
        {
            q: "Does Oxyem support payroll and attendance together?",
            a: "Yes. Attendance, leave management, and payroll are fully integrated into one unified system."
        },
        {
            q: "Can Oxyem be customized?",
            a: "Yes. We tailor workflows, permissions, and modules based on your unique business needs."
        },
        {
            q: "Is Oxyem secure?",
            a: "Absolutely. Oxyem is built with enterprise-grade security, data encryption, and role-based access controls."
        }
    ];
    return (
        <>
            <Head>
                <title>Oxyem – All-in-One HR & Payroll Management Platform</title>
                <meta name="description" content={"Oxyem is an all-in-one HR, payroll, attendance & employee management platform to automate people operations and gain real-time workforce insights."} />
            </Head>
            <Navbar page={"home"} />
            <div id='oxyem-landing'>
                <section className="hero">
                    <div className="hero-wrapper reveal">
                        <div className="animate">
                            <h1>
                                Smarter Workforce Management <br />
                                <span>for Growing Businesses</span>
                            </h1>
                            <p className="sub"> One powerful platform to manage HR, payroll, attendance, leave, and employee engagement — all in one place. </p>
                            <p className="support"> Reduce manual work. Eliminate errors. Gain real-time visibility across your workforce. </p>
                            <div className="cta">
                                <Link href="/home" className="btn-primary">👉 Request a Demo</Link>
                                <Link href="/home" className="btn-secondary">▶️ Watch Product Tour</Link>
                            </div>
                        </div>
                        <div className="hero-image animate"> <img src="/assets/img/hero-img-1.png" alt="OXYEM Dashboard" />
                            <div className="card one">📊 Live Dashboard</div>
                            <div className="card two">✅ Payroll Accuracy</div>
                            <div className="card three">⏱ Smart Attendance</div>
                            <div className="card four">🤖 AI Enabled</div>
                        </div>
                    </div>
                </section>
                <section className="problem-section">
                    <div className="problem-wrapper">
                        <div className="problem-heading fade-up"> <span className="tag">PROBLEM STATEMENT</span>
                            <h2>
                                Managing people shouldn’t be complicated.<br />
                                <span style={{ 'color': 'AccentColorText' }}>But for most teams, it is.</span>
                            </h2>
                            <p> HR teams and managers struggle with outdated tools and fragmented systems that slow down daily operations. </p>
                        </div>
                        <div className="problem-grid">
                            <div className="problem-card">
                                <div className="problem-icon"> <i className="fa-solid fa-layer-group"></i> </div>
                                <h4>Disconnected Tools</h4>
                                <p> Multiple systems across HR, payroll, and attendance cause data silos and inefficiencies. </p>
                            </div>
                            <div className="problem-card">
                                <div className="problem-icon"> <i className="fa-solid fa-file-invoice-dollar"></i> </div>
                                <h4>Manual Payroll</h4>
                                <p> Spreadsheet-based payroll increases errors, delays, and compliance risk. </p>
                            </div>
                            <div className="problem-card">
                                <div className="problem-icon"> <i className="fa-solid fa-clock"></i> </div>
                                <h4>Attendance Errors</h4>
                                <p> Inaccurate attendance data leads to disputes and employee dissatisfaction. </p>
                            </div>
                            <div className="problem-card">
                                <div className="problem-icon"> <i className="fa-solid fa-users"></i> </div>
                                <h4>Low Engagement</h4>
                                <p> Lack of insights and feedback tools impacts motivation and productivity. </p>
                            </div>
                            <div className="problem-card">
                                <div className="problem-icon"> <i className="fa-solid fa-chart-line"></i> </div>
                                <h4>Poor Visibility</h4>
                                <p> Decision-makers lack real-time insights into workforce performance. </p>
                            </div>
                            <div className="problem-card">
                                <div className="problem-icon"> <i className="fa-solid fa-triangle-exclamation"></i> </div>
                                <h4>Growth Risk</h4>
                                <p> Operational inefficiencies slow scaling and increase business risk. </p>
                            </div>
                        </div>
                        <p className="text-center mt-4"> These inefficiencies slow down growth and create unnecessary risk. </p>
                    </div>
                </section>
                <section className="solution-section">
                    <div className="solution-wrapper fade-up"> <span className="solution-tag">SOLUTION SNAPSHOT</span>
                        <h2>
                            OXYEM brings everything together<br />
                            <span>in one intelligent platform.</span>
                        </h2>
                        <p className="solution-desc"> OXYEM is an all-in-one employee management system built for modern businesses. From HR operations to payroll and performance insights, OXYEM helps you run your workforce with clarity, control, and confidence. </p>
                        <div className="solution-stats">
                            <div className="solution-stat">
                                <div className="icon-wrap">
                                    <i className="fa-solid fa-shield"></i>
                                </div>
                                <h3>100% Compliance Ready</h3>
                                <p>Stay audit-ready with built-in statutory rules and automated compliance checks.</p>
                            </div>

                            <div className="solution-stat">
                                <div className="icon-wrap">
                                    <i className="fa-solid fa-user-gear"></i>
                                </div>
                                <h3>Self-Service Employee Portal</h3>
                                <p>Stay audit-ready with built-in statutory rules and automated compliance checks.</p>
                            </div>

                            <div className="solution-stat">
                                <div className="icon-wrap">
                                    <i className="fa-solid fa-headset"></i>
                                </div>
                                <h3>24/7 Dedicated Support</h3>
                                <p>Empower employees to manage attendance, leave, and payslips on their own.</p>
                            </div>

                        </div>
                    </div>
                </section>
                <section className="benefits-section">
                    <div className="benefits-wrapper">
                        <div className="benefits-heading fade-up"> <span className="benefits-tag">CORE BENEFITS</span>
                            <h2>
                                Why teams choose<br />
                                <span>OXYEM every day</span>
                            </h2>
                            <p> Designed to remove complexity and help your workforce perform better. </p>
                        </div>
                        <div className="benefits-grid">
                            <div className="benefit-card ">
                                <div className="benefit-icon">🚀</div>
                                <h4>Automate HR Operations</h4>
                                <p> Manage onboarding, documents, roles, and employee data without spreadsheets or endless emails. </p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">💸</div>
                                <h4>Payroll Without Errors</h4>
                                <p> Automated payroll powered by attendance, leave, and built-in compliance rules. </p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">⏱</div>
                                <h4>Accurate Attendance & Leave</h4>
                                <p> Track shifts, work hours, and leave in real time — from anywhere, on any device. </p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">📊</div>
                                <h4>Actionable Workforce Insights</h4>
                                <p> Get AI-powered insights into productivity, engagement, and workforce trends. </p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">🤝</div>
                                <h4>Boost Employee Engagement</h4>
                                <p> Keep teams informed, aligned, and motivated with transparent communication and feedback. </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="feature-offset">
                    <div className="feature-offset-wrapper">
                        <div className="section-head"> <span className="feature-offset-tag">FEATURE HIGHLIGHTS</span>
                            <h2>Powerful features designed to scale with your team</h2>
                            <p>Every module works together so your people, data, and decisions stay connected.</p>
                        </div>
                        <div className="features-grid">

                            <div className="feature-card">
                                <div className="icon-wrap">
                                    <i className="fa-solid fa-users"></i>
                                </div>
                                <h4>HR Management</h4>
                                <p>Manage employee records, documents, and lifecycle from one place.</p>
                            </div>

                            <div className="feature-card">
                                <div className="icon-wrap">
                                    <i className="fa-solid fa-calculator"></i>
                                </div>
                                <h4>Payroll & Compliance</h4>
                                <p>Automated salary processing with statutory compliance built-in.</p>
                            </div>

                            <div className="feature-card">
                                <div className="icon-wrap">
                                    <i className="fa-solid fa-clock"></i>
                                </div>
                                <h4>Attendance & Shift Tracking</h4>
                                <p>Real-time attendance with shift planning and approvals.</p>
                            </div>

                            <div className="feature-card">
                                <div className="icon-wrap">
                                    <i className="fa-solid fa-calendar-check"></i>
                                </div>
                                <h4>Leave Management</h4>
                                <p>Configure policies, approvals, and leave balances easily.</p>
                            </div>

                            <div className="feature-card">
                                <div className="icon-wrap">
                                    <i className="fa-solid fa-chart-line"></i>
                                </div>
                                <h4>Opportunity & Pricing</h4>
                                <p>Connect people, projects, pricing, and invoicing seamlessly.</p>
                            </div>

                            <div className="feature-card highlight">
                                <div className="icon-wrap">
                                    <i className="fa-solid fa-brain"></i>
                                </div>
                                <h4>AI-Driven Insights</h4>
                                <p>Smart analytics to improve decisions and performance.</p>
                            </div>

                        </div>
                    </div>
                </section>
                <section className="who-for">
                    <div className="who-wrapper">
                        <div className="who-content"> <span className="who-tag">WHO IT’S FOR</span>
                            <h2 className="who-title">Built for teams who want to scale without chaos</h2>
                            <p className="who-desc"> Oxyem is designed for modern organizations that want clarity, control, and confident growth. </p>
                            <div className="who-list">
                                <div className="who-item"><span className="who-icon">✔</span>HR Managers</div>
                                <div className="who-item"><span className="who-icon">✔</span>Business Owners & Founders</div>
                                <div className="who-item"><span className="who-icon">✔</span>Operations Leaders</div>
                                <div className="who-item"><span className="who-icon">✔</span>Growing Startups</div>
                                <div className="who-item"><span className="who-icon">✔</span>Mid-size Enterprises</div>
                            </div>
                            <p className="who-note"> If your workforce is growing, <strong>Oxyem grows with you.</strong> </p>
                        </div>
                        <div className="who-image animate">
                            <img src="/assets/img/img-1.avif" alt="Team working together" /> </div>
                    </div>
                </section>
                <section className="why-oxyem">
                    <div className="why-wrapper">
                        <div> <span className="why-tag">WHY OXYEM</span>
                            <h2 className="why-title">Why teams choose Oxyem</h2>
                            <p className="why-desc"> A single intelligent platform that replaces complexity with clarity, automation, and confidence. </p>
                            <div className="why-list">
                                <div className="why-item">
                                    <div className="why-icon">🧩</div>
                                    <div>
                                        <h4>All-in-one system</h4>
                                        <p>No tool hopping — HR, payroll, attendance, and insights in one place.</p>
                                    </div>
                                </div>
                                <div className="why-item">
                                    <div className="why-icon">⚡</div>
                                    <div>
                                        <h4>Built for modern teams</h4>
                                        <p>Remote-ready, scalable, and flexible for fast-growing businesses.</p>
                                    </div>
                                </div>
                                <div className="why-item">
                                    <div className="why-icon">🎯</div>
                                    <div>
                                        <h4>Easy to use, powerful inside</h4>
                                        <p>Clean UI with enterprise-grade automation under the hood.</p>
                                    </div>
                                </div>
                                <div className="why-item">
                                    <div className="why-icon">🏗️</div>
                                    <div>
                                        <h4>Designed by industry experts</h4>
                                        <p>Built around real HR and operations challenges.</p>
                                    </div>
                                </div>
                                <div className="why-item">
                                    <div className="why-icon">🤖</div>
                                    <div>
                                        <h4>Continuously evolving with AI</h4>
                                        <p>Smarter decisions powered by data and intelligence.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="why-visual">
                            <div className="why-card">
                                <h3>Confidence at every stage of growth</h3>
                                <p> From early-stage startups to mid-size enterprises, Oxyem adapts to your workflows and keeps your workforce aligned, compliant, and productive. </p>
                                <div className="why-stats">
                                    <div className="stat"> <strong>40%</strong> <span>HR workload reduced</span> </div>
                                    <div className="stat"> <strong>99.9%</strong> <span>Payroll accuracy</span> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="cta-bold">
                    <div className="cta-box"> <span className="cta-tag">READY TO GET STARTED?</span>
                        <h2>Ready to simplify workforce management?</h2>
                        <p> Let Oxyem handle the complexity — so you can focus on growing your business. </p>
                        <div className="cta-actions"> 
                            <Link href="/" className="btn-primary">👉 Request a Demo</Link> 
                        <Link href="/" className="btn-secondary">👉 Talk to Our Experts</Link>
                        </div>
                    </div>
                </section>

                <section className="faq-section">
                    <div className="faq-container">
                        <h2>Frequently Asked Questions</h2>
                        <p className="faq-subtitle"> Everything you need to know about Oxyem before getting started. </p>
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={`faq-item ${activeIndex === i ? "active" : ""}`}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => toggle(i)}
                                >
                                    {faq.q} <i className="fa-solid fa-chevron-down icon"></i>
                                </button>

                                <div className="faq-answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </section>
				
				
               <section class="cta-bar">
  <h3>Have any questions? We’re here to help.</h3>
  <a href="#" class="cta-btn">
    Contact Us
    <span class="arrow">→</span>
  </a>
</section>
				
				
                 <footer className="footer-area marketing-footer">
				 
				 
				 
                <div className="container">
				
				
				
				
                 
					
					
					
					
                    <div className="row mt-5">
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
					
				<div className="oxyem-footer-inner">
                        <p> <strong>Oxyem</strong> — Powering Smarter Workforce Decisions </p>
                    </div>	
					
					
                </div>
                <div className="copyright-area">
                    <div className="container">
                        <p>Copyright © {currentYear} Oxytal Limited. All Rights Reserved </p>
                    </div>
                </div>
            </footer>
            </div>
        </>
    )
}
