<template>
    <el-main class="index-main">

        <el-row class="people-screen">

            <el-col :span="4">
                
                <el-date-picker
                    style="width: 90%;"
                    size="small"
                    v-model="timeDate"
                    type="date"
                    value-format='timestamp'
                    :picker-options="pickerOptions"
                    @change="timeChange"
                    placeholder="请选择日期">
                </el-date-picker>

            </el-col>

            <el-col :span="4">

                <el-button type="primary" @click="orgOpenClassClick" size="small">查 询</el-button>

            </el-col>

        </el-row>

        <el-table
            :data="list"
            ref="tableSelect"
            v-loading="fullscreenLoading"
            :key="Math.random()"
            style="width: 100%">
            
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              v-for="(item, index) in columnList"
              :key="index"
              >

              <template slot-scope="scope">
                <span>{{scope.row[item.prop]}}</span>
              </template>

            </el-table-column>

        </el-table>

    </el-main>
</template>

<script>
import { 
    orgOpenClass,
} from '../../request/api';
import { 
    timestampToTime, 
    genderText,
    classTypeString,
    getTextByJs,
    sortTextNum,
    schoolType,
} from '../../assets/js/common';
import { 
    
} from '../../assets/js/data';
export default {
    name: 'studentsNewBaoKao',
    data() {
        return {
            form: {
                time: '',
                dayType: '',
            },
            list: [],
            totalFlag: false,
            columnList: [
                { 'prop': 'singlePlatform', 'label': '成单平台', width: 120},
                { 'prop': 'classTeaOrg', 'label': '班主任组别' },
                { 'prop': 'openClassNum', 'label': '应开班' },
                { 'prop': 'alreadyOpenClassNum', 'label': '已开班', width: 120 },
                { 'prop': 'openClassNumData', 'label': '开班率', width: 120 },
                { 'prop': 'followUpNum', 'label': '应跟进', width: 120},
                { 'prop': 'alreadyFollowUpNum', 'label': '已跟进', width: 120},
                { 'prop': 'followUpNumData', 'label': '跟进率', width: 110},
            ],
            fullscreenLoading: false,
            timeDate: '',
            pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > Date.now();
                },
                shortcuts: [{
                  text: '今天',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime());
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '昨天',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '前天',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 2);
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '2天前',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 3);
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '3天前',
                  onClick(picker) {
                    const date = new Date(new Date(new Date().toLocaleDateString()).getTime());
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 4);
                    picker.$emit('pick', date);
                  }
                }]
            },
        }
    },
    created() {
        
    },
    methods: {
        timeChange() {
            this.form.time = this.timeDate;
        },
        orgOpenClassClick() {
            if(this.form.time){
                if(this.form.time == new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime()){
                    this.form.dayType = 1;
                }else if(this.form.time == new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() - 3600 * 1000 * 24){
                    this.form.dayType = 0;
                }else{
                    this.form.dayType = '';
                }
                this.orgOpenClass();
            }else{
                this.$message({
                    type: 'error',
                    message: '请您先选择查询日期'
                })
            }
        },
        orgOpenClass() {
            this.fullscreenLoading = true;
            this.$smoke_post(orgOpenClass, this.form).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.map(sll => {
                            sll.singlePlatform = schoolType(sll.singlePlatform);
                            if(sll.openClassNum != 0) {
                                sll.openClassNumData = ((sll.alreadyOpenClassNum / sll.openClassNum) * 100).toFixed(2) + '%';
                            }else{
                                sll.openClassNumData = '0%';
                            }
                            if(sll.followUpNum != 0) {
                                sll.followUpNumData = ((sll.alreadyFollowUpNum / sll.followUpNum) * 100).toFixed(2) + '%';
                            }else{
                                sll.followUpNumData = '0%';
                            }
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
    },
    mounted() {
        
    },
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
        .people-screen{
            margin-bottom: 16px;
            .screen-li{
                width: 90%;
            }
        }
        .el-pagination{
            text-align: right;
            margin-top: .4rem;
        }
    }
</style>