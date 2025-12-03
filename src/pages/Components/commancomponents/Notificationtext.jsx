import React from 'react'
import Profile from './profile';
export default function Notificationtext({ id, name, imageUrl, profilelink, toptext, maintext, bottomtext, iconsize }) {
    
    const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_BASE_URL;
    return (
        <span key={id} className="dropdown-item oxyem-notifi-dropdown d-flex align-items-center">
            <div className="me-2">
                <div className="avatar avatar-md oxyem-notifi-image">
                    <Profile name={name} imageurl={imageUrl} size={iconsize} profilelink={`${websiteUrl}/employeeDashboard/${profilelink}`} />
                </div>
            </div>
            <div className="flex-grow-1">
                {toptext ? (
                    <p className="noti-heading">{toptext}</p>
                ) : (<></>)}
                {maintext ? (
                    <p className="noti-details"><span className="noti-title">{maintext}</span></p>
                ) : (<></>)}
                {bottomtext ? (
                    <p className="noti-time">
                        <span className="notification-time">{bottomtext}</span>
                    </p>
                ) : (<></>)}
            </div>
        </span>
    )
}
