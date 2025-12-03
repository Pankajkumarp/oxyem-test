import React from 'react';
import Avatar from 'react-avatar';
import Link from 'next/link';

export default function Profile({ name, imageurl, size, profilelink }) {
    const avatarComponent = (
        <Avatar
            name={name}
            src={imageurl}
            size={size || 35}
            textSizeRatio={2}
            round={true}
            style={{
                marginRight: '5px',
                objectFit: 'cover' // Add object-fit
            }}
        />
    );

    return profilelink ? (
        <Link href={profilelink}>
            {avatarComponent}
        </Link>
    ) : (
        avatarComponent
    );
}

