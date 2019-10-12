import axios from 'axios';

axios.defaults.timeout = 5000;
axios.defaults.baseURL = process.env.NODE_ENV === "production" ? "https://testgm.jhwx.com" : "";

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
      return Promise.reject(err);
    }
);

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
    // console.log(response);
    // if (response.data.code < 10008 && response.data.code != 200){
    //   location.href = '/login';
    // }else{
    //   return response
    // }
    return response
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
            resolve(response.data);
        },err => {
            reject(err)
        })
    })
}