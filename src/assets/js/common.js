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