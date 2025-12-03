import React from 'react'
import { BiErrorCircle } from "react-icons/bi";
function Networkerror() {
    return (
        <>
            <div id="messages-container">
                <div className="alert alert-danger sk-neterror-icon" role="alert">
				<BiErrorCircle />
                    <p>Oops, seems there is an intermittent issue while loading the content.  Please refresh this page or login again or try to connect after some time. </p>
                    <p>Our team is actively addressing the issue, and we expect to have it resolved as soon as possible. You may notice intermittent disruptions in your app experience while we work on a fix. We apologize for any inconvenience this may cause.</p>
                </div>
            </div>
        </>
    )
}

export default Networkerror