import Breadcrumbs from '../../Components/Breadcrumbs/Breadcrumbsdiscription';
import Head from 'next/head';
import axios from 'axios';
import StepForm from './StepForm';
import { IoSettingsOutline } from "react-icons/io5";

export default function opportunity({ userFormdata }) {  // Default to empty array if not provided
    return (
        <>
            <Head>
                <title>Company Registration & Setup | Oxytal Platform</title>
                <meta name="description" content={"Company Registration, HR Software, Payroll Management, Employee Attendance, Employee Management System, Oxytal, Business Setup, Leave Management, Onboarding"} />
            </Head>
            <div className="main-wrapper" id="new-admin-comp">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <Breadcrumbs 
                        icon={<IoSettingsOutline />}
                        maintext="Configure your Company Profile" 
                        discription="Complete all required attributes as per your company policy."/>
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
        console.error(error)
        return {
            redirect: {
                destination: context.req.headers.referer || '/',
                permanent: false,
            },
        };
    }
}
