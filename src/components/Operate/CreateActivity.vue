<template>
  <el-container class="index-main">
    <el-main>
      <div class="people-title">创建活动<i class="el-icon-back" title="返回" @click="$router.go(-1)">点击返回</i></div>
      <el-tabs type="border-card">
        <el-tab-pane label="基础信息">
          <el-form ref="form" :model="form" :rules="rules" label-width="180px !important">
            <el-form-item label="应用公众号" prop="appId">
              <el-row :gutter="10">
                <el-col :span="7">
                  <el-select v-model="form.appId" placeholder="请选择公众号">
                    <el-option
                      :key="index"
                      v-for=" (item,index) in application"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col class="form-tip" :span="15">初次选定后，之后不可更改</el-col>
              </el-row>
              
            </el-form-item>
            <el-form-item label="活动名称" prop="activityName">
              <el-col :span="7">
                <el-input v-model.trim="form.activityName"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="活动简约封面" prop="imageUrl2">
              <el-row :gutter="10">
                <el-col :span="7">
                  <el-upload
                  class="avatar-uploader"
                  :action="uploadFile"
                  :show-file-list="false"
                  :data="pppss"
                  :on-success="handleAvatarSuccessicon"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl2" :src="imageUrl2" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                </el-col>
                <el-col class="form-tip" :span="15">用户分享活动链接等情况使用。封面尺寸要求：300px*300px</el-col>
              </el-row>
              
              
            </el-form-item>
            <el-form-item label="关键词" prop="triggerWord">
              <el-row :gutter="10">
                <el-col :span="7">
                  <el-input v-model.trim="form.triggerWord"></el-input>
                </el-col>
                <el-col class="form-tip" :span="15">
                  多个可以用逗号分隔开
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="活动时间" prop="activityTime">
              <el-col :span="7">
                <el-date-picker
                v-model="form.activityTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="派奖时间" prop="receiveTime">
              <el-col :span="7">
                <el-date-picker
                  v-model="form.receiveTime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :picker-options="pickerOptions"
                  :default-time="['00:00:00', '23:59:59']"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="新用户触发" prop="newUserTrigger">
            <el-row :gutter="10">
              <el-col :span="7">
                <el-select v-model="form.newUserTrigger">
                  <el-option label="启用" value="1"></el-option>
                  <el-option label="不启用" value="0"></el-option>
                </el-select>
              </el-col>
              <el-col class="form-tip" :span="15">新用户初进公众号，直接发送文案与海报</el-col>
            </el-row>
            </el-form-item>
            <el-form-item label="触发文案">
              <el-row>
                <el-col :span="16">
                  <el-row>
                    <el-col><el-input type="textarea" row="5" v-model="form.triggerText"></el-input></el-col>
                  </el-row>
                  <el-row>
                    <el-col class="form-tip">
                      用户在公众号发关键字，则会收到此内容消息,不填写则不发送消息给用户
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>  
            </el-form-item>
            <el-form-item label="触发图片">
            <el-row :gutter="10">
              <el-col :span="7">
                <el-upload
                  ref="upload"
                  class="avatar-uploader"
                  :action="uploadFile"
                  :show-file-list="false"
                  :data="pppss"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-col>
              <el-col class="form-tip" :span="15">用户在公众号发关键字，则会收到此内容海报,不上传则不发送海报图给用户。海报尺寸要求：750px*1334px</el-col>
            </el-row>
              
            </el-form-item>
            <el-form-item label="用户中奖提醒推荐人">
            <el-row :gutter="10">
              <el-col :span="7">
                <el-radio-group v-model="awardNotice" label-width="100px">
                  <el-radio-button label="开启"></el-radio-button>
                  <el-radio-button label="关闭"  border></el-radio-button>
                </el-radio-group>
              </el-col>
              <el-col class="form-tip" :span="15">提醒暂时为固定形式内容</el-col>
            </el-row>
              
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button @click="$router.push('/operate/activityA')">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="活动图文">
          <EditorBar :value="form.activityContent" :isClear="isClear" @saveContent="saveContent"></EditorBar>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import EditorBar from "../../components/Share/wangEnduit";
