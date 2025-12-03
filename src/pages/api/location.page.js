import {ApiError, ApiResponse, ClientError, IpInfo, IpregistryClient} from '@ipregistry/client';
export default async function handler(req, res) {
  try {
	const client = new IpregistryClient('ira_lFI6hMNV4xfYgCItcw66J6SZxJA8nF4FpRp5');
    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp = forwardedFor ? forwardedFor.split(',')[0] : req.connection.remoteAddress;
    if (clientIp) {
		client.lookupIp(clientIp).then(response => {
        res.status(200).json({
          city: response.data.location.city,
          state: response.data.location.region.name,
          country: response.data.location.country.name
        });
  
    }).catch(error => {
        console.error(error);
    });
    } else {
      res.status(400).json({ error: 'Failed to retrieve IP address' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Failed to extract data', details: error.message });
  }
} 