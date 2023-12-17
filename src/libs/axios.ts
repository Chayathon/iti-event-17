import axios from "axios";

//create an axios instance
const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL, // api base_url
  timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  }
);

// response interceptor

service.interceptors.response.use(
  (response) => {
    // do something with response data
    return response;
  },
  (error) => {
    // do something with response error
    return Promise.reject(error);
  }
);

export default service;

//make fetcher for SWR
export const fetcher = (url: string) =>
  service.get(url).then((res) => res.data);
