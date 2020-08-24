"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Index = _interopRequireDefault(require("@/components/Index/Index"));

var _Four = _interopRequireDefault(require("@/components/Index/Four"));

var _Edition = _interopRequireDefault(require("@/components/Index/Edition"));

var _Login = _interopRequireDefault(require("@/components/Index/Login"));

var _Forget = _interopRequireDefault(require("@/components/Index/Forget"));

var _Url = _interopRequireDefault(require("@/components/Index/Url"));

var _Menu = _interopRequireDefault(require("@/components/Base/Menu"));

var _People = _interopRequireDefault(require("@/components/Base/People"));

var _PeopleDefault = _interopRequireDefault(require("@/components/Base/PeopleDefault"));

var _PeopleChange = _interopRequireDefault(require("@/components/Base/PeopleChange"));

var _PeopleDataPermiss = _interopRequireDefault(require("@/components/Base/PeopleDataPermiss"));

var _Role = _interopRequireDefault(require("@/components/Base/Role"));

var _Zuzhi = _interopRequireDefault(require("@/components/Base/Zuzhi"));

var _UserRecord = _interopRequireDefault(require("@/components/Base/UserRecord"));

var _TimeData = _interopRequireDefault(require("@/components/Crm/TimeData"));

var _EveryTime = _interopRequireDefault(require("@/components/Crm/EveryTime"));

var _DataAllocation = _interopRequireDefault(require("@/components/Crm/DataAllocation"));

var _ProChannel = _interopRequireDefault(require("@/components/Crm/ProChannel"));

var _SetMembers = _interopRequireDefault(require("@/components/Crm/SetMembers"));

var _AddMembers = _interopRequireDefault(require("@/components/Crm/AddMembers"));

var _FirstTime = _interopRequireDefault(require("@/components/Crm/FirstTime"));

var _ContactToday = _interopRequireDefault(require("@/components/Crm/ContactToday"));

var _SevenDay = _interopRequireDefault(require("@/components/Crm/SevenDay"));

var _AllDay = _interopRequireDefault(require("@/components/Crm/AllDay"));

var _Completed = _interopRequireDefault(require("@/components/Crm/Completed"));

var _RecoverData = _interopRequireDefault(require("@/components/Crm/RecoverData"));

var _SeatData = _interopRequireDefault(require("@/components/Crm/SeatData"));

var _Overflow = _interopRequireDefault(require("@/components/Crm/Overflow"));

var _Toallocate = _interopRequireDefault(require("@/components/Crm/Toallocate"));

var _Enum = _interopRequireDefault(require("@/components/Crm/Enum"));

var _ExtendLinkList = _interopRequireDefault(require("@/components/Crm/ExtendLinkList"));

var _EnterClues = _interopRequireDefault(require("@/components/Crm/EnterClues"));

var _Students = _interopRequireDefault(require("@/components/Crm/Students"));

var _AgreeMentDetails = _interopRequireDefault(require("@/components/Crm/AgreeMentDetails"));

var _NewStudents = _interopRequireDefault(require("@/components/Crm/NewStudents"));

var _Registered = _interopRequireDefault(require("@/components/Crm/Registered"));

var _HeadMaster = _interopRequireDefault(require("@/components/Crm/HeadMaster"));

var _AllStudents = _interopRequireDefault(require("@/components/Crm/AllStudents"));

var _FieldManagement = _interopRequireDefault(require("@/components/Crm/FieldManagement"));

var _ManageClues = _interopRequireDefault(require("@/components/Crm/ManageClues"));

var _PeopleClues = _interopRequireDefault(require("@/components/Crm/PeopleClues"));

var _SendSMS = _interopRequireDefault(require("@/components/Crm/SendSMS"));

var _SMSlist = _interopRequireDefault(require("@/components/Crm/SMSlist"));

var _SMSRecord = _interopRequireDefault(require("@/components/Crm/SMSRecord"));

var _StudentsNewBaoKao = _interopRequireDefault(require("@/components/Crm/StudentsNewBaoKao"));

var _StudentsAllBaoKao = _interopRequireDefault(require("@/components/Crm/StudentsAllBaoKao"));

