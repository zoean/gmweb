<template>
    <div v-if="routersFlag" class="aside-all">
      <el-menu
        :default-active="activeIndex"
        ref="elmenu"
        class="el-menu-vertical-demo"
        :default-openeds="openedsIndex"
        :collapse="iscollapse"
        :collapse-transition="false"
        :unique-opened="false"
        >

        <div v-for="(item,index) in userMenuList" :key="index">

          <el-submenu 
            class="el-submenu-smoke" 
            :index="`${item.url}`" 
            v-if="item.includeSubsetList.length != 0 && item.disabled && item.url != '/base/people'"
            :style="iscollapse ? 'min-width: auto; width: auto;' : ''"
          >
            <template slot="title">
              <svg-icon :icon-class="item.icon" />
              <span class="menu-titles">{{item.name}}</span>
            </template>
            <div v-for="(res,num) in item.includeSubsetList" :key="num">
              <el-menu-item 
                :index="`${res.url}`" 
                @click="active_router(res)"
                v-if="res.disabled && res.menuComponent != 'button'"
                :style="iscollapse ? 'min-width: auto; width: auto;' : ''"
              >
              <div class="el-menu-item-div">
                <i :class="res.icon"></i>
                <span class="menu-titles">{{res.name}}</span>
              </div>
              </el-menu-item>
            </div>
          </el-submenu>

          <el-menu-item :index="`${item.url}`" v-else-if="item.disabled" @click="active_router(item)" class="el-menu-item-smoke" :style="iscollapse ? 'min-width: auto; width: auto;' : ''">
            <svg-icon :icon-class="item.icon" />
            <span class="menu-titles" slot="title">{{item.name}}</span>
          </el-menu-item>

          <!-- <el-menu-item :index="`${item.url}`" v-if="item.disabled" @click="active_router(item)">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item> -->

        </div>

      </el-menu>
      
      <el-image
        style="width: 15px; height: 45px; position: absolute; right: -13px; top: 40%; cursor: pointer;"
        v-show="iscollapse"
        @click="open_click"
        :src="require('../../assets/images/aside_open.png')">
      </el-image>

      <el-image
        style="width: 15px; height: 45px; position: absolute; right: -13px; top: 40%; cursor: pointer;"
        v-show="!iscollapse"
        @click="close_click"
        :src="require('../../assets/images/aside_close.png')">
      </el-image>

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
          iscollapse: false,
          screeenWidth: document.documentElement.clientWidth
        }
    },
    created() {
      this.router_index();      
    },
    methods: {
      open_click() {
        this.iscollapse = false;
      },
      close_click() {
        this.iscollapse = true;
      },
      active_router(index) {
        this.$store.commit('setPageNum', index.pageNum)
        this.$router.push({ path: index.url });
        this.activeIndex = index.url;
      },
      router_index() {
        this.activeIndex = this.$route.path;
      }
    },
    watch:{
      '$route.path': function(newVal){
        this.activeIndex = this.$route.path
        if(newVal == '/'){
          this.openedsIndex = [];
          this.routersFlag = false;
          // this.activeIndex = newVal;
        }else if(newVal.indexOf("/base") != -1){
          this.routersFlag = true;
          // this.activeIndex = this.$store.state.userMenuList[0].defaultUrl;
          this.userMenuList = this.$store.state.userMenuList[0].includeSubsetList;
        }else if(newVal.indexOf("/crm") != -1){
          this.routersFlag = true;
          // this.activeIndex = this.$store.state.userMenuList[1].defaultUrl;
          this.userMenuList = this.$store.state.userMenuList[1].includeSubsetList;
          if(newVal.indexOf('/mbo/company') != -1){
            this.activeIndex = '/crm/mbo/companyyearmbo'
          }else if(newVal.indexOf('/mbo/department') != -1){
            this.activeIndex = '/crm/mbo/departmentyearmbo'
          }
        }else if(newVal.indexOf("/knowp") != -1){
          this.routersFlag = true;
          // this.activeIndex = this.$store.state.userMenuList[2].defaultUrl;
          this.userMenuList = this.$store.state.userMenuList[2].includeSubsetList;          
        }else if(newVal.indexOf("/operate") != -1){
          this.routersFlag = true;
          // this.activeIndex = this.$store.state.userMenuList[3].defaultUrl;
          this.userMenuList = this.$store.state.userMenuList[3].includeSubsetList;
        }else{
          this.routersFlag = true;
          // this.activeIndex = newVal;
        }

        window.onresize = () => {
          if(((newVal.indexOf('url') == -1) && (newVal != '/') && (newVal != '/login') && (newVal != '/forget') && (newVal != '/edition') && (newVal != '/404') && (newVal.indexOf('agreeMentDetails') == -1))){
            if(document.documentElement.clientWidth < 980){
              this.close_click()
            }else{
              this.open_click()
            }
          }
        }
      }
    },
    mounted() {
        // const userMenuList = this.$store.state.userMenuList;
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
  .aside-all{
    position: relative;
    height: 100%;
    z-index: 2;
    .svg-icon{
      margin-left: 4px !important;
      color: #909399;
      font-size: 18px;
    }
    .el-menu-vertical-demo{
      height: calc(100vh - 60px);
      overflow-y: scroll;
      .el-menu-item.is-active{
        color: #409EFF;
        background: #f2f3f7;
      }
    }
  }
  
/* //element-ui table的去除右侧滚动条的样式 */
::-webkit-scrollbar {
    width: 1px;
    height: 1px;
}
::-webkit-scrollbar-thumb {
    background-color: #f7f7f7;
    border-radius: 8px;
}
</style>