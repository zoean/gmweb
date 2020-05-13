<template>
    <div v-if="routersFlag">
        <el-aside style="width: 3rem; min-width: 200px;">
            
            <el-menu
                :default-active="activeIndex"
                ref="elmenu"
                class="el-menu-vertical-demo"
                :default-openeds="openedsIndex"
                :unique-opened=true
                >

                <div v-for="(item,index) in userMenuList" :key="index">

                  <el-submenu class="el-submenu-smoke" :index="`${item.url}`" v-if="item.includeSubsetList.length != 0 && item.disabled && item.url != '/base/people'">
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
                      <div class="el-menu-item-div">
                        <i :class="res.icon"></i>
                        {{res.name}}
                      </div>
                      </el-menu-item>
                    </div>
                  </el-submenu>

                  <el-menu-item :index="`${item.url}`" v-else-if="item.disabled" @click="active_router(item)" class="el-menu-item-smoke">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                  </el-menu-item>

                  <!-- <el-menu-item :index="`${item.url}`" v-if="item.disabled" @click="active_router(item)">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                  </el-menu-item> -->

                </div>

                <el-image
                  style="width: 3rem; position: absolute; bottom: 0;"
                  :src="require('../../assets/images/aside_backg.png')">
                </el-image>
                
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
          console.log(newVal);
          this.activeIndex = newVal;
        }else if(newVal.indexOf("/base") != -1){
          this.routersFlag = true;
          this.activeIndex = this.$store.state.userMenuList[0].defaultUrl;
          this.userMenuList = this.$store.state.userMenuList[0].includeSubsetList;
        }else if(newVal.indexOf("/crm") != -1){
          this.routersFlag = true;
          this.activeIndex = this.$store.state.userMenuList[1].defaultUrl;
          this.userMenuList = this.$store.state.userMenuList[1].includeSubsetList;
        }else if(newVal.indexOf("/knowp") != -1){
          this.routersFlag = true;
          this.activeIndex = this.$store.state.userMenuList[2].defaultUrl;
          this.userMenuList = this.$store.state.userMenuList[2].includeSubsetList;
        }else if(newVal.indexOf("/operate") != -1){
          this.routersFlag = true;
          this.activeIndex = this.$store.state.userMenuList[3].defaultUrl;
          this.userMenuList = this.$store.state.userMenuList[3].includeSubsetList;
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
        }else if(arr[1] == 'knowp'){
          this.routersFlag = true;
          this.userMenuList = userMenuList[2].includeSubsetList;
        }else if(arr[1] == 'operate'){
          this.routersFlag = true;
          this.userMenuList = userMenuList[3].includeSubsetList;
        }else{
          this.routersFlag = true;
        }
    }
}
</script>

<style lang="less" scoped>
    .el-aside{
      height: 100%;
      .el-submenu-smoke{
        position: relative;
        z-index: 999999;
        color: #fff;
        border-radius: none;
        i{
          color: #fff;
        }
        .el-submenu__title{
          &:hover{
            span{
              color: #4794FE !important;
            }
            i{
              color: #4794FE !important;
            }
          }
          span{
            color: #fff !important;
          }
          i{
            color: #fff !important;
          }
        }
        .el-menu-item.is-active .el-menu-item-div{
          width: calc(3rem - 24px);
          min-width: 176px;
          margin-left: -16px;
          padding-left: 16px;
          border-radius: 50px 0 0 50px;
          background: #fff;
          color: #4794FE;
          i{
            color: #4794FE;
          }
        }
        .el-menu-item{
          background: #4794FE;
          color: #fff;
          padding-left: 26px;
          i{
            color: #fff;
          }
          .el-menu-item-div{
            background: #4794FE;
            color: #fff;
            &:hover{
              width: calc(3rem - 24px);
              min-width: 176px;
              margin-left: -16px;
              padding-left: 16px;
              border-radius: 50px 0 0 50px;
              background: rgba(255, 255, 255, 0.75) !important;
              color: #4794FE;
              i{
                color: #4794FE;
              }
            }
          }
        }
      }
      .el-menu-vertical-demo{
        position: relative;
        z-index: 999999;
        height: 100%;
        border-right: none;
        background-color: #4794FE !important;
      }
      .el-menu-item-smoke{
        color: #fff;
        border-radius: 50px 0px 0px 50px;
        width: calc( 100% - 26px );
        margin-left: 26px;
        i{
          color: #fff;
        }
      }
      .el-menu-item-smoke:hover{
        background: rgba(255, 255, 255, 0.75) !important;
        color: #4794FE;
        i{
          color: #4794FE;
        }
      }
      .el-menu-item-smoke.is-active{
        background: #fff;
        color: #4794FE;
        i{
          color: #4794FE;
        }
      }
    }
</style>