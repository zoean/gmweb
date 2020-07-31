import {
  Message
} from 'element-ui'
import axios from 'axios';

export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}

export const getTextByJs = (arr) => {
    let str = "";
    for (var i = 0; i < arr.length; i++) {
        if(arr[i].name == undefined){
            str = '';
        }else{
            str += arr[i].name+ "，";
        }
    }
    //去掉最后一个逗号(如果不需要去掉，就不用写)
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }else{
        str = '无';
    }
    return str;
}

export const getTextByState = (state) => {
    let str = '';
    if(state == 1){
        str = '在职';
    }else if(state == 0){
        str = '离职';
    }
    return str;
}

// 查看通时数据text转换
export const getTextByTime = (state, state1, state2, text1, text2) => {
    let str = '';
    if(state == state1){
        str = text1;
    }else if(state == state2){
        str = text2;
    }
    return str;
}

export const timestampToTime = (timestamp) => {
    if(timestamp == '' || timestamp == 0){
        return '- -';
    }else{
        var date = timestamp.length == 10 ? new Date(timestamp * 1000) : new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = (date.getDate() + 1 < 11 ? '0' + date.getDate() : date.getDate()) + ' ';
        var h = date.getHours() + ':';
        var m = (date.getMinutes() + 1 < 11 ? '0' + date.getMinutes()  : date.getMinutes()) + ':'
        var s = (date.getSeconds() + 1 < 11 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
    }
}

export const getCurrentDate = (seperator) => {
    var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator + month + seperator + strDate;
        return currentdate;
}

export const backType = (type) => {
    let str = '';
    if(type == '1'){
        str = '首咨';
    }else if(type == '2'){
        str = '回收池';
    }
    return str;
}

export const schoolType = (type) => {
    let str = '';
    if(type == 'jhwx'){
        str = '慧众';
    }else if(type == 'shengxuewangxiao'){
        str = '胜学';
    }else if(type == 'jhwxedu'){
        str = '集团';
    }
    return str;
}

export const smoke_MJ_5 = (type) => {
    let str = '';
    if(type == '1'){
        str = 'A+';
    }else if(type == '2'){
        str = 'A';
    }else if(type == '3'){
        str = 'B';
    }else if(type == '4'){
        str = 'C';
    }else if(type == '5'){
        str = 'D';
    }else if(type == '6'){
        str = 'E';
    }
    return str;
}

export const genderText = (id) => {
    let str;
    switch (id) {
        case 0:
            str = '女';
            break;
        case 1:
            str = '男';
            break;
        case 2:
            str = '';
            break;
    }
    return str;
}

export const educationText = (id) => {
    let str;
    switch (id) {
        case 1:
            str = '初中以下';
            break;
        case 2:
            str = '高中';
            break;
        case 3:
            str = '大专';
            break;
        case 4:
            str = '本科';
            break;
        case 5:
            str = '硕士';
            break;
        case 6:
            str = '博士';
            break;
        case 7:
            str = '中专';
            break;
    }
    return str;
}

export const educationTypeText = (id) => {
    let str;
    switch (id) {
        case 1:
            str = '全日制统招';
            break;
        case 2:
            str = '成人教育';
            break;
        case 3:
            str = '自学考试';
            break;
        case 4:
            str = '网络教育';
            break;
        case 5:
            str = '国家开放大学';
            break;
    }
    return str;
}

export const smoke_MJ_6 = (type) => {
    let str = '';
    if(type == '1'){
        str = '百度信息流';
    }else if(type == '2'){
        str = '头条信息流';
    }else if(type == '3'){
        str = '自制推广页';
    }else if(type == '4'){
        str = '京华官网';
    }else if(type == '5'){
        str = '京华APP';
    }else if(type == '6'){
        str = '京华小程序';
    }else if(type == '7'){
        str = '京华公众号';
    }else if(type == '8'){
        str = '胜学官网';
    }else if(type == '9'){
        str = '集团官网';
    }
    return str;
}

export const smoke_MJ_4 = (type) => {
    let str;
    switch (type) {
        case 1:
            str = '座机外呼';
            break;
        case 2:
            str = '微信沟通';
            break;
        case 3:
            str = '手机外呼';
            break;
        case 0:
            str = '其他';
            break;
    }
    return str;
}

export const pathWayText = (type) => {
    let str = '';
    if(type == 1){
        str = '呼叫中心';
    }else if(type == 2){
        str = '工作手机';
    }
    return str;
}

export const timeReturn = (time) => {
    let result = parseInt(time)
    let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
    let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
    let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
    result = `${h}:${m}:${s}`
    return result
}

export const classTypeText = (id) => {
    let str;
    switch (id) {
        case 1:
            str = '2019年一级注册消防工程师【300分梦想签约班】';
            break;
        case 2:
            str = '2019年一级注册消防工程师【名师冠名取证班】';
            break;
        case 3:
            str = '2019年一级注册消防工程师【300小时集训班】';
            break;
    }
    return str;
}

export const classTypeString = (id) => {
    let str;
    switch (id) {
        case 0:
            str = '普通班';
            break;
        case 1:
            str = '高端班';
            break;
    }
    return str;
}

export const orderTypeText = (id) => {
    let str;
    switch (id) {
        case 0:
            str = '普通单';
            break;
        case 1:
            str = '定金单';
            break;
        case 2:
            str = '尾款单';
            break;
    }
    return str;
}

export const backEnable = (enable) => {
    let str = '';
    if(enable == '1'){
        str = '开启';
    }else if(enable == '0'){
        str = '关闭';
    }
    return str;
}

// 去重数组中的对象
export const deteleObject = (obj) => {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
            return (Number(a) - Number(b));
        });
        var str = '';
        for (var j = 0; j < keys.length; j++) {
            str += JSON.stringify(keys[j]);
            str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
            uniques.push(obj[i]);
            stringify[str] = true;
        }
    }
    uniques = uniques;
    return uniques;
}

