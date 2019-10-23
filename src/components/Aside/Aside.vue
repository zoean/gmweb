<template>
    <div>
        <el-aside width='3rem'>
            
            <el-menu
                :default-active="activeIndex"
                ref="elmenu"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                :default-openeds="openedsIndex"
                >

                <div v-for="(item,index) in $store.state.userMenuList" :key="index">

                  <el-submenu :index="`${item.url}`" v-if="item.includeSubsetList.length != 0 && item.disabled">
                    <template slot="title">
                      <i :class="item.icon"></i>
                      <span>{{item.name}}</span>
                    </template>
                    <div v-for="(res,num) in item.includeSubsetList" :key="num">
                      <el-menu-item 
                        :index="`${res.url}`" 
                        @click="active_router(res)"
                        v-if="res.disabled"
                      >{{res.name}}
                      </el-menu-item>
                    </div>
                  </el-submenu>

                  <el-menu-item :index="`${item.url}`" v-if="item.includeSubsetList.length == 0 && item.disabled" @click="active_router(item)">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                  </el-menu-item>

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
          activeIndex: '/base',
          openedsIndex: ['']
        }
    },
    created() {
      this.router_index();
    },
    methods: {
      active_router(index) {
        this.$router.push({ path: index.url });
      },
      router_index() {
        this.activeIndex = this.$route.path;
      },
      handleOpen(key, keyPath) {
          console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
          console.log(key, keyPath);
      },
      getMenuDetailsSubsetByUuid() {
        this.$smoke_post(getMenuDetailsSubsetByUuid, {}).then(res => {
          console.log(res);
        })
      }
    },
    watch:{
      '$route.path': function(newVal,oldVal){
        if(newVal == '/' || newVal == '/timeData'){
          this.openedsIndex = [];
          this.activeIndex = '';
        }
      }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .el-aside{
        height: 100%;
        .el-menu{
            height: 100%;
        }
    }
</style>