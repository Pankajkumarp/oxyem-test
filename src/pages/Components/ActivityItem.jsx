"use client";

import ProfilePic from "./ProfilePic";

export default function ActivityItem({
  avatarUrl,
  name,
  title,
  subtitle,
  time,
}) {
  return (
    // <div className="flex items-start gap-3 py-4">
    //   {/* Profile Pic */}
    //   <ProfilePic src={avatarUrl} name={name} />

    //   {/* Text Content */}
    //   <div className="flex flex-col">
    //     {/* Name + Action */}
    //     <div className="text-sm leading-5">
    //       <span className="fw-bold">
    //         {name}
    //       </span>{" "}
    //       <span className="text-blue-600">
    //         {action}
    //       </span>
    //     </div>

    //     {/* Document Title */}
    //     <div className="mt-1 text-sm font-medium text-blue-600 hover:underline cursor-pointer">
    //       {title}
    //     </div>

    //     {/* Subtitle */}
    //     {subtitle && (
    //       <div className="small text-primary mt-1">
    //         {subtitle}
    //       </div>
    //     )}

    //     {/* Time */}
    //     <div className="mt-1 text-xs text-gray-400">
    //       {time}
    //     </div>
    //   </div>
    // </div>












    <div className="container">
<div className="row justify-content-center">
 
    
{/* <div className="activity-wrapper">
 
  <div className="activity-header">
<h3>Activity</h3>
 
  <div className="activity-dropdown">
<span className="activity-more" id="activityMenuBtn">⋯</span>

</div>
  */}
 
  <div className="activity-list">
 
    {/* <!-- Activity Item --> */}
<div className="activity-item">
<span className="activity-line"></span>
 
      <div className="activity-avatar">
{/* <img src="" alt=""> */}
    <ProfilePic src={avatarUrl} name={name} />

</div>
 
      <div className="activity-content">
<div className="activity-user">
         {name}
</div>
 
        <div className="activity-desc">
<strong> {title}</strong>
</div>
 
        <div className="activity-meta">
           {subtitle}
</div>
 
        <div className="activity-time">
          {time}
</div>
</div>
</div>
 
 
</div>
 
  </div>
</div>
// </div>
// </div>

  );
}