// 删除数组中的某一个对象
export const removeObject = (_arr, _obj) => {
    var length = _arr.length;
    for (var i = 0; i < length; i++) {
        if (_arr[i] == _obj) {
            if (i == 0) {
                _arr.shift(); //删除并返回数组的第一个元素
                return _arr;
            }
            else if (i == length - 1) {
                _arr.pop();  //删除并返回数组的最后一个元素
                return _arr;
            }
            else {
                _arr.splice(i, 1); //删除下标为i的元素
                return _arr;
            }
        }
    }
}

//删除数组中的指定元素
export const removeEvery = (str, arr) => {
    const index = arr.indexOf(str);
    arr.splice(index, 1);
    return arr;
}

export const classTextById = (id) => {
    let str;
    switch (id) {
        case 1:
            str = '一级分类';
            break;
        case 2:
            str = '二级分类';
            break;
        case 3:
            str = '考试项目';
            break;
        case 4:
            str = '科目';
            break;
    }
    return str;
}

export const workingLifeText = (id) => {
    let str;
    switch (id) {
        case 1:
            str = '尚未工作';
            break;
        case 2:
            str = '1年';
            break;
        case 3:
            str = '2年';
            break;
        case 4:
            str = '3年';
            break;
        case 5:
            str = '4年';
            break;
        case 6:
            str = '5年';
            break;
        case 7:
            str = '6年';
            break;
        case 8:
            str = '7年';
            break;
        case 9:
            str = '8年';
            break;
        case 10:
            str = '9年';
            break;
        case 11:
            str = '10年';
            break;
        case 12:
            str = '10年以上';
            break;
    }
    return str;
}

export const evidencePurposeText = (id) => {
    let str;
    switch (id) {
        case 1:
            str = '获取额外收入';
            break;
        case 2:
            str = '工作使用';
            break;
        case 3:
            str = '充实学习';
            break;
        case 4:
            str = '其它';
            break;
    }
    return str;
}

export const emphasisLevelByText = (id) => {
    let str;
    switch (id) {
        case 1:
            str = 'A';
            break;
        case 2:
            str = 'B';
            break;
        case 3:
            str = 'C';
            break;
        case 4:
            str = 'D';
            break;
    }
    return str;
}

