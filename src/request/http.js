import axios from 'axios';
// import axiosRetry from 'axios-retry'
import {
  Message
} from 'element-ui'
axios.defaults.baseURL = "";
axios.defaults.timeout = 6000;

// axiosRetry(axios, {
//   retries: 3, // 设置自动发送请求次数
//   retryDelay: () => 6000, // 重新请求的间隔
//   shouldResetTimeout: true, //  重置超时时间
//   retryCondition: (error) => { // true为打开自动发送请求，false为关闭自动发送请求
//     // if (error.message.includes('timeout')) return true
//     // 如果你要在请求出错的时候重新发送请求（返回400以上的状态码时） 你应该像下面这样写
//     // if (error.message.includes('timeout') || error.message.includes('status code')) return true
//   }
// })

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
      Message({
        message: '服务器连接超时，请重试',
        type: 'error'
      })
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

export const smoke_post_big = (url,params = {},time) => {
  return new Promise((resolve,reject) => {
    axios.post(url, params, {timeout: time})
      .then(response => {
        response && response.data ? resolve(response.data) : resolve(response)
      },err => {
          reject(err)
      })
  })
}