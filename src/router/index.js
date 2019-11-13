import Vue from 'vue';
import Router from 'vue-router';

import index from '@/components/Index/Index';
import four from '@/components/Index/Four';
import login from '@/components/Login/Login';
import people from '@/components/Base/People';
import peopleDefault from '@/components/Base/PeopleDefault';
import peopleChange from '@/components/Base/PeopleChange';
import menu from '@/components/Base/Menu';
import role from '@/components/Base/Role';
import zuzhi from '@/components/Base/Zuzhi';
import timeData from '@/components/Statistics/Time';
import everyTime from '@/components/Statistics/EveryTime';
import knowp from '@/components/Knowp/Index';
import classManage from '@/components/Knowp/ClassManage';
import subject from '@/components/Knowp/Subject';
import know from '@/components/Knowp/Know';
import vedio from '@/components/Knowp/Vedio';
import contents from '@/components/Knowp/Contents';
import crm from '@/components/Crm/Index';

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
            path: '/crm/timeData',
            name: 'timeData',
            component: timeData
        },
        {
            path: '/crm/everyTime',
            name: 'everyTime',
            component: everyTime
        },
        {
            path: '/knowp',
            name: 'knowp',
            component: knowp
        },
        {
            path: '/knowp/classManage',
            name: 'classManage',
            component: classManage
        },
        {
            path: '/knowp/subject',
            name: 'subject',
            component: subject
        },
        {
            path: '/knowp/contents',
            name: 'contents',
            component: contents
        },
        {
            path: '/knowp/know',
            name: 'know',
            component: know
        },
        {
            path: '/knowp/vedio',
            name: 'vedio',
            component: vedio
        },
        {
            path: '/crm',
            name: 'crm',
            component: crm
        },
        {
            path: '/404',
            name: '404',
            component: four,
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
