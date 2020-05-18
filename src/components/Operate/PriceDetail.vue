<template>
  <el-container class="index-main">
    <el-main>
      <div class="people-title">奖品详情{{form.coupon}}</div>
      <el-radio-group v-model="radio1" @change="changeCR">
        <el-radio-button v-for="(item,index) in radioButton" :key='index' :label="item"></el-radio-button>
      </el-radio-group>
      <el-form ref="form" :model="form">
        <el-form-item label="奖品状态">
          <el-radio-group v-model="form.radio" @change="changeCR">
            <el-radio-button label="开启"></el-radio-button>
            <el-radio-button label="关闭"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="奖品图片">
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
        <el-form-item label="奖品名称">
          <el-col :span="10">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="任务人数">
          <el-col :span="4">
            <el-input></el-input>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="4">
            <el-input></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="市场价格">
          <el-col :span="10">
            <el-input></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="领取跳转" v-if="radio1 === '自定义链接'">
          <el-col :span="10">
            <el-input></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="选择优惠券" v-if="radio1 === '优惠券'">
          <el-col :span="10">
            <el-select v-model="form.coupon">
              <el-option label="优惠券1" value="0"></el-option>
              <el-option label="优惠券2" value="1"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="领取验证">
          <el-col :span="10">
            <el-select>
              <option></option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="领取时告知">
          <el-col :span="10">
            <el-input></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="10" class="btnbox">
          <el-button type="primary" @click="addWinning">提交</el-button>
          <el-button>取消</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "pricedetail",
  data() {
    return {
      radio1: "优惠券",
      currentRadio: "",
      detailId: "",
      imageUrl: "",
      radioButton:["优惠券","实物邮寄","自定义链接"],
      form: {
        radio: "",
        name: "",
        coupon: ""
      }
    };
  },
  created() {
    let Id = this.$route.query.id;
    let priceType = this.$route.query.priceType
    this.detailId = Id ? Id : "";
    console.log(priceType)
    if(priceType.length){
      this.radio1 = priceType
      let newradioButton = this.radioButton.filter(v=>v===priceType)
      this.radioButton = newradioButton
    }
  },
  methods: {
    changeCR(a) {
      console.log(a);
    },
    addWinning(){
      console.log(this.$refs['form'].resetFields())
    }
  }
};
</script>

<style scoped lang='less'>
.index-main {
  height: calc(100vh - 60px);
  .people-title {
    width: 100%;
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
.line {
  text-align: center;
}
.btnbox {
  display: flex;
  justify-content: center;
}
</style>