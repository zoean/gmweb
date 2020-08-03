<template>
    <div class="baokao">
        <el-dialog width="56%" title="报考信息" :visible.sync="baokaoFlag_" :before-close="handleClose">
          
            <div v-loading="fullscreenLoading">
                <div class="baokao_kuang" v-if="message.itemId">

                <div><span class="baokao_lable">姓名：</span><span>{{message.name}}</span></div>
                <div><span class="baokao_lable">身份证号：</span><span>{{message.idCardNo}}</span></div>
                <div><span class="baokao_lable">性别：</span><span>{{message.gender}}</span></div>
                <div><span class="baokao_lable">学历：</span><span>{{message.education}}</span></div>
                <div><span class="baokao_lable">毕业院校：</span><span>{{message.graduationSchool}}</span></div>
                <div><span class="baokao_lable">所学专业：</span><span>{{message.graduationMajor}}</span></div>

                <div v-if="message.itemId != 97"><span class="baokao_lable">学历类型：</span><span>{{message.educationType}}</span></div>
                <div><span class="baokao_lable">毕业时间：</span><span>{{message.graduationTime}}</span></div>

                <div v-if="message.itemId != 97"><span class="baokao_lable">资格证书：</span><span>{{message.qualificationCert}}</span></div>

                <div v-if="message.itemId == 97 || message.itemId == 15"><span class="baokao_lable">工作单位：</span><span>{{message.work}}</span></div>
                <div v-if="message.itemId == 97 || message.itemId == 15"><span class="baokao_lable">工作年限：</span><span>{{message.workingYears}}</span></div>

                <div><span class="baokao_lable">手机：</span><span>{{message.telephone}}</span></div>
 
                <div v-if="message.itemId == 97"><span class="baokao_lable">职务：</span><span>{{message.workPost}}</span></div>
                <div><span class="baokao_lable">常用邮箱：</span><span>{{message.email}}</span></div>

                <div v-if="message.itemId != 97"><span class="baokao_lable">人事考试网账号：</span><span>{{message.cptaAccount}}</span></div>
                <div v-if="message.itemId != 97"><span class="baokao_lable">人事考试网密码：</span><span>{{message.cptaPassword}}</span></div>

            </div>

            <div v-if="message.itemId" style="margin-bottom: 10px;">

                <ul id="baokao">
                    <li v-for="(item, index) in imgArr"
                        :key="index">
                        <img :src="item.address ? item.address : require('../../assets/images/no_picture.png')" />
                        <span>{{item.name}}</span>
                    </li>
                </ul>

                <ul v-if="message.itemId == 97">
                    <li
                        @click="itemClick()">
                        <img style="width: 100px; height: 100px;" :src="educationFormUrl ? require('../../assets/images/yes_pdf.png') : require('../../assets/images/no_pdf.png')" alt="">
                        <span>学历电子备案表</span>
                    </li>
                </ul>

            </div>
            
            <span slot="footer" class="dialog-footer" v-if="message.itemId">
                <el-button type="primary" @click="examineYes" size="small">审核通过</el-button>
                <el-popover
                    placement="right-end"
                    width="200"
                    v-model="examineNoFlag">
                    
                    <el-select v-model="checkForm.checkResult" style="margin: 10px 0 14px 0;" placeholder="请选择审核失败原因" class="screen-li" size="small" clearable>
                        <el-option
                          v-for="item in checkResultList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                    </el-select>
                    
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" plain @click="examineNoFlag = false">取消</el-button>
                      <el-button type="primary" size="mini" @click="examineNo">确定</el-button>
                    </div>
                    <el-button slot="reference" plain size="small" style="margin-left: 10px;">审核失败</el-button>
                </el-popover>
            </span>

            <div v-if="!message.itemId"> 
                <el-image
                    style="width: 180px; height: 160px; margin-top: 40px;"
                    :src="require('../../assets/images/no_data.png')"
                ></el-image>    
                <div style="margin-top: 20px; font-size: 16px;"> 暂无数据 </div>
            </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import { 
    registerGet,
    registerCheck,
} from '../../request/api';
import { 
    timestampToTime, getTextByJs, genderText, educationText, educationTypeText
} from '../../assets/js/common';
import { 
    MJ_1, MJ_2, MJ_3, MJ_10, MJ_11, MJ_12, nationAll, MJ_15
} from '../../assets/js/data';
export default {
    name: 'baokaoMessage',
    props: {
        baokaoFlag: {
          type: Boolean,
          default: false
        },
        registerId: {
          type: String,
          default: ''
        }
    },
    data() {
        return {
            message: {
                itemId: '1'
            },
            imgArr: [],
            fullscreenLoading: false,
            checkForm: {
                checkResult: '',
                checkStatus: '',
                registerId: this.registerId
            },
            examineNoFlag: false,
            checkResultList: [
                {label: '照片不合格', value: '照片不合格'},
                {label: '工作证明不合格', value: '工作证明不合格'},
                {label: '学历不合格', value: '学历不合格'},
            ],
            educationFormUrl: ''
        }
    },
    created() {
        this.registerGet();
    },
    methods: {
        itemClick() {
            if(this.educationFormUrl != '') {
                window.open(this.educationFormUrl, '_blank');
            }
        },
        registerGet() {
            this.fullscreenLoading = true;
            this.$smoke_get(registerGet, {
                registerId: this.registerId
            }).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.gender = genderText(res.data.gender);
                        res.data.education = educationText(res.data.education);
                        res.data.educationType = educationTypeText(Number(res.data.educationType));
                        this.message = res.data;

                        this.imgArr.push({name: '个人相片', address: res.data.personalPictureUrl});
                        this.imgArr.push({name: '学历证书', address: res.data.diplomaUrl});
                        if(res.data.itemId == '97') {
                            this.imgArr.push({name: '申请表', address: res.data.applicationFormUrl});
                            this.imgArr.push({name: '身份证', address: res.data.idCardCopyUrl});
                            // this.imgArr.push({name: '学历电子备案表', address: res.data.educationFormUrl});
                            this.educationFormUrl = res.data.educationFormUrl;
                        }else{
                            this.imgArr.push({name: '身份证', address: res.data.idCardCopyUrl});
                        }

                        if(res.data.itemId == '97' || res.data.itemId == '15') {
                            this.imgArr.push({name: '工作年限证明', address: res.data.workTimeProveUrl});
                        }

                        this.$nextTick(() => {
                            this.initImageTools();
                        })
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
        handleClose() {
            this.$emit("changebaokaoFlag", false)
        },
        examineYes() {
            this.checkForm.checkStatus = 1;
            this.checkForm.checkResult = '';
            this.registerCheck();
        },
        examineNo() {
            this.checkForm.checkStatus = 2;
            if(this.checkForm.checkResult) {
                this.registerCheck();
            }else{
                this.$message({
                    type: 'error',
                    message: '请您选择审核失败原因'
                })
            }
        },
        registerCheck() {
            this.$smoke_post(registerCheck, this.checkForm).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '审核情况提交成功'
                    })
                    this.$emit("changebaokaoFlag", false)
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        initImageTools(){
            //初始化 viewerjs
            const ViewerDom = document.getElementById('baokao');
            const viewer = new Viewer(ViewerDom, {
                zIndex: 8888,
            });
        },
    },
    mounted() {
        
    },
    computed: {
        baokaoFlag_:{
            get(){
                return this.baokaoFlag
            },
            set(val){
                this.$emit("changebaokaoFlag",val)
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .baokao{
        text-align: center;
        ul {
            li {
                width: 100px;
                height: 100px;
                margin-right: 10px;
                margin-top: 20px;
                border: 1px dashed #cccccc;
                cursor: pointer;
                display: inline-block;
                text-align: center;
                img {
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                }
            }
        }
        .baokao_kuang{
            border-top: 1px solid #DDDDDD;
            text-align: left;
            padding-top: 20px;
            .baokao_lable {
                width: 50%;
                text-align: right;
                display: inline-block;
            }
        }
    }
    .baokao /deep/ div.el-dialog__body{
        height: 55vh;
        overflow: auto;
        padding: 10px 20px;
    }
    
    .baokao /deep/ div.el-dialog__footer{
        text-align: center;
    }
</style>