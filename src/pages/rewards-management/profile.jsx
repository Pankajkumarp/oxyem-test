import React from 'react';
import Avatar from 'react-avatar';
import Link from 'next/link';

export default function Profile({ name, imageurl, size, profilelink, role, designation }) {
    const avatarComponent = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
                name={name}
                src={imageurl}
                size={size || 35}
                textSizeRatio={2}
                round={true}
                style={{
                    marginRight: '10px',
                    objectFit: 'cover' // Add object-fit
                }}
            />
            <div>
                <div>{name}</div>
                {role && <div style={{ fontSize: '12px', color: 'gray' }}>{role}</div>}
                {designation && <div style={{ fontSize: '12px', color: 'gray' }}>{designation}</div>}
            </div>
        </div>
    );

    return profilelink ? (
        <Link href={profilelink} style={{ textDecoration: 'none', color: 'inherit' }}>
            {avatarComponent}
        </Link>
    ) : (
        avatarComponent
    );
}
