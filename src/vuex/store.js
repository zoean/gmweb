import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    name: '', //用户姓名
    jobNumber: '', //用户工号
    uuid: '', //唯一标识
    accountNumber: ''//手机号
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
}

export default new Vuex.Store({
    state, mutations, actions
})