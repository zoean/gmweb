<template>
  <div id="app">
    <Header v-if="$store.state.commonFlag"></Header>
    <el-container>
      <Aside v-if="$store.state.commonFlag" :toggleSidebar="toggleSidebar"></Aside>
      <div :class="['main-wrap', sideBarOpen ? 'sidebar-open' : 'sidebar-close']">
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
      sideBarOpen: true
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
    }
  },
  methods: {
    toggleSidebar(){
      this.sideBarOpen = !this.sideBarOpen
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
  height: 100vh;
}
.el-container{
  padding-top: 60px;
  position: relative;
}
.main-wrap{
  position: absolute;
  right: 0
}
.sidebar-open{
  width: calc( 100vw - 260px );
}
.sidebar-close{
  width: calc( 100vw - 64px );
}
.edit-field-icon{
  color: #5cb6ff;
  font-size: 20px;
  cursor: pointer;
}
</style>
