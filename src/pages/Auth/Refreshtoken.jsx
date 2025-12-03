import axios from 'axios';
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import CryptoJS from "crypto-js";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const axiosJWT = axios.create({
  baseURL: `${apiUrl}`,
});

const ff ="gkgjgng"

axiosJWT.interceptors.request.use(async (config) => {
	console.log("accessToken")
	Number.prototype.padLeft = function(base,chr){
		const len = (String(base || 10).length - String(this).length)+1;
		return len > 0? new Array(len).join(chr || '0')+this : this;

	}

	const accessToken = Cookies.get('accessToken');
	const refreshToken = Cookies.get('refreshToken');
	console.log("accessToken",accessToken)
	console.log("refreshToken",refreshToken)
	
});

export { axiosJWT };