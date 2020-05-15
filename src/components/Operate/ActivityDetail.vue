<template>
    <el-container class="index-main">
      <el-main>
        <div class="people-title">活动管理</div>
        <el-tabs type="border-card">
          <el-tab-pane label="基础信息">
            <el-form ref="form" :model="form" label-width="150px !important">
              <el-form-item label="应用公众号">
                <el-col :span="7">
                  <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="活动名称">
                <el-col :span="7">
                  <el-input v-model="form.name"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="触发机制">
                <el-radio-group v-model="radio" label-width="100px">
                  <el-radio-button label="输入关键词"></el-radio-button>
                  <el-radio-button label="进入桌面" border></el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="关键词">
                <el-col :span="7">
                  <el-input v-model="form.name"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="活动时间">
                <el-date-picker
                  v-model="value1"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="派奖事件">
                <el-date-picker
                  v-model="value2"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="新用户触发">
                <el-col :span="7">
                  <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="子菜单出发">
                <el-col :span="7">
                  <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item label="触发文案">
                <el-col :span="7">
                  <el-input type="textarea" v-model="form.desc"></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="触发图文链接">
                <el-col :span="7">
                  <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
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
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="产生助力提醒推荐人">
                <el-radio-group v-model="radio1" label-width="150px !important">
                  <el-radio-button label="开启"></el-radio-button>
                  <el-radio-button label="关闭" border></el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="用户中奖提醒推荐人">
                <el-radio-group v-model="radio2" label-width="100px">
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
          <el-tab-pane label="活动图文">配置管理</el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
</template>
<script>
export default {
  name: "activitydetail",
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      radio: "",
      radio1: "",
      radio2: "",
      value1:"",
      value2:"",
      imageUrl:""
    };
  },
  methods: {
    handleAvatarSuccess(){

    },
    beforeAvatarUpload(){

    },
    onSubmit(){
      
    }
  },
  
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