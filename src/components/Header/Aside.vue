<template>
    <div v-if="routersFlag">
        <el-aside width='3rem'>
            
            <el-menu
                :default-active="activeIndex"
                ref="elmenu"
                class="el-menu-vertical-demo"
                :default-openeds="openedsIndex"
                :unique-opened=true
                >

                <div v-for="(item,index) in userMenuList" :key="index">

                  <el-submenu :index="`${item.url}`" v-if="item.includeSubsetList.length != 0 && item.disabled && item.url != '/base/people'">
                    <template slot="title">
                      <i :class="item.icon"></i>
                      <span>{{item.name}}</span>
                    </template>
                    <div v-for="(res,num) in item.includeSubsetList" :key="num">
                      <el-menu-item 
                        :index="`${res.url}`" 
                        @click="active_router(res)"
                        v-if="res.disabled && res.menuComponent != 'button'"
                      >
                      <i :class="res.icon"></i>
                      {{res.name}}
                      </el-menu-item>
                    </div>
                  </el-submenu>

                  <el-menu-item :index="`${item.url}`" v-else-if="item.disabled" @click="active_router(item)">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                  </el-menu-item>

                  <!-- <el-menu-item :index="`${item.url}`" v-if="item.disabled" @click="active_router(item)">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                  </el-menu-item> -->

                </div>
                
            </el-menu>

        </el-aside>
    </div>
</template>

<script>
import { getMenuDetailsSubsetByUuid } from '../../request/api';
export default {
    name: '',
    data() {
        return {
          activeIndex: '',
          openedsIndex: [''],
          routersFlag: '',
          userMenuList: [],
        }
    },
    created() {
      this.router_index();
    },
    methods: {
      active_router(index) {
        this.$store.commit('setPageNum', index.pageNum)
        this.$router.push({ path: index.url });
      },
      router_index() {
        this.activeIndex = this.$route.path;
      },
      filterPageNum(obj){
        obj.map(subObj => {
          if(subObj.url == this.activeIndex){
            this.$store.commit('setPageNum', subObj.pageNum)
          }else if(subObj.includeSubsetList){
            this.filterPageNum(subObj.includeSubsetList)
          }
        })
      }
      // handleOpen(key, keyPath) {
      //     console.log(key, keyPath);
      // },
      // handleClose(key, keyPath) {
      //     console.log(key, keyPath);
      // },
      // getMenuDetailsSubsetByUuid() {
      //   this.$smoke_post(getMenuDetailsSubsetByUuid, {}).then(res => {
      //     console.log(res);
      //   })
      // }
    },
    watch:{
      '$route.path': function(newVal){
        if(newVal == '/'){
          this.openedsIndex = [];
          this.routersFlag = false;
          console.log(this.routersFlag);
          this.activeIndex = newVal;
        }else if(newVal.indexOf("/base") != -1){
          this.routersFlag = true;
          this.activeIndex = newVal;
          this.userMenuList = this.$store.state.userMenuList[0].includeSubsetList;
        }else if(newVal.indexOf("/crm") != -1){
          this.routersFlag = true;
          this.userMenuList = this.$store.state.userMenuList[1].includeSubsetList;
          this.activeIndex = newVal;
        }else if(newVal.indexOf("/knowp") != -1){
          this.routersFlag = true;
          this.userMenuList = this.$store.state.userMenuList[2].includeSubsetList;
          this.activeIndex = newVal;
        }else{
          this.routersFlag = true;
          this.activeIndex = newVal;
        }
      }
    },
    mounted() {
        const userMenuList = JSON.parse(localStorage.getItem("userMenuList"));
        const arr = this.$route.path.split("/");  
        if(this.$route.path == '/'){
          this.openedsIndex = [];
          this.routersFlag = false;
        }else if(arr[1] == 'base'){
          this.routersFlag = true;
          this.userMenuList = userMenuList[0].includeSubsetList;
        }else if(arr[1] == 'crm'){
          this.routersFlag = true;
          this.userMenuList = userMenuList[1].includeSubsetList;
          this.filterPageNum(this.userMenuList)
        }else if(arr[1] == 'knowp'){
          this.routersFlag = true;
          this.userMenuList = userMenuList[2].includeSubsetList;
        }else{
          this.routersFlag = true;
        }
    }
}
</script>

<style lang="less" scoped>
    .el-aside{
        height: 100%;
        .el-menu{
            height: 100%;
            border-top: 1px solid #e6e6e6;
        }
    }
</style>