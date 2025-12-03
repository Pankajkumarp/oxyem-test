import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react';
import CustomDataTable from '../Datatable/tablewithApi';
import OpportunityHistroy from '../Popup/pricingHistroy';
function SummaryView() {

  const router = useRouter();
  const { id } = router.query;
  const onViewClick = (id) => {
    router.push(`/createPricing/view/${id}`);
  };
  const [isModalHistroyOpen, setIsModalHistroyOpen] = useState(false);
  const [opportunityId, setOpportunityId] = useState("");
  const onHistoryClick = async (id) => {
    setOpportunityId(id);
    setIsModalHistroyOpen(true)
  };
  const closeHistroyClick = (id) => {
    setIsModalHistroyOpen(false)
  };
  const onEditClick = (id) => {
    router.push(`/createPricing/${id}`);
  };
  return (
    <>
      <OpportunityHistroy isOpen={isModalHistroyOpen} closeModal={closeHistroyClick} opportunityId={opportunityId} />
      <div>
        <CustomDataTable
          title={""}
          onViewClick={onViewClick}
          onHistoryClick={onHistoryClick}
          onEditClick={onEditClick}
          pagename={"addpayroll"}
          dashboradApi={'/opportunity/summaryListForPrice'}
          idProject={id}
        />
      </div>
    </>
  );
}

export default SummaryView;
