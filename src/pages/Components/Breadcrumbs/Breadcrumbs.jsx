import React from 'react'
import Link from 'next/link';
import { FaPlus } from "react-icons/fa6";
import { Tooltip } from 'react-tooltip';
 
export default function Breadcrumbs({ maintext, addlink, tooltipcontent ,pagename }) {
  return (
    <div className="page-header oxyem-custom-breadcrumb">
      <div className="row align-items-center">
        <div className={addlink ? "col-10" : pagename==="payrollmanagement" ? "col-10" : "col-12"}>
          <h3 className="page-title">{maintext}</h3>
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/Dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item active">{maintext}</li>
          </ul>
        </div>
 
        {addlink && (
          <div className="col-2 text-center">
            <Link
              href={addlink}
              className='btn btn-primary breadcrum-btn'
              data-tooltip-id="my-tooltip-breadcrumb"
              data-tooltip-content={tooltipcontent || ""}
            >
              <FaPlus />
            </Link>
          </div>
        )}
 
         {/* {pagename ==="payrollmanagement" && (
          <div className="col-5 ps-0 px-0">
            <div className="float-end ps-0">
            <Link
              href={"/add-payroll"}
              className='btn btn-oxyem me-1'
              data-tooltip-id="my-tooltip-breadcrumb"
              data-tooltip-content={tooltipcontent || ""}
            >
              Employee
            </Link>
              <Link
              href={"/add-payrollemp"}
              className='btn btn-oxyem me-1 '
              data-tooltip-id="my-tooltip-breadcrumb"
              data-tooltip-content={tooltipcontent || ""}
            >
              Non-Employee
            </Link>
            </div>
          </div>
        )}
        */}
      </div>
 
      <Tooltip id="my-tooltip-breadcrumb" style={{ zIndex: 99999 }} />
    </div>
  );
}