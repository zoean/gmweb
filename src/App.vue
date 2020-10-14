<template>
  <div id="app">
    <Header v-if="$store.state.commonFlag"></Header>
    <el-container :class="paddingClass" id="el-container">
      <div id="mainHandle">
        <p id="pageTitle" v-if="isNormalPage" :style="{left: pageTitleLeft + 'px'}">{{pageTitle}}</p>
        <p v-if="includeSearch" id="toggleSearch" @click="toggleSearch">
          <svg-icon v-show="hideSearch" icon-class="openSearch" />
          <svg-icon v-show="!hideSearch" icon-class="closeSearch" />
          <span v-show="hideSearch">展开条件</span>
          <span v-show="!hideSearch">收起条件</span>
        </p>
      </div>
      <Aside v-if="$store.state.commonFlag" @setPageTitleLeft="setPageTitleLeft" @changeIscollapse="changeIscollapse"></Aside>
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
      unNormalPage: ['/login', '/', '/forget', '/edition'],
      paddingClass: '',
      tableHeight: 0,
      toggleAction: false,
      hideSearch: false,
      searchAreaHeight: 0,
      excludeSearch: ['/login', '/', '/base/role', '/base/zuzhi', '/base/menu', '/crm/promotion/dataAllocation', '/crm/promotion/enterClues', '/crm/salesBoard/salesBoard', '/crm/salesBoard/salesOrgBoard', '/crm/mbo/companyyearmbo', '/crm/mbo/departmentyearmbo', '/knowp/vedio', '/knowp/subject', '/knowp/classManage', '/operate/activityA', '/crm/myClient/completed', '/crm/myClient/toallocate', '/crm/dataStatistics/overflow', '/crm/dataStatistics/timeData', '/crm/dataStatistics/eduData', '/crm/crmConfig/enums', '/crm/crmConfig/FieldManagement', '/crm/eduAdmin/headMaster', '/crm/sms/smslist', '/crm/class/orgOpenClass', '/crm/class/openClass', '/crm/class/returnOrgVisit', '/crm/class/returnVisit', '/crm/wechat/wechatManagement', '/crm/mbo/companymonthmbo', '/crm/mbo/companydaymbo', '/crm/mbo/departmentmonthmbo', '/crm/mbo/departmentdaymbo', '/forget', '/edition', '/operate/activityA/createactivity', '/operate/activityA/ActivityDetail', '/operate/activityA/partinMember', '/operate/activityA/winninglist', '/operate/activityA/pricelist', '/base/people', '/base/people/change', '/base/people/permiss'],
      includeSearch: false,
      initOptions: {},
      total: 0,
      paginationHeight: 0,
      searchAreaHeight: 0,
      windowHeight: 0,
      initHeight: 0,
      initSearchHeight: 0,
      handleCount: 0,
      pageTitle: '',
      pageTitleLeft: 232,
      trHeight: 1,
      iscollapse: false
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
    '$route': function(route){
      var path = route.path
      if(path == '/404' || path == '/edition' || path == '/login' || path == '/forget' || (path.indexOf('agreeMentDetails') !== -1) || (path.indexOf('url') !== -1)){
        this.$store.dispatch('actionsSetCommonFlag', false);
      }else{
        this.$store.dispatch('actionsSetCommonFlag', true);
      }
      if(this.unNormalPage.includes(path)){
        this.isNormalPage = false
        this.paddingClass = 'noheader-padding'
      }else{
        this.isNormalPage = true
        this.paddingClass = 'header-padding'
      }  
      if(this.excludeSearch.includes(path)){
        this.includeSearch = false
      }else{
        this.includeSearch = true
      } 
      this.hideSearch = false
      this.toggleAction = false
      this.pageTitle = route.meta.title    
      this.setPageTitleLeft() 
    }
  },

  mounted(){
    this.pageTitle = this.$route.meta.title    
    this.setPageTitleLeft() 
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
    changeIscollapse(val){
      this.iscollapse = val
    },
    toggleSearch(){
      this.toggleAction = !this.toggleAction
      setTimeout(()=>{
          this.hideSearch = !this.hideSearch 
          this.setTableHeight(this.total, this.handleCount, this.trHeight)
      }, 400)
    },
    setPageTitleLeft(){ 
      if(!this.iscollapse){        
        // if(/^\/crm/.test(this.$route.path)){
          this.pageTitleLeft = 234
        // }else{
        //   this.pageTitleLeft = 168
        // }
      }else{
        this.pageTitleLeft = 86
      }
    },
    setTableHeight(total, handleCount, trH){//计算数据列表高度
      this.handleCount = handleCount || 0
      this.total = total
      var elPagination = document.getElementsByClassName('el-pagination')[0],
      searchArea = document.getElementsByClassName('people-screen')[0];
      this.paginationHeight = elPagination && elPagination.offsetHeight ? elPagination.offsetHeight : 0,
      this.searchAreaHeight = searchArea && searchArea.offsetHeight ? searchArea.offsetHeight : 0,
      this.windowHeight = document.documentElement.clientHeight;
      this.setPageTitleLeft() 
      if(this.searchAreaHeight > 0){
        this.initSearchHeight =  this.searchAreaHeight
      }
      this.trHeight = trH
      this.tableHeight = this.hideSearch ? this.windowHeight - this.paginationHeight + this.initSearchHeight - this.handleCount * 42 - 136 : this.windowHeight - this.paginationHeight - this.initSearchHeight - this.handleCount * 42 - 116
      if(this.total * this.trHeight * 45 < this.tableHeight){
        // if(this.total == 0){
        //   this.tableHeight = this.trHeight * 46 + 46
        // }else{
          // this.tableHeight = this.total * this.trHeight * 46 + 46
          // this.tableHeight = this.total * this.trHeight * 46 + 46
        // }
      }else{
        this.tableHeight = this.hideSearch && this.total > 15 ? this.windowHeight - this.paginationHeight - this.initSearchHeight - this.handleCount * 42 -78 : this.tableHeight
      }
      if(/^\/base\/menu/.test(this.$route.path)){
        this.tableHeight = this.windowHeight - this.handleCount * 42 - 116
      }
    },
    resizeHandle(){
      window.addEventListener('resize', _.throttle(()=>{
        this.setTableHeight(this.total,this.handleCount, this.trHeight)
      }, 100))
    }
  }
}
</script>

<style lang="less" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  .el-container{
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    #mainHandle{
        position: absolute;
        width: 100%;
        left: 0;
        top: 68px;
      #pageTitle{
        font-size: 14px;
        color: #666;
        min-width: 300px;
        position: absolute;
        height: 14px;
        line-height: 14px;
        top: 0;
        display: flex;
        align-item: center;
      }
      #pageTitle:before{
        content: "";
        width: 4px;
        height: 14px;
        background: #409EFF;
        border-radius: 3px;
        color: #409EFF;
        margin-right: 10px;
        display: inline-block;
      }
      #toggleSearch{
        cursor: pointer;
        color: #AAAAAA;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        z-index: 1;
        width: 100px;
        left: 50%;
        top: 0;
        position: absolute;
        margin-left: 0;
        .svg-icon{
          width: 10px;
          height: 6px;
        }
      }
    }
    
  }
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
