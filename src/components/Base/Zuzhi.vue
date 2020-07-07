<template>
    <el-main class="index-main">
        <el-table
          :data="zuzhiList"
          style="width: 100%"
          row-key="uuid"
          :indent='35'
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            v-for="(item, index) in columnList"
            :key="index"
            >
          </el-table-column>
          <!-- <el-table-column prop="active" label="操作">
            <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" >查看</el-button>
            </template>
          </el-table-column> -->
        </el-table>

    </el-main>
</template>

<script>

// default-expand-all 默认table要不要展开

import { getOrgSubsetByUuid } from '../../request/api';
export default {
    name: 'zuzhi',
    data() {
        return {
            zuzhiList: [],
            columnList: [
                { 'prop': 'name', 'label': '组织名称' },
                // { 'prop': 'uuid', 'label': 'id' },
            ],
        }
    },
    created() {
        this.getOrgSubsetByUuid();
    },
    methods: {
        // handleClick(row) {
        //     alert('暂未开发');
        // },
        getOrgSubsetByUuid() {
            let arr;
            this.$smoke_post(getOrgSubsetByUuid, {
                uuid: ""
            }).then(res => {
                //替换key（includeSubsetList换为children）table子节点key必须为children
                arr = JSON.parse(JSON.stringify(res.data).replace(/includeSubsetList/g,"children"));
                arr.map(sll => {
                    sll.name = sll.name;
                })
                this.zuzhiList = arr;
            })
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
        height: auto;
        .people-title{
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 15px;
            background: #fff;
            margin-bottom: .3rem;
            color: #666666;
            font-weight: 700;
        }
        .people-screen{
            margin-bottom: 16px;
            .screen-li{
                width: 90%;
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
    border-radius: 0px;
    border-radius: 8px;
}
</style>