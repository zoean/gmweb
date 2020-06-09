<template>
  
  <!-- <el-dialog
    title="修改密码"
    :visible.sync="centerDialogVisible"
    :modal-append-to-body='false'
    width="40%"
    :show-close="centerDialogVisible"
    :before-close="handleClose"
    class="reset-password"
    center>
    <el-form :model="form">
        
      <el-form-item label="手机号" :label-width="formLabelWidth">
        <el-input v-model="form.accountNumber" autocomplete="off" type="password" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="新密码" :label-width="formLabelWidth">
        <el-input v-model="form.newPassword" autocomplete="off" type="password" style="width: 80%;"></el-input>
      </el-form-item>
      <el-form-item label="验证码" :label-width="formLabelWidth">
        <el-input :value="form.verCode" style="width: 40%;" @input="input_change_ma($event)"></el-input>
        <el-button style="display: inline-block; max-width: 150px; float: right; margin-right: 20%; width: 34%; height: 100%; margin-left: 6%; text-align: center;" plain @click="sendDingVerCode" :disabled="form_rule_flag">{{form_rule_name}}</el-button>
      </el-form-item>

      <el-form-item label="" :label-width="formLabelWidth">
        <div style="font-size: 12px; float: right; margin-right: 20%;">@：获取验证码后，请去钉钉查看</div>
      </el-form-item>
    </el-form>

    

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialoghold">保 存</el-button>
      <el-button @click="dialog_cancel" v-if="!oneLogin">取 消</el-button>
      <el-button @click="dialog_cancel_back" v-if="oneLogin">返回登录页</el-button>
    </span>
  </el-dialog> -->
  
</template>

<script>
export default {
  name: 'forget',
  data() {
    return {
       
    }
  },
  created() {
    
  },
  methods: {
    
  },
  mounted() {
    
  }
}
</script>

<style lang="less" scoped>
  
</style>