var _StudentsMyBaoKao = _interopRequireDefault(require("@/components/Crm/StudentsMyBaoKao"));

var _EduData = _interopRequireDefault(require("@/components/Crm/EduData"));

var _SalesBoard = _interopRequireDefault(require("@/components/Crm/SalesBoard"));

var _SalesOrgBoard = _interopRequireDefault(require("@/components/Crm/SalesOrgBoard"));

var _OrgOpenClass = _interopRequireDefault(require("@/components/Crm/OrgOpenClass"));

var _OpenClass = _interopRequireDefault(require("@/components/Crm/OpenClass"));

var _ReturnOrgVisit = _interopRequireDefault(require("@/components/Crm/ReturnOrgVisit"));

var _ReturnVisit = _interopRequireDefault(require("@/components/Crm/ReturnVisit"));

var _WechatManagement = _interopRequireDefault(require("@/components/Crm/WechatManagement"));

var _companyYearMbo = _interopRequireDefault(require("@/components/Crm/companyYearMbo"));

var _companyMonthMbo = _interopRequireDefault(require("@/components/Crm/companyMonthMbo"));

var _companyDayMbo = _interopRequireDefault(require("@/components/Crm/companyDayMbo"));

var _departmentYearMbo = _interopRequireDefault(require("@/components/Crm/departmentYearMbo"));

var _departmentMonthMbo = _interopRequireDefault(require("@/components/Crm/departmentMonthMbo"));

var _departmentDayMbo = _interopRequireDefault(require("@/components/Crm/departmentDayMbo"));

var _Index2 = _interopRequireDefault(require("@/components/Knowp/Index"));

var _ClassManage = _interopRequireDefault(require("@/components/Knowp/ClassManage"));

var _Subject = _interopRequireDefault(require("@/components/Knowp/Subject"));

var _Know = _interopRequireDefault(require("@/components/Knowp/Know"));

var _Vedio = _interopRequireDefault(require("@/components/Knowp/Vedio"));

var _Contents = _interopRequireDefault(require("@/components/Knowp/Contents"));

var _ActivityA = _interopRequireDefault(require("@/components/Operate/ActivityA"));

var _ActivityDetail = _interopRequireDefault(require("@/components/Operate/ActivityDetail"));

var _PartinMember = _interopRequireDefault(require("@/components/Operate/PartinMember"));

var _WinningList = _interopRequireDefault(require("@/components/Operate/WinningList"));

var _PriceList = _interopRequireDefault(require("@/components/Operate/PriceList"));

var _PriceDetail = _interopRequireDefault(require("@/components/Operate/PriceDetail"));

