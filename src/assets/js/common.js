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