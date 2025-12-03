import React from 'react'
import { FaPlus } from "react-icons/fa";
import { BiSolidQuoteAltRight, BiSolidQuoteAltLeft } from "react-icons/bi";
function Bottomtext({languageContent}) {
  return (
  <>
	<div className="sk-accordion-bg-section" >
				<div className="container py-5 img-sec sk-login-inner-section">
					<div className="row align-items-center flex-row">
						<div className="col-md-6 img-mob-mobile"><img className="" src="assets/img/bg-social.png" width="100%" alt="" /></div>
						<div className="col-md-6">
							<h2><span>{languageContent.Image1H2}</span> </h2>
							<h5>{languageContent.Image1H5}</h5>
							<div className="sk-accordion">
								<div className="sk-accordion-item">
									<span className="sk-accordion-header">
										<button className="sk-accordion-button">{languageContent.Image1Btn1}</button>
									</span>
									<FaPlus />
								</div>
								<div className="sk-accordion-item">
									<span className="sk-accordion-header">
										<button className="sk-accordion-button">{languageContent.Image1Btn2}</button>
									</span>
									<FaPlus />
								</div>
								<div className="sk-accordion-item">
									<span className="sk-accordion-header">
										<button className="sk-accordion-button" >{languageContent.Image1Btn3}</button>
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
							<h2 className='sk-log-custom-text' dangerouslySetInnerHTML= {{ __html: languageContent.Image2H2}} /> </div>
					</div>
				</div>
			</div>
    <div className="" style={{ backgroundImage: `url('assets/img/login-bg-1.jpg')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
							<div className="container py-5 img-sec sk-login-inner-section">
								<div className="row align-items-center flex-row">
									<div className="col-md-6 img-mob-mobile"><img className="" src="assets/img/login-img-1.png" width="100%" alt="" /></div>
									<div className="col-md-6">
										<h2 dangerouslySetInnerHTML={{ __html: languageContent.Image3H2 }} /></div>
									<div className="col-md-6 img-mob-desktop"><img className="" src="assets/img/login-img-1.png" width="100%" alt="" /></div>
								</div>
							</div>
						</div>
						<div className="" style={{ backgroundImage: `url('assets/img/login-bg-2.jpg')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
							<div className="container py-5 img-sec sk-login-inner-section">
								<div className="row align-items-center">
									<div className="col-md-6"><img className="" src="assets/img/login-img-2.png" width="100%" alt="" /></div>
									<div className="col-md-6 ps-5 sk-space-remove-login">
										<h2 className="text-left " dangerouslySetInnerHTML= {{ __html: languageContent.Image4H2}} />
										
										<h3><span className="sk-comma"><BiSolidQuoteAltLeft /></span> {languageContent.Image4H3}  <span className="sk-comma"><BiSolidQuoteAltRight /></span></h3> </div>
								</div>
							</div>
						</div>
						</>
  )
}

export default Bottomtext