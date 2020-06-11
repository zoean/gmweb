export let pass_word = /^(\w){6,12}$/; //密码必须由6-12位数字或者字母组成

export const columnListYes = [
    { 'prop': 'orgName', 'label': '统计单元' },
    { 'prop': 'title0', 'label': '0--1' },
    { 'prop': 'title1', 'label': '1--2' },
    { 'prop': 'title2', 'label': '2--3' },
    { 'prop': 'title3', 'label': '3--4' },
    { 'prop': 'title4', 'label': '4--5' },
    { 'prop': 'title5', 'label': '5--6' },
    { 'prop': 'title6', 'label': '6--7' },
    { 'prop': 'title7', 'label': '7--8' },
    { 'prop': 'title8', 'label': '8--9' },
    { 'prop': 'title9', 'label': '9--10' },
    { 'prop': 'title10', 'label': '10--11' },
    { 'prop': 'title11', 'label': '11--12' },
    { 'prop': 'title12', 'label': '12--13' },
    { 'prop': 'title13', 'label': '13--14' },
    { 'prop': 'title14', 'label': '14--15' },
    { 'prop': 'title15', 'label': '15--16' },
    { 'prop': 'title16', 'label': '16--17' },
    { 'prop': 'title17', 'label': '17--18' },
    { 'prop': 'title18', 'label': '18--19' },
    { 'prop': 'title19', 'label': '19--20' },
    { 'prop': 'title20', 'label': '20--21' },
    { 'prop': 'title21', 'label': '21--22' },
    { 'prop': 'title22', 'label': '22--23' },
    { 'prop': 'title23', 'label': '23--24' },
    { 'prop': 'totalPassTime', 'label': '全天合计单位：小时' },
]

export const columnListNo = [
    { 'prop': 'orgName', 'label': '手机号码' },
    { 'prop': 'day', 'label': '地区归属' },
    { 'prop': 'totalPassTime', 'label': '姓名' },
    { 'prop': 'totalPassTime', 'label': '性别' },
    { 'prop': 'totalPassTime', 'label': '级别' },
    { 'prop': 'totalPassTime', 'label': '拨通 / 拨打' },
    { 'prop': 'totalPassTime', 'label': '最近一次联系时间' },
    { 'prop': 'totalPassTime', 'label': '最近备注' },
]

export const everyTimeList = [
    { 'prop': 'callerId', 'label': '客户电话' },
    { 'prop': 'callerArea', 'label': '客户归属' },
    { 'prop': 'calledId', 'label': '拨打人电话' },
    { 'prop': 'seatName', 'label': '拨打人姓名' },
    { 'prop': 'seatOrgName', 'label': '拨打人部门' },
    { 'prop': 'callStyle', 'label': '拨打方式' },
    { 'prop': 'insertTime', 'label': '拨打时间' },
    { 'prop': 'isCalledPhone', 'label': '是否接通' },
    { 'prop': 'duration', 'label': '通话时长（秒）' },
    // { 'prop': 'dealState', 'label': '处理状态' },
    { 'prop': 'resume', 'label': '通话备注' },
    // { 'prop': 'areaId', 'label': '号码归属' },
    // { 'prop': 'callStyle', 'label': '呼叫方式' },
    // { 'prop': 'callerQueueTime', 'label': '进入队列' },
    // { 'prop': 'callerStime', 'label': '呼入系统应答时间' },
    // { 'prop': 'dnis', 'label': '中继号码' },
    // { 'prop': 'hangupSide', 'label': '挂机方' },
    // { 'prop': 'insertDbTime', 'label': '插库时间' },
    // { 'prop': 'pathway', 'label': '呼叫途径' },
    // { 'prop': 'phoneId', 'label': '电话记录id' },
    // { 'prop': 'queueName', 'label': '呼叫节点' },
    // { 'prop': 'recordFile', 'label': '录音URL链接' },
    // { 'prop': 'ringTime', 'label': '响铃时长（秒）' },
    // { 'prop': 'satisfactionDegree', 'label': '电话满意度评价' },
    // { 'prop': 'seatId', 'label': '坐席工号' },
    // { 'prop': 'uin', 'label': '座席账号' }
]

export const vedioTypeArr = [
    { 'value': 1, 'label': '录播课时' },
    { 'value': 2, 'label': '直播回放' },
    { 'value': 3, 'label': '短视频' },
]

export const dateList = [
    { 'value': 1, 'label': '星期一' },
    { 'value': 2, 'label': '星期二' },
    { 'value': 3, 'label': '星期三' },
    { 'value': 4, 'label': '星期四' },
    { 'value': 5, 'label': '星期五' },
    { 'value': 6, 'label': '星期六' },
    { 'value': 7, 'label': '星期七' },
]

//枚举编号
export const MJ_1 = 'MJ-1'; //客户学历
export const MJ_2 = 'MJ-2'; //工作年限
export const MJ_3 = 'MJ-3'; //取证目的
export const MJ_4 = 'MJ-4'; //沟通方式
export const MJ_5 = 'MJ-5'; //意向等级
export const MJ_6 = 'MJ-6'; //推广渠道
export const MJ_7 = 'MJ-7'; //推广账号
export const MJ_8 = 'MJ-8'; //公司分校
export const MJ_9 = 'MJ-9'; //jq平台账号
export const MJ_10 = 'MJ-10'; //学籍状态
export const MJ_11 = 'MJ-11'; //学习状况
export const MJ_12 = 'MJ-12'; //跟进类型

//溢出池和回收池 分配至人
export const zuzhiUuid = '2a39b4c564494c58a0b15512a62e7014';

//人员详情角色 超级管理员的 uuid
export const superManageUuid = '383799112b0d47a7a3341bce77f8b776';

//websock
export const websockHttp = 'wss://websocket.jhwx.com/websocket/msg/';

//销售部组织id
export const showid = '544230511a59461c8ed6c82ce2355e17';



















