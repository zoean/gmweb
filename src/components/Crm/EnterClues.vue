<template>
    <div class="main-area">

        <el-container class="index-main">

            <el-main>

                <div class="people-title">录入线索</div>

                <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                    <el-tab-pane label="手动输入" name="first">手动输入</el-tab-pane>
                    <el-tab-pane label="模板输入" name="second">模板输入</el-tab-pane>
                </el-tabs>

            </el-main>

        </el-container>

    </div>
</template>

<script>
import { 
    
} from '../../request/api';
import {  } from '../../assets/js/common';
import {  } from '../../assets/js/data';
export default {
    name: 'enterClues',
    data() {
        return {
            activeName: 'first',
        }
    },
    created() {
        
    },
    methods: {
        handleTabsClick(tab, event) {
            console.log(tab, event);
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .main-area{
        .index-main{
            height: calc( 100vh - 60px);
            .people-title{
                width: calc( 100vw - 3.8rem);
                height: 40px;
                line-height: 40px;
                text-align: center;
                font-size: 15px;
                background: #aaa;
                margin-bottom: .3rem;
                color: #fff;
            }
            .people-screen{
                margin-bottom: .3rem;
                .screen-li{
                    width: 90%;
                }
            }
        }
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
    /* //element-ui table的去除右侧滚动条的样式 */
    ::-webkit-scrollbar {
        width: 8px;
        height: 1px;
    }
        /* // 滚动条的滑块 */
    ::-webkit-scrollbar-thumb {
        background-color: #a1a3a9;
        border-radius: 8px;
    }
</style>