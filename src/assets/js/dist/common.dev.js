"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isExternal = isExternal;
exports.formatNumber = formatNumber;
exports.receiveTimeFun = exports.textUrl = exports.filepostDown = exports.citiesFun = exports.countDownTime = exports.countDown = exports.sendStartText = exports.dialStateText = exports.isAllocationText = exports.input_mode_Text = exports.urlFun = exports.menuNumberFunc = exports.levelFunc = exports.SpreadTreeFunc = exports.SpreadArrExp = exports.SetTreeFunc = exports.SetArrExp = exports.ExamTreeFunc = exports.ExamArrExp = exports.peopleTreeFunc = exports.peopleArrExp = exports.teacherTreeFunc = exports.teacherArrExp = exports.treeFunc = exports.flagArrAll = exports.pushPeopleFunc = exports.quchong = exports.managerName = exports.stateText = exports.vedioTypeText = exports.formatSeconds = exports.sortNumberMove = exports.sortTextNum = exports.emphasisLevelByText = exports.evidencePurposeText = exports.workingLifeText = exports.classTextById = exports.removeEvery = exports.removeObject = exports.deteleObject = exports.backEnable = exports.orderTypeText = exports.classTypeString = exports.classTypeText = exports.timeReturn = exports.pathWayText = exports.smoke_MJ_4 = exports.smoke_MJ_6 = exports.educationTypeText = exports.educationText = exports.genderText = exports.smoke_MJ_5 = exports.schoolType = exports.backType = exports.getCurrentDate = exports.timestampToTime = exports.getTextByTime = exports.getTextByState = exports.getTextByJs = void 0;

var _elementUi = require("element-ui");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

var getTextByJs = function getTextByJs(arr) {
  var str = "";

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name == undefined) {
      str = '';
    } else {
      str += arr[i].name + "，";
    }
  } //去掉最后一个逗号(如果不需要去掉，就不用写)


  if (str.length > 0) {
    str = str.substr(0, str.length - 1);
  } else {
    str = '无';
  }

  return str;
};

exports.getTextByJs = getTextByJs;

var getTextByState = function getTextByState(state) {
  var str = '';

  if (state == 1) {
    str = '在职';
  } else if (state == 0) {
    str = '离职';
  }

  return str;
}; // 查看通时数据text转换


exports.getTextByState = getTextByState;

var getTextByTime = function getTextByTime(state, state1, state2, text1, text2) {
  var str = '';

  if (state == state1) {
    str = text1;
  } else if (state == state2) {
    str = text2;
  }

  return str;
};

exports.getTextByTime = getTextByTime;

var timestampToTime = function timestampToTime(timestamp) {
  if (timestamp == '' || timestamp == 0) {
    return '- -';
  } else {
    var date = timestamp.length == 10 ? new Date(timestamp * 1000) : new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000

    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() + 1 < 11 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = date.getHours() + ':';
    var m = (date.getMinutes() + 1 < 11 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds() + 1 < 11 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }
};

exports.timestampToTime = timestampToTime;

var getCurrentDate = function getCurrentDate(seperator) {
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
};

exports.getCurrentDate = getCurrentDate;

var backType = function backType(type) {
  var str = '';

  if (type == '1') {
    str = '首咨';
  } else if (type == '2') {
    str = '回收池';
  }

  return str;
};

exports.backType = backType;

var schoolType = function schoolType(type) {
  var str = '';

  if (type == 'jhwx') {
    str = '慧众';
  } else if (type == 'shengxuewangxiao') {
    str = '胜学';
  } else if (type == 'jhwxedu') {
    str = '集团';
  }

  return str;
};

exports.schoolType = schoolType;

var smoke_MJ_5 = function smoke_MJ_5(type) {
  var str = '';

  if (type == '1') {
    str = 'A+';
  } else if (type == '2') {
    str = 'A';
  } else if (type == '3') {
    str = 'B';
  } else if (type == '4') {
    str = 'C';
  } else if (type == '5') {
    str = 'D';
  } else if (type == '6') {
    str = 'E';
  }

  return str;
};

exports.smoke_MJ_5 = smoke_MJ_5;

var genderText = function genderText(id) {
  var str;

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
};

exports.genderText = genderText;

var educationText = function educationText(id) {
  var str;

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
};

exports.educationText = educationText;

var educationTypeText = function educationTypeText(id) {
  var str;

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
};

exports.educationTypeText = educationTypeText;

var smoke_MJ_6 = function smoke_MJ_6(type) {
  var str = '';

  if (type == '1') {
    str = '百度信息流';
  } else if (type == '2') {
    str = '头条信息流';
  } else if (type == '3') {
    str = '自制推广页';
  } else if (type == '4') {
    str = '京华官网';
  } else if (type == '5') {
    str = '京华APP';
  } else if (type == '6') {
    str = '京华小程序';
  } else if (type == '7') {
    str = '京华公众号';
  } else if (type == '8') {
    str = '胜学官网';
  } else if (type == '9') {
    str = '集团官网';
  }

  return str;
};

exports.smoke_MJ_6 = smoke_MJ_6;

var smoke_MJ_4 = function smoke_MJ_4(type) {
  var str;

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
};

exports.smoke_MJ_4 = smoke_MJ_4;

var pathWayText = function pathWayText(type) {
  var str = '';

  if (type == 1) {
    str = '呼叫中心';
  } else if (type == 2) {
    str = '工作手机';
  }

  return str;
};

exports.pathWayText = pathWayText;

var timeReturn = function timeReturn(time) {
  var result = parseInt(time);
  var h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
  var m = Math.floor(result / 60 % 60) < 10 ? '0' + Math.floor(result / 60 % 60) : Math.floor(result / 60 % 60);
  var s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60);
  result = "".concat(h, ":").concat(m, ":").concat(s);
  return result;
};