export const sortTextNum = (text) => {
    let str;
    switch (text) {
        case 'jobNumber':
            str = 0;
            break;
        case 'createTime':
            str = 0;
            break;
        case 'school':
            str = 1;
            break;
        case 'name':
            str = 1;
            break;
        case 'receiveTime':
            str = 1;
            break;
        case 'hiredDate':
            str = 2;
            break;
        case 'jobStatus':
            str = 3;
            break;
    }
    return str;
}

export const sortNumberMove = (arr, scope, move) => {
    let json = {};
    arr.map((sll, index) => {
        if(scope.uuid == sll.uuid){
            json.moveSortNumber = sll.sortNumber;
            json.moveUuid = sll.uuid;
            if(move == 'up') {
                json.effectSortNumber = arr[index - 1].sortNumber;
                json.effectUuid = arr[index - 1].uuid;
            }else if(move == 'down') {
                json.effectSortNumber = arr[index + 1].sortNumber;
                json.effectUuid = arr[index + 1].uuid;
            }
            json.parentUuid = '';
        }else{
            sll.children.map((qqs, index) => {
                if(scope.uuid == qqs.uuid) {
                    json.moveSortNumber = qqs.sortNumber;
                    json.moveUuid = qqs.uuid;
                    if(move == 'up') {
                        json.effectSortNumber = sll.children[index - 1].sortNumber;
                        json.effectUuid = sll.children[index - 1].uuid;
                    }else if(move == 'down') {
                        json.effectSortNumber = sll.children[index + 1].sortNumber;
                        json.effectUuid = sll.children[index + 1].uuid;
                    }
                    json.parentUuid = sll.uuid;
                }else{
                    qqs.children.map((aas, index) => {
                        if(scope.uuid == aas.uuid) {
                            json.moveSortNumber = aas.sortNumber;
                            json.moveUuid = aas.uuid;
                            if(move == 'up') {
                                json.effectSortNumber = qqs.children[index - 1].sortNumber;
                                json.effectUuid = qqs.children[index - 1].uuid;
                            }else if(move == 'down') {
                                json.effectSortNumber = qqs.children[index + 1].sortNumber;
                                json.effectUuid = qqs.children[index + 1].uuid;
                            }
                            json.parentUuid = qqs.uuid;
                        }else{
                            aas.children.map((wwd, index) => {
                                if(scope.uuid == wwd.uuid) {
                                    json.moveSortNumber = wwd.sortNumber;
                                    json.moveUuid = wwd.uuid;
                                    if(move == 'up') {
                                        json.effectSortNumber = aas.children[index - 1].sortNumber;
                                        json.effectUuid = aas.children[index - 1].uuid;
                                    }else if(move == 'down') {
                                        json.effectSortNumber = aas.children[index + 1].sortNumber;
                                        json.effectUuid = aas.children[index + 1].uuid;
                                    }
                                    json.parentUuid = aas.uuid;
                                }
                            })
                        }
                    })
                }
            })
        }
    })
    return json;
}

export const formatSeconds = (value) => {
	var theTime = parseInt(value);
	var theTime1 = 0;
	var theTime2 = 0;

	if(theTime >= 60) {
		theTime1 = parseInt(theTime / 60);
		theTime = parseInt(theTime % 60);
		if(theTime1 >= 60) {
			theTime2 = parseInt(theTime1 / 60);
			theTime1 = parseInt(theTime1 % 60);
		}
	}
	if(theTime < 10) {
		theTime = "0" + parseInt(theTime)
	}
	var result = "" + theTime + "";
	if(theTime1 >= 0) {
		if(theTime1 < 10) {
			theTime1 = "0" + parseInt(theTime1)
		}
		result = "" + theTime1 + ":" + result;
	}
	if(theTime2 >= 0) {
		if(theTime2 < 10) {
			theTime2 = "0" + parseInt(theTime2)
		}
		result = "" + theTime2 + ":" + result;
	}
	return result;
}

export const vedioTypeText = (id) => {
    let str;
    switch (id) {
        case 1:
            str = '录播课时';
            break;
        case 2:
            str = '直播回放';
            break;
        case 3:
            str = '短视频';
            break;
    }
    return str;
}

export const stateText = (id) => {
    let str;
    switch (id) {
        case 1:
            str = '开启';
            break;
        case 0:
            str = '关闭';
            break;
    }
    return str;
}

