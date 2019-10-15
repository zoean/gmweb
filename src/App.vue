<template>
  <div id="app">
    <Header v-if="flag"></Header>
    <el-container>
      <Aside v-if="flag"></Aside>
      <router-view/>
    </el-container>
  </div>
</template>

<script>
import Header from './components/Header/Index';
import Aside from './components/Aside/Aside';
export default {
  name: 'app',
  components: {
    Header, Aside
  },
  data() {
    return{
      flag: true
    }
  },
  created() {
    // console.log(this.$route.path);
    if(this.$route.path == '/login'){
      this.flag = false;
    }else{
      this.flag = true;
    }
  }
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
