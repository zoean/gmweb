<template>
    <div>
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" disabled>
                        
            <el-form-item label="用户姓名" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="用户工号" prop="describe">
              <el-input v-model="ruleForm.jobNumber"></el-input>
            </el-form-item>
            <el-form-item label="用户手机号" prop="describe">
              <el-input v-model="ruleForm.accountNumber"></el-input>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
import { getUserByToken, } from '../../request/api'
export default {
    name: 'peopleDefault',
    data() {
        return {
            ruleForm: {
                name: '',
                jobNumber: '',
                accountNumber: '',
            },
        }
    },
    created() {
        this.getUserByToken();
    },
    methods: {
        getUserByToken() {
            this.$smoke_post(getUserByToken,{}).then(res => {
                this.ruleForm.name = res.data.name;
                this.ruleForm.jobNumber = res.data.jobNumber;
                this.ruleForm.accountNumber = res.data.accountNumber;
            })
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    
</style>