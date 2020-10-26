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
import todayFirstTime from '@/components/Crm/TodayFirstTime'
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
import examManage from '@/components/Crm/ExamManage';
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
import refuseClues from '@/components/Crm/RefuseCludes';
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
            component: index,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/login',
            name: 'login',
            component: login,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/forget',
            name: 'forget',
            component: forget,
            meta: {
                title: '全部客户'
            }
        },

        {
            path: '/url/:id',
            name: 'url',
            component: url,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/base/people',
            name: 'people',
            component: people,
            // meta:{
            //     keepAlive:true //需要被缓存的组件}
            meta: {
                title: '员工管理'
            }
        },
        {
            path: '/base/people/default',
            name: 'peopleDefault',
            component: peopleDefault,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/base/people/change',
            name: 'peopleChange',
            component: peopleChange,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/base/people/permiss',
            name: 'peopledataPermiss',
            component: peopledataPermiss,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/base/menu',
            name: 'menu',
            component: menu,
            meta: {
                title: '菜单管理'
            }
        },
        {
            path: '/base/role',
            name: 'role',
            component: role,
            meta: {
                title: '角色管理'
            }
        },
        {
            path: '/base/zuzhi',
            name: 'zuzhi',
            component: zuzhi,
            meta: {
                title: '组织结构管理'
            }
        },
        {
            path: '/base/userRecord',
            name: 'userRecord',
            component: userRecord,
            meta: {
                title: '用户操作记录'
            }
        },

        {
            path: '/crm/dataStatistics/timeData',
            name: 'timeData',
            component: timeData,
            meta: {
                title: '通时数据统计'
            }
        },
        {
            path: '/crm/dataStatistics/everyTime',
            name: 'everyTime',
            component: everyTime,
            meta: {
                title: '电话记录查询'
            }
        },
        {
            path: '/crm/dataStatistics/eduData',
            name: 'eduData',
            component: eduData,
            meta: {
                title: '教务统计'
            }
        },

        {
            path: '/crm/salesBoard/salesBoard',
            name: 'salesBoard',
            component: salesBoard,
            meta: {
                title: '销售看板'
            }
        },
        {
            path: '/crm/salesBoard/salesOrgBoard',
            name: 'salesOrgBoard',
            component: salesOrgBoard,
            meta: {
                title: '销售主管看板'
            }
        },

        {
            path: '/crm/dataStatistics/recoverData',
            name: 'recoverData',
            component: recoverData,
            meta: {
                title: '公共池数据管理'
            }
        },
        {
            path: '/crm/myClient/toallocate',
            name: 'toallocate',
            component: toallocate,
            meta: {
                title: '可领取公池数据'
            }
        },
        {
            path: '/crm/dataStatistics/seatData',
            name: 'seatData',
            component: seatData,
            meta: {
                title: '坐席数据管理'
            }
        },
        {
            path: '/crm/dataStatistics/overflow',
            name: 'overflow',
            component: overflow,
            meta: {
                title: '溢出池数据管理'
            }
        },
        {
            path: '/crm/promotion/dataAllocation',
            name: 'dataAllocation',
            component: dataAllocation,
            meta: {
                title: '分配引擎配置'
            }
        },
        {
            path: '/crm/promotion/proChannel',
            name: 'proChannel',
            component: proChannel,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/crm/myClient/todayFirstTime',
            name: 'todayFirstTime',
            component: todayFirstTime,
            meta: {
                title: '今日首咨'
            }
        },
        {
            path: '/crm/myClient/firstTime',
            name: 'firstDay',
            component: firstDay,
            meta: {
                title: '首次咨询'
            }
        },
        {
            path: '/crm/myClient/contactToday',
            name: 'contactToday',
            component: contactToday,
            meta: {
                title: '今日联系'
            }
        },
        {
            path: '/crm/myClient/sevenDay',
            name: 'sevenDay',
            component: sevenDay,
            meta: {
                title: '三日未联'
            }
        },
        {
            path: '/crm/myClient/allDay',
            name: 'allDay',
            component: allDay,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/crm/myClient/completed',
            name: 'completed',
            component: completed,
            meta: {
                title: '已成单'
            }
        },

        {
            path: '/crm/crmConfig/enums',
            name: 'enums',
            component: enums,
            meta: {
                title: '枚举类型管理'
            }
        },

        {
            path: '/crm/crmConfig/examManage',
            name: 'examManage',
            component: examManage,
            meta: {
                title: '考期管理'
            }
        },

        {
            path: '/crm/promotion/extendLinkList',
            name: 'extendLinkList',
            component: extendLinkList,
            meta: {
                title: '推广链接记录'
            }
        },

        {
            path: '/crm/promotion/enterClues',
            name: 'enterClues',
            component: enterClues,
            meta: {
                title: '录入线索'
            }
        },

        {
            path: '/crm/crmConfig/fieldManagement',
            name: 'fieldManagement',
            component: fieldManagement,
            meta: {
                title: '页面字段管理'
            }
        },

        {
            path: '/crm/myStudents/students',
            name: 'students',
            component: students,
            meta: {
                title: '我的学员'
            }
        },

        {
            path: '/crm/myStudents/newStudents',
            name: 'newStudents',
            component: newStudents,
            meta: {
                title: '新学员管理'
            }
        },

        {
            path: '/crm/myStudents/agreeMentDetails',
            name: 'agreeMentDetails',
            component: agreeMentDetails,
            meta: {
                title: '全部客户'
            }
        },

        {
            path: '/crm/eduAdmin/headMaster',
            name: 'headMaster',
            component: headMaster,
            meta: {
                title: '班级管理'
            }
        },

        {
            path: '/crm/eduAdmin/allStudents',
            name: 'allStudents',
            component: allStudents,
            meta: {
                title: '所辖学员'
            }
        },

        {
            path: '/crm/dataClues/manageClues',
            name: 'manageClues',
            component: manageClues,
            meta: {
                title: '主管线索'
            }
        },

        {
            path: '/crm/dataClues/peopleClues',
            name: 'peopleClues',
            component: peopleClues,
            meta: {
                title: '个人线索'
            }
        },

        {
            path: '/crm/dataClues/refuseClues',
            name: 'refuseClues',
            component: refuseClues,
            meta: {
                title: '线索垃圾站'
            }
        },

        {
            path: '/crm/sms/sendSMS',
            name: 'sendSMS',
            component: sendSMS,
            meta: {
                title: '全部客户'
            }
        },

        {
            path: '/crm/sms/smslist',
            name: 'smslist',
            component: smslist,
            meta: {
                title: '短信内容记录'
            }
        },

        {
            path: '/crm/sms/smsRecord',
            name: 'smsRecord',
            component: smsRecord,
            meta: {
                title: '短信发送记录'
            }
        },

        {
            path: '/crm/baokao/new',
            name: 'studentsNewBaoKao',
            component: studentsNewBaoKao,
            meta: {
                title: '报考学员管理'
            }
        },

        {
            path: '/crm/baokao/all',
            name: 'studentsAllBaoKao',
            component: studentsAllBaoKao,
            meta: {
                title: '报考员管理'
            }
        },

        {
            path: '/crm/baokao/my',
            name: 'studentsMyBaoKao',
            component: studentsMyBaoKao,
            meta: {
                title: '报考管理'
            }
        },

        {
            path: '/crm/class/orgOpenClass',
            name: 'orgOpenClass',
            component: orgOpenClass,
            meta: {
                title: '开班监控'
            }
        },

        {
            path: '/crm/class/openClass',
            name: 'openClass',
            component: openClass,
            meta: {
                title: '开班及时度'
            }
        },

        {
            path: '/crm/class/returnOrgVisit',
            name: 'returnOrgVisit',
            component: returnOrgVisit,
            meta: {
                title: '回访监控'
            }
        },

        {
            path: '/crm/class/returnVisit',
            name: 'returnVisit',
            component: returnVisit,
            meta: {
                title: '回访及时度'
            }
        },

        {
            path: '/crm/wechat/wechatManagement',
            name: 'wechatManagement',
            component: wechatManagement,
            meta: {
                title: '微信管理'
            }
        },

        {
            path: '/crm/mbo/companyyearmbo',
            name: 'companyyearmbo',
            component: companyYearMbo,
            meta: {
                title: '全部客户'
            }
        },

        {
            path: '/crm/mbo/companymonthmbo',
            name: 'companymonthmbo',
            component: companyMonthMbo,
            meta: {
                title: '全部客户'
            }
        },

        {
            path: '/crm/mbo/companydaymbo',
            name: 'companydaymbo',
            component: companyDayMbo,
            meta: {
                title: '全部客户'
            }
        },

        {
            path: '/crm/mbo/departmentyearmbo',
            name: 'departmentyearmbo',
            component: departmentYearMbo,
            meta: {
                title: '全部客户'
            }
        },

        {
            path: '/crm/mbo/departmentmonthmbo',
            name: 'departmentmonthmbo',
            component: departmentMonthMbo,
            meta: {
                title: '全部客户'
            }
        },

        {
            path: '/crm/mbo/departmentdaymbo',
            name: 'departmentdaymbo',
            component: departmentDayMbo,
            meta: {
                title: '全部客户'
            }
        },

        {
            path: '/crm/myClient/registered',
            name: 'registered',
            component: registered,
            meta: {
                title: '已注册'
            }
        },

        {
            path: '/crm/setMembers',
            name: 'setMembers',
            component: setMembers,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/crm/addMembers',
            name: 'addMembers',
            component: addMembers,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/knowp',
            name: 'knowp',
            component: knowp,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/knowp/classManage',
            name: 'classManage',
            component: classManage,
            meta: {
                title: '项目结构管理'
            }
        },
        {
            path: '/knowp/subject',
            name: 'subject',
            component: subject,
            meta: {
                title: '科目管理'
            }
        },
        {
            path: '/knowp/contents',
            name: 'contents',
            component: contents,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/knowp/know',
            name: 'know',
            component: know,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/knowp/vedio',
            name: 'vedio',
            component: vedio,
            meta: {
                title: '视频资源管理'
            }
        },

        {
            path: '/operate/activityA',
            name: 'activity',
            component: activityA,
            meta: {
                title: '全部客户'
            }
        },
        {
            path:'/operate/activityA/createactivity',
            name:'CreateActivity',
            component:CreateActivity,
            meta: {
                title: '全部客户'
            }
        },
        {
            path:'/operate/activityA/ActivityDetail',
            name:'activitydetail',
            component:ActivityDetail,
            meta: {
                title: '全部客户'
            }
        },
        {
            path:'/operate/activityA/partinMember',
            name:'partinMember',
            component:partinMember,
            meta: {
                title: '全部客户'
            }
        },
        {
            path:'/operate/activityA/winninglist',
            name:'WinningList',
            component:WinningList,
            meta: {
                title: '全部客户'
            }
        },
        {
            path:'/operate/activityA/pricelist',
            name:'PriceList',
            component:PriceList,
            meta: {
                title: '全部客户'
            }
        },
        {
            path:'/operate/activityA/pricedetail',
            name:'pricedetail',
            component:PriceDetail,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/404',
            name: '404',
            component: four,
            meta: {
                title: '全部客户'
            }
        },
        {
            path: '/edition',
            name: 'edition',
            component: edition,
            meta: {
                title: '全部客户'
            }
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
