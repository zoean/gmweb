import Vue from 'vue';
import Router from 'vue-router';

import index from '@/components/Index/Index';
import four from '@/components/Index/Four';
import edition from '@/components/Index/Edition';
import login from '@/components/Index/Login';
import forget from '@/components/Index/Forget';
import url from '@/components/Index/Url';

import menu from '@/components/Base/Menu';
import people from '@/components/Base/People';
import peopleDefault from '@/components/Base/PeopleDefault';
import peopleChange from '@/components/Base/PeopleChange';
import peopledataPermiss from '@/components/Base/PeopleDataPermiss';
import role from '@/components/Base/Role';
import zuzhi from '@/components/Base/Zuzhi';
import userRecord from '@/components/Base/UserRecord';

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
import recoverData from '@/components/Crm/RecoverData';
import seatData from '@/components/Crm/SeatData';
import overflow from '@/components/Crm/Overflow';
import toallocate from '@/components/Crm/Toallocate';
import enums from '@/components/Crm/Enum';
import extendLinkList from '@/components/Crm/ExtendLinkList';
import enterClues from '@/components/Crm/EnterClues';
import students from '@/components/Crm/Students';
import agreeMentDetails from '@/components/Crm/AgreeMentDetails';
import newStudents from '@/components/Crm/NewStudents';
import registered from '@/components/Crm/Registered';
import headMaster from '@/components/Crm/HeadMaster';
import allStudents from '@/components/Crm/AllStudents';
import fieldManagement from '@/components/Crm/FieldManagement';
import manageClues from '@/components/Crm/ManageClues';
import peopleClues from '@/components/Crm/PeopleClues';
import sendSMS from '@/components/Crm/SendSMS';
import smslist from '@/components/Crm/SMSlist';
import smsRecord from '@/components/Crm/SMSRecord';
import studentsNewBaoKao from '@/components/Crm/StudentsNewBaoKao';
import studentsAllBaoKao from '@/components/Crm/StudentsAllBaoKao';
import studentsMyBaoKao from '@/components/Crm/StudentsMyBaoKao';
import eduData from '@/components/Crm/EduData';

import salesBoard from '@/components/Crm/SalesBoard';
import salesOrgBoard from '@/components/Crm/SalesOrgBoard';

import orgOpenClass from '@/components/Crm/OrgOpenClass';
import openClass from '@/components/Crm/OpenClass';
import returnOrgVisit from '@/components/Crm/ReturnOrgVisit';
import returnVisit from '@/components/Crm/ReturnVisit';
import wechatManagement from '@/components/Crm/WechatManagement';

import companyYearMbo from '@/components/Crm/companyYearMbo'
import companyMonthMbo from '@/components/Crm/companyMonthMbo'
import companyDayMbo from '@/components/Crm/companyDayMbo'

import departmentYearMbo from '@/components/Crm/departmentYearMbo'
import departmentMonthMbo from '@/components/Crm/departmentMonthMbo'
import departmentDayMbo from '@/components/Crm/departmentDayMbo'

import knowp from '@/components/Knowp/Index';
import classManage from '@/components/Knowp/ClassManage';
import subject from '@/components/Knowp/Subject';
import know from '@/components/Knowp/Know';
import vedio from '@/components/Knowp/Vedio';
import contents from '@/components/Knowp/Contents';


