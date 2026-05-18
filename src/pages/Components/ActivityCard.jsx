"use client";

import ActivityItem from "./ActivityItem";

export default function ActivityCard() {
  return (
   <>
     <div className="activity-header">
  <h3 className="fw-semibold mb-0">Activity</h3>
  <button className="activity-more">⋯</button>
</div>


      <div className="activity-mainclass">
        <ActivityItem
          name="Sandeep Bawalia"
          action="added"
          title="P••••bduteel Bank Information"
          subtitle="Accounting • ★ 2688"
          time="15s • updated on April 12, 2024"
        />
           <ActivityItem
          name="Mukesh Kaushal"
          action="uploaded"
          title="Investment Declaration Form"
          subtitle="Jan 2026"
          time="45s • updated on April 12, 2024"
        />
           <ActivityItem
          name="Sandeep Bawalia"
          action="added"
          title="P••••bduteel Bank Information"
          subtitle="Accounting • ★ 2688"
          time="15s • updated on April 12, 2024"
        />
      </div>
    </>
  );
}
