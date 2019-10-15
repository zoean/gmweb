<template>
    <div>
        <el-aside width='3rem'>
                    
            <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                >
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>基础模块</span>
                  </template>
                  <el-menu-item-group>
                    <template slot="title">人员管理</template>
                    <el-menu-item index="1-1">人员列表</el-menu-item>
                  </el-menu-item-group>
                  <!-- <el-menu-item-group title="分组2">
                    <el-menu-item index="1-3">选项3</el-menu-item>
                  </el-menu-item-group> -->
                </el-submenu>
                <el-menu-item index="2">
                  <i class="el-icon-menu"></i>
                  <span slot="title">导航二</span>
                </el-menu-item>
                <el-menu-item index="3">
                  <i class="el-icon-document"></i>
                  <span slot="title">导航三</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <i class="el-icon-setting"></i>
                  <span slot="title">导航四</span>
                </el-menu-item>
            </el-menu>

        </el-aside>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
           
        }
    },
    created() {

    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
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