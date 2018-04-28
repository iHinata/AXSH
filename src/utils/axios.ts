import axios from 'axios';
import {baseURL} from './context';

const instance = axios.create({
  baseURL: baseURL
});

// 网络请求之前的预处理
instance.interceptors.request.use(config => config,
  error => Promise.reject(error));


// 网络请求之后的处理
instance.interceptors.response.use(response => {
  if (response.headers['content-type'] === 'text/html') {
    // window.location.href = `${instance.defaults.baseURL}#/login`;
  }
  return response;
}, error => {
  if (typeof error.response === 'undefined') {
    // window.location.href = `${instance.defaults.baseURL}#/login`;
  }
  return Promise.resolve(error.response);
});


export default instance;
