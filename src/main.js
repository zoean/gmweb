import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import router from './router'
import store from './vuex/store'
import ElementUI from 'element-ui';
import AFTableColumn from 'af-table-column'
import 'element-ui/lib/theme-chalk/index.css';
import VScrollLock from 'v-scroll-lock'
import { smoke_get, smoke_post } from './request/http' //引入js文件默认是js的后缀
import './assets/css/public.css' //引入css文件要加后缀
import '@/assets/css/common.css'
import 'vue-area-linkage/dist/index.css';
import VueAreaLinkage from 'vue-area-linkage';
import './assets/js/rem'
import '@/icons' // icon
import VueClipboard from 'vue-clipboard2'
import 'default-passive-events'
// import VueAudio from 'vue-audio-better'
 
// Vue.use(VueAudio)

Vue.use(ElementUI, { zIndex: 1000});
Vue.use(VueClipboard);
Vue.use(AFTableColumn);
Vue.use(VScrollLock);
Vue.use(VueAreaLinkage);
Vue.use(Vuex);
Vue.prototype.$smoke_get = smoke_get;
Vue.prototype.$smoke_post = smoke_post;

Vue.config.productionTip = false

// 移动dialogDrag
Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
      const dialogHeaderEl = el.querySelector('.el-dialog__header')
      const dragDom = el.querySelector('.el-dialog')
      dialogHeaderEl.style.cursor = 'move'
   
      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
   
      dialogHeaderEl.onmousedown = (e) => {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft
        const disY = e.clientY - dialogHeaderEl.offsetTop
   
        // 获取到的值带px 正则匹配替换
        let styL, styT
   
        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (sty.left.includes('%')) {
          styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
          styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
        } else {
          styL = +sty.left.replace(/\px/g, '')
          styT = +sty.top.replace(/\px/g, '')
        }
   
        document.onmousemove = function(e) {
          // 通过事件委托，计算移动的距离
          const l = e.clientX - disX
          const t = e.clientY - disY
   
          // 移动当前元素
          dragDom.style.left = `${l + styL}px`
          dragDom.style.top = `${t + styT}px`
   
          // 将此时的位置传出去
          // binding.value({x:e.pageX,y:e.pageY})
        }
   
        document.onmouseup = function(e) {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }
})

//路由守卫
router.beforeEach((to, from, next) => {

    const jhToken = localStorage.getItem("jhToken");

    const userMenuList = JSON.parse(localStorage.getItem("userMenuList"));

    if(to.path === '/forget' || (to.path.indexOf('url') !== -1)) {
        next();
    }else{
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
    }
    
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
