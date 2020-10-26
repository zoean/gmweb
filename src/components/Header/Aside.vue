<template>
    <div v-if="routersFlag" class="aside-all" :style="{minWidth: iscollapse ? 'auto' : '214px'}">
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
      <p class="menuHandle" @click="toggleMenu">
        <svg-icon v-show="!iscollapse" class="hopen" icon-class="hopen" icon-title="收起菜单" />
        <span v-show="!iscollapse">收起菜单</span>
        <svg-icon v-show="iscollapse" class="hclose" icon-class="hclose" icon-title="展开菜单" />
      </p>
    </div>
</template>

<script>
import { getMenuDetailsSubsetByUuid, getClueDataNumber} from '../../request/api';
import { menuNumberFunc }  from '../../assets/js/common'
export default {
    name: '',
    data() {
        return {
          activeIndex: '',
          openedsIndex: [''],
          routersFlag: '',
          userMenuList: [],
          iscollapse: false,
          screeenWidth: document.documentElement.clientWidth,
          clueDataNumberList: [],
        }
    },
    created() {
      this.router_index();  
      console.log(this.$route.path)
      if(this.$route.path.indexOf('/crm') != -1){
        this.updateClueDataNumber() 
      }         
    },
    methods: {
      closeMenu(index){        
        this.$emit('setPageTitleLeft')
      },
      toggleMenu(){
        this.iscollapse = !this.iscollapse
      },
      active_router(index) {
        this.$store.commit('setPageNum', index.pageNum)
        this.$router.push({ path: index.url });
        this.activeIndex = index.url;
      },
      router_index() {
        this.activeIndex = this.$route.path;
      },
      getClueDataNumber() {
            let arr = [];
            this.$smoke_get(getClueDataNumber, {}).then(res => {
                if(res.code == 200) {
                    for(let i in res.data) {
                        arr.push(res.data[i]);
                    }
                    this.clueDataNumberList = arr;                    
                    const userMenuList = JSON.parse(localStorage.getItem('userMenuList'));
                    this.$store.commit('setUserMenuList', menuNumberFunc(userMenuList, this.clueDataNumberList));
                    localStorage.setItem('userMenuList', JSON.stringify(menuNumberFunc(userMenuList, this.clueDataNumberList)));
                    this.userMenuList = JSON.parse(localStorage.getItem('userMenuList'))[1].includeSubsetList
                }else{
                }
            })
        },
      updateClueDataNumber(){
        this.getClueDataNumber()
      }
    },
    watch:{
      'iscollapse': function(newVal){ 
        this.$emit('changeIscollapse', newVal)
        this.$emit('setPageTitleLeft')
      },
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
          
        this.updateClueDataNumber()
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
      }
    },
    mounted() {
        // const userMenuList = this.$store.state.userMenuList;
        this.$emit('setPageTitleLeft')
        const userMenuList = JSON.parse(localStorage.getItem("userMenuList"));
        const arr = this.$route.path.split("/");  
        if(this.$route.path == '/'){
          this.openedsIndex = [];
          this.routersFlag = false;
        }else if(arr[1] == 'base'){
          this.routersFlag = true;
          this.userMenuList = userMenuList[0].includeSubsetList;
        }else if(arr[1] == 'crm'){
          this.updateClueDataNumber()
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
      font-size: 18px;
      color: #909399;
    }
    .el-menu-vertical-demo{
      height: calc(100vh - 60px);
      overflow-y: scroll;
      background: #F5F5F5;
      padding-bottom: 40px;
      .el-submenu__title{
        .menu-titles{
          color: #555;
        }
        .el-menu-item{
          i{
            color: #909399;
          }
          span{
            color: #555;  
          }
        }
        .el-menu-item.is-active{
          background: #DEDEDE;
          i, span{          
          color: #409EFF;
          }
        }
      }
    }
    .menuHandle{
      position: absolute;
      bottom: 0;
      left: 0;
      height: 34px;
      width: 100%;
      background: #F0F0F0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999999;
      cursor: pointer;
      border-right: 1px solid #e6e6e6;
      .svg-icon{
        width: 13px;
        height: 12px;
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