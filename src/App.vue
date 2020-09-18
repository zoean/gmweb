<template>
  <div id="app">
    <Header v-if="$store.state.commonFlag"></Header>
    <el-container :class="paddingClass" id="el-container">
      <Aside v-if="$store.state.commonFlag"></Aside>
      <keep-alive include="people">
        <router-view />
      </keep-alive>
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
      isNormalPage: false,
      unNormalPage: ['/login', '/', '/forget'],
      paddingClass: '',
    }
  },
  created() {
    if((this.$route.path.indexOf('url') !== -1) || (this.$route.path == '/login') || (this.$route.path == '/forget') || (this.$route.path == '/edition') || ((this.$route.path == '/404') || (this.$route.path.indexOf('agreeMentDetails') !== -1))){
      this.$store.dispatch('actionsSetCommonFlag', false);
    }else{
      this.$store.dispatch('actionsSetCommonFlag', true);
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
