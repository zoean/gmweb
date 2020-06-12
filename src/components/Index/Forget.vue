<template>
  
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="width: 700px; border: 1px dashed #ccc; position: absolute; left: 50%; margin-left: -480px; top: 100px; padding: 30px;">

    <div style="text-align: center; font-size: 16px;">忘记密码</div>
      
    <el-form-item label="手机号" :label-width="formLabelWidth" prop="accountNumber">
      <el-input v-model="ruleForm.accountNumber" autocomplete="off" placeholder="请输入手机号" style="width: 80%;" size="small"></el-input>
    </el-form-item>
    <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
      <el-input v-model="ruleForm.newPassword" autocomplete="off" placeholder="请输入新密码" type="password" style="width: 80%;" size="small"></el-input>
    </el-form-item>
    <el-form-item label="验证码" :label-width="formLabelWidth" prop="verCode">
      <el-input :value="ruleForm.verCode" style="width: 40%;" placeholder="请输入验证码" size="small" @input="input_change($event)"></el-input>
      <el-button size="small" style="display: inline-block; max-width: 150px; float: right; margin-right: 20%; width: 34%; height: 100%; margin-top: 4px; margin-left: 6%; text-align: center;" plain @click="sendDingVerCode" :disabled="form_rule_flag">{{form_rule_name}}</el-button>
    </el-form-item>

    <el-form-item label="" :label-width="formLabelWidth">
      <div style="font-size: 12px; float: right; margin-right: 20%;">@：获取验证码后，请去钉钉查看</div>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')" size="small" style="width: 80px;">保 存</el-button>
      <el-button @click="loginBack" size="small" plain style="width: 80px;">返回登录</el-button>
    </el-form-item>
    
  </el-form>
  
</template>

<script>
import { forgetPassword, sendDingVerCode } from '../../request/api';
import { phone_vailData } from '../../assets/js/data';
export default {
  name: 'forget',
  data() {
    return {
        formLabelWidth: '120px',
        ruleForm: {
          accountNumber: '',
          newPassword: '',
          verCode: ''
        },
        rules: {
          accountNumber: [
            { pattern: phone_vailData, required: true, message: '请输入手机号', trigger: 'blur' },
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
          verCode: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ],
        },
        form_rule_flag: false,
        form_rule_name: '获取钉钉验证码',
        timer:null,
    }
  },
  created() {
    
  },
  methods: {
    input_change(e) {
      this.ruleForm.verCode = e;
      this.$forceUpdate();
    },
    loginBack() {
      this.$router.push({
        path: '/login'
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.forgetPassword();
        } else {
          return false;
        }
      });
    },
    forgetPassword() {
      const that = this;
      this.$smoke_post(forgetPassword, this.ruleForm).then(res => {
        if(res.code == 200) {
          this.$message({
            type: 'success',
            message: '密码修改成功, 3秒后会自动跳转到登录页'
          })
          setTimeout(function(){ 
              that.$router.push({
                  path: '/login'
              })
          }, 3000);
        }else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    sendDingVerCode() {
      let num = 60;
      if(phone_vailData.test(this.ruleForm.accountNumber)) {
        this.$smoke_get(sendDingVerCode + `/` + this.ruleForm.accountNumber, {}).then(res => {
            if(res.code == 200) {
                if(res.data == 0) {
                    this.$message({
                        type: 'success',
                        message: '获取钉钉验证码成功'
                    })
                    this.timer = setInterval(() => {
                        num--;
                        if(num <= 0){
                            clearInterval(this.timer);
                            this.form_rule_name = '获取钉钉验证码';
                            this.form_rule_flag = false;
                        }else{
                            this.form_rule_name = num + 's';
                            this.form_rule_flag = true;
                        }
                    },1000)

                }else{
                    this.$message({
                        type: 'error',
                        message: '亲，一分钟以后再获取'
                    })
                    this.timer = setInterval(() => {
                        num--;
                        if(num <= 0){
                            clearInterval(this.timer);
                            this.form_rule_name = '获取钉钉验证码';
                            this.form_rule_flag = false;
                        }else{
                            this.form_rule_name = num + 's';
                            this.form_rule_flag = true;
                        }
                    },1000)
                }
            }else{
                this.$message({
                    type: 'error',
                    message: '获取钉钉验证码失败'
                })
                this.form_rule_flag = false;
            }
        })
      }
    },
  },
  mounted() {
    
  }
}
</script>

<style lang="less" scoped>
  
</style>