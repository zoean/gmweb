<template>
  <div id="app">
    <Header v-if="$store.state.commonFlag"></Header>
    <el-container :class="paddingClass">
      <Aside v-if="$store.state.commonFlag" :toggleSidebar="toggleSidebar"></Aside>
      <div :class="[isNormalPage ? 'main-wrap' : '', widthClass]">
        <router-view/>
      </div>
    </el-container>
  </div>
</template>

<script>
import Header from './components/Header/Index';
import Aside from './components/Header/Aside';
export default {
  name: 'app',
  components: {
    Header, Aside
  },
  data() {
    return{
      sideBarOpen: true,
      isNormalPage: false,
      unNormalPage: ['/login', '/'],
      widthClass: 'sidebar-open',
      paddingClass: ''
    }
  },
  created() {
    if((this.$route.path == '/login') || ((this.$route.path == '/404'))){
      this.$store.dispatch('actionsSetCommonFlag', false);
    }else{
      this.$store.dispatch('actionsSetCommonFlag', true);
    }
  },
  watch:{
    '$route.path': function(newVal){
      if(newVal == '/404' || newVal == '/login'){
        this.$store.dispatch('actionsSetCommonFlag', false);
      }else{
        this.$store.dispatch('actionsSetCommonFlag', true);
      }
      if(this.unNormalPage.includes(this.$route.path)){
        this.isNormalPage = false
        this.widthClass = 'sidebar-no'
        this.paddingClass = 'noheader-padding'
      }else{
        this.isNormalPage = true
        this.paddingClass = 'header-padding'
        if(this.sideBarOpen){
          this.widthClass = 'sidebar-open'
        }else{
          this.widthClass = 'sidebar-close'
        }
      }
    }
  },
  mounted(){
    if(this.unNormalPage.includes(this.$route.path)){
      this.isNormalPage = false
      this.widthClass = 'sidebar-no'
      this.paddingClass = 'noheader-padding'
    }else{
      this.isNormalPage = true
      this.paddingClass = 'header-padding'
      if(this.sideBarOpen){
        this.widthClass = 'sidebar-open'
      }else{
        this.widthClass = 'sidebar-close'
      }
    }
  },
  methods: {
    toggleSidebar(){
      this.sideBarOpen = !this.sideBarOpen
      if(this.sideBarOpen){
        this.widthClass = 'sidebar-open'
      }else{
        this.widthClass = 'sidebar-close'
      }
      
    console.log(this.widthClass)
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
  position: relative;
}
.header-padding{
  padding-top: 60px;
}
.noheader-padding{
  padding-top: 0;
}
.main-wrap{
  position: absolute;
  right: 0
}
.sidebar-no,.sidebar-open,.sidebar-close{
}
.sidebar-no{
  width: 100%;
}
.sidebar-open{
  width: calc( 100vw - 260px );
}
.sidebar-close{
  width: calc( 100vw - 64px );
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