export const managerName = (arr) => {
    let str = "";
    for (var i = 0; i < arr.length; i++) {
        str += arr[i]+ "，";
    }
    //去掉最后一个逗号(如果不需要去掉，就不用写)
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }else{
        str = '暂无';
    }
    return str;
}

export const quchong = (arr, name) =>{
    var hash = {};
    return arr.reduce(function (item, next) {
      hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
      return item;
    }, []);
}

export const pushPeopleFunc = (arr) => {
    for(var i in arr){
        if(arr[i].list != undefined){
            arr[i].userList.map(sll => {
                sll.orgName = sll.userName;
                sll.orgUuid = sll.userUuid
            })
            arr[i].list = arr[i].list.concat(arr[i].userList);
            pushPeopleFunc(arr[i].list);
        }else{
            break;
        }
    }
    return arr;
}

export let flagArrAll = []; //默认展开分配人员数组
export const treeFunc = (arr) => {
    let json = {
        'arr': null,
        'flagArr': null,
    }
    for(var i in arr){
        if(arr[i].list != undefined){
            arr[i].userList.map(sll => {
                sll.orgName = sll.userName;
                sll.orgUuid = sll.userUuid
                if(sll.flag){
                    flagArrAll.push(sll.userUuid);
                }
            })
            arr[i].list = arr[i].list.concat(arr[i].userList);
            treeFunc(arr[i].list);
        }else{
            break;
        }
    }
    json.arr = arr;
    json.flagArr = flagArrAll;
    return json;
}

export let teacherArrExp = []; //默认展开班主任数组
export const teacherTreeFunc = (arr) => {
    let json = {
        'arr': null,
        'flagArr': null,
    }
    for(var i in arr){
        if(arr[i].list != undefined){
            arr[i].classTeacherBasicList.map(sll => {
                sll.orgName = sll.userName;
                sll.orgUuid = sll.userUuid
                if(sll.flag){
                    teacherArrExp.push(sll.userUuid);
                }
                if(sll.studentNum > 0 && sll.flag) {
                    sll.disabled = true;
                }
            })
            arr[i].list = arr[i].list.concat(arr[i].classTeacherBasicList);
            teacherTreeFunc(arr[i].list);
        }else{
            break;
        }
    }
    json.arr = arr;
    json.flagArr = teacherArrExp;
    return json;
}


export let peopleArrExp = []; //默认展开人员数组
export const peopleTreeFunc = (arr) => {
    let json = {
        'arr': null,
        'flagArr': null,
    }
    for(var i in arr){
        if(arr[i].list != undefined){
            if(arr[i].flag) {
                peopleArrExp.push({ name: arr[i].name, type: arr[i].type, uuid: arr[i].uuid});
            }
            arr[i].userList.map(sll => {
                if(sll.flag){
                    peopleArrExp.push({ name: sll.name, type: sll.type, uuid: sll.uuid});
                }
            })
            arr[i].list = arr[i].list.concat(arr[i].userList);
            peopleTreeFunc(arr[i].list);
        }else{
            break;
        }
    }
    json.arr = arr;
    json.flagArr = peopleArrExp;
    return json;
}

export let ExamArrExp = []; //默认展开人员数组
export const ExamTreeFunc = (arr) => {
    let json = {
        'arr': null,
        'flagArr': null,
    }
    for(var i in arr){
        if(arr[i].list != undefined){
            if(arr[i].flag) {
                ExamArrExp.push({ name: arr[i].name, type: arr[i].type, uuid: arr[i].uuid});
            }
            arr[i].list.map(sll => {
                if(sll.flag){
                    ExamArrExp.push({ name: sll.name, type: sll.type, uuid: sll.uuid});
                }
            })
            ExamTreeFunc(arr[i].list);
        }else{
            break;
        }
    }
    json.arr = arr;
    json.flagArr = ExamArrExp;
    return json;
}

export let SetArrExp = []; //默认展开人员数组
export const SetTreeFunc = (arr) => {
    let json = {
        'arr': null,
        'flagArr': null,
    }
    for(var i in arr){
        if(arr[i].list != undefined){
            if(arr[i].flag) {
                SetArrExp.push({ name: arr[i].name, type: arr[i].type, uuid: arr[i].uuid});
            }
            arr[i].list.map(sll => {
                if(sll.flag){
                    SetArrExp.push({ name: sll.name, type: sll.type, uuid: sll.uuid});
                }
            })
            SetTreeFunc(arr[i].list);
        }else{
            break;
        }
    }
    json.arr = arr;
    json.flagArr = SetArrExp;
    return json;
}

