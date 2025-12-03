import React, { useState } from 'react';
import { MdKeyboardArrowRight ,MdKeyboardArrowDown } from "react-icons/md";

export default function ClaimDetail({ claimDetails }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const { ideaNumber, ideaType, complexity, submittedBy ,submissionDate ,subject} = claimDetails || {};

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    
    return (
        <div className="row">
            <div className="col-md-12" style={{textAlign:'right'}}>
                <span onClick={toggleExpand} className="mb-3" >
                    <span className='automation-view-details'>Submitted on <span>{submissionDate}</span> by <span>{submittedBy}</span></span>
                    {isExpanded ? <MdKeyboardArrowDown size={25}/> : <MdKeyboardArrowRight size={25}/> }
                </span>
            </div>
            {isExpanded && (
                <>
                    <div className="col-md-6">
                        <ul className="personal-info-header-right claim-detail-v-page top-details">
                            <li>
                                <div className="title">Idea Number :</div>
                                <div className="text">{ideaNumber}</div>
                            </li>
                            <li>
                                <div className="title">Idea Type :</div>
                                <div className="text">{ideaType}</div>
                            </li>
                            
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <ul className="personal-info-header-right claim-detail-v-page top-details">
                            <li>
                                <div className="title">Subject Name :</div>
                                <div className="text">{subject}</div>
                            </li>
                            <li>
                                <div className="title">Complexity :</div>
                                <div className="text">{complexity}</div>
                            </li>
                            
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
