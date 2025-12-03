import React from 'react'

export default function claimdetail({claimDetails}) {

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options).replace(/ /g, '-');
      };

  return (
    <div className="row">
        <div className="col-md-6">
            <ul className="personal-info-header-right claim-detail-v-page top-details">
            {claimDetails && claimDetails.submittedDate && claimDetails.submittedDate &&  (
                    <li>
                        <div className="title">Submitted Date :</div>
                        <div className="text">{claimDetails.submittedDate}</div>
                    </li>
                )} 
                {claimDetails && claimDetails.submittedBy && claimDetails.submittedBy &&  (
                    <li>
                        <div className="title">Submitted by :</div>
                        <div className="text">{claimDetails.submittedBy}</div>
                    </li>
                )}         
                                             
                {claimDetails && claimDetails.claimName && claimDetails.claimNumber &&  (
                    <li>
                        <div className="title">Claim Number :</div>
                        <div className="text">{claimDetails.claimNumber}</div>
                    </li>
                )}                                 
                {claimDetails && claimDetails.claimDate && (
                    <li>
                        <div className="title">Claim Date :</div>
                         <div className="text">{formatDate(claimDetails.claimDate)}</div>
                    </li>
                )} 
            </ul>
        </div>
        
        <div className="col-md-6">
            <ul className="personal-info-header-right claim-detail-v-page top-details"> 
            {claimDetails && claimDetails.claimName &&  (
                <li>
                    <div className="title">Claim Name :</div>
                    <div className="text"> {claimDetails.claimName}</div>
                </li>
            )} 
            {claimDetails && claimDetails.shortCode && (
                <li>
                    <div className="title">Claim Currency :</div>
                    <div className="text">{claimDetails.shortCode ? claimDetails.shortCode : ''}</div>
                </li>              
            )}
            {claimDetails && claimDetails.claimAmount && (
                <li>
                    <div className="title">Claim Amount :</div>
                    <div className="text">{claimDetails.currsymbol} {claimDetails.claimAmount ? claimDetails.claimAmount : ''}</div>
                </li>              
            )}
            {claimDetails && claimDetails.claimMonth && (
                <li>
                    <div className="title">Claim Month :</div>
                    <div className="text"> {claimDetails.claimMonth}</div>               
                 </li>              
            )}
            </ul>
        </div>
    </div>
  )
}
