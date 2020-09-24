<template>
  <div id="app">
    <Header v-if="$store.state.commonFlag"></Header>
    <el-container :class="paddingClass" id="el-container">
      <p id="toggleSearch" @click="toggleSearch">
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
      unNormalPage: ['/login', '/'],
      paddingClass: '',
      tableHeight: 0,
      toggleAction: false,
      hideSearch: false,
      searchAreaHeight: 0
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
      searchAreaHeight = document.getElementsByClassName('people-screen')[0].offsetHeight,
      windowHeight = document.documentElement.clientHeight;
      this.searchAreaHeight = this.searchAreaHeight
      if(total <= 14){
          this.tableHeight = total * 45
      }else{
          this.tableHeight = this.hideSearch ? windowHeight - 200 + searchAreaHeight : windowHeight - 210
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
  top: 78px;
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