export let SpreadArrExp = []; //默认展开推广账号数组
export const SpreadTreeFunc = (arr) => {
    let json = {
        'arr': null,
        'flagArr': null,
    }
    for(var i in arr){
        if(arr[i].list != undefined){
            if(arr[i].flag) {
                SpreadArrExp.push({ name: arr[i].name, type: arr[i].type, uuid: arr[i].uuid});
            }
            arr[i].list.map(sll => {
                if(sll.flag){
                    SpreadArrExp.push({ name: sll.name, type: sll.type, uuid: sll.uuid});
                }
            })
            SpreadTreeFunc(arr[i].list);
        }else{
            break;
        }
    }
    json.arr = arr;
    json.flagArr = SpreadArrExp;
    return json;
}

//菜单level code转汉字
export const levelFunc = (arr) => {
    for(var i in arr) {
        if(arr[i].children != undefined){
            if(arr[i].level == 1) {
                arr[i].level = '目录';
            }else if(arr[i].level == 2){
                arr[i].level = '页面';
            }else if(arr[i].level == 3){
                arr[i].level = '按钮';
            }
            levelFunc(arr[i].children);
        }else{
            break;
        }
    }
    return arr;
}

//菜单num统计

export const menuNumberFunc = (arr, brr) => {
    if(arr[1].includeSubsetList[0].includeSubsetList[0].name.indexOf('(') == -1) { //避免name重复加()

        arr[1].includeSubsetList[0].includeSubsetList[0].name = brr[0] == undefined ? arr[1].includeSubsetList[0].includeSubsetList[0].name + ' (' + '0' + ')' : arr[1].includeSubsetList[0].includeSubsetList[0].name + ' (' + brr[0] + ')';
        arr[1].includeSubsetList[0].includeSubsetList[1].name = brr[1] == undefined ? arr[1].includeSubsetList[0].includeSubsetList[1].name + ' (' + '0' + ')' : arr[1].includeSubsetList[0].includeSubsetList[1].name + ' (' + brr[1] + ')';
        arr[1].includeSubsetList[0].includeSubsetList[2].name = brr[3] == undefined ? arr[1].includeSubsetList[0].includeSubsetList[2].name + ' (' + '0' + ')' : arr[1].includeSubsetList[0].includeSubsetList[2].name + ' (' + brr[5] + ')';
        arr[1].includeSubsetList[0].includeSubsetList[3].name = brr[2] == undefined ? arr[1].includeSubsetList[0].includeSubsetList[3].name + ' (' + '0' + ')' : arr[1].includeSubsetList[0].includeSubsetList[3].name + ' (' + brr[2] + ')';
        arr[1].includeSubsetList[0].includeSubsetList[4].name = brr[4] == undefined ? arr[1].includeSubsetList[0].includeSubsetList[4].name + ' (' + '0' + ')' : arr[1].includeSubsetList[0].includeSubsetList[4].name + ' (' + brr[4] + ')';
        arr[1].includeSubsetList[0].includeSubsetList[5].name = brr[5] == undefined ? arr[1].includeSubsetList[0].includeSubsetList[5].name + ' (' + '0' + ')' : arr[1].includeSubsetList[0].includeSubsetList[5].name + ' (' + brr[3] + ')';

    }
    
    return arr;

}

//copyData

export const copyData = (data) => {
    let url = data;
    let oInput = document.createElement('input');
    oInput.value = url;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象;
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.remove();
}

export const urlFun = (url) => {
    if(url.split("?")[1] != undefined){
        var params = url.split("?")[1].split("&");
        var obj = {};
        params.map(v => obj[v.split("=")[0]] = v.split("=")[1]);
        return obj;
    }else {
        Message({
            message: '推广链接错误，请重新输入',
            type: 'error'
        })
    }
}

export const input_mode_Text = (text) => {
    let str;
    switch (text) {
        case 0:
            str = '线上';
            break;
        case 1:
            str = '录入';
            break;
    }
    return str;
}

