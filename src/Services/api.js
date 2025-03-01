import axios from 'axios';
const apiUrl = import.meta.env.VITE_URL_API;
const token = import.meta.env.VITE_TOKEN;
const email = import.meta.env.VITE_EMAIL;
const password = import.meta.env.VITE_PASSWORD;
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

export const fetchInvoices = async (page = 1, filters = {}) => {
  const params = {
    page,
    ...filters,
  };
  console.log(apiUrl);
  
  const response = await axios.get(`${apiUrl}/v1/bills`, {
     params,
     headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
 
    },
    });
  return response.data.data;
};