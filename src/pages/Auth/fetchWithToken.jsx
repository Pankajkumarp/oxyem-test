import axios from 'axios';
const getAccessToken = (cookies) => {
    const cookie = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('accessToken=')) : null;
    return cookie ? cookie.split('=')[1] : null;
};
const getRefreshToken = (cookies) => {
    const cookie = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('refreshToken=')) : null;
    return cookie ? cookie.split('=')[1] : null;
};
export const fetchWithToken = async (url, params = {}, context) => {
    const cookies = context.req.headers.cookie;
    const accessToken = getAccessToken(cookies);
    const refreshToken = getRefreshToken(cookies);
    const headers = accessToken ? { Authorization: accessToken } : {};
    try {
        const response = await axios.get(url, {
            params,
            headers,
        });
        return response.data.data;
    } catch (error) {
        if (error.response?.status === 401 && refreshToken) {
            try {
                const refreshResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/refreshToken`, {
                    rft: refreshToken
                });
                const newAccessToken = refreshResponse.data?.accessToken;
                if (newAccessToken) {
                    const retryResponse = await axios.get(url, {
                        params,
                        headers: { Authorization: newAccessToken },
                    });
                    return retryResponse.data.data;
                } else {
                    throw new Error('Failed to refresh token');
                }
            } catch (refreshError) {
                throw new Error('Failed to refresh token');
            }
        } else {
            console.error("API Error: ", error.response ? error.response.data : error);
            throw error;
        }
    }
};
