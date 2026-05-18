import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbsdiscription';
import { useRouter } from 'next/router'
import Head from 'next/head';
import axios from 'axios';
import StepForm from './StepForm';

export default function opportunity({ userFormdata }) {  // Default to empty array if not provided
    console.log("userFormdata", userFormdata);
    return (
        <>
            <Head>
                <title>Configure Policies & Info – Admin Dashboard</title>
                <meta name="description" content={"Use the Admin Dashboard to create new user groups, manage roles, and organize access permissions efficiently and securely."} />
            </Head>
            <div className="main-wrapper" id="new-admin-comp">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs maintext="Configure Policies & Info" />
                        {userFormdata &&(<StepForm formFieldData={userFormdata} />)}
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const cookies = context.req.headers.cookie;
    const accessToken = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('accessToken='))?.split('=')[1] : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const response = await axios.get(`${apiUrl}/getDynamicForm`, {
            params: { formType: 'CompanyRegistration' },
            headers: {
                Authorization: accessToken,
            },
        });

        if (response.data.errorMessage === "Access denied") {
            return {
                redirect: {
                    destination: context.req.headers.referer || '/',
                    permanent: false,
                },
            };
        }
        return {
            props: { userFormdata: response.data.data },
        };

    } catch (error) {
        return {
            redirect: {
                destination: context.req.headers.referer || '/',
                permanent: false,
            },
        };
    }
}
