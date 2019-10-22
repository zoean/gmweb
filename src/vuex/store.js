import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    name: '', //用户姓名
    jobNumber: '', //用户工号
    uuid: '', //唯一标识
    accountNumber: '',//手机号
    commonFlag: false,//Header+Aside控制
    // oneLogin: false, //是否首次登录(true:是 false:不是)
    userMenuList: [],
}

const mutations = {
    setName(state,name){
        return(state.name = name);
    },
    setAccountNumber(state,accountNumber){
        return(state.accountNumber = accountNumber);
    },
    setJobNumber(state,jobNumber){
        return(state.jobNumber = jobNumber);
    },
    setUuid(state,uuid){
        return(state.uuid = uuid);
    },
    setCommonFlag(state,commonFlag){
        return(state.commonFlag = commonFlag);
    },
    // setOneLogin(state,oneLogin){
    //     return(state.oneLogin = oneLogin);
    // },
    setUserMenuList(state,userMenuList){
        return(state.userMenuList = userMenuList);
    },
}

const actions = {
    actionsSetName(context, name) {
        return context.commit('setName', name);
    },
    actionsSetJobNumber(context, jobNumber) {
        return context.commit('setJobNumber', jobNumber);
    },
    actionsSetUuid(context, uuid) {
        return context.commit('setUuid', uuid);
    },
    actionsSetAccountNumber(context, accountNumber) {
        return context.commit('setAccountNumber', accountNumber);
    },
    actionsSetCommonFlag(context, commonFlag) {
        return context.commit('setCommonFlag', commonFlag);
    },
    actionsSetUserMenuList(context, userMenuList) {
        return context.commit('setUserMenuList', userMenuList);
    },
    // actionsSetOneLogin(context, oneLogin) {
    //     return context.commit('setOneLogin', oneLogin);
    // },
}

export default new Vuex.Store({
    state, mutations, actions
})