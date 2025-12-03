import { useState, useEffect } from 'react';
import { axiosJWT } from '../../../Auth/AddAuthorization';
import Link from 'next/link';


export default function CheckPermission({ service, action, children }) {
    const [hasPermission, setHasPermission] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkPermission = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                const response = await axiosJWT.get(`${apiUrl}/checkPermission`, {
                    params: { service, action }
                });

                if (response.data.statusCode === 200 && response.data.message === "ok") {
                    setHasPermission(true);
                } else {
                    setHasPermission(false);
                }
            } catch (error) {
                console.error('Permission check failed', error);
                setHasPermission(false);
            } finally {
                setLoading(false);
            }
        };

        checkPermission();
    }, [service, action]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (hasPermission) {
        return <>{children}</>;
    }

    return (
        <div className="access-denied-wrapper">
            <div className="access-denied-card">
                <img
                    src="/assets/img/access-denied.png"
                    alt="Access Denied"
                    className="access-denied-image"
                />
                <h2 className="access-denied-title">Access Denied!</h2>
                <p className="access-denied-message">
                    Sorry, you do not have permission to access this page.
                </p>
                <p className="access-denied-subtext">
                    If you believe this is an error, please contact your administrator.
                </p>
                
            </div>
        </div>
    );
}
