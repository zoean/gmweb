<template>
    <div style="">
        <el-container class="index-main">

            <el-main>

                <div class="people-title">项目结构管理</div> 
         
                <!-- <el-table
                  :data="classList"
                  style="width: calc( 100vw - 3.65rem)">
                  <el-table-column
                    :prop="item.prop"
                    :label="item.label"
                    v-for="(item, index) in columnList"
                    :key="index"
                    >
                  </el-table-column>
                  <el-table-column prop="active" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total='total'
                    :page-size='screenForm.pageSize'
                    :page-sizes="[2, 3, 5, 8]"
                    :hide-on-single-page="totalFlag"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                >
                </el-pagination> -->

            </el-main>

        </el-container>
    </div>
    
</template>

<script>
import { getKnowledgeStructure } from '../../request/api';
export default {
    name: 'index',
    data() {
        return {
            classForm: {
                currentPage: 1,
                pageSize: 10,
                sortSet: []
            }
        }
    },
    created() {
        
    },
    methods: {
        
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .el-main{
        // background: grey;
    }
    .index-main{
        height: calc( 100vh - 60px);
        .people-title{
            width: 100%;
            height: .6rem;
            line-height: .6rem;
            text-align: center;
            font-size: .2rem;
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
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
</style>