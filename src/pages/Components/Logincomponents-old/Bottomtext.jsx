import React from 'react'
import { FaPlus } from "react-icons/fa";
import { BiSolidQuoteAltRight, BiSolidQuoteAltLeft } from "react-icons/bi";
function Bottomtext() {
  return (
  <>
	<div className="sk-accordion-bg-section" >
				<div className="container py-5 img-sec sk-login-inner-section">
					<div className="row align-items-center flex-row">
						<div className="col-md-6 img-mob-mobile"><img className="" src="assets/img/bg-social.png" width="100%" alt="" /></div>
						<div className="col-md-6">
							<h2><span>Who is Skolrup for?</span> </h2>
							<h5>Anyone looking to navigate their professional life</h5>
							<div className="sk-accordion">
								<div className="sk-accordion-item">
									<span className="sk-accordion-header">
										<button className="sk-accordion-button">find a coworker or clasmate</button>
									</span>
									<FaPlus />
								</div>
								<div className="sk-accordion-item">
									<span className="sk-accordion-header">
										<button className="sk-accordion-button">Find a new job</button>
									</span>
									<FaPlus />
								</div>
								<div className="sk-accordion-item">
									<span className="sk-accordion-header">
										<button className="sk-accordion-button" >Find a course a training</button>
									</span>
									<FaPlus />
								</div>
							</div>
						</div>
						<div className="col-md-6 img-mob-desktop"><img className="" src="assets/img/bg-social.png" width="100%" alt="" /></div>
					</div>
				</div>
			</div>
			<div className="sk-login-cust-sec" >
				<div className="container py-5 img-sec sk-login-inner-section">
					<div className="row align-items-center flex-row justify-content-center">
						<div className="col-md-7">
							<h2 className='sk-log-custom-text'>Join your <span>colleagues, classmates,</span> and <span>friends</span> on Skolrup</h2> </div>
					</div>
				</div>
			</div>
    <div className="" style={{ backgroundImage: `url('assets/img/login-bg-1.jpg')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
							<div className="container py-5 img-sec sk-login-inner-section">
								<div className="row align-items-center flex-row">
									<div className="col-md-6 img-mob-mobile"><img className="" src="assets/img/login-img-1.png" width="100%" alt="" /></div>
									<div className="col-md-6">
										<h2><span>Discover</span> the best way to <span>connect</span> with your friends, schools or Universities</h2> </div>
									<div className="col-md-6 img-mob-desktop"><img className="" src="assets/img/login-img-1.png" width="100%" alt="" /></div>
								</div>
							</div>
						</div>
						<div className="" style={{ backgroundImage: `url('assets/img/login-bg-2.jpg')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
							<div className="container py-5 img-sec sk-login-inner-section">
								<div className="row align-items-center">
									<div className="col-md-6"><img className="" src="assets/img/login-img-2.png" width="100%" alt="" /></div>
									<div className="col-md-6 ps-5 sk-space-remove-login">
										<h2 className="text-left ">
											<span>Collaborate</span> with colleagues, and friends to gather <span>feedback</span> and <span>improvement</span> </h2>
										<h3><span className="sk-comma"><BiSolidQuoteAltLeft /></span> The Art of Collaboration: Strategies for Success. <span className="sk-comma"><BiSolidQuoteAltRight /></span></h3> </div>
								</div>
							</div>
						</div>
						</>
  )
}

export default Bottomtext