exports.timeReturn = timeReturn;

var classTypeText = function classTypeText(id) {
  var str;

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
};

exports.classTypeText = classTypeText;

var classTypeString = function classTypeString(id) {
  var str;

  switch (id) {
    case 0:
      str = '普通班';
      break;

    case 1:
      str = '高端班';
      break;
  }

  return str;
};

exports.classTypeString = classTypeString;

var orderTypeText = function orderTypeText(id) {
  var str;

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
};

exports.orderTypeText = orderTypeText;

var backEnable = function backEnable(enable) {
  var str = '';

  if (enable == '1') {
    str = '开启';
  } else if (enable == '0') {
    str = '关闭';
  }

  return str;
}; // 去重数组中的对象


exports.backEnable = backEnable;

var deteleObject = function deteleObject(obj) {
  var uniques = [];
  var stringify = {};

  for (var i = 0; i < obj.length; i++) {
    var keys = Object.keys(obj[i]);
    keys.sort(function (a, b) {
      return Number(a) - Number(b);
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
}; // 删除数组中的某一个对象


exports.deteleObject = deteleObject;

var removeObject = function removeObject(_arr, _obj) {
  var length = _arr.length;

  for (var i = 0; i < length; i++) {
    if (_arr[i] == _obj) {
      if (i == 0) {
        _arr.shift(); //删除并返回数组的第一个元素


        return _arr;
      } else if (i == length - 1) {
        _arr.pop(); //删除并返回数组的最后一个元素


        return _arr;
      } else {
        _arr.splice(i, 1); //删除下标为i的元素


        return _arr;
      }
    }
  }
}; //删除数组中的指定元素


exports.removeObject = removeObject;

var removeEvery = function removeEvery(str, arr) {
  var index = arr.indexOf(str);
  arr.splice(index, 1);
  return arr;
};

exports.removeEvery = removeEvery;

var classTextById = function classTextById(id) {
  var str;

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
};

exports.classTextById = classTextById;

var workingLifeText = function workingLifeText(id) {
  var str;

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
};

exports.workingLifeText = workingLifeText;

var evidencePurposeText = function evidencePurposeText(id) {
  var str;

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
};

exports.evidencePurposeText = evidencePurposeText;

var emphasisLevelByText = function emphasisLevelByText(id) {
  var str;

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
};

exports.emphasisLevelByText = emphasisLevelByText;

var sortTextNum = function sortTextNum(text) {
  var str;

  switch (text) {
    case 'jobNumber':
      str = 0;
      break;

    case 'createTime':
      str = 0;
      break;

    case 'num':
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

    case 'countNum':
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
};

exports.sortTextNum = sortTextNum;

var sortNumberMove = function sortNumberMove(arr, scope, move) {
  var json = {};
  arr.map(function (sll, index) {
    if (scope.uuid == sll.uuid) {
      json.moveSortNumber = sll.sortNumber;
      json.moveUuid = sll.uuid;

      if (move == 'up') {
        json.effectSortNumber = arr[index - 1].sortNumber;
        json.effectUuid = arr[index - 1].uuid;
      } else if (move == 'down') {
        json.effectSortNumber = arr[index + 1].sortNumber;
        json.effectUuid = arr[index + 1].uuid;
      }

      json.parentUuid = '';
    } else {
      sll.children.map(function (qqs, index) {
        if (scope.uuid == qqs.uuid) {
          json.moveSortNumber = qqs.sortNumber;
          json.moveUuid = qqs.uuid;

          if (move == 'up') {
            json.effectSortNumber = sll.children[index - 1].sortNumber;
            json.effectUuid = sll.children[index - 1].uuid;
          } else if (move == 'down') {
            json.effectSortNumber = sll.children[index + 1].sortNumber;
            json.effectUuid = sll.children[index + 1].uuid;
          }

          json.parentUuid = sll.uuid;
        } else {
          qqs.children.map(function (aas, index) {
            if (scope.uuid == aas.uuid) {
              json.moveSortNumber = aas.sortNumber;
              json.moveUuid = aas.uuid;

              if (move == 'up') {
                json.effectSortNumber = qqs.children[index - 1].sortNumber;
                json.effectUuid = qqs.children[index - 1].uuid;
              } else if (move == 'down') {
                json.effectSortNumber = qqs.children[index + 1].sortNumber;
                json.effectUuid = qqs.children[index + 1].uuid;
              }

              json.parentUuid = qqs.uuid;
            } else {
              aas.children.map(function (wwd, index) {
                if (scope.uuid == wwd.uuid) {
                  json.moveSortNumber = wwd.sortNumber;
                  json.moveUuid = wwd.uuid;

                  if (move == 'up') {
                    json.effectSortNumber = aas.children[index - 1].sortNumber;
                    json.effectUuid = aas.children[index - 1].uuid;
                  } else if (move == 'down') {
                    json.effectSortNumber = aas.children[index + 1].sortNumber;
                    json.effectUuid = aas.children[index + 1].uuid;
                  }

                  json.parentUuid = aas.uuid;
                }
              });
            }
          });
        }
      });
    }
  });
  return json;
};

exports.sortNumberMove = sortNumberMove;

var formatSeconds = function formatSeconds(value) {
  var theTime = parseInt(value);
  var theTime1 = 0;
  var theTime2 = 0;

  if (theTime >= 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);

    if (theTime1 >= 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }

  if (theTime < 10) {
    theTime = "0" + parseInt(theTime);
  }

  var result = "" + theTime + "";

  if (theTime1 >= 0) {
    if (theTime1 < 10) {
      theTime1 = "0" + parseInt(theTime1);
    }

    result = "" + theTime1 + ":" + result;
  }

  if (theTime2 >= 0) {
    if (theTime2 < 10) {
      theTime2 = "0" + parseInt(theTime2);
    }

    result = "" + theTime2 + ":" + result;
  }

  return result;
};

exports.formatSeconds = formatSeconds;

var vedioTypeText = function vedioTypeText(id) {
  var str;

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
};

exports.vedioTypeText = vedioTypeText;

var stateText = function stateText(id) {
  var str;

  switch (id) {
    case 1:
      str = '开启';
      break;

    case 0:
      str = '关闭';
      break;
  }

  return str;
};

exports.stateText = stateText;

var managerName = function managerName(arr) {
  var str = "";

  for (var i = 0; i < arr.length; i++) {
    str += arr[i] + "，";
  } //去掉最后一个逗号(如果不需要去掉，就不用写)


  if (str.length > 0) {
    str = str.substr(0, str.length - 1);
  } else {
    str = '暂无';
  }

  return str;
};

exports.managerName = managerName;

var quchong = function quchong(arr, name) {
  var hash = {};
  return arr.reduce(function (item, next) {
    hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
    return item;
  }, []);
};

exports.quchong = quchong;

var pushPeopleFunc = function pushPeopleFunc(arr) {
  for (var i in arr) {
    if (arr[i].list != undefined) {
      arr[i].userList.map(function (sll) {
        sll.orgName = sll.userName;
        sll.orgUuid = sll.userUuid;
      });
      arr[i].list = arr[i].list.concat(arr[i].userList);
      pushPeopleFunc(arr[i].list);
    } else {
      break;
    }
  }

  return arr;
};

exports.pushPeopleFunc = pushPeopleFunc;
var flagArrAll = []; //默认展开分配人员数组

exports.flagArrAll = flagArrAll;

var treeFunc = function treeFunc(arr) {
  var json = {
    'arr': null,
    'flagArr': null
  };

  for (var i in arr) {
    if (arr[i].list != undefined) {
      arr[i].userList.map(function (sll) {
        sll.orgName = sll.userName;
        sll.orgUuid = sll.userUuid;

        if (sll.flag) {
          flagArrAll.push(sll.userUuid);
        }
      });
      arr[i].list = arr[i].list.concat(arr[i].userList);
      treeFunc(arr[i].list);
    } else {
      break;
    }
  }

  json.arr = arr;
  json.flagArr = flagArrAll;
  return json;
};

exports.treeFunc = treeFunc;
var teacherArrExp = []; //默认展开班主任数组

exports.teacherArrExp = teacherArrExp;

var teacherTreeFunc = function teacherTreeFunc(arr) {
  var json = {
    'arr': null,
    'flagArr': null
  };

  for (var i in arr) {
    if (arr[i].list != undefined) {
      arr[i].classTeacherBasicList.map(function (sll) {
        sll.orgName = sll.userName;
        sll.orgUuid = sll.userUuid;

        if (sll.flag) {
          teacherArrExp.push(sll.userUuid);
        }

        if (sll.studentNum > 0 && sll.flag) {
          sll.disabled = true;
        }
      });
      arr[i].list = arr[i].list.concat(arr[i].classTeacherBasicList);
      teacherTreeFunc(arr[i].list);
    } else {
      break;
    }
  }

  json.arr = arr;
  json.flagArr = teacherArrExp;
  return json;
};

exports.teacherTreeFunc = teacherTreeFunc;
var peopleArrExp = []; //默认展开人员数组

exports.peopleArrExp = peopleArrExp;

var peopleTreeFunc = function peopleTreeFunc(arr) {
  var json = {
    'arr': null,
    'flagArr': null
  };

  for (var i in arr) {
    if (arr[i].list != undefined) {
      if (arr[i].flag) {
        peopleArrExp.push({
          name: arr[i].name,
          type: arr[i].type,
          uuid: arr[i].uuid
        });
      }

      arr[i].userList.map(function (sll) {
        if (sll.flag) {
          peopleArrExp.push({
            name: sll.name,
            type: sll.type,
            uuid: sll.uuid
          });
        }
      });
      arr[i].list = arr[i].list.concat(arr[i].userList);
      peopleTreeFunc(arr[i].list);
    } else {
      break;
    }
  }

  json.arr = arr;
  json.flagArr = peopleArrExp;
  return json;
};

exports.peopleTreeFunc = peopleTreeFunc;
var ExamArrExp = []; //默认展开人员数组

exports.ExamArrExp = ExamArrExp;

var ExamTreeFunc = function ExamTreeFunc(arr) {
  var json = {
    'arr': null,
    'flagArr': null
  };

  for (var i in arr) {
    if (arr[i].list != undefined) {
      if (arr[i].flag) {
        ExamArrExp.push({
          name: arr[i].name,
          type: arr[i].type,
          uuid: arr[i].uuid
        });
      }

      arr[i].list.map(function (sll) {
        if (sll.flag) {
          ExamArrExp.push({
            name: sll.name,
            type: sll.type,
            uuid: sll.uuid
          });
        }
      });
      ExamTreeFunc(arr[i].list);
    } else {
      break;
    }
  }

  json.arr = arr;
  json.flagArr = ExamArrExp;
  return json;
};

exports.ExamTreeFunc = ExamTreeFunc;
var SetArrExp = []; //默认展开人员数组

exports.SetArrExp = SetArrExp;

var SetTreeFunc = function SetTreeFunc(arr) {
  var json = {
    'arr': null,
    'flagArr': null
  };

  for (var i in arr) {
    if (arr[i].list != undefined) {
      if (arr[i].flag) {
        SetArrExp.push({
          name: arr[i].name,
          type: arr[i].type,
          uuid: arr[i].uuid
        });
      }

      arr[i].list.map(function (sll) {
        if (sll.flag) {
          SetArrExp.push({
            name: sll.name,
            type: sll.type,
            uuid: sll.uuid
          });
        }
      });
      SetTreeFunc(arr[i].list);
    } else {
      break;
    }
  }

  json.arr = arr;
  json.flagArr = SetArrExp;
  return json;
};

exports.SetTreeFunc = SetTreeFunc;
var SpreadArrExp = []; //默认展开推广账号数组

exports.SpreadArrExp = SpreadArrExp;

var SpreadTreeFunc = function SpreadTreeFunc(arr) {
  var json = {
    'arr': null,
    'flagArr': null
  };

  for (var i in arr) {
    if (arr[i].list != undefined) {
      if (arr[i].flag) {
        SpreadArrExp.push({
          name: arr[i].name,
          type: arr[i].type,
          uuid: arr[i].uuid
        });
      }

      arr[i].list.map(function (sll) {
        if (sll.flag) {
          SpreadArrExp.push({
            name: sll.name,
            type: sll.type,
            uuid: sll.uuid
          });
        }
      });
      SpreadTreeFunc(arr[i].list);
    } else {
      break;
    }
  }

  json.arr = arr;
  json.flagArr = SpreadArrExp;
  return json;
}; //菜单level code转汉字


exports.SpreadTreeFunc = SpreadTreeFunc;

var levelFunc = function levelFunc(arr) {
  for (var i in arr) {
    if (arr[i].children != undefined) {
      if (arr[i].level == 1) {
        arr[i].level = '目录';
      } else if (arr[i].level == 2) {
        arr[i].level = '页面';
      } else if (arr[i].level == 3) {
        arr[i].level = '按钮';
      }

      levelFunc(arr[i].children);
    } else {
      break;
    }
  }

  return arr;
}; //菜单num统计


exports.levelFunc = levelFunc;

var menuNumberFunc = function menuNumberFunc(arr, brr) {
  if (arr[1].includeSubsetList[0].includeSubsetList[0].name.indexOf('(') == -1) {
    //避免name重复加()
    arr[1].includeSubsetList[0].includeSubsetList[0].name = brr[0] == undefined ? arr[1].includeSubsetList[0].includeSubsetList[0].name + ' (' + '0' + ')' : arr[1].includeSubsetList[0].includeSubsetList[0].name + ' (' + brr[0] + ')';
    arr[1].includeSubsetList[0].includeSubsetList[1].name = brr[1] == undefined ? arr[1].includeSubsetList[0].includeSubsetList[1].name + ' (' + '0' + ')' : arr[1].includeSubsetList[0].includeSubsetList[1].name + ' (' + brr[1] + ')';
    arr[1].includeSubsetList[0].includeSubsetList[2].name = brr[3] == undefined ? arr[1].includeSubsetList[0].includeSubsetList[2].name + ' (' + '0' + ')' : arr[1].includeSubsetList[0].includeSubsetList[2].name + ' (' + brr[5] + ')';
    arr[1].includeSubsetList[0].includeSubsetList[3].name = brr[2] == undefined ? arr[1].includeSubsetList[0].includeSubsetList[3].name + ' (' + '0' + ')' : arr[1].includeSubsetList[0].includeSubsetList[3].name + ' (' + brr[2] + ')';
    arr[1].includeSubsetList[0].includeSubsetList[4].name = brr[4] == undefined ? arr[1].includeSubsetList[0].includeSubsetList[4].name + ' (' + '0' + ')' : arr[1].includeSubsetList[0].includeSubsetList[4].name + ' (' + brr[4] + ')';
    arr[1].includeSubsetList[0].includeSubsetList[5].name = brr[5] == undefined ? arr[1].includeSubsetList[0].includeSubsetList[5].name + ' (' + '0' + ')' : arr[1].includeSubsetList[0].includeSubsetList[5].name + ' (' + brr[3] + ')';
  }

  return arr;
};

exports.menuNumberFunc = menuNumberFunc;

var urlFun = function urlFun(url) {
  if (url.split("?")[1] != undefined) {
    var params = url.split("?")[1].split("&");
    var obj = {};
    params.map(function (v) {
      return obj[v.split("=")[0]] = v.split("=")[1];
    });
    return obj;
  } else {
    (0, _elementUi.Message)({
      message: '推广链接错误，请重新输入',
      type: 'error'
    });
  }
};

exports.urlFun = urlFun;

var input_mode_Text = function input_mode_Text(text) {
  var str;

  switch (text) {
    case 0:
      str = '线上';
      break;

    case 1:
      str = '录入';
      break;
  }

  return str;
};

exports.input_mode_Text = input_mode_Text;

var isAllocationText = function isAllocationText(text) {
  var str;

  switch (text) {
    case 0:
      str = '未分配';
      break;

    case 1:
      str = '已分配';
      break;
  }

  return str;
};

exports.isAllocationText = isAllocationText;

var dialStateText = function dialStateText(text) {
  var str;

  switch (text) {
    case 0:
      str = '未拨打';
      break;

    case 1:
      str = '已拨打';
      break;
  }

  return str;
};

exports.dialStateText = dialStateText;

var sendStartText = function sendStartText(text) {
  var str;

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
};

exports.sendStartText = sendStartText;

var countDown = function countDown(time) {
  var s = 0;
  var hour = time.split(':')[0];
  var min = time.split(':')[1];
  var sec = time.split(':')[2];
  s = Number(hour * 3600) + Number(min * 60) + Number(sec);
  return s * 1000;
};

exports.countDown = countDown;

var countDownTime = function countDownTime(time) {
  var hh;
  var mm;
  var ss;

  if (time == null || time < 0) {
    return;
  } //得到小时


  hh = time / 3600 | 0;
  time = parseInt(time) - hh * 3600;

  if (parseInt(hh) < 10) {
    hh = "0" + hh;
  } //得到分


  mm = time / 60 | 0; //得到秒

  ss = parseInt(time) - mm * 60;

  if (parseInt(mm) < 10) {
    mm = "0" + mm;
  }

  if (ss < 10) {
    ss = "0" + ss;
  }

  return hh + ":" + mm + ":" + ss;
};

exports.countDownTime = countDownTime;

var citiesFun = function citiesFun(data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].cities.length < 1) {
      // children若为空数组，则将children设为undefined
      data[i].cities = undefined;
    } else {
      // children若不为空数组，则继续 递归调用 本方法
      citiesFun(data[i].cities);
    }
  }

  return data;
}; //post下载Excel


exports.citiesFun = citiesFun;

var filepostDown = function filepostDown(url, cfg, name) {
  _axios["default"].post(url, cfg, {
    responseType: 'blob',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  }).then(function (res) {
    //  如果支持微软的文件下载方式(ie10+浏览器)
    if (window.navigator.msSaveBlob) {
      try {
        var blobObject = new Blob([res.data]);
        window.navigator.msSaveBlob(blobObject, name);
      } catch (e) {
        console.log(e);
      }
    } else {
      //  其他浏览器
      var _url = window.URL.createObjectURL(new Blob([res.data]));

      var link = document.createElement('a');
      link.href = _url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // 下载完成移除元素

      window.URL.revokeObjectURL(_url); // 释放掉blob对象
    }
  });
};

exports.filepostDown = filepostDown;

var textUrl = function textUrl(text) {
  var url = '';
  var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  url = text.replace(reg, "<a style='color: #587cf7' href='$1$2'>$1$2</a>").replace(/\n/g, "<br />");
  return url;
};

exports.textUrl = textUrl;

var receiveTimeFun = function receiveTimeFun(id) {
  var obj = {
    receiveStartTime: '',
    receiveEndTime: ''
  };
  var date = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime();
  var now = new Date().getTime();

  switch (id) {
    case 1:
      obj.receiveStartTime = date;
      obj.receiveEndTime = now;
      break;

    case 2:
      obj.receiveStartTime = date - 3600 * 1000 * 24 * 2;
      obj.receiveEndTime = date;
      break;

    case 3:
      obj.receiveStartTime = date - 3600 * 1000 * 24 * 6;
      obj.receiveEndTime = date - 3600 * 1000 * 24 * 2;
      break;

    case 4:
      obj.receiveStartTime = date - 3600 * 1000 * 24 * 13;
      obj.receiveEndTime = date - 3600 * 1000 * 24 * 6;
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
};

exports.receiveTimeFun = receiveTimeFun;