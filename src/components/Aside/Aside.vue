<template>
    <div>
        <el-aside width='3rem'>
                    
            <el-menu
                :default-active="activeIndex"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                >
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>基础管理模块</span>
                  </template>
                  <el-menu-item index="1-1" @click="active_router('1-1')">员工管理</el-menu-item>
                  <el-menu-item index="1-2" @click="active_router('1-2')">角色管理</el-menu-item>
                  <el-menu-item index="1-3" @click="active_router('1-3')">组织结构管理</el-menu-item>
                  <el-menu-item index="1-4" @click="active_router('1-4')">菜单管理</el-menu-item>
                  <!-- <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                  </el-menu-item-group> -->
                </el-submenu>
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">用户关系（crm）模块</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <i class="el-icon-document"></i>
                  <span slot="title">知识点体系模块</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <i class="el-icon-setting"></i>
                  <span slot="title">财务功能模块</span>
                </el-menu-item>
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
        }
    },
    created() {
      this.router_index();
    },
    methods: {
      active_router(index) {
        console.log(index);
        let route = '';
        switch(index){
          case '1-1':
            route = '/base/people';
            break;
          case '1-2':
            route = '/base/role';
            break;
          case '1-3':
            route = '/base/zuzhi';
            break;
          case '1-4':
            route = '/base/menu';
            break;
        }
        this.$router.push({ path: route });
      },
      router_index() {
        let index = '';
        switch(this.$route.path){
          case '/base/people':
            index = '1-1';
            break;
          case '/base/role':
            index = '1-2';
            break;
          case '/base/zuzhi':
            index = '1-3';
            break;
          case '/base/menu':
            index = '1-4';
            break;
        }
        this.activeIndex = index;
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