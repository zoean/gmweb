import axios from 'axios';
import {
  Message
} from 'element-ui'
axios.defaults.timeout = 5000;
axios.defaults.baseURL = process.env.NODE_ENV === "production" ? "https://testgm.jhwx.com" : "/smoke_api";

//http request 拦截器
axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('jhToken');
      config.data = JSON.stringify(config.data);
      config.headers = {
        'Content-Type':'application/json'
      }
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    error => {
      Message({
        message: '服务返回错误，请重试',
        type: 'error'
      })
      return Promise.reject(error);
    }
);

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
    if (response.data && response.data.code == 10002){
      location.href = '/';
      localStorage.removeItem('jhToken');
      localStorage.removeItem('userMenuList');
      localStorage.removeItem('initOptions');
      return response
    }else{
      return response
    }
}, err => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
            console.log('错误请求')
          break;
      }
    } else {
      console.log('连接到服务器失败')
    }
    return Promise.resolve(err.response)
})

export const smoke_get = (url,params = {}) => {
    return new Promise((resolve,reject) => {
      axios.get(url,{
        params:params
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
    })
}

export const smoke_post = (url,params = {}) => {
    return new Promise((resolve,reject) => {
      axios.post(url, params)
        .then(response => {
          response && response.data ? resolve(response.data) : resolve(response)
        },err => {
            reject(err)
        })
    })
}