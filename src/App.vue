<template>
  <div id="app">
    <Header v-if="$store.state.commonFlag"></Header>
    <el-container :class="paddingClass" id="el-container">
      <p v-if="includeSearch" id="toggleSearch" @click="toggleSearch">
        <svg-icon v-show="hideSearch" icon-class="openSearch" />
        <svg-icon v-show="!hideSearch" icon-class="closeSearch" />
        <span v-show="hideSearch">展开条件</span>
        <span v-show="!hideSearch">收起条件</span>
      </p>
      <Aside v-if="$store.state.commonFlag"></Aside>
      <keep-alive include="people">
        <router-view @setTableHeight="setTableHeight" @toggleSearch="toggleSearch" :tableHeight="tableHeight" :toggleAction="toggleAction" :hideSearch="hideSearch" />
      </keep-alive>
    </el-container>
  </div>
</template>

<script>
import Header from './components/Header/Index';
import Aside from './components/Header/Aside';
import _ from 'lodash'
export default {
  name: 'app',
  components: {
    Header, Aside
  },
  data() {
    return{
      isNormalPage: false,
      unNormalPage: ['/login', '/', '/forget'],
      paddingClass: '',
      tableHeight: 0,
      toggleAction: false,
      hideSearch: false,
      searchAreaHeight: 0,
      excludeSearch: ['/login', '/', '/base/role', '/base/zuzhi', '/base/menu', '/crm/promotion/dataAllocation', '/crm/promotion/enterClues', '/crm/salesBoard/salesBoard', '/crm/salesBoard/salesOrgBoard', '/crm/mbo/companyyearmbo', '/crm/mbo/departmentyearmbo', '/knowp/vedio', '/knowp/subject', '/knowp/classManage', '/operate/activityA', '/crm/myClient/completed', '/crm/myClient/toallocate', '/crm/dataStatistics/overflow', '/crm/dataStatistics/timeData', '/crm/dataStatistics/eduData', '/crm/crmConfig/enums', '/crm/crmConfig/FieldManagement', '/crm/eduAdmin/headMaster', '/crm/sms/smslist', '/crm/class/orgOpenClass', '/crm/class/openClass', '/crm/class/returnOrgVisit', '/crm/class/returnVisit', '/crm/wechat/wechatManagement', '/crm/mbo/companymonthmbo', '/crm/mbo/companydaymbo', '/crm/mbo/departmentmonthmbo', '/crm/mbo/departmentdaymbo', '/forget', '/edition', '/operate/activityA/createactivity', '/operate/activityA/ActivityDetail', '/operate/activityA/partinMember', '/operate/activityA/winninglist', '/operate/activityA/pricelist', '/base/people'],
      includeSearch: false,
      initOptions: {},
      total: 0,
      paginationHeight: 0,
      searchAreaHeight: 0,
      windowHeight: 0,
      initHeight: 0,
      initSearchHeight: 0,
      handleCount: 0
    }
  },
  created() {
    if((this.$route.path.indexOf('url') !== -1) || (this.$route.path == '/login') || (this.$route.path == '/forget') || (this.$route.path == '/edition') || ((this.$route.path == '/404') || (this.$route.path.indexOf('agreeMentDetails') !== -1))){
      this.$store.dispatch('actionsSetCommonFlag', false);
    }else{
      this.$store.dispatch('actionsSetCommonFlag', true);
    }
    this.resizeHandle()
  },
  distroyed(){
    window.removeEventListener('resize')
    this.initOptions = JSON.parse(localStorage.getItem('initOptions'));
    if(this.initOptions) {
      var demo = browserfly.noConflict();
      var initOptions = {
		    debug: true, // 日志是否输出 default false
  		  strid: '',
  		  uin: this.initOptions.uin , // tq号 / 用户名 必填
  		  admin_uin: this.initOptions.adminUin , // 主管理员TQ号
  		  appid: this.initOptions.appId, // 唯一凭证
  		  access_token: this.initOptions.accessToken, // 密文
  		  server_url: this.initOptions.serverUrl
      };
      demo.init(initOptions);
    }
  },
  watch:{
    '$route.path': function(newVal){
      if(newVal == '/404' || newVal == '/edition' || newVal == '/login' || newVal == '/forget' || (this.$route.path.indexOf('agreeMentDetails') !== -1) || (this.$route.path.indexOf('url') !== -1)){
        this.$store.dispatch('actionsSetCommonFlag', false);
      }else{
        this.$store.dispatch('actionsSetCommonFlag', true);
      }
      if(this.unNormalPage.includes(this.$route.path)){
        this.isNormalPage = false
        this.paddingClass = 'noheader-padding'
      }else{
        this.isNormalPage = true
        this.paddingClass = 'header-padding'
      }  
      if(this.excludeSearch.includes(this.$route.path)){
        this.includeSearch = false
      }else{
        this.includeSearch = true
      } 
      this.hideSearch = false
      this.toggleAction = false
    }
  },

  mounted(){
    if(this.unNormalPage.includes(this.$route.path)){
      this.isNormalPage = false
      this.paddingClass = 'noheader-padding'
    }else{
      this.isNormalPage = true
      this.paddingClass = 'header-padding'
    }
    if(this.excludeSearch.includes(this.$route.path)){
      this.includeSearch = false
    }else{
      this.includeSearch = true
    } 
    this.hideSearch = false
    this.toggleAction = false
  },

  methods: {
    toggleSearch(){
      this.toggleAction = !this.toggleAction
      setTimeout(()=>{
          this.hideSearch = !this.hideSearch 
          this.setTableHeight(this.total, this.handleCount)
      }, 400)
    },
    setTableHeight(total, handleCount){//计算数据列表高度
      console.log(total, '----------')
      this.handleCount = handleCount || 0
      this.total = total
      var elPagination = document.getElementsByClassName('el-pagination')[0],
      searchArea = document.getElementsByClassName('people-screen')[0];
      this.paginationHeight = elPagination && elPagination.offsetHeight ? elPagination.offsetHeight : 0,
      this.searchAreaHeight = searchArea && searchArea.offsetHeight ? searchArea.offsetHeight : 0,
      this.windowHeight = document.documentElement.clientHeight;
      if(this.searchAreaHeight > 0){
        this.initSearchHeight =  this.searchAreaHeight
      }
      this.tableHeight = this.hideSearch ? this.windowHeight - this.paginationHeight + this.initSearchHeight - this.handleCount * 42 -130: this.windowHeight - this.paginationHeight - this.initSearchHeight - this.handleCount * 42 - 110
      if(this.total * 45 < this.tableHeight){
        this.tableHeight = this.total * 45 + 45
      }
    },
    resizeHandle(){
      window.addEventListener('resize', _.throttle(()=>{
        this.setTableHeight(this.total,this.handleCount)
      }, 500))
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
}
.el-container{
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#toggleSearch{
  position: absolute;
  width: 100%;
  left: 0;
  top: 68px;
  cursor: pointer;
  color: #AAAAAA;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
#toggleSearch .svg-icon{
  width: 10px;
  height: 6px;
}
.header-padding{
  padding-top: 60px;
}
.noheader-padding{
  padding-top: 0;
}
.edit-field-icon{
  color: #5cb6ff;
  font-size: 20px;
  cursor: pointer;
}
</style>
