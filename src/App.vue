<template>
  <div id="app">
    <Header v-if="$store.state.commonFlag"></Header>
    <el-container>
      <Aside v-if="$store.state.commonFlag"></Aside>
      <router-view/>
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
    '$route.path': function(newVal,oldVal){
      if(newVal == '/404' || newVal == '/login'){
        this.$store.dispatch('actionsSetCommonFlag', false);
      }else{
        this.$store.dispatch('actionsSetCommonFlag', true);
      }
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.el-container{
  height: calc( 100vh - 60px);
}
</style>
