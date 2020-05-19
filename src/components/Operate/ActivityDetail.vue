<template>
  <el-container class="index-main">
    <el-main>
      <div class="people-title">活动详情</div>
      <el-tabs type="border-card">
        <el-tab-pane label="基础信息">
          <el-form ref="form" :model="form" label-width="150px !important" :rules="rules">
            <el-form-item label="应用公众号" prop="official">
              <el-col :span="7">
                <el-select v-model="form.official" placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="活动名称" prop="name">
              <el-col :span="7">
                <el-input v-model.trim="form.name"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="触发机制">
              <el-radio-group v-model="form.mechanism" label-width="100px">
                <el-radio-button label="输入关键词"></el-radio-button>
                <el-radio-button label="进入桌面" border></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.mechanism === '输入关键词' " label="关键词" prop="keyword">
              <el-col :span="7">
                <el-input v-model="form.keyword"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="活动时间" prop="activityTime">
              <el-col :span="7">
                <el-date-picker
                  style="width:100%"
                  v-model="form.activityTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="派奖时间" prop="distributionTime">
              <el-col :span="7">
                <el-date-picker
                  style="width:100%"
                  v-model="form.distributionTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="新用户触发" prop="newUser">
              <el-col :span="7">
                <el-select v-model="form.region" placeholder="">
                  <el-option label="启用" value="0"></el-option>
                  <el-option label="不启用" value="1"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="子菜单触发" prop="submenu">
              <el-col :span="7">
                <el-select v-model="form.submenu" >
                  <el-option label="启用" value="0"></el-option>
                  <el-option label="不启用" value="1"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="触发文案">
              <el-col :span="7">
                <el-input type="textarea" v-model="form.desc"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="触发图文链接" prop="graphicLinks">
              <el-col :span="7">
                <el-select v-model="form.graphicLinks" placeholder="请选择活动区域">
                  <el-option label="触发" value="shanghai"></el-option>
                  <el-option label="不启用" value="beijing"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="触发图片">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :auto-upload="false"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="产生助力提醒推荐人">
              <el-radio-group v-model="form.Zremind" label-width="150px !important">
                <el-radio-button label="开启"></el-radio-button>
                <el-radio-button label="关闭" border></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="用户中奖提醒推荐人">
              <el-radio-group v-model="form.Uremind" label-width="100px">
                <el-radio-button label="开启"></el-radio-button>
                <el-radio-button label="关闭" border></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="活动图文">
          <EditorBar v-model="detail" :isClear="isClear" @change="change"></EditorBar>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import EditorBar from "../../components/Share/wangEnduit"
export default {
  name: "CreateActivity",
  components:{EditorBar},
  data() {
    return {
      form: {
        name: "",
        keyword: "",
        official: "",
        mechanism: "输入关键词",
        activityTime:"",
        distributionTime:"",
        submenu:"",
        graphicLinks:"",
        graphicLinks:"",
        delivery: false,
        remindReferrer:"",//提醒推荐人
        type: [],
        resource: "",
        desc: "",
        newUser:"",
        Zremind:"关闭",
        Uremind:"关闭"
      },
      imageUrl: "",
      rules: {
        official: [{ required: true, message: "请选择公众号", trigger: "change" }],
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        keyword: [{ required: true, message: "请输入关键词", trigger: "blur" }],
        activityTime:[{type: 'date', required: true, message: '请选择日期', trigger: 'change'}],
        distributionTime:[{type: 'date', required: true, message: '请选择日期', trigger: 'change'}],
        newUser:[{ required: true, message: "请选择是否开启", trigger: "change" }]
      },
        test:'',  
        isClear: false,  
        detail:"" 
    };
  },
  created() {
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {});
    },
    change(val) {  
      console.log(val)  
    },  
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
/deep/ .el-form .el-form-item{
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