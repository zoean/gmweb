<template>
  <el-container class="index-main">
    <el-main>
      <div class="people-title">创建活动</div>
      <el-tabs type="border-card">
        <el-tab-pane label="基础信息">
          <el-form ref="form" :model="form" label-width="150px !important" :rules="rules">
            <el-form-item label="应用公众号" prop="appId">
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
            </el-form-item>
            <el-form-item label="活动名称" prop="activityName">
              <el-col :span="7">
                <el-input v-model.trim="form.activityName"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="活动简约封面">
              <el-upload
                class="avatar-uploader"
                action="http://testgm.jhwx.com/upload-service/upload/file"
                :show-file-list="false"
                :data="pppss"
                :on-success="handleAvatarSuccessicon"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl2" :src="imageUrl2" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="关键词" prop="triggerWord">
              <el-col :span="7">
                <el-input v-model.trim="form.triggerWord"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="活动时间" prop="activityTime">
              <el-col :span="7">
                <el-date-picker
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  style="width:100%"
                  v-model="activityTimes"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="派奖时间" prop="receiveTime">
              <el-col :span="7">
                <el-date-picker
                  style="width:100%"
                  value-format="yyyy-MM-dd"
                  v-model="receiveTimes"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="新用户触发" prop="newUserTrigger">
              <el-col :span="7">
                <el-select v-model="form.newUserTrigger">
                  <el-option label="启用" value="0"></el-option>
                  <el-option label="不启用" value="1"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="触发文案">
              <el-col :span="7">
                <el-input type="textarea" v-model="form.triggerText"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="触发图片">
              <el-upload
                ref="upload"
                class="avatar-uploader"
                action="http://testgm.jhwx.com/upload-service/upload/file"
                :show-file-list="false"
                :data="pppss"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="用户中奖提醒推荐人">
              <el-radio-group v-model="awardNotice" label-width="100px">
                <el-radio-button label="开启"></el-radio-button>
                <el-radio-button label="关闭"  border></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="活动图文">
          <EditorBar :value="form.activityContent" :isClear="isClear" @change="change"></EditorBar>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import EditorBar from "../../components/Share/wangEnduit";
import {wechatActivityAdd}  from '@/request/operateApi.js'
export default {
  name: "CreateActivity",
  data() {
    return {
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() < new Date().getTime() - 86400000;
        }
      },
      form: {
        appId: "", //公账号APPID
        activityName: "", //活动名称   
        newUserTrigger: "", //新用户是否触发（0-否，1-是）
        triggerText: "", //触发文案
        activityPage: "", //活动简约封面
        activityContent: "", //	活动图文信息
        awardNotice: "", //中奖通知推荐人（0-否，1-是）
        triggerPicture: "", //触发图片
        activityStartTime:"",//活动开始时间
        activityEndTime:"",
        receiveStartTime:"",//派奖开始时间
        receiveEndTime:"",
        triggerWord:""//关键字
      },
      application: [{ label: "测试号", value: "wx5684c1cd32a4fe6a" }],
      isClear: false,
      activityTimes: "", //活动时间
      receiveTimes: "", //派奖时间
      imageUrl: "",
      imageUrl2: "",
      detail: "",
      rules: {
        appId: [{ required: true, message: "请选择公众号", trigger: "change" }],
        activityName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        newUserTrigger: [
          { required: true, message: "请选择是否开启", trigger: "change" }
        ]
      },
      pppss: { fileType: "img" }, //上传图片携带参数
      awardNotice:"",
      copyForm:''
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
          "http://testfile.jhwx.com/" + res.data.fileUrl;
      } else {
        this.$message.error(res.data.msg);
      }
    },
    handleAvatarSuccessicon(res, file) {
      this.imageUrl2 = URL.createObjectURL(file.raw);
      if (res.code === 0) {
        this.form.activityPage =
          "http://testfile.jhwx.com/" + res.data.fileUrl;
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
                
             this.form.activityStartTime = this.activityTimes[0]
             this.form.activityEndTime = this.activityTimes[1]
             this.form.receiveStartTime = this.receiveTimes[0]
             this.form.receiveEndTime = this.receiveTimes[1]
             this.$smoke_post(wechatActivityAdd,this.form).then(res=>{
                 if(res.code === 200){
                    this.form = this.copyForm
                    this.$router.push('/operate/activityA')
                 }
            })
        }
      });
    },
    change(value) {
      this.form.activityContent = value
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
  }
}
/deep/ .el-form .el-form-item {
  padding-bottom: 10px;
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