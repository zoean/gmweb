<template>
    <el-main class="index-main">
        <el-row class="people-screen">

            <el-col :span="3" v-if="addEnums">
                <el-button type="primary" @click="addEnumClick">新增枚举</el-button>
            </el-col>

            <el-col :span="5">
                <el-input v-model="form.name" placeholder="请输入名称" class="screen-li"></el-input>
            </el-col>

            <el-col :span="5">
                <el-button type="primary" @click="getEnumList">搜 索</el-button>
            </el-col>

        </el-row>

        <el-table
            :data="list"
            ref="tree"
            v-loading="fullscreenLoading"
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
                  <el-button @click="customerDetails(scope.row)" type="text" >查看详情</el-button>
                  <el-button v-if="editEnums" @click="editEnumClick(scope.row)" type="text" >修改</el-button>
              </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'
            :page-size='form.pageSize'
            :page-sizes="[10, 20, 30]"
            :hide-on-single-page="totalFlag"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        >
        </el-pagination>

        <el-dialog :title="enumTitle" :visible.sync="enumFlag">
          <el-form :model="enumForm">

            <el-form-item label="枚举名称" :label-width="formLabelWidth">
                <el-input v-model="enumForm.name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="枚举描述" :label-width="formLabelWidth">
                <el-input v-model="enumForm.describe" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="枚举开启状态" :label-width="formLabelWidth">
                <el-switch
                    :active-value='1'
                    :inactive-value='0'
                    v-model="enumForm.enable"
                    active-color="#13ce66"
                    inactive-color="#cccccc">
                </el-switch>
            </el-form-item>
            
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="enumFlag = false">取 消</el-button>
            <el-button type="primary" @click="enumFormOk">确 定</el-button>
          </div>
        </el-dialog>

        <el-drawer
            :title="drawerTitle"
            :visible.sync="drawerFlag"
            :direction="direction"
            size="50%"
            :before-close="handleClose">
            <span class="bullets"></span>

            <el-row class="people-screen">

                <el-col :span="3" style="margin-left: 22px;" v-if="addEnumsDetails">
                    <el-button type="primary" @click="addEnumItemClick">新增枚举项</el-button>
                </el-col>

            </el-row>

            <el-dialog :title="enumItemTitle" :visible.sync="enumItemFlag" :append-to-body='true'>
              <el-form :model="enumItemForm">

                <el-form-item label="枚举项名称" :label-width="formLabelWidth">
                    <el-input v-model="enumItemForm.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="枚举项开启状态" :label-width="formLabelWidth">
                    <el-switch
                        :active-value='1'
                        :inactive-value='0'
                        v-model="enumItemForm.enable"
                        active-color="#13ce66"
                        inactive-color="#cccccc">
                    </el-switch>
                </el-form-item>

              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="enumItemFlag = false">取 消</el-button>
                <el-button type="primary" @click="enumItemFormOk">确 定</el-button>
              </div>
            </el-dialog>

            <el-table
                :data="enumItemList"
                border
                ref="enumItemTree"
                v-loading="fullscreenLoadingDetails"
                style="width: 94%; margin: 0 auto; margin-top: 20px;">
                <el-table-column
                  :prop="item.prop"
                  :label="item.label"
                  v-for="(item, index) in columnItemList"
                  :key="index"
                  >
                </el-table-column>
                <el-table-column prop="active" label="操作" v-if="editEnumsDetails">
                  <template slot-scope="scope">
                      <el-button @click="editEnumItemClick(scope.row)" type="text" >修改</el-button>
                  </template>
                </el-table-column>
            </el-table>

        </el-drawer>

    </el-main>
</template>

