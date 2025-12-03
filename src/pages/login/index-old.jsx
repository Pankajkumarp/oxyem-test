import Link from 'next/link';
import Image from 'next/image'
import Header from '../Components/Logincomponents/Header';

import Loginform from '../Components/Logincomponents/Loginform';
import Footer from '../Components/Logincomponents/Footer';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head.js';
import Bottomtext from '../Components/Logincomponents/Bottomtext';
import Cookies from 'js-cookie';
import { LoginPageContent as enContent ,logoContent as logoText,copyRightText as footercr} from '../../common/content_en';
import stylesLogin from './login.module.css'; // Import CSS module



export default function Login({value}) {
	const content =  enContent;	
	const logocontent1 =  logoText;
	let footertext= footercr;
	//console.log("rrr",logocontent1)
   const pathvalid = Cookies.get('Oldpath');
	useEffect(() => {
		if(value !== undefined && value !== '') {
		let url = new URL(value);

		let path = url.pathname + url.search;
		Cookies.set('Oldpath', path, { secure: true, expires: 2 / 24 });
		}

		setTimeout(() => {
      router.replace('/login')
    }, 1500)
	  }, [value])




	const router = useRouter();
	const data = router.query.data;
	const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
	const webpath = basepath + 'login'
	return (
		<>
			<Head>
				<title>Oxyem</title>
				<meta name="description" content="Skolrup is a platform to connect, share, and collaborate with your friends, school, and universities" />

				<link rel="canonical" href={webpath} />
			</Head>
			<div className="main-wrapper">
				<div className="login-wrapper">
					<div className="sk-loginbox">
						<Header languageContent= {logocontent1}  />
						<div className="sk-log-container">
							<div className="container">
								<div className="row">
									<div className="col-md-7 login-left">
										<div style={{ position: 'relative', width: '100%', height: '100%' }}>
											<Image
												src="/assets/img/login-img41.png"
												alt="Logo"
												layout='fill'
												objectFit='contain'
											/>
										</div>
									</div>
									<div className="col-md-5 login-right">
										<div className="login-right-wrap">
											<Loginform  languageContent= {content} />
										</div>
									</div>
								</div>
							</div>
						</div>
						


					</div>
				</div>
				<Footer footercr= {footertext}  />
			</div>
		</>
	)
}
export async function getServerSideProps(context) {
	const { value } = context.query
	return {
	  props: { value: value || '' },
	}
  }