var _CreateActivity = _interopRequireDefault(require("@/components/Operate/CreateActivity"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//推广渠道管理
//首次咨询
//今日联系
//七日未联系
//全部客户
//已成单
//运营活动
_vue["default"].use(_vueRouter["default"]); // 重写路由


var routerPush = _vueRouter["default"].prototype.push;

_vueRouter["default"].prototype.push = function push(location) {
  return routerPush.call(this, location)["catch"](function (error) {
    return error;
  });
};

var _default = new _vueRouter["default"]({
  // mode: 'history',
  routes: [{
    path: '/',
    name: 'index',
    component: _Index["default"]
  }, {
    path: '/login',
    name: 'login',
    component: _Login["default"]
  }, {
    path: '/forget',
    name: 'forget',
    component: _Forget["default"]
  }, {
    path: '/url/:id',
    name: 'url',
    component: _Url["default"]
  }, {
    path: '/base/people',
    name: 'people',
    component: _People["default"]
  }, {
    path: '/base/people/default',
    name: 'peopleDefault',
    component: _PeopleDefault["default"]
  }, {
    path: '/base/people/change',
    name: 'peopleChange',
    component: _PeopleChange["default"]
  }, {
    path: '/base/people/permiss',
    name: 'peopledataPermiss',
    component: _PeopleDataPermiss["default"]
  }, {
    path: '/base/menu',
    name: 'menu',
    component: _Menu["default"]
  }, {
    path: '/base/role',
    name: 'role',
    component: _Role["default"]
  }, {
    path: '/base/zuzhi',
    name: 'zuzhi',
    component: _Zuzhi["default"]
  }, {
    path: '/base/userRecord',
    name: 'userRecord',
    component: _UserRecord["default"]
  }, {
    path: '/crm/dataStatistics/timeData',
    name: 'timeData',
    component: _TimeData["default"]
  }, {
    path: '/crm/dataStatistics/everyTime',
    name: 'everyTime',
    component: _EveryTime["default"]
  }, {
    path: '/crm/dataStatistics/eduData',
    name: 'eduData',
    component: _EduData["default"]
  }, {
    path: '/crm/salesBoard/salesBoard',
    name: 'salesBoard',
    component: _SalesBoard["default"]
  }, {
    path: '/crm/salesBoard/salesOrgBoard',
    name: 'salesOrgBoard',
    component: _SalesOrgBoard["default"]
  }, {
    path: '/crm/dataStatistics/recoverData',
    name: 'recoverData',
    component: _RecoverData["default"]
  }, {
    path: '/crm/myClient/toallocate',
    name: 'toallocate',
    component: _Toallocate["default"]
  }, {
    path: '/crm/dataStatistics/seatData',
    name: 'seatData',
    component: _SeatData["default"]
  }, {
    path: '/crm/dataStatistics/overflow',
    name: 'overflow',
    component: _Overflow["default"]
  }, {
    path: '/crm/promotion/dataAllocation',
    name: 'dataAllocation',
    component: _DataAllocation["default"]
  }, {
    path: '/crm/promotion/proChannel',
    name: 'proChannel',
    component: _ProChannel["default"]
  }, {
    path: '/crm/myClient/firstTime',
    name: 'firstDay',
    component: _FirstTime["default"]
  }, {
    path: '/crm/myClient/contactToday',
    name: 'contactToday',
    component: _ContactToday["default"]
  }, {
    path: '/crm/myClient/sevenDay',
    name: 'sevenDay',
    component: _SevenDay["default"]
  }, {
    path: '/crm/myClient/allDay',
    name: 'allDay',
    component: _AllDay["default"]
  }, {
    path: '/crm/myClient/completed',
    name: 'completed',
    component: _Completed["default"]
  }, {
    path: '/crm/crmConfig/enums',
    name: 'enums',
    component: _Enum["default"]
  }, {
    path: '/crm/promotion/extendLinkList',
    name: 'extendLinkList',
    component: _ExtendLinkList["default"]
  }, {
    path: '/crm/promotion/enterClues',
    name: 'enterClues',
    component: _EnterClues["default"]
  }, {
    path: '/crm/crmConfig/fieldManagement',
    name: 'fieldManagement',
    component: _FieldManagement["default"]
  }, {
    path: '/crm/myStudents/students',
    name: 'students',
    component: _Students["default"]
  }, {
    path: '/crm/myStudents/newStudents',
    name: 'newStudents',
    component: _NewStudents["default"]
  }, {
    path: '/crm/myStudents/agreeMentDetails',
    name: 'agreeMentDetails',
    component: _AgreeMentDetails["default"]
  }, {
    path: '/crm/eduAdmin/headMaster',
    name: 'headMaster',
    component: _HeadMaster["default"]
  }, {
    path: '/crm/eduAdmin/allStudents',
    name: 'allStudents',
    component: _AllStudents["default"]
  }, {
    path: '/crm/dataClues/manageClues',
    name: 'manageClues',
    component: _ManageClues["default"]
  }, {
    path: '/crm/dataClues/peopleClues',
    name: 'peopleClues',
    component: _PeopleClues["default"]
  }, {
    path: '/crm/sms/sendSMS',
    name: 'sendSMS',
    component: _SendSMS["default"]
  }, {
    path: '/crm/sms/smslist',
    name: 'smslist',
    component: _SMSlist["default"]
  }, {
    path: '/crm/sms/smsRecord',
    name: 'smsRecord',
    component: _SMSRecord["default"]
  }, {
    path: '/crm/baokao/new',
    name: 'studentsNewBaoKao',
    component: _StudentsNewBaoKao["default"]
  }, {
    path: '/crm/baokao/all',
    name: 'studentsAllBaoKao',
    component: _StudentsAllBaoKao["default"]
  }, {
    path: '/crm/baokao/my',
    name: 'studentsMyBaoKao',
    component: _StudentsMyBaoKao["default"]
  }, {
    path: '/crm/class/orgOpenClass',
    name: 'orgOpenClass',
    component: _OrgOpenClass["default"]
  }, {
    path: '/crm/class/openClass',
    name: 'openClass',
    component: _OpenClass["default"]
  }, {
    path: '/crm/class/returnOrgVisit',
    name: 'returnOrgVisit',
    component: _ReturnOrgVisit["default"]
  }, {
    path: '/crm/class/returnVisit',
    name: 'returnVisit',
    component: _ReturnVisit["default"]
  }, {
    path: '/crm/wechat/wechatManagement',
    name: 'wechatManagement',
    component: _WechatManagement["default"]
  }, {
    path: '/crm/mbo/companyyearmbo',
    name: 'companyyearmbo',
    component: _companyYearMbo["default"]
  }, {
    path: '/crm/mbo/companymonthmbo',
    name: 'companymonthmbo',
    component: _companyMonthMbo["default"]
  }, {
    path: '/crm/mbo/companydaymbo',
    name: 'companydaymbo',
    component: _companyDayMbo["default"]
  }, {
    path: '/crm/mbo/departmentyearmbo',
    name: 'departmentyearmbo',
    component: _departmentYearMbo["default"]
  }, {
    path: '/crm/mbo/departmentmonthmbo',
    name: 'departmentmonthmbo',
    component: _departmentMonthMbo["default"]
  }, {
    path: '/crm/mbo/departmentdaymbo',
    name: 'departmentdaymbo',
    component: _departmentDayMbo["default"]
  }, {
    path: '/crm/myClient/registered',
    name: 'registered',
    component: _Registered["default"]
  }, {
    path: '/crm/setMembers',
    name: 'setMembers',
    component: _SetMembers["default"]
  }, {
    path: '/crm/addMembers',
    name: 'addMembers',
    component: _AddMembers["default"]
  }, {
    path: '/knowp',
    name: 'knowp',
    component: _Index2["default"]
  }, {
    path: '/knowp/classManage',
    name: 'classManage',
    component: _ClassManage["default"]
  }, {
    path: '/knowp/subject',
    name: 'subject',
    component: _Subject["default"]
  }, {
    path: '/knowp/contents',
    name: 'contents',
    component: _Contents["default"]
  }, {
    path: '/knowp/know',
    name: 'know',
    component: _Know["default"]
  }, {
    path: '/knowp/vedio',
    name: 'vedio',
    component: _Vedio["default"]
  }, {
    path: '/operate/activityA',
    name: 'activity',
    component: _ActivityA["default"]
  }, {
    path: '/operate/activityA/createactivity',
    name: 'CreateActivity',
    component: _CreateActivity["default"]
  }, {
    path: '/operate/activityA/ActivityDetail',
    name: 'activitydetail',
    component: _ActivityDetail["default"]
  }, {
    path: '/operate/activityA/partinMember',
    name: 'partinMember',
    component: _PartinMember["default"]
  }, {
    path: '/operate/activityA/winninglist',
    name: 'WinningList',
    component: _WinningList["default"]
  }, {
    path: '/operate/activityA/pricelist',
    name: 'PriceList',
    component: _PriceList["default"]
  }, {
    path: '/operate/activityA/pricedetail',
    name: 'pricedetail',
    component: _PriceDetail["default"]
  }, {
    path: '/404',
    name: '404',
    component: _Four["default"]
  }, {
    path: '/edition',
    name: 'edition',
    component: _Edition["default"]
  }, {
    path: '*',
    redirect: '/404'
  }],
  scrollBehavior: function scrollBehavior() {
    return {
      y: 0
    };
  }
});

exports["default"] = _default;