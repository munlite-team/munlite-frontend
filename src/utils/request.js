import axios from 'axios';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 7000,
  // request timeout
});

// request interceptor
// service.interceptors.request.use(
//   (config) => {
//     // do something before request is sent
//     // eslint-disable-next-line no-param-reassign
//     config.headers['Content-Type'] = 'application/json';
//     return config;
//   },
//   (error) => {
//     // do something with request error
//     console.log(error); // for debug
//     return Promise.reject(error);
//   },
// );

export default service;