import {wechatActivityAdd}  from '@/request/operateApi.js'
import { uploadFile } from '../../request/api';
export default {
  name: "CreateActivity",
  data() {
    return {
      pickerOptions: {
      },
      form: {
        appId: "", //公账号APPID
        activityName: "", //活动名称   
        newUserTrigger: "1", //新用户是否触发（0-否，1-是）
        triggerText: "", //触发文案
        activityPage: "", //活动简约封面
        activityContent: "", //	活动图文信息
        awardNotice: 1, //中奖通知推荐人（0-否，1-是）
        triggerPicture: "", //触发图片
        activityStartTime:"",//活动开始时间
        activityEndTime:"",
        receiveStartTime:"",//派奖开始时间
        receiveEndTime:"",
        triggerWord:""//关键字
      },
      application: [{ label: "测试号", value: "wx5684c1cd32a4fe6a" }],
      isClear: false,
      activityTime: "", //活动时间
      receiveTime: "", //派奖时间
      imageUrl: "",
      imageUrl2: "",
      detail: "",
      rules: {
        appId: [{ required: true, message: "请选择公众号", trigger: "change" }],
        activityName: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 30, message: '长度在3-30个字符', trigger: 'blur'}
        ],
        // imageUrl2: [
        //   { required: true, message: "请上传活动封面", trigger: "blur" }
        // ],
        triggerWord:[
          { required: true, message: "请输入关键词", trigger: "blur" }
        ],
        activityTime: [
          { required: true, message: "请选择活动时间", trigger: "blur" }
        ],
        receiveTime: [
          { required: true, message: "请选择派奖时间", trigger: "blur" }
        ],
        newUserTrigger: [
          { required: true, message: "请选择是否开启", trigger: "change" }
        ]
      },
      pppss: { fileType: "img" }, //上传图片携带参数
      awardNotice:"开启",
      copyForm:'',
      uploadFile: uploadFile
    };
  },
  created(){
    this.copyForm = JSON.parse(JSON.stringify(this.form))
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.code === 0) {
        this.form.triggerPicture =
          process.env.VUE_APP_FILE_JHWX + res.data.fileUrl;
      } else {
        this.$message.error(res.data.msg);
      }
    },
    handleAvatarSuccessicon(res, file) {
      this.imageUrl2 = URL.createObjectURL(file.raw);
      if (res.code === 0) {
        this.form.activityPage =
          process.env.VUE_APP_FILE_JHWX + res.data.fileUrl;
      } else {
        this.$message.error(res.data.msg);
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if(valid){
          if(this.awardNotice === '开启'){
                this.form.awardNotice = '1'
          }else if(this.awardNotice === '关闭'){
                this.form.awardNotice = '0'
          }
          this.form.activityStartTime = this.form.activityTime[0]
          this.form.activityEndTime = this.form.activityTime[1]
          this.form.receiveStartTime = this.form.receiveTime[0]
          this.form.receiveEndTime = this.form.receiveTime[1]
          this.$smoke_post(wechatActivityAdd,this.form).then(res=>{
              if(res.code === 200){
                this.form = this.copyForm
                this.$router.push('/operate/activityA')
              }
          })
        }
      });
    },
    saveContent(val){
      this.form.activityContent = val
    }
  },
  components: {
    EditorBar
  }
};
</script>

<style lang="less" scoped>

.line {
  text-align: center;
}
.index-main {
  height: calc(100vh - 60px);
  .people-title {
    width: 100% !important;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 15px;
    background: #aaa;
    margin-bottom: 0.3rem;
    color: #fff;
    position: relative;
    i{
        position: absolute;
        left: 10px;
        top: 13px;
        cursor: pointer;
    }
  }
}
/deep/ .el-form .el-form-item {
  padding-bottom: 10px;
  .el-textarea__inner{
    min-height: 140px !important;
  }
}
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>