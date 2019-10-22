<template>
    <div class="main-area">
        <el-form ref="form" :model="formText" label-width="80px">

            <el-form-item label="姓名：">
                <el-input v-model="formText.name" disabled></el-input>
            </el-form-item>

            <el-form-item label="工号：">
                <el-input v-model="formText.jobNumber" disabled></el-input>
            </el-form-item>

            <el-form-item label="手机号：">
                <el-input v-model="formText.accountNumber" disabled></el-input>
            </el-form-item>

            <el-form-item label="在职状态：">
                <el-input v-model="formText.jobStatus" disabled></el-input>
            </el-form-item>

            <el-form-item label="组织部门：">
                <el-input v-model="formText.orgUuidList" disabled></el-input>
            </el-form-item>

            <el-form-item label="拥有角色：">
                <el-input v-model="formText.roleUuidList" disabled></el-input>
            </el-form-item>

            <el-form-item label="关联JQ用户：">
                <el-input v-model="formText.uin" disabled></el-input>
                <el-button type="primary" plain style="margin-top: .2rem" @click="searchJQ">查找并关联</el-button>
                <el-button type="primary" plain style="margin-top: .2rem" @click="addJQ">创建并关联</el-button>
            </el-form-item>

        </el-form>

        <el-button type="primary" @click="onSubmit" style="margin-left: 6.8rem; width: 2rem;">保存</el-button>
    </div>
</template>

<script>
import { getUserDetailed } from '../../request/api';
import { getTextByState, getTextByJs } from '../../assets/js/common'
export default {
    name: 'index',
    data() {
        return {
           uuid: this.$route.query.uuid,
           form: {},
           formText: {},
        }
    },
    created() {
        this.getUserDetailed();
    },
    methods: {
        getUserDetailed() {
            this.$smoke_post(getUserDetailed, {
                uuid: this.uuid
            }).then(res => {
                console.log(res);
                this.form = res.data;
                this.formText = res.data;
                this.formText.jobStatus = getTextByState(res.data.jobStatus);
                this.formText.orgUuidList = getTextByJs(res.data.orgUuidList);
                this.formText.roleUuidList = getTextByJs(res.data.roleUuidList);
            })
        },
        onSubmit() {
            console.log('222');
            alert('暂未开发');
        },
        searchJQ() {
            alert('正在开发中');
        },
        addJQ() {
            alert('正在开发中');
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .main-area{
        width: calc( 100vw - 3.65rem );
        .el-form{
            width: 6rem;
            margin: .4rem auto;
            border: 1px dashed #aaa;
            padding: .4rem;
        }
    }
</style>