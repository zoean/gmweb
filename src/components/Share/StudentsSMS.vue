<template>
    <div class="download">
        <el-dialog width="40%" title="短信发送" :visible.sync="studentsSMSFlag_" :before-close="handleClose">
          
          <el-table
            :data="smsList"
            ref="smsTable"
            v-if="smsSetFlag"
            >

            <el-table-column
              type="selection"
              width="45">
            </el-table-column>

            <el-table-column
                :prop="item.prop"
                :label="item.label"
                v-for="(item, index) in smsColumnList"
                :key="index">

                <template slot-scope="scope">
                
                    <span>{{scope.row[item.prop] || '- -'}}</span>

                </template>

            </el-table-column>

          </el-table>

          <span slot="footer" class="dialog-footer" v-if="smsSetFlag">

            <el-button @click="handleClose" plain size="small">取 消</el-button>
            <el-button type="primary" @click="smsStuUuidListClick" size="small">确 定</el-button>

          </span>

          <el-form :model="smsForm" :rules="smsFormRules" ref="smsForm" class="demo-ruleForm" v-if="!smsSetFlag">
                
              <el-form-item label="短信名字" prop="smsMsgId">
                
                <el-select @change="smsMsgChange" v-model="smsForm.smsMsgId" placeholder="请选择短信模板" size="small" >
                    <el-option
                      v-for="item in smsMsgList"
                      :key="item.msgId"
                      :label="item.msgName"
                      :value="item.msgId">
                    </el-option>
                </el-select>

              </el-form-item>

              <el-form-item label="" prop="smsMsgText">
                <el-input size="small" type="textarea" v-model="smsForm.smsMsgText" readonly autosize></el-input>
              </el-form-item>

              <el-form-item label="发送方式" prop="type">
                
                <el-select @change="smsTypeChange" v-model="smsForm.type" placeholder="请选择发送方式" size="small" >
                    <el-option
                      v-for="item in smsTypeList"
                      :key="item.msgId"
                      :label="item.msgName"
                      :value="item.msgId">
                    </el-option>
                </el-select>

              </el-form-item>

              <el-form-item label="每日发送时间" prop="timeValue" v-if="smsTypeFlag">

                <el-time-picker
                  v-model="smsForm.timeValue"
                  value-format="HH:mm:ss"
                  placeholder="每日发送时间"
                  size="small"
                  style="width: 100%;"
                >
                </el-time-picker>

              </el-form-item>

              <el-form-item label="每日发送量" prop="number" v-if="smsTypeFlag">
                  <el-input v-model="smsForm.number" placeholder="请输入每日发送量" size="small"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" size="small" @click="sendSms('smsForm')">发送短信</el-button>
                <el-button @click="sendSmsFalse" size="small" plain>取消</el-button>
              </el-form-item>

          </el-form>

        </el-dialog>
    </div>
</template>

<script>
import { 
    getSendMsgSupStuList,
    groupSMS,
    getSMSMsgBaseList,
} from '../../request/api';
import { 
    timestampToTime
} from '../../assets/js/common';
import { 
    
} from '../../assets/js/data';
export default {
    name: 'DownloadList',
    props: {
        studentsSMSFlag: {
          type: Boolean,
          default: false
        },
        studentsSMSForm: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            smsList: [],
            smsColumnList: [
                { 'prop': 'name', 'label': '姓名' },
                { 'prop': 'tel', 'label': '手机号码' },
            ],

            smsForm: {
                number: '', //每日发送数量
                smsMsgId: '', //短信模板id	
                smsMsgText: '',
                stuList: [], //手机号码集合	(uuid)
                time: '', //发送时间(示例：10：13：12 将其换算为毫秒)
                timeValue: '',
                type: '', //发送方式：1 定时发送 2 一次性发送
            },
            smsFormRules: {
                number: [
                  { required: true, message: '请输入每日发送量', trigger: 'blur' }
                ],
                smsMsgId: [
                  { required: true, message: '请选择短信模板', trigger: 'change' }
                ],
                timeValue: [
                  { required: true, message: '请选择每日发送时间', trigger: 'change' }
                ],
                type: [
                  { required: true, message: '请选择发送方式', trigger: 'change' }
                ],
            },
            smsMsgList: [],
            smsSetFlag: true,
            smsTypeList: [
                { msgName: '定时发送', msgId: 1},
                { msgName: '一次性发送', msgId: 2},
            ],
            smsTypeFlag: false,
        }
    },
    created() {
        this.getSendMsgSupStuList();
    },
    methods: {
        sendSmsFalse() {
            this.smsSetFlag = true;
            
            this.$nextTick(() => {
                this.smsList.map(sll => {
                    this.$refs.smsTable.toggleRowSelection(sll, true);
                })
            })
        },
        sendSms(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if(this.smsTypeFlag) {
                    this.smsForm.time = countDown(this.smsForm.timeValue);
                }
                // console.log(this.smsForm);
                this.groupSMS();
              } else {
                return false;
              }
            });
        },
        groupSMS() {
            this.$smoke_post(groupSMS, this.smsForm).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '发送成功'
                    });
                    this.$emit("changeStudentsSMSFlag", false);
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    });
                }
            })
        },
        smsMsgChange(value) {
            this.smsMsgList.map(sll => {
                if(sll.msgId == value){
                    this.smsForm.smsMsgText = sll.msg;
                }
            })
        },
        smsTypeChange(value) {
            if(value == 1) {
                this.smsTypeFlag = true;
            }else{
                this.smsTypeFlag = false;
            }
        },
        getSMSMsgBaseList() {
            this.$smoke_get(getSMSMsgBaseList, {}).then(res => {
                if(res.code == 200) {
                    this.smsMsgList = res.data;
                }
            })
        },
        getSendMsgSupStuList() {
            this.smsSetFlag = true;
            this.$smoke_post(getSendMsgSupStuList, this.studentsSMSForm).then(res => {
                if(res.code == 200) {
                    this.smsList = res.data;
                    this.$nextTick(() => {
                        res.data.map(sll => {
                            this.$refs.smsTable.toggleRowSelection(sll, true);
                        })
                    })
                }
            })
        },
        handleClose() {
            this.$emit("changeStudentsSMSFlag", false);
        },
        smsStuUuidListClick() {
            let stuUuidArr = [];
            this.$refs.smsTable.selection.map(sll => {
                stuUuidArr.push(sll.stuUuid);
            });
            if(stuUuidArr.length != 0) {
                this.smsForm.stuList = stuUuidArr;
                this.smsForm.timeValue = '';
                this.smsSetFlag = false;
                this.getSMSMsgBaseList();
            }else{
                this.$message({
                    type: 'error',
                    message: '暂无学员可发送短信'
                });
            }
        },
    },
    mounted() {
        
    },
    computed: {
        studentsSMSFlag_:{
            get(){
                return this.studentsSMSFlag
            },
            set(val){
                this.$emit("changeStudentsSMSFlag",val)
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