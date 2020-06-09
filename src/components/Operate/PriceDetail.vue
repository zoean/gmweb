<template>
  <el-container class="index-main">
    <el-main>
      <div class="people-title">奖品详情</div>
      <el-radio-group v-model="radio1" @change="changeCR">
        <el-radio-button v-for="(item,index) in radioButton" :key="index" :label="item"></el-radio-button>
      </el-radio-group>
      <el-form ref="form" :model="form">
        <el-form-item label="奖品状态">
          <el-radio-group v-model="form.awardStatus">
            <el-radio-button label="开启"></el-radio-button>
            <el-radio-button label="关闭"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="奖品图片">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action="http://gm.jhwx.com/upload-service/upload/file"
            :show-file-list="false"
            :data="pppss"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="奖品名称">
          <el-col :span="10">
            <el-input v-model="form.awardName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="任务人数">
          <el-col :span="4">
            <el-input placeholder="必填" v-model="form.membersMin"></el-input>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="4">
            <el-input v-model="form.membersMax" placeholder="若不填则无上限"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="市场价格">
          <el-col :span="10">
            <el-input v-model="form.valuationPrice"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="领取跳转" v-if="radio1 === '自定义链接'">
          <el-col :span="10">
            <el-input v-model="form.awardUrl"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="选择分校" v-if="radio1 === '优惠券'">
          <el-col :span="10">
            <el-select v-model="form.schoolName" @change="getCouponList(form.schoolName)">
              <el-option label="京华网校" value="jhwx"></el-option>
              <el-option label="胜学网校" value="shengxuewangxiao"></el-option>
              <el-option label="集团网校" value="jhwxedu"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="选择优惠券" v-if="radio1 === '优惠券'">
          <el-col :span="10">
            <el-select v-model="form.couponsId">
              <el-option v-for="(item, index) in couponList" :label="item.couponName" :value="item.couponId">{{item.couponName}}</el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="领取验证">
          <el-col :span="10">
            <el-select v-model="form.receiveVerify">
              <el-option label="验证码验证手机且不可跳过" value="0"></el-option>
              <el-option label="验证码验证手机但可跳过" value="1"></el-option>
              <el-option label="无需验证码验证手机" value="2"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="领取时告知">
          <el-col :span="10">
            <el-input v-model="form.awardTip"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="10" class="btnbox">
          <el-button type="primary" @click="addWinning">提交</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import { wechatActivityAwardGet,wechatActivityAwardSEdit,wechatActivityAwardAdd, getCouponList } from "@/request/operateApi.js";
export default {
  name: "pricedetail",
  data() {
    return {
      radio1: "优惠券",
      currentRadio: "",
      detailId: "",
      imageUrl: "",
      pppss: { fileType: "img" }, //上传图片携带参数
      radioButton: ["优惠券", "实物邮寄", "自定义链接"],
      couponList: [],
      form: {
        awardStatus: "", //奖励开启状态(0-关闭，1-开启)
        awardName: "", //奖励名称
        couponsId: "", //	优惠券ID
        receiveVerify: "", //领取手机号验证
        valuationPrice: "", //市场价格
        awardUrl: "", //领取跳转地址
        awardTip: "", //领奖时告知,
        pictureUrl: "", //奖品图片
        membersMaxL:'',
        membersMin:'',
      },
    };
  },
  created() {
    let Id = this.$route.query.activityId;
    let priceType = this.$route.query.priceType;
    let awardId = this.$route.query.awardId;
    this.detailId = Id ? Id : "";
    if (priceType && Id && awardId) {
      priceType === "1"
        ? (this.radio1 = "优惠券")
        : priceType === "2"
        ? (this.radio1 = "实物邮寄")
        : (this.radio1 = "自定义链接");
      let newradioButton = this.radioButton.filter(v => v === this.radio1);
      this.radioButton = newradioButton;
      this.$smoke_get(wechatActivityAwardGet, { awardId }).then(res => {
          if (res.code === 200) {
            this.imageUrl = res.data.pictureUrl;
            res.data.awardStatus === "0"
              ? (res.data.awardStatus = "关闭")
              : (res.data.awardStatus = "开启")
            let receiveVerify = res.data.receiveVerify;
            // receiveVerify = receiveVerify === "0" ? '验证码验证手机且不可跳过' :(receiveVerify === "1" ? '验证码验证手机但可跳过':'无需验证码验证手机')
            this.form = res.data;
            this.getCouponList(this.form.schoolName)
          }
        }
      );
    }
  },
  methods: {
    getCouponList(schoolName){
    this.$smoke_post(getCouponList, {schoolName}).then(res => {
      if(res.code == 200){
        this.couponList = res.data ? res.data : []
      }
    })
    },
    changeCR() {
        this.form = {
        awardStatus: "", //奖励开启状态(0-关闭，1-开启)
        awardName: "", //奖励名称
        couponsId: "", //	优惠券ID
        receiveVerify: "", //领取手机号验证
        valuationPrice: "", //市场价格
        awardUrl: "", //领取跳转地址
        awardTip: "", //领奖时告知,
        pictureUrl: "", //奖品图片
        membersMaxL:'',
        membersMin:'',
      }
    },
    addWinning() {
      // console.log(this.$refs["form"].resetFields());
        let Id = this.$route.query.activityId;
        let priceType = this.$route.query.priceType;
        let awardId = this.$route.query.awardId;
      if(priceType&& Id && awardId){//这个是修改页面
        this.form.activityId = Id
        this.form.awardId = awardId
        this.form.awardType = priceType
        this.form.awardStatus = this.form.awardStatus === "开启" ? "1" : "0"
        console.log(this.form)
        this.$smoke_post(wechatActivityAwardSEdit,this.form).then(res=>{
          if(res.code === 200){
            this.$router.go(-1)
          }
        })
      }else{//新建页面
        this.form.activityId = this.$route.query.activityId
        this.form.awardType = this.radio1 === '优惠券' ? '1' :(this.radio1 === '实物邮寄'? '2' : (this.radio1 === '自定义链接' ? '3' : ''))
        this.form.awardStatus = this.form.awardStatus === "开启" ? "1" : "0"
                    console.log(this.form.awardType)
        this.$smoke_post(wechatActivityAwardAdd,this.form).then(res=>{

          console.log(res)
            if(res.code === 200){
              this.$router.go(-1)
            }
        })
         
      }

    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.code === 0) {
        this.form.pictureUrl = "http://testfile.jhwx.com/" + res.data.fileUrl;
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