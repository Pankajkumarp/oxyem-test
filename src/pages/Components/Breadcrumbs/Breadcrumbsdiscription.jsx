import React from 'react'
import Link from 'next/link';
import { FaPlus } from "react-icons/fa6";
import { Tooltip } from 'react-tooltip';

export default function Breadcrumbsdiscription({ maintext, addlink, tooltipcontent, pagename, discription, icon, bottomLink, imageLink, name, additionalTxt }) {
  return (
    <div className="page-header oxyem-custom-breadcrumb oxyem-custom-breadcrum-dis">
      <div className="col-12 col-lg-12 col-xl-12 d-flex">
        <div className="card flex-fill comman-shadow oxyem-index mb-4 oxyem-description-box-top-c">
          <div className='permission-description-text'>
            {imageLink?(<span className='breadcrumb-image-box'>{imageLink}</span>):(
            <>{icon && <span className="breadcrumb-icon">{icon}</span>}</>
            )}
            <div className="core-text">
              {name && (<h3 className='breadcrumb-name-text'>{name}</h3>)}
              {additionalTxt && (<h4 className='breadcrumb-additional-text'>{additionalTxt}</h4>)}
              {maintext && (<h3>{maintext}</h3>)}
              {discription && (<p>{discription}</p>)}
            </div>
          </div>
          {bottomLink === "hide"?(null):(
          <ul className={`breadcrumb ${icon ? "breadcrumb-dis-text" : ""}`}>
            <li className="breadcrumb-item"><Link href="/Dashboard">Dashboard</Link></li>
            <li className="breadcrumb-item active">{maintext}</li>
          </ul>
          )}
          {addlink && (
            <div className="col-2 text-center">
              <Link
                href={addlink}
                className='btn btn-primary breadcrum-btn breadcrum-btn-with-disc'
                data-tooltip-id="my-tooltip-breadcrumb"
                data-tooltip-content={tooltipcontent || ""}
              >
                <FaPlus />
              </Link>
            </div>
          )}
        </div>
        <Tooltip id="my-tooltip-breadcrumb" style={{ zIndex: 99999 }} />
      </div>
    </div>
  );
}