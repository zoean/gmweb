<template>
    <el-main class="index-main">
        
        <!-- <el-upload
            style="width: 130px; display: inline-block;"
            :action="readExcelClueData"
            :headers="headersObj"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <el-button plain size="small" style="width: 120px;">导入线索</el-button>
        </el-upload>

        <el-button plain @click="downloadImport" size="small" style="width: 130px; display: inline-block;">下载导入模板</el-button>

        <el-button plain @click="clearImport" size="small" style="width: 130px; display: inline-block;">清除导入线索</el-button>

        <el-button type="primary" @click="upImport" size="small" style="width: 120px; display: inline-block; float: right;">确定导入</el-button> -->

    </el-main>
</template>

<script>
import { 
  
} from '../../request/api';
import { 
  
} from '../../assets/js/common';
export default {
    name: 'timeData',
    data() {
      return {
        fullscreenLoading: false,
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
        }
        .screen-li{
            width: 90%;
        }
    }
    .index-main /deep/ .el-table .cell{
        text-align: center !important;
    }
</style>