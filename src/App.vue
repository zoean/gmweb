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
    const userMenuList = JSON.parse(localStorage.getItem('userMenuList'))
    if((this.$route.path == '/login') || ((this.$route.path == '/404'))){
      this.$store.dispatch('actionsSetCommonFlag', false);
    }else{
      this.$store.dispatch('actionsSetCommonFlag', true);
    }
    this.filterPageNum(userMenuList)
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
  methods: {
    filterPageNum(obj){
      obj.map(subObj => {
        if(subObj.url == this.$route.path){
          this.$store.commit('setPageNum', subObj.pageNum)
          console.log(this.$store.state.pageNum)
        }else if(subObj.includeSubsetList){
          this.filterPageNum(subObj.includeSubsetList)
        }
      })
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
