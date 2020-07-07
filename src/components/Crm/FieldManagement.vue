<template>
  <el-main class="index-main">
      <el-row class="search-area">

          <el-col :span="5">
              <el-input placeholder="请输入搜索项" size="small" class="screen-li"></el-input>
          </el-col>

          <el-col :span="5">
              <el-button type="primary" size="small">查 询</el-button>
          </el-col>

          <el-col :span="14">
              <el-button type="primary" size="small" @click="addPageHandle" style="float: right;">新增页面</el-button>
          </el-col>

      </el-row>
      <el-table :data="pageManageList.list">
        <el-table-column v-for="(item, index) in pageManageListColumn" :prop="item.prop" :key="index" :label="item.label" :formatter="item.formatter">
        </el-table-column> 
        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
          
            <svg-icon @click.native.prevent="getCurPageField(scope.$index, scope.row)" icon-title="查看详情" icon-class="detail" />
            
            <svg-icon @click.native.prevent="editPageHandle(scope.$index, scope.row)" icon-title="修改" icon-class="edit" />
          </template>
    </el-table-column>
      </el-table>
      <el-dialog width="30%" :visible.sync="addEditPageVisible" :title="addEditPageType == 'add' ? '添加页面' : '编辑页面'" :close-on-click-modal="false">
    <el-form ref="addEditPageForm" :model="addEditPageForm" :rules="addEditPageRules">
      <el-form-item label="页面名称" prop="name">
        <el-input v-model="addEditPageForm.name" size="small" placeholder="请输入页面名称"></el-input>
      </el-form-item>
      <el-form-item label="页面描述" prop="describe">
        <el-input v-model="addEditPageForm.describe" size="small" placeholder="请输入页面描述"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="submitAddEditPage">确 定</el-button>
      <el-button size="small" plain @click="addEditPageVisible = false">取 消</el-button>
    </span>
  </el-dialog>
  
  <el-dialog width="30%" :visible.sync="addEditFieldVisible" :title="addEditFieldType == 'add' ? '添加字段' : '编辑字段'" :close-on-click-modal="false">
    <el-form ref="addEditFieldForm" :model="addEditFieldForm" :rules="addEditFieldRules">
      <el-form-item label="字段名称" prop="label">
        <el-input v-model="addEditFieldForm.label" size="small" placeholder="请输入字段名称"></el-input>
      </el-form-item>
      <el-form-item label="字段描述" prop="describe">
        <el-input v-model="addEditFieldForm.describe" size="small" placeholder="请输入字段描述"></el-input>
      </el-form-item>
      <el-form-item label="字段props" prop="props">
        <el-input v-model="addEditFieldForm.props" size="small" placeholder="请输入字段props"></el-input>
      </el-form-item>      
      <el-form-item label="sql字段key" prop="sqlField">
        <el-input v-model="addEditFieldForm.sqlField" size="small" placeholder="请输入sql字段key"></el-input>
      </el-form-item>      
      <el-form-item label="表头字段宽度" prop="width">
        <el-input v-model="addEditFieldForm.width" size="small" placeholder="请输入表头字段宽度"></el-input>
      </el-form-item>  
      <el-form-item label="是否开启" prop="ifOpen">
        <el-switch
          v-model="addEditFieldForm.ifOpen"
          active-color="#13ce66"
          size="small"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>          
      <el-form-item label="是否固定" prop="ifFixed">
        <el-switch
          v-model="addEditFieldForm.ifFixed"
          active-color="#13ce66"
          size="small"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>   
      <el-form-item label="是否默认" prop="ifDef">
        <el-switch
          v-model="addEditFieldForm.ifDef"
          active-color="#13ce66"
          size="small"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="是否排序" prop="ifSort">
        <el-switch
          v-model="addEditFieldForm.ifSort"
          active-color="#13ce66"
          size="small"
          inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitAddEditField" size="small">确 定</el-button>
      <el-button @click="addEditFieldVisible = false" size="small" plain>取 消</el-button>
    </span>
  </el-dialog>
  <el-drawer
    title="页面字段详情"
    :visible.sync="drawerVisible"
    direction="rtl"
    size="50%"
    >
    <span class="bullets"></span>
    <el-button type="primary" @click.native.prevent="addFieldHandle" class="ml20" size="small">添加字段</el-button>
    <el-table :data="pageFieldList" class="ml20">
      <el-table-column v-for="(item, index) in pageFieldListColumn" :prop="item.prop" :key="index" :label="item.label" :formatter="item.formatter">
      </el-table-column>
      <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <svg-icon @click.native.prevent="editFieldHandle(scope.$index, scope.row)" icon-title="修改" icon-class="edit" />
          </template>
    </el-table-column>
    </el-table>
  </el-drawer>

</el-main>
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
        sqlField: '',
        ifOpen: false,
        ifDef: false,
        ifSort: false,
        ifFixed: false,
        pageUuid: '',
        width: 80
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
        width:[
           {
            required: true, message:'请输入表头字段宽度', trigger: 'blur'
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
          'prop':'ifOpen', 'label': '是否开启', formatter: this.statusFormatter
        },
        {
          'prop': 'ifFixed', 'label': '是否固定', formatter: this.statusFormatter
        },
        {
          'prop':'ifDef', 'label': '是否默认', formatter: this.statusFormatter
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
      this.resetAddEditPageForm()
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
      this.$nextTick(()=>{
        this.$refs['addEditPageForm'].resetFields()
      })
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
      this.resetAddEditFieldForm()
      this.$smoke_post(getFieldDetail, {uuid: row.uuid}).then(res => {
        if(res.code == 200){
          this.addEditFieldForm.label = res.data.label
          this.addEditFieldForm.describe = res.data.describe
          this.addEditFieldForm.props = res.data.props
          this.addEditFieldForm.sqlField = res.data.sqlField || ''
          this.addEditFieldForm.ifDef = res.data.ifDef ? true : false
          this.addEditFieldForm.ifOpen = res.data.ifOpen ? true : false
          this.addEditFieldForm.ifSort = res.data.ifSort ? true : false
          this.addEditFieldForm.uuid = row.uuid
          this.addEditFieldForm.width = row.width
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
      this.addEditFieldForm.sqlField = ''
      this.addEditFieldForm.ifOpen = false
      this.addEditFieldForm.ifDef = false
      this.addEditFieldForm.ifSort = false
      this.addEditFieldForm.width = 80
      this.$nextTick(()=>{
        this.$refs['addEditFieldForm'].resetFields()
      })
    }
  }
}
</script>
<style lang="less" scoped>
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
    .ml20{
      margin-left: 20px;
    }
  }
</style>