import Vue from 'vue';
import Router from 'vue-router';

import index from '@/components/Index/Index';
import four from '@/components/Index/Four';
import login from '@/components/Index/Login';

import menu from '@/components/Base/Menu';
import people from '@/components/Base/People';
import peopleDefault from '@/components/Base/PeopleDefault';
import peopleChange from '@/components/Base/PeopleChange';
import peopledataPermiss from '@/components/Base/PeopleDataPermiss';
import role from '@/components/Base/Role';
import zuzhi from '@/components/Base/Zuzhi';

import timeData from '@/components/Crm/TimeData';
import everyTime from '@/components/Crm/EveryTime';
import dataAllocation from '@/components/Crm/DataAllocation';
import proChannel from '@/components/Crm/ProChannel'; //推广渠道管理
import setMembers from '@/components/Crm/SetMembers';
import addMembers from '@/components/Crm/AddMembers';
import firstDay from '@/components/Crm/FirstTime'; //首次咨询
import contactToday from '@/components/Crm/ContactToday'; //今日联系
import sevenDay from '@/components/Crm/SevenDay'; //七日未联系
import allDay from '@/components/Crm/AllDay'; //全部客户
import completed from '@/components/Crm/Completed'; //已成单
import crm from '@/components/Crm/Index';
import recoverData from '@/components/Crm/RecoverData';
import seatData from '@/components/Crm/SeatData';
import overflow from '@/components/Crm/Overflow';
import toallocate from '@/components/Crm/Toallocate';
import enums from '@/components/Crm/Enum';
import extendLinkList from '@/components/Crm/ExtendLinkList';
import enterClues from '@/components/Crm/EnterClues';
import students from '@/components/Crm/Students';
import newStudents from '@/components/Crm/NewStudents';
import registered from '@/components/Crm/Registered';
import headMaster from '@/components/Crm/HeadMaster';
import vip from '@/components/Crm/Vip';
import fieldManagement from '@/components/Crm/FieldManagement';

import knowp from '@/components/Knowp/Index';
import classManage from '@/components/Knowp/ClassManage';
import subject from '@/components/Knowp/Subject';
import know from '@/components/Knowp/Know';
import vedio from '@/components/Knowp/Vedio';
import contents from '@/components/Knowp/Contents';

import activityA from '@/components/Operate/ActivityA';

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
            path: '/base/people/permiss',
            name: 'peopledataPermiss',
            component: peopledataPermiss
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
            path: '/crm/dataStatistics/timeData',
            name: 'timeData',
            component: timeData
        },
        {
            path: '/crm/dataStatistics/everyTime',
            name: 'everyTime',
            component: everyTime
        },
        {
            path: '/crm/dataStatistics/recoverData',
            name: 'recoverData',
            component: recoverData
        },
        {
            path: '/crm/myClient/toallocate',
            name: 'toallocate',
            component: toallocate
        },
        {
            path: '/crm/dataStatistics/seatData',
            name: 'seatData',
            component: seatData
        },
        {
            path: '/crm/dataStatistics/overflow',
            name: 'overflow',
            component: overflow
        },
        {
            path: '/crm/promotion/dataAllocation',
            name: 'dataAllocation',
            component: dataAllocation
        },
        {
            path: '/crm/promotion/proChannel',
            name: 'proChannel',
            component: proChannel
        },
        {
            path: '/crm/myClient/firstTime',
            name: 'firstDay',
            component: firstDay
        },
        {
            path: '/crm/myClient/contactToday',
            name: 'contactToday',
            component: contactToday
        },
        {
            path: '/crm/myClient/sevenDay',
            name: 'sevenDay',
            component: sevenDay
        },
        {
            path: '/crm/myClient/allDay',
            name: 'allDay',
            component: allDay
        },
        {
            path: '/crm/myClient/completed',
            name: 'completed',
            component: completed
        },

        {
            path: '/crm/crmConfig/enums',
            name: 'enums',
            component: enums
        },

        {
            path: '/crm/promotion/extendLinkList',
            name: 'extendLinkList',
            component: extendLinkList
        },

        {
            path: '/crm/promotion/enterClues',
            name: 'enterClues',
            component: enterClues
        },
        
        {
            path: '/crm/crmConfig/fieldManagement',
            name: 'fieldManagement',
            component: fieldManagement
        },
        
        {
            path: '/crm/myStudents/students',
            name: 'students',
            component: students
        },

        {
            path: '/crm/myStudents/newStudents',
            name: 'newStudents',
            component: newStudents
        },

        {
            path: '/crm/eduAdmin/headMaster',
            name: 'headMaster',
            component: headMaster
        },

        {
            path: '/crm/eduAdmin/vip',
            name: 'vip',
            component: vip
        },

        {
            path: '/crm/myClient/registered',
            name: 'registered',
            component: registered
        },

        {
            path: '/crm/setMembers',
            name: 'setMembers',
            component: setMembers
        },
        {
            path: '/crm/addMembers',
            name: 'addMembers',
            component: addMembers
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
            path: '/operate/activityA',
            name: 'activityA',
            component: activityA
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