//运营活动
import activityA from '@/components/Operate/ActivityA';
import ActivityDetail  from '@/components/Operate/ActivityDetail'
import partinMember from '@/components/Operate/PartinMember'
import WinningList from '@/components/Operate/WinningList'
import PriceList from '@/components/Operate/PriceList'
import PriceDetail from '@/components/Operate/PriceDetail'
import CreateActivity from '@/components/Operate/CreateActivity'
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
            path: '/forget',
            name: 'forget',
            component: forget
        },
        
        {
            path: '/url/:id',
            name: 'url',
            component: url
        },
        {
            path: '/base/people',
            name: 'people',
            component: people,
            // meta:{
            //     keepAlive:true //需要被缓存的组件
            // },
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
            path: '/base/userRecord',
            name: 'userRecord',
            component: userRecord
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
            path: '/crm/dataStatistics/eduData',
            name: 'eduData',
            component: eduData
        },

        {
            path: '/crm/salesBoard/salesBoard',
            name: 'salesBoard',
            component: salesBoard
        },
        {
            path: '/crm/salesBoard/salesOrgBoard',
            name: 'salesOrgBoard',
            component: salesOrgBoard
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
            path: '/crm/myStudents/agreeMentDetails',
            name: 'agreeMentDetails',
            component: agreeMentDetails
        },

        {
            path: '/crm/eduAdmin/headMaster',
            name: 'headMaster',
            component: headMaster
        },

        {
            path: '/crm/eduAdmin/allStudents',
            name: 'allStudents',
            component: allStudents
        },

        {
            path: '/crm/dataClues/manageClues',
            name: 'manageClues',
            component: manageClues
        },

        {
            path: '/crm/dataClues/peopleClues',
            name: 'peopleClues',
            component: peopleClues
        },

        {
            path: '/crm/sms/sendSMS',
            name: 'sendSMS',
            component: sendSMS
        },

        {
            path: '/crm/sms/smslist',
            name: 'smslist',
            component: smslist
        },

        {
            path: '/crm/sms/smsRecord',
            name: 'smsRecord',
            component: smsRecord
        },

        {
            path: '/crm/baokao/new',
            name: 'studentsNewBaoKao',
            component: studentsNewBaoKao
        },

        {
            path: '/crm/baokao/all',
            name: 'studentsAllBaoKao',
            component: studentsAllBaoKao
        },

        {
            path: '/crm/baokao/my',
            name: 'studentsMyBaoKao',
            component: studentsMyBaoKao
        },

        {
            path: '/crm/class/orgOpenClass',
            name: 'orgOpenClass',
            component: orgOpenClass
        },

        {
            path: '/crm/class/openClass',
            name: 'openClass',
            component: openClass
        },

        {
            path: '/crm/class/returnOrgVisit',
            name: 'returnOrgVisit',
            component: returnOrgVisit
        },

        {
            path: '/crm/class/returnVisit',
            name: 'returnVisit',
            component: returnVisit
        },

        {
            path: '/crm/wechat/wechatManagement',
            name: 'wechatManagement',
            component: wechatManagement
        },

        {
            path: '/crm/mbo/companyyearmbo',
            name: 'companyyearmbo',
            component: companyYearMbo
        },

        {
            path: '/crm/mbo/companymonthmbo',
            name: 'companymonthmbo',
            component: companyMonthMbo
        },

        {
            path: '/crm/mbo/companydaymbo',
            name: 'companydaymbo',
            component: companyDayMbo
        },

        {
            path: '/crm/mbo/departmentyearmbo',
            name: 'departmentyearmbo',
            component: departmentYearMbo
        },

        {
            path: '/crm/mbo/departmentmonthmbo',
            name: 'departmentmonthmbo',
            component: departmentMonthMbo
        },

        {
            path: '/crm/mbo/departmentdaymbo',
            name: 'departmentdaymbo',
            component: departmentDayMbo
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
            name: 'activity',
            component: activityA
        },
        {
            path:'/operate/activityA/createactivity',
            name:'CreateActivity',
            component:CreateActivity
        },  
        {
            path:'/operate/activityA/ActivityDetail',
            name:'activitydetail',
            component:ActivityDetail
        },  
        {
            path:'/operate/activityA/partinMember',
            name:'partinMember',
            component:partinMember
        },
        {
            path:'/operate/activityA/winninglist',
            name:'WinningList',
            component:WinningList
        },
        {
            path:'/operate/activityA/pricelist',
            name:'PriceList',
            component:PriceList
        },
        {
            path:'/operate/activityA/pricedetail',
            name:'pricedetail',
            component:PriceDetail
        },
        {
            path: '/404',
            name: '404',
            component: four,
        },
        {
            path: '/edition',
            name: 'edition',
            component: edition,
        },
        {
            path: '*',
            redirect: '/404'
        }
    ],
    scrollBehavior () {
        return {y: 0}
    }
})
