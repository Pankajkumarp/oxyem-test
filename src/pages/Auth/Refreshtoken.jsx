import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const axiosJWT = axios.create({
  baseURL: `${apiUrl}`,
});

axiosJWT.interceptors.request.use(async () => {
	Number.prototype.padLeft = function(base,chr){
		const len = (String(base || 10).length - String(this).length)+1;
		return len > 0? new Array(len).join(chr || '0')+this : this;

	}
});

export { axiosJWT };