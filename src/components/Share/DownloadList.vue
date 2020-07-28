<template>
    <div class="download">
        <el-dialog width="40%" title="下载任务" :visible.sync="downloadFlag_" :before-close="handleClose">

            <el-table
                :data="list"
                ref="tableSelect"
                v-loading="fullscreenLoading"
                style="width: 100%">

                <el-table-column
                  :prop="item.prop"
                  :label="item.label"
                  :show-overflow-tooltip="true"
                  :min-width="item.width"
                  v-for="(item, index) in columnList"
                  :key="index"
                >

                  <template slot-scope="scope">
                    <span>{{scope.row[item.prop]}}</span>
                    <svg-icon v-if="item.prop == 'download' && scope.row['status'] == '已完成'" icon-class="download" icon-title="点击下载" @click="downloadClick(scope.row)" />
                  </template>

                </el-table-column>
            </el-table>
          
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancleField" size="small" plain>关 闭</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
import { 
    downloadList
} from '../../request/api';
import { 
    timestampToTime
} from '../../assets/js/common';
import { 
    
} from '../../assets/js/data';
export default {
    name: 'DownloadList',
    props: {
        downloadFlag: {
          type: Boolean,
          default: false
        },
    },
    data() {
        return {
            list: [],
            columnList: [
                { 'prop': 'taskName', 'label': '任务名称', width: 200 },
                { 'prop': 'finishTime', 'label': '完成时间', width: 120 },
                { 'prop': 'status', 'label': '处理状态', width: 60 },
                { 'prop': 'download', 'label': '', width: 50 },
            ],
        }
    },
    created() {
        this.downloadList();
    },
    methods: {
        downloadList() {
            this.fullscreenLoading = true;
            this.$smoke_post(downloadList, {
                registerId: this.registerId
            }).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.map(sll => {
                            sll.status = sll.status == 0 ? '处理中' : sll.status == 1 ? '已完成' : '处理失败'
                        })
                        this.list = res.data;
                    }, 300);
                }else{
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }, 300)
                }
            })
        },
        downloadClick(row) {
            window.open(row.downloadUrl, '_blank');
        },
        handleClose() {
            this.$emit("changedownloadFlag", false)
        },
        cancleField() {
            this.$emit("changedownloadFlag", false)
        },
    },
    mounted() {
        
    },
    computed: {
        downloadFlag_:{
            get(){
                return this.downloadFlag
            },
            set(val){
                this.$emit("changedownloadFlag",val)
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .download /deep/ div.el-dialog__body{
        height: 55vh;
        overflow: auto;
        padding: 10px 20px;
    }
</style>