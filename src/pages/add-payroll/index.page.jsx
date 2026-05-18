import Breadcrumbs from '../Components/Breadcrumbs/Breadcrumbsdiscription';
import Head from 'next/head';
import pageTitles from '../../common/pageTitles.js';
import PayrollEdit from './PayrollEdit.jsx';
export default function addPayroll() {
    return (
        <>
            <Head>
                <title>{pageTitles.PayrollAddPayroll}</title>
                <meta name="description" content={pageTitles.PayrollAddPayroll} />
            </Head>
            <div className="main-wrapper">
                <div className="page-wrapper">
                    <div className="content container-fluid">
                        <div className="row">
                            <div className="col-12 col-lg-12 col-xl-12">
                                <Breadcrumbs maintext={"Create Employee Payroll"} discription={"Generate and manage salary details for an employee for the selected month. Add earnings, allowances, attendance, and deductions to calculate the final net payable amount."} />
                                <PayrollEdit />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>

    );
}
