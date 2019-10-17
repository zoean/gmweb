import Vue from 'vue';
import Router from 'vue-router';

import Index from '@/components/Index/Index';
import Login from '@/components/Login/Login';
import People from '@/components/Base/People';
import Menu from '@/components/Base/Menu';
import Role from '@/components/Base/Role';
import Zuzhi from '@/components/Base/Zuzhi';

Vue.use(Router);

// 重写路由
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

export default new Router({
    // mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/base/people',
            name: 'people',
            component: People
        },
        {
            path: '/base/menu',
            name: 'menu',
            component: Menu
        },
        {
            path: '/base/role',
            name: 'role',
            component: Role
        },
        {
            path: '/base/zuzhi',
            name: 'zuzhi',
            component: Zuzhi
        },
    ]
})
