<template>
    <el-main class="index-main">

        <div class="people-title">推广渠道管理</div>

        <el-row class="people-screen">
            <el-col :span="5">
                <el-button type="primary" @click="addQudao">新增推广渠道</el-button>
            </el-col>
            <el-col :span="5">
                <el-input v-model="form.name" placeholder="请输入渠道名称" class="screen-li"></el-input>
            </el-col>
            <el-col :span="5">
                <el-button type="primary" @click="channelGetList">搜 索</el-button>
            </el-col>
        </el-row>

        <el-drawer
            :title="drawerTitle"
            :visible.sync="drawer"
            :direction="direction"
            :before-close="handleClose">
            <span class="bullets"></span>
            
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                
                <el-form-item label="渠道名称" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="渠道备注" prop="remarks">
                  <el-input v-model="ruleForm.remarks"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                </el-form-item>

            </el-form>

        </el-drawer>

        <el-table
            :data="list"
            ref="tree"
            style="width: 100%">
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              v-for="(item, index) in columnList"
              :key="index"
              >
            </el-table-column>
            <el-table-column prop="active" label="操作">
              <template slot-scope="scope">
                  <el-button @click="handleUpdataClick(scope.row)" type="text" >修改</el-button>
                  <el-popover
                    placement="top"
                    width="200"
                    trigger="click"
                    :ref="`popover-${scope.$index}`"
                    >
                    <p style="margin-bottom: .2rem;">确定要删除此菜单吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                      <el-button type="primary" size="mini" @click="handleDeleteClick(scope)">确定</el-button>
                    </div>
                    <el-button slot="reference" type="text"  style="margin-left: .2rem;">删除</el-button>
                  </el-popover>
              </template>
            </el-table-column>
        </el-table>

    </el-main>
</template>

<script>
import { channelGetList, channelAdd, channelDelete, channelUpdate, channeGet} from '../../request/api';
export default {
    name: 'proChannel',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 10,
                name: '',
            },
            list: [],
            columnList: [
                { 'prop': 'name', 'label': '渠道名称' },
                { 'prop': 'number', 'label': '渠道ID' },
                { 'prop': 'remarks', 'label': '渠道备注' },
                // { 'prop': 'uuid', 'label': '渠道的唯一标识' },
            ],
            drawer: false,
            drawerTitle: '新增渠道',
            direction: 'rtl',
            ruleForm: {
                name: '',
                remarks: '',
                uuid: '',
            },
            rules: {
                name: [
                  { required: true, message: '请输入渠道名称', trigger: 'blur' },
                ],
                remarks: [
                  { required: true, message: '请输入渠道备注', trigger: 'blur' }
                ],
            },
        }
    },
    created() {
        this.channelGetList();
    },
    methods: {
        channelGetList() {
            this.$smoke_post(channelGetList, this.form).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.list = res.data.list;
                }
            })
        },
        addQudao() {
            this.drawer = true;
            this.drawerTitle = '新增渠道';
            this.ruleForm.name = '';
            this.ruleForm.remarks = '';
            this.ruleForm.uuid = '';
        },
        channelAdd() {
            this.$smoke_post(channelAdd, this.ruleForm).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.drawer = false;
                    this.channelGetList();
                }
            })
        },
        handleClose(done) {
            done();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                  if(this.drawerTitle == '新增渠道'){
                    this.channelAdd();
                  }else{
                    this.channelUpdate();
                  }
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        },
        handleDeleteClick(scope) {
            // console.log(scope.row.uuid);
            this.$smoke_post(channelDelete, {
                uuid: scope.row.uuid
            }).then(res => {
                console.log(res);
                if(res.code == 200){
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'success',
                        message: '删除成功', 
                    });
                    this.channelGetList();
                }
            })
        },
        handleUpdataClick(row) {
            console.log(row);
            this.drawer = true;
            this.drawerTitle = '修改渠道';
            this.ruleForm.uuid = row.uuid;
            this.channeGet(row.uuid);
        },
        channeGet(id) {
            this.$smoke_post(channeGet, {
                uuid: id        
            }).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.ruleForm.name = res.data.name;
                    this.ruleForm.remarks = res.data.remarks;
                }
            })
        },
        channelUpdate() {
            this.$smoke_post(channelUpdate, this.ruleForm).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '修改成功', 
                    });
                    this.drawer = false;
                    this.channelGetList();
                }else{
                    this.$message({
                        type: 'error',
                        message: '修改失败', 
                    });
                }
            })
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
        height: calc( 100vh - 60px);
        .people-title{
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 15px;
            background: #fff;
            margin-bottom: .3rem;
            color: #666666;
        }
        .people-screen{
            margin-bottom: .3rem;
            .screen-li{
                width: 90%;
            }
        }
    }
    // .proChannel /deep/ .el-table .cell{
    //     text-align: center !important;
    // }
</style>