import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head.js';
import { TbError404 } from "react-icons/tb";
export default function Custom404() {
	const router = useRouter();
	const basepath = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
	const webpath = basepath + '404'
	useEffect(() => {
		router.push('/login');
	}, [router]);
	return (
		<>
			<Head>
				<title>Page Not Found</title>
				<meta name="description" content="Page Not Found." />
				<link rel="canonical" href={webpath} />
			</Head>
			<div className="main-wrapper">
				<div className="page-wrapper">
					<div className="content container-fluid">
						<div className="row">
							<div className="col-12 col-lg-12 col-xl-12 d-flex">
								<div className="card flex-fill comman-shadow oxyem-index">
									<div className="center-part">
										<div className="card-body oxyem-mobile-card-body">
											<div className="col-12 col-md-12 col-xl-12 col-sm-12 mx-auto card border" id="sk-error-page-f">
												<div className='error_inner_section'>
													<TbError404 />
													<h1>Page Not Found</h1>
													<p>You will be redirected to the login page...</p>
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
		</>
	)
}

