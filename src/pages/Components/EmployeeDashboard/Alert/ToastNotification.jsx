// ToastNotification.js
import React from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FaRegCheckCircle} from "react-icons/fa";
const ToastNotification = ({ message }) => {
    return toast.success(({ id }) => (
        <div style={{ display: 'flex', alignItems: 'center', borderRadius: '0' }}>
            <FaRegCheckCircle style={{
							fontSize: '35px',
							marginRight: '10px',
							color: '#4caf50'
						}} />
            <span dangerouslySetInnerHTML={{ __html: message }}></span>
            <button
            onClick={() => toast.dismiss(id)}
            style={{
                background: 'none',
				border: 'none',
				color: '#4caf50',
				marginLeft: 'auto',
				cursor: 'pointer',
				fontSize: '20px',
            }}
          >
                {/* <FaTimes /> */}
            </button>
        </div>
    ), {
        icon: null, // Disable default icon
        duration: 7000,
        style: {
            border: '1px solid #4caf50',
            padding: '8px',
            color: '#4caf50',
        },
    });
};

const ToastContainer = () => (
    <Toaster
        position="top-right"
        reverseOrder={false}
    />
);

export { ToastNotification, ToastContainer };
