export const getTextByJs = (arr) => {
    let str = "";
    for (var i = 0; i < arr.length; i++) {
        str += arr[i].name+ "，";
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
    }else{
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
        return '';
    }else{
        var date = timestamp.length == 10 ? new Date(timestamp * 1000) : new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
    }
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
export const removeAaary = (_arr, _obj) => {
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

export const sortNumberMove = (arr, scope, move) => {
    let json = {};
    console.log(arr);
    console.log(scope);
    console.log(move);
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
                    console.log('3322323');
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