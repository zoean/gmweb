import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import router from './router'
import store from './vuex/store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { smoke_get, smoke_post } from './request/http' //引入js文件默认是js的后缀
import './assets/css/public-mobile.css' //引入css文件要加后缀
import './assets/js/rem'

Vue.use(ElementUI);
Vue.use(Vuex);
Vue.prototype.$smoke_get = smoke_get;
Vue.prototype.$smoke_post = smoke_post;

Vue.config.productionTip = false

//路由守卫
router.beforeEach((to, from, next) => {

    const jhToken = localStorage.getItem("jhToken");

    const userMenuList = JSON.parse(localStorage.getItem("userMenuList"));
    // console.log(userMenuList);

    if (!jhToken) {//未登录
        if (to.path !== '/login') {//跳转到登录页    
            return next({path: '/login'});
        }else {
            next();
        }
    }else {//已登录
        if (to.path === '/login') {//跳转到首页
            return next({path: '/'});
        }else{
            userMenuList.map(res => {
                if(res.includeSubsetList.length != 0){
                    res.includeSubsetList.map(lls => {
                        if(to.path == lls.url){
                            if(!lls.disabled){
                                return next({path: '/404'});
                            }else{
                                next();
                            }
                        }else{
                            next();
                        }
                    })
                }else{
                    if(to.path == res.url){
                        if(!res.disabled){
                            return next({path: '/404'});
                        }else{
                            next();
                        }
                    }else{
                        next();
                    }
                    next();
                }
                next();
            })
            next();
        }
        next();
    }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
