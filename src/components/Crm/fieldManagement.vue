<template>
  <div class="main-area">
    <el-container class="index-main">
      <el-main>
        <div class="people-title">页面字段管理</div>
        <div class="search-area">
          <el-button type="primary" @click="addPageHandle">新增页面</el-button>
          <el-input placeholder="请输入搜索项"></el-input>
          <el-button  type="primary">搜索</el-button>
        </div>
        <el-table :data="pageManageList.list">
          <el-table-column v-for="(item, index) in pageManageListColumn" :prop="item.prop" :key="index" :label="item.label" :formatter="item.formatter">
          </el-table-column> 
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="getCurPageField(scope.$index, scope.row)"
                type="text">
                查看详情
              </el-button>
              <el-button
                @click.native.prevent="editPageHandle(scope.$index, scope.row)"
                type="text">
                修改
              </el-button>
            </template>
      </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-dialog :visible.sync="addEditPageVisible" :title="addEditPageType == 'add' ? '添加页面' : '编辑页面'" :close-on-click-modal="false">
      <el-form ref="addEditPageForm" :model="addEditPageForm" :rules="addEditPageRules">
        <el-form-item label="页面名称" prop="name">
          <el-input v-model="addEditPageForm.name" placeholder="请输入页面名称"></el-input>
        </el-form-item>
        <el-form-item label="页面描述" prop="describe">
          <el-input v-model="addEditPageForm.describe" placeholder="请输入页面描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addEditPageVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddEditPage">确 定</el-button>
      </span>
    </el-dialog>
    
    <el-dialog :visible.sync="addEditFieldVisible" :title="addEditFieldType == 'add' ? '添加字段' : '编辑字段'" :close-on-click-modal="false">
      <el-form ref="addEditFieldForm" :model="addEditFieldForm" :rules="addEditFieldRules">
        <el-form-item label="字段名称" prop="label">
          <el-input v-model="addEditFieldForm.label" placeholder="请输入字段名称"></el-input>
        </el-form-item>
        <el-form-item label="字段描述" prop="describe">
          <el-input v-model="addEditFieldForm.describe" placeholder="请输入字段描述"></el-input>
        </el-form-item>
        <el-form-item label="字段props" prop="props">
          <el-input v-model="addEditFieldForm.props" placeholder="请输入字段props"></el-input>
        </el-form-item>      
        <el-form-item label="sql字段key" prop="sqlKey">
          <el-input v-model="addEditFieldForm.sqlKey" placeholder="请输入sql字段key"></el-input>
        </el-form-item>         
        <el-form-item label="是否默认" prop="ifDef">
          <el-switch
            v-model="addEditFieldForm.ifDef"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>               
        <el-form-item label="是否开启" prop="ifOpen">
          <el-switch
            v-model="addEditFieldForm.ifOpen"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>        
        <el-form-item label="是否排序" prop="ifSort">
          <el-switch
            v-model="addEditFieldForm.ifSort"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addEditFieldVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddEditField">确 定</el-button>
      </span>
    </el-dialog>
    <el-drawer
      title="页面字段详情"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="50%"
      >
      <el-button type="primary" @click.native.prevent="addFieldHandle" class="ml20">添加字段</el-button>
      <el-table :data="pageFieldList" class="ml20">
        <el-table-column v-for="(item, index) in pageFieldListColumn" :prop="item.prop" :key="index" :label="item.label" :formatter="item.formatter">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="editFieldHandle(scope.$index, scope.row)"
                type="text">
                修改
              </el-button>
            </template>
      </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>
