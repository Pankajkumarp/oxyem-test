import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const authenticatedRequest = async (axiosConfig) => {
    let accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    const makeRequest = async (token) => {
        return axios({
            ...axiosConfig,
            headers: {
                ...(axiosConfig.headers || {}),
                Authorization: token,
            },
        });
    };

    try {
        return await makeRequest(accessToken);
    } catch (error) {
        if (error.response?.status === 401 && refreshToken) {
            try {
                const refreshResponse = await axios.post(`${apiUrl}/users/refreshToken`, {
                    rft: refreshToken,
                });

                const newAccessToken = refreshResponse.data.accessToken;
                Cookies.set('accessToken', newAccessToken, { secure: true });

                return await makeRequest(newAccessToken);
            } catch (refreshError) {
                throw new Error('Session expired. Please log in again.');
            }
        } else {
            throw error;
        }
    }
};

export default authenticatedRequest;