<script>
import { addEnum, addEnumItem, enumItemSort, getEnum, getEnumItem, getEnumList, updateEnum, updateEnumItem, enumByEnumNums } from '../../request/api';
import { backEnable } from '../../assets/js/common';
export default {
    name: 'enum',
    data() {
        return {
            form: {
                currentPage: 1,
                pageSize: 10,
                name: '',
            },
            list: [],
            total: null,
            columnList: [
                { 'prop': 'number', 'label': '枚举编号' },
                { 'prop': 'name', 'label': '枚举名称' },
                { 'prop': 'describe', 'label': '枚举描述' },
                { 'prop': 'enableText', 'label': '枚举开启状态' },
            ],
            totalFlag: false, //当只有一页时隐藏分页
            enumFlag: false,
            formLabelWidth: '120px',
            enumForm: {
                name: '',
                describe: '',
                enable: 0,
                uuid: '',
            },
            enumTitle: '',
            drawerTitle: '枚举详情',
            drawerFlag: false,
            direction: 'rtl',
            enumItemList: [], //枚举项列表
            columnItemList: [
                { 'prop': 'sort', 'label': '枚举项序号' },
                { 'prop': 'name', 'label': '枚举项名称' },
                { 'prop': 'number', 'label': '枚举项编号' },
                { 'prop': 'enableSonText', 'label': '枚举项开启状态' },
            ],
            enumItemForm: {
                name: '',
                enable: 0,
                enumUuid: '', //枚举唯一标识
                enumItemUuid: '', //枚举项唯一标识
            },
            enumItemTitle: '',
            enumItemFlag: false,
            addEnums: null,
            addEnumsDetails: null,
            editEnums: null,
            editEnumsDetails: null,
            fullscreenLoading: false,
            fullscreenLoadingDetails: false,
        }
    },
    created() {
        this.getEnumList();
        let buttonMap = JSON.parse(localStorage.getItem("buttonMap"));
        this.addEnums = buttonMap.addEnums;
        this.addEnumsDetails = buttonMap.addEnumsDetails;
        this.editEnums = buttonMap.editEnums;
        this.editEnumsDetails = buttonMap.editEnumsDetails;
    },
    methods: {
        handleClose(done) {
            done();
        },
        addEnumClick() {
            this.enumFlag = true;
            this.enumForm.name = '';
            this.enumForm.describe = '';
            this.enumForm.enable = 0;
            this.enumForm.uuid = '';
            this.enumTitle = '新增枚举';
        },
        enumFormOk() {
            if(this.enumForm.name == "" || this.enumForm.describe == ''){
               this.$message({
                    type: 'error',
                    message: '亲，枚举名称或者枚举描述不能为空', 
                });
            }else if(this.enumTitle == '新增枚举'){
                this.addEnum();
            }else{
                this.updateEnum();
            }
        },
        addEnum() {
            console.log(this.enumForm);
            this.$smoke_post(addEnum, this.enumForm).then(res => {
                if(res.code == 200) {
                    this.enumFlag = false;
                    this.$message({
                        type: 'success',
                        message: '添加枚举成功', 
                    });
                    this.getEnumList();
                }else{
                    this.enumFlag = true;
                    this.$message({
                        type: 'error',
                        message: res.msg, 
                    });
                }
            })
        },
        customerDetails( row ) {
            console.log(row);
            this.drawerFlag = true;
            this.enumItemForm.enumUuid = row.uuid;
            this.getEnumItem();
        },
        editEnumClick(row) {
            console.log(row);
            this.enumFlag = true;
            this.enumTitle = '修改枚举';
            this.enumForm.name = row.name;
            this.enumForm.describe = row.describe;
            this.enumForm.enable = row.enable;
            this.enumForm.uuid = row.uuid;
        },
        updateEnum() {
            this.$smoke_post(updateEnum, this.enumForm).then(res => {
                if(res.code == 200) {
                    this.enumFlag = false;
                    this.$message({
                        type: 'success',
                        message: '修改枚举成功', 
                    });
                    this.getEnumList();
                }else{
                    this.enumFlag = true;
                    this.$message({
                        type: 'error',
                        message: res.msg, 
                    });
                }
            })
        },
        getEnumList() {
            this.fullscreenLoading = true;
            this.$smoke_post(getEnumList, this.form).then(res => {
                if(res.code == 200) {

                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        res.data.list.map(sll => {
                            sll.enableText = backEnable(sll.enable);
                        })
                        this.list = res.data.list;
                        this.total = res.data.total;
                        console.log(this.list);
                    }, 300);

                }else{

                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }, 300)

                }
            })
        },
        editEnumItemClick(row) {
            console.log(row);
            this.enumItemFlag = true;
            this.enumItemForm.name = row.name;
            this.enumItemForm.enable = row.enable;
            this.enumItemForm.enumItemUuid = row.uuid;
            this.enumItemTitle = '修改枚举项';
        },
        enumItemFormOk() {
            if(this.enumItemForm.name == ""){
               this.$message({
                    type: 'error',
                    message: '亲，枚举项名称不能为空', 
                });
            }else if(this.enumItemTitle == '新增枚举项'){
                this.addEnumItem();
            }else{
                this.updateEnumItem();
            }
        },
        addEnumItemClick() {
            this.enumItemFlag = true;
            this.enumItemForm.name = '';
            this.enumItemForm.enable = 0;
            this.enumItemTitle = '新增枚举项';
        },
        addEnumItem() {
            this.$smoke_post(addEnumItem, this.enumItemForm).then(res => {
                if(res.code == 200) {
                    this.enumItemFlag = false;
                    this.$message({
                        type: 'success',
                        message: '添加枚举项成功', 
                    });
                    this.getEnumItem();
                }else{
                    this.enumItemFlag = true;
                    this.$message({
                        type: 'error',
                        message: res.msg, 
                    });
                }
            })
        },
        updateEnumItem() {
            this.$smoke_post(updateEnumItem, this.enumItemForm).then(res => {
                if(res.code == 200) {
                    this.enumItemFlag = false;
                    this.$message({
                        type: 'success',
                        message: '修改枚举项成功', 
                    });
                    this.getEnumItem();
                }else{
                    this.enumItemFlag = true;
                    this.$message({
                        type: 'error',
                        message: res.msg, 
                    });
                }
            })
        },
        getEnumItem() {
            this.fullscreenLoadingDetails = true;
            this.$smoke_post(getEnumItem, {
                uuid: this.enumItemForm.enumUuid,
            }).then(res => {
                if(res.code == 200) {

                    setTimeout(() => {
                        this.fullscreenLoadingDetails = false;
                        res.data.map(sll => {
                            sll.enableSonText = backEnable(sll.enable);
                        })
                        this.enumItemList = res.data;
                    }, 300);

                }else{
                    setTimeout(() => {
                        this.fullscreenLoadingDetails = false;
                        this.$message({
                            type: 'error',
                            message: res.msg
                        })
                    }, 300)
                }
            })
        },
        handleCurrentChange(index) {
            console.log(index);
            this.form.currentPage = index;
            this.getEnumList();
        },
        handleSizeChange(index) {
            console.log(index);
            this.form.pageSize = index;
            this.getEnumList();
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .index-main{
        height: calc( 100vh - 140px);
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
            margin-bottom: 16px;
            .screen-li{
                width: 90%;
            }
        }
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
/* //element-ui table的去除右侧滚动条的样式 */
::-webkit-scrollbar {
    width: 8px;
    height: 1px;
}
    /* // 滚动条的滑块 */
::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 0px;
    border-radius: 8px;
}
</style>