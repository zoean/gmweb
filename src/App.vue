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
      excludeSearch: ['/login', '/', '/base/role', '/base/zuzhi', '/base/menu', '/crm/promotion/dataAllocation', '/crm/promotion/enterClues', '/crm/salesBoard/salesBoard', '/crm/salesBoard/salesOrgBoard', '/crm/mbo/companyyearmbo', '/crm/mbo/departmentyearmbo', '/knowp/vedio', '/knowp/subject', '/knowp/classManage', '/operate/activityA', '/crm/myClient/completed', '/crm/myClient/toallocate', '/crm/dataStatistics/overflow', '/crm/dataStatistics/timeData'],
      includeSearch: false,
      initOptions: {}
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
          this.setTableHeight()
      }, 400)
    },
    setTableHeight(total){//计算数据列表高度
      const paginationHeight = document.getElementsByClassName('el-pagination')[0].offsetHeight?document.getElementsByClassName('el-pagination')[0].offsetHeight : 0,
      searchAreaHeight = document.getElementsByClassName('people-screen')[0].offsetHeight ? document.getElementsByClassName('people-screen')[0].offsetHeight : 0,
      windowHeight = document.documentElement.clientHeight;
      this.searchAreaHeight = this.searchAreaHeight
      if(total <= 14){
        if(total <= 1){
          this.tableHeight = 94
        }else{
          this.tableHeight = total * 46
        }
      }else{
          this.tableHeight = this.hideSearch ? windowHeight - 180 + searchAreaHeight : windowHeight - 190
      }
    },
    resizeHandle(){
      window.addEventListener('resize', _.throttle(this.setTableHeight, 500))
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
