import {useRouter} from 'next/router'
import Head from 'next/head.js';
import { useParams } from 'next/navigation'
import { useState } from "react";
import { useForm, } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from "axios";
import { usePathname } from 'next/navigation'

import Header from '../Components/Logincomponents/Header';
import Footer from '../Components/Logincomponents/Footer';
import { logoContent as logoText,copyRightText as footercr, forgotPassword as fpcontent} from '../../common/content_en';
export default function Changepassword() {
	const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
 const webpath = basepath + 'Change-password'
	const router = useRouter()
	const FPcontent =  fpcontent;
	  const logocontent1 =  logoText;
	  let footertext= footercr;
	//const [responselogMessage, setverEmail] = useState('');
	//setverEmail(email)
  const validationSchema = Yup.object().shape({
    restpassword: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
	  restconfirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('restpassword'), null], 'Confirm Password does not match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
    
  });
  const [responselogMessage, setjoinResponseMessage] = useState('');
  const [errorjoinMessage, setErrorjoinMessage] = useState('');
  const {query} = router
	const props={query};
	
  const onSubmit = async (data) => {
    //reset()
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
	const obj2 = Object.assign( query, data);
    await axios.post(`${apiUrl}/users/updatepwd`, obj2)
    .then(response => {
			setjoinResponseMessage(response.data.message)
			router.push({
				pathname: '/login',			
			}, '/');
		})

    .catch(error => {
			setErrorjoinMessage(error.response.data.message)
		});

    }
  return (
  <>
  	<Head>
		<title>Change password | OXYEm</title>
        <meta name="description" content="Skolrup is a platform to connect, share, and collaborate with your friends, school, and universities" />
		<link rel="canonical" href={webpath} />
	</Head>
    <div className="main-wrapper login-body">
	<div className="login-wrapper">
		<div className="loginbox skolrup-change-password">
			<Header languageContent= {logocontent1} />
			<div className="container">
				<div className="account-page">
					<div className="main-wrapper">
						<div className="account-content ">
							<div className="container ">
								<div className="account-box">
									<div className="account-wrapper">
										<p className="forgot-title">Change Your Password</p>
										<div className="alert alert-borderless alert-warning text-center" role="alert">
											<p> Please change your password. Your new password must meet the following requirements:</p>
											<div className="pass_list">
												
												<ul>
													<li className="">Password is case sensitive.</li>
													<li className="">Must be at least 8 characters long.</li>
													<li className="">Must be no more than 16 characters long.</li>
													<li className="">Must include at least 1 number.</li>
													<li className="">Must have at least 1 symbol (non letter or number) character.</li>
													<li className="">Must have at least 1 lowercase letter.</li>
													<li className="">Must have at least 1 uppercase letter.</li>
													<li className="">Must have at least 1 unique character.</li>
												</ul>
												
											</div>
										</div>
										
										{responselogMessage && (
		<div className="error mb-3">
		<div id="messages-container"><div className="alert alert-success" role="alert">{responselogMessage}</div></div>
		</div>
		)}

										<form onSubmit={handleSubmit(onSubmit)}  >

        <div className="form-group">
          <label>Password <span className="login-danger">*</span></label>
          <input
            type="password"
            {...register('restpassword')}
            className={`form-control ${errors.restpassword ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.restpassword?.message}</div>
        </div>
        
        <div className="form-group">
          <label>Confirm Password <span className="login-danger">*</span></label>
          <input
            type="password"
            {...register('restconfirmPassword')}
            className={`form-control ${
              errors.restconfirmPassword ? 'is-invalid' : ''
            }`}
          />
          <div className="invalid-feedback">
            {errors.restconfirmPassword?.message}
          </div>
        </div>

        <div className="form-group mb-0">
										<button  className="btn btn-primary btn-block" type="submit">Update Password</button>
									</div>
                  
      </form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer footercr= {footertext} />
		</div>
	</div>
</div>
  </>  
  )
}
