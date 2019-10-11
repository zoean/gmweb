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

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