export const isAllocationText = (text) => {
    let str;
    switch (text) {
        case 0:
            str = '未分配';
            break;
        case 1:
            str = '已分配';
            break;
    }
    return str;
}

export const dialStateText = (text) => {
    let str;
    switch (text) {
        case 0:
            str = '未拨打';
            break;
        case 1:
            str = '已拨打';
            break;
    }
    return str;
}

export const sendStartText = (text) => {
    let str;
    switch (text) {
        case 0:
            str = '未发送';
            break;
        case 1:
            str = '已发送';
            break;
        case 2:
            str = '发送失败';
            break;
        case 3:
            str = '内容为空';
            break;
        case 4:
            str = '手机号码为空';
            break;
        case 5:
            str = '模板id为空';
            break;
        case 6:
            str = '模板参数为空';
            break;
    }
    return str;
}

export const countDown = (time) => {

    var s = 0;
    
    var hour = time.split(':')[0];
    
    var min = time.split(':')[1];
    
    var sec = time.split(':')[2];
    
    s = Number(hour * 3600) + Number(min * 60) + Number(sec);
    
    return s * 1000;
    
}

export const countDownTime = (time) => {
    var hh;
    var mm;
    var ss;
    if(time==null||time<0){
        return;
    }
    //得到小时
    hh=time/3600|0;
    time=parseInt(time)-hh*3600;
    if(parseInt(hh)<10){
          hh="0"+hh;
    }
    //得到分
    mm=time/60|0;
    //得到秒
    ss=parseInt(time)-mm*60;
    if(parseInt(mm)<10){
         mm="0"+mm;    
    }
    if(ss<10){
        ss="0"+ss;      
    }
    return hh+":"+mm+":"+ss;
}

export const citiesFun = (data) => {
    for(var i=0;i<data.length;i++){
        if(data[i].cities.length<1){
          // children若为空数组，则将children设为undefined
          data[i].cities = undefined;
        }else {
          // children若不为空数组，则继续 递归调用 本方法
          citiesFun(data[i].cities);
        }
    }
    return data;
}

//post下载Excel
export const filepostDown = (url, cfg, name) => {
    axios.post(url, cfg, { responseType: 'blob', headers : {
            'Cache-Control' : 'no-cache',
            'Pragma' : 'no-cache'
        } }).then((res) => {
        //  如果支持微软的文件下载方式(ie10+浏览器)
        if (window.navigator.msSaveBlob) {
            try {
              const blobObject = new Blob([res.data]);
              window.navigator.msSaveBlob(blobObject, name);
            } catch (e) {
              console.log(e);
            }
        } else {
        //  其他浏览器
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // 下载完成移除元素
            window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
    });
}

export const textUrl = (text) => {
    let url = '';
    const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
    url = text.replace(reg, "<a style='color: #587cf7' href='$1$2'>$1$2</a>").replace(/\n/g, "<br />");
    return url;
}

export const receiveTimeFun = (id) => {
    let obj = {
        receiveStartTime: '',
        receiveEndTime: ''
    }
    const date = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
    const now = new Date().getTime();
    switch (id) {
        case 1:
            obj.receiveStartTime = date;
            obj.receiveEndTime = now;
            break;
        case 2:
            obj.receiveStartTime = date - 3600 * 1000 * 24 * 2;
            obj.receiveEndTime = date - 3600 * 1000 * 24 * 1;
            break;
        case 3:
            obj.receiveStartTime = date - 3600 * 1000 * 24 * 6;
            obj.receiveEndTime = date - 3600 * 1000 * 24 * 3;
            break;
        case 4:
            obj.receiveStartTime = date - 3600 * 1000 * 24 * 13;
            obj.receiveEndTime = date - 3600 * 1000 * 24 * 7;
            break;
        case 5:
            obj.receiveStartTime = '';
            obj.receiveEndTime = date - 3600 * 1000 * 24 * 13;
            break;
        case 6:
            obj.receiveStartTime = '';
            obj.receiveEndTime = '';
            break;
        case '':
            obj.receiveStartTime = '';
            obj.receiveEndTime = '';
            break;
    }
    return obj;
}

