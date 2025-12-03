import React from 'react'
export default function loader({ text }) {
    return (
        <div className='loader-box'>
            <div className="loader"></div>
            {text ?
                <h5>{text}</h5>
            : null}
        </div>
    )
}
