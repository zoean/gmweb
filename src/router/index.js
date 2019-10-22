import Vue from 'vue';
import Router from 'vue-router';

import index from '@/components/Index/Index';
import login from '@/components/Login/Login';
import people from '@/components/Base/People';
import peopleDefault from '@/components/Base/PeopleDefault';
import peopleChange from '@/components/Base/PeopleChange';
import menu from '@/components/Base/Menu';
import role from '@/components/Base/Role';
import zuzhi from '@/components/Base/Zuzhi';
import timeData from '@/components/Statistics/Time';

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
            component: index
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/base/people',
            name: 'people',
            component: people
        },
        {
            path: '/base/people/default',
            name: 'peopleDefault',
            component: peopleDefault
        },
        {
            path: '/base/people/change',
            name: 'peopleChange',
            component: peopleChange
        },
        {
            path: '/base/menu',
            name: 'menu',
            component: menu
        },
        {
            path: '/base/role',
            name: 'role',
            component: role
        },
        {
            path: '/base/zuzhi',
            name: 'zuzhi',
            component: zuzhi
        },
        {
            path: '/timeData',
            name: 'timeData',
            component: timeData
        },
    ]
})
