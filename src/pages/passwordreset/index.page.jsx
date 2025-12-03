import Head from 'next/head.js';
import Header from '../Components/Logincomponents/Header';
import Footer from '../Components/Logincomponents/Footer';
import React from 'react';
import { useState } from "react";
import axios from "axios";
import OTP from './resetpwd';
import { LoginPageContent as enContent ,logoContent as logoText,copyRightText as footercr, forgotPassword as fpcontent} from '../../common/content_en';
import dynamic from 'next/dynamic';
const DynamicForm = dynamic(() => import('../Components/CommanForm.jsx'), {
    ssr: false
});
import Navbar from '../Components/Navbar/index.page.jsx';

export default function Forgotten() {
	// const content =  enContent;
	const FPcontent =  fpcontent;
	const logocontent1 =  logoText;
	let footertext= footercr;
	const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
 const webpath = basepath + 'Forgot-password'
	const [Forgotform, showForm] = useState(true)
    
	const [responseotp, setotpResponse] = useState('');
	const [ErrorShow, setError] = useState('');

	  const initialContent = {

			formType: "Email",
			section: [
			  {
				SectionName: "",
				name: "Email",
				isVisible: true,
				Subsection: [
				  {
					SubsectionName: "",
					name: "Email",
					isVisible: true,
					fields: [
					  {
						type: "Email",
						col: "12",
						label: "Email",
						name: "userName",
						placeholder: "Enter your email address",
						value: "",
						validations: [
						  {
							type: "required",
							message: "Email is required"
						  }
						  
						]
					  }
					]
				  }
				],
				buttons: [
				  {
					type: "Submit",
					col: "col-12",
					class: "btn-primary col-12",
					buttontype: "submit",
					label: "Submit Request",
					placeholder: "Next",
					value: "submit",
					validations: []
				  }
				]
			  }
			]
	  }

    const [content, setContent] = useState(initialContent);
    const handleChangeValue = (fieldName, value) => {
        const updatedArray = JSON.parse(JSON.stringify(content)); // Create a deep copy of the original array

        for (let i = 0; i < updatedArray.section.length; i++) {
            const section = updatedArray.section[i];

            for (let j = 0; j < section.Subsection.length; j++) {
                const subsection = section.Subsection[j];

                for (let k = 0; k < subsection.fields.length; k++) {
                    const field = subsection.fields[k];

                    if (field.name === fieldName) {
                        // Update the value of the field with matching fieldName
                        updatedArray.section[i].Subsection[j].fields[k].value = value;
                        break;
                    }
                }
            }
        }

        setContent(updatedArray);
    };

	const submitformdata = async (value) => {
		const formattedData = {};
  
		// Convert the data to the required format
		content.section.forEach(section => {
			section.Subsection.forEach(subsection => {
				subsection.fields.forEach(field => {
					if (typeof field.value === 'object' && 'value' in field.value) {
						formattedData[field.name] = field.value.value;
					} else {
						formattedData[field.name] = field.value;
					}
				});
			});
		});	
		try {
		  
			  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/users/forgotPassword';
			  const response = await axios.post(apiUrl, formattedData);
			  if (response.status === 200) {
				setotpResponse(response.data.userdata)
				showForm(false);
			  }
		  
	  } catch (error) {
		const data = error.response.data.message;
        
			setError(data);
			setTimeout(() => {
				setError('');
			}, 20000);
	   }
	};

	return (
	<>
	<Head>
		<title>Forgot password | Skolrup</title>
        <meta name="description" content="Skolrup is a platform to connect, share, and collaborate with your friends, school, and universities" />
		<link rel="canonical" href={webpath} />
	</Head>
		<div className="main-wrapper login-body">
			<div className="login-wrapper">	
					<div className="sk-loginbox auth_page">
					{Forgotform ?
						<>
							<Navbar  />
								<div className="container">
									<div className="row justify-content-center">
									<div className="col-md-5 " >
								<div className="account-page">
									<div className="main-wrapper">
										<div className="sk-log-container ">
											<div className="container ">
												<div className="account-box passwordreset-page">
													<div className="account-wrapper">
														<p className="forgot-title">{FPcontent.ResetPwdText}</p>
														<div className="alert alert-borderless alert-warning" role="alert">
															<div className="pass_list">
																<ul>

																	<li>{FPcontent.forgotpwdli1}</li>
																	<li>{FPcontent.forgotpwdli2}</li>
																</ul>
															</div>
														</div>

														{ErrorShow &&
															<div id="messages-container">
																<div className="alert alert-danger" role="alert">{ErrorShow}</div>
															</div>
														}
														
														{content && content.section && Array.isArray(content.section) ? (
                                                            content.section.map((section, index) => (
                                                                <div key={index} >
                                                                    <DynamicForm
                                                                        fields={section}
                                                                        submitformdata={submitformdata}
                                                                        handleChangeValue={handleChangeValue}
                                                                        handleChangess={() => handleChangess(index)}
                                                                        pagename={'passwordreset'}
                                                                        isModule={content.formType}
                                                                    />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div></div>
                                                        )}
													</div>
												</div>
											</div>
										</div>
									</div>
									</div>
									</div>
								</div>
							</div>
							<Footer footercr= {footertext} />
						</>
						:
						<>
							<OTP id={responseotp}  languageContent= {logocontent1} FPcontent={FPcontent} />
						</>
					}
				</div>
			</div>
		</div>
</>
	)
}