<script>
import {addPage, getPage, updatePage, addField, updateField, getField, getFieldDetail} from '@/request/api'
import {timestampToTime} from '@/assets/js/common'
export default {
  data(){
    return {
      getPageManageListForm: {},
      pageManageList: [],
      pageManageListColumn:[
        {
          'prop':'number', 'label': '页面编号'
        },        
        {
          'prop':'name', 'label': '页面名称'
        },        
        {
          'prop':'describe', 'label': '页面描述'
        },
        {
          'prop':'createTime', 'label': '创建时间', formatter: this.timeFormatter
        }
      ],
      addEditPageVisible: false,
      addEditPageType: 'add',
      addEditPageForm: {
        describe: '',
        name: ''
      },
      addEditPageRules:{
        name: [{
          required: true, message: '请输入页面名称', trigger: 'blur'
        }],
        describe: [{
          required: true, message: '请输入页面描述', trigger: 'blur'
        }]
      },
      addEditFieldVisible: false,
      addEditFieldType: '',
      addEditFieldForm: {
        label: '',
        describe: '',
        props: '',
        sqlKey: '',
        ifOpen: false,
        ifDef: false,
        ifSort: false,
        pageUuid: ''
      },
      addEditFieldRules: {
        label:[
           {
            required: true, message:'请输入字段名称', trigger: 'blur'
          }
        ],
        describe:[
           {
            required: true, message:'请输入字段描述', trigger: 'blur'
          }
        ],
        props:[
           {
            required: true, message:'请输入字段props', trigger: 'blur'
          }
        ],
      },
      drawerVisible: false,
      pageFieldList: [],
      pageFieldListColumn:[       
        {
          'prop':'number', 'label': '字段编号'
        },   
        {
          'prop':'label', 'label': '字段名称'
        },     
        {
          'prop':'props', 'label': '字段props'
        },
        {
          'prop':'ifDef', 'label': '是否默认', formatter: this.statusFormatter
        },
        {
          'prop':'ifOpen', 'label': '是否开启', formatter: this.statusFormatter
        },
        {
          'prop':'ifSort', 'label': '是否排序', formatter: this.statusFormatter
        }
      ],
    }
  },
  created(){
    this.getPageManageList()
  },
  methods: {
    timeFormatter(row, column, cellValue){
      return timestampToTime(Number(cellValue))
    },
    statusFormatter(row, column, cellValue){
      return cellValue ? '是' : '否'
    },
    getPageManageList(){
      this.$smoke_post(getPage, this.getPageManageListForm).then(res => {
        if(res.code == 200){
          this.pageManageList = res.data
        }
      })
    },
    editPageHandle(index, row){
      this.addEditPageVisible = true
      this.addEditPageType = 'edit'
      this.addEditPageForm.name = row.name
      this.addEditPageForm.describe = row.describe
      this.addEditPageForm.uuid = row.uuid
    },
    addPageHandle(){
      this.addEditPageVisible = true
      this.addEditPageType = 'add'
      this.resetAddEditPageForm()
    },
    resetAddEditPageForm(){
      this.addEditPageForm.describe = ''
      this.addEditPageForm.name = ''
    },
    submitAddEditPage(){
      this.$refs['addEditPageForm'].validate((valid) => {
        if (valid) {
          if(this.addEditPageType == 'add'){
            this.$smoke_post(addPage, this.addEditPageForm).then(res => {
              if(res.code == 200){
                this.$message({
                  type: 'success',
                  message: '添加页面成功'
                })
                this.addEditPageVisible = false
                this.getPageManageList()
              }else{
                this.$message({
                  type: 'error', 
                  message:res.msg
                })
              }
            })
          }else{
            this.$smoke_post(updatePage, this.addEditPageForm).then(res => {
              if(res.code == 200){
                this.$message({
                  type: 'success',
                  message: '页面更新成功'
                })
                this.addEditPageVisible = false
                this.getPageManageList()
              }else{
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    addFieldHandle(){
      this.addEditFieldType = "add"
      this.addEditFieldVisible = true
      this.resetAddEditFieldForm()
    },
    editFieldHandle(index, row){
      this.addEditFieldType = "edit"
      this.addEditFieldVisible = true
      this.$smoke_post(getFieldDetail, {uuid: row.uuid}).then(res => {
        if(res.code == 200){
          this.addEditFieldForm.label = res.data.label
          this.addEditFieldForm.describe = res.data.describe
          this.addEditFieldForm.props = res.data.props
          this.addEditFieldForm.sqlKey = res.data.sqlKey || ''
          this.addEditFieldForm.ifDef = res.data.ifDef ? true : false
          this.addEditFieldForm.ifOpen = res.data.ifOpen ? true : false
          this.addEditFieldForm.ifSort = res.data.ifSort ? true : false
          this.addEditFieldForm.uuid = row.uuid
        }
      })
    },
    submitAddEditField(){
      this.$refs['addEditFieldForm'].validate((valid) => {
        if (valid) {
          if(this.addEditFieldType == 'add'){
            this.$smoke_post(addField, this.addEditFieldForm).then(res => {
              if(res.code == 200){
                this.$message({
                  type: 'success',
                  message: '添加字段成功'
                })
                this.addEditFieldVisible = false
                this.reloadFieldList()
              }else{
                this.$message({
                  type: 'error', 
                  message:res.msg
                })
              }
            })
          }else{
            this.$smoke_post(updateField, this.addEditFieldForm).then(res => {
              if(res.code == 200){
                this.$message({
                  type: 'success',
                  message: '字段更新成功'
                })
                this.addEditFieldVisible = false
                this.reloadFieldList()
              }else{
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    getCurPageField(index, row){
      this.drawerVisible = true
      this.addEditFieldForm.pageUuid = row.uuid
      this.reloadFieldList()
    },
    reloadFieldList(){
      this.$smoke_post(getField, {pageUuid: this.addEditFieldForm.pageUuid}).then(res => {
        if(res.code == 200){
          this.pageFieldList = res.data
        }
      })
    },
    resetAddEditFieldForm(){
      this.addEditFieldForm.label =  ''
      this.addEditFieldForm.describe = ''
      this.addEditFieldForm.props = ''
      this.addEditFieldForm.sqlKey = ''
      this.addEditFieldForm.ifOpen = false
      this.addEditFieldForm.ifDef = false
      this.addEditFieldForm.ifSort = false
    }
  }
}
</script>
<style lang="less" scoped>
.main-area{
  width: calc( 100% - 3em);
  .index-main{
    height: calc( 100vh - 60px);
    display: flex;
    flex-direction: column;
    .people-title{
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 15px;
        background: #aaa;
        margin-bottom: .3rem;
        color: #fff;
    }
    .search-area{
      display: flex;
      flex-direction: row;
      *{
        margin-right: 10px;
      }
      .el-input{
        width: 220px;
      }
    }
    .el-table{
      margin-top: 20px;
    }
  }
  .ml20{
    margin-left: 20px;
  }
}
</style>