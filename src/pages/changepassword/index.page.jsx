import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from "axios";
import Header from '../Components/Logincomponents/Header';
import { copyRightText as footercr } from '../../common/content_en';
import Footer from '../Components/Logincomponents/Footer';
import { IoCheckmark } from "react-icons/io5";
import Navbar from '../Components/Navbar/index.page.jsx';
export default function ChangePassword() {
  const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
  const webpath = basepath + 'Change-password';
  const router = useRouter();
  let footertext = footercr;

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
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password criteria states
  const [hasNumber, setHasNumber] = useState(false);
  const [hasLower, setHasLower] = useState(false);
  const [hasUpper, setHasUpper] = useState(false);
  const [hasMinLength, setMinLength] = useState(false);
  const [hasMaxLength, setMaxLength] = useState(false);
  const [hasSpecialChar, setSpecialChar] = useState(false);
  
  // Track password changes and validation criteria
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    setHasNumber(/(?=.*\d)/.test(newPassword));
    setHasLower(/(?=.*[a-z])/.test(newPassword));
    setHasUpper(/(?=.*[A-Z])/.test(newPassword));
    setMinLength(newPassword.length >= 8);
    setMaxLength(newPassword.length <= 16);
    setSpecialChar(/(?=.*[!@#$%^&*])/.test(newPassword));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Update form validity
  useEffect(() => {
    const formValid =
      password === confirmPassword &&
      hasNumber &&
      hasLower &&
      hasUpper &&
      hasMinLength &&
      hasMaxLength &&
      hasSpecialChar &&
      Object.keys(errors).length === 0;

    setIsFormValid(formValid);
  }, [password, confirmPassword, hasNumber, hasLower, hasUpper, hasMinLength, hasMaxLength, hasSpecialChar, errors]);

  const onSubmit = async (data) => {
    if (!isFormValid) {
      return;
    }
    
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const { query } = router;
    
    // Assuming 'restpassword' is the correct field in 'data'
    const { restpassword } = data; 
    
    // Combine query params with the password data
    const payload = {
      ...query,
      restpassword,
    };
    
    try {
      const response = await axios.post(`${apiUrl}/users/updatepwd`, payload);
      router.push('/login');
    } catch (error) {
      // Handle the error appropriately here
      // console.error('Failed to update password:', error.response?.data?.message || error.message);
    }
    };

  return (
    <>
      <Head>
        <title>Change password | Skolrup</title>
        <meta name="description" content="Skolrup is a platform to connect, share, and collaborate with your friends, school, and universities" />
        <link rel="canonical" href={webpath} />
      </Head>

      <div className="main-wrapper login-body">
        <div className="login-wrapper">
          <div className="sk-loginbox auth_page">
            <Navbar />
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-5">
                  <div className="account-page">
                    <div className="main-wrapper">
                      <div className="sk-log-container">
                        <div className="container">
                          <div className="account-box passwordreset-page">
                            <div className="account-wrapper">
                              <p className="forgot-title">Change Your Password</p>
                              <div className="alert alert-borderless alert-warning text-center" role="alert">
                                <p>Please change your password. Your new password must meet the following requirements:</p>
                                <div className="pass_list">
                                  <ul>
                                    <li className={`${hasLower ? 'sk-validation1' : ''}`} style={{ color: hasLower ? 'green' : ''}}>{hasLower ? <IoCheckmark/> : ''} Must have at least 1 lowercase letter.</li>
                                    <li className={`${hasMinLength ? 'sk-validation2' : ''}`} style={{ color: hasMinLength ? 'green' : ''}}>{hasMinLength ? <IoCheckmark/> : ''} Must be at least 8 characters long.</li>
                                    <li className={`${hasMaxLength ? 'sk-validation3' : ''}`} style={{ color: hasMaxLength ? 'green' : ''}}>{hasMaxLength ? <IoCheckmark/> : ''} Must be no more than 16 characters long.</li>
                                    <li className={`${hasNumber ? 'sk-validation4' : ''}`} style={{ color: hasNumber ? 'green' : ''}}>{hasNumber ? <IoCheckmark/> : ''} Must include at least 1 number.</li>
                                    <li className={`${hasSpecialChar ? 'sk-validation5' : ''}`} style={{ color: hasSpecialChar ? 'green' : ''}}>{hasSpecialChar ? <IoCheckmark/> : ''} Must have at least 1 symbol/special character.</li>
                                    <li className={`${hasUpper ? 'sk-validation6' : ''}`} style={{ color: hasUpper ? 'green' : ''}}>{hasUpper ? <IoCheckmark/> : ''} Must have at least 1 uppercase letter.</li>
                                  </ul>
                                </div>
                              </div>

                              <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                  <label>Password <span className="login-danger">*</span></label>
                                  <input
                                    type="password"
                                    {...register('restpassword')}
                                    className={`form-control ${errors.restpassword ? 'is-invalid' : ''}`}
                                    onChange={handlePasswordChange}
                                  />
                                  <div className="invalid-feedback">{errors.restpassword?.message}</div>
                                </div>

                                <div className="form-group">
                                  <label>Confirm Password <span className="login-danger">*</span></label>
                                  <input
                                    type="password"
                                    {...register('restconfirmPassword')}
                                    className={`form-control ${errors.restconfirmPassword ? 'is-invalid' : ''}`}
                                    onChange={handleConfirmPasswordChange}
                                  />
                                  <div className="invalid-feedback">
                                    {errors.restconfirmPassword?.message}
                                  </div>
                                </div>

                                <div className="form-group mb-0">
                                  <button className="btn btn-primary btn-block" type="submit" disabled={!isFormValid}>
                                    Update Password
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
