import { useRouter } from 'next/router'
import React from 'react';
import { useState } from "react";
import axios from "axios";
import Header from '../Components/Logincomponents/Header';

import dynamic from 'next/dynamic';
const DynamicForm = dynamic(() => import('../Components/CommanForm.jsx'), {
    ssr: false
});

import { LoginPageContent as enContent ,logoContent as logoText,copyRightText as footercr, forgotPassword as fpcontent} from '../../common/content_en';
export default function OTP(props) {

	const router = useRouter()
	const logocontent1 =  logoText;
 
	
	const [ErrorShow, setError] = useState('');
	const initialContent = {

		formType: "resetpassword",
		section: [
		  {
			SectionName: "",
			name: "resetpassword",
			isVisible: true,
			Subsection: [
			  {
				SubsectionName: "",
				name: "resetpassword",
				isVisible: true,
				fields: [
				  {
					type: "Text",
					col: "12",
					label: "Security Code",
					name: "securityCode",
					placeholder: "Enter your security code",
					value: "",
					validations: [
					  {
						type: "required",
						message: "Security Code is required"
					  },
					  
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
				label: "Validate Code",
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
	const formattedData2 = {};
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

		const userName = props.id.userName;
		formattedData2["pid"] = userName;    
        formattedData2["userName"] = userName; 
        formattedData2["securityCode"] = formattedData.securityCode || "";

	try {
	  
		  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/users/verifycode';
		  const response = await axios.post(apiUrl, formattedData2);

		  if (response.status === 200) {
			  
			router.push({
				pathname: '/changepassword',
				query: { userName: userName }
			}, '/changepassword');
			  
		  }
	  
  } catch (error) {
	const data = error.response.data;
	setError(data.message);
	setTimeout(() => {
		setError('');
	}, 20000);
  }
};

	return (
		<div className="main-wrapper login-body">
			<div className="login-wrapper">
				<div className="loginbox">
					<Header languageContent= {logocontent1}  />
					<div className="container">
					<div className="row justify-content-center">
			<div className="col-md-5">
						<div className="account-page">
							<div className="main-wrapper">
								<div className="sk-log-container">
									<div className="container ">
										<div className="account-box passwordreset-page">
												<div className="account-wrapper">
												<p className="forgot-title">Confirm Security Code</p>
												<div className="alert alert-borderless alert-warning" role="alert">
													<p> To verify your identity, a security code has been sent to your registered email address.</p>
												</div>
												<div id="messages-container">
													<div className="alert alert-success" role="alert">if the account exists you should receive a recovery email in your inbox soon</div>
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
					<div className="login-footer">
						<p>Copyright ©
							SKOLRUP. All Rights Reserved.</p>
					</div>
				</div>
			</div>
		</div>

	)
}
