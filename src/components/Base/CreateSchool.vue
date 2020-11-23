<template>
  <el-main class="index-main">
    <el-row class="people-screen" :gutter="10" id="searchArea">
      <el-col :span="3">
        <el-input size="small" v-model="searchForm.name" placeholder="请输入分校名称"></el-input>
      </el-col>
      <el-col :span="3">
        <el-select size="small" v-model="searchForm.active" placeholder="请选择状态">
          <el-option value="true" label="开启"></el-option>
          <el-option value="false" label="关闭"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button size="small" type="primary" @click="schoolList">查询</el-button>
      </el-col>
      <el-col :span="15">
        <el-button class="smoke-fr" size="small" type="primary" @click="addSchool">创建分校</el-button>
      </el-col>
    </el-row>
    <el-table :data="list"
    :height="tableHeight"
    class="mt10"
    v-loading="loading">
      <el-table-column v-for="item in columnList" :label="item.label" :prop="item.prop" :formatter="item.formatter"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <svg-icon @click.native.prevent="editSchool(scope.row)" icon-title="编辑" icon-class="edit" />
          <el-popconfirm
              confirmButtonText='确定'
              cancelButtonText='取消'
              icon="el-icon-info"
              iconColor="red"
              placement="top"
              :title="!scope.row.active ? '是否确定启用该分校' : '是否确定停用该分校'"
              @onConfirm="onOffSchool(scope.row)"
          >
          <svg-icon :class="!scope.row.active ? '' : 'grey'" slot="reference" :icon-title="!scope.row.active ? '启用' : '停用'" icon-class="lock" />
          </el-popconfirm>
          <!-- <el-popconfirm
            title="确认删除该分校吗？"
          > 
            <svg-icon @click.native.prevent="delSchool(scope.row)" slot="reference" icon-title="删除" icon-class="del" />
          </el-popconfirm> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="searchForm.currentPage"
    :page-sizes="[10, 20, 30, 50, 100]"
    :page-size="searchForm.pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="searchForm.total"
    style="text-align: right;">
  </el-pagination>
    <el-dialog :title="addEditTitle" :visible.sync="addEditVisible" width="500px">
      <el-form :model="addEditForm" :rules="addEditRules" ref="addEditSchool">
        <el-form-item label="分校名称" prop="name">
          <el-input v-model="addEditForm.name"></el-input>
        </el-form-item>
        <el-form-item v-if="addEditType == 2" label="分校简称" prop="schoolName">
          <el-input v-model="addEditForm.schoolName" placeholder="英文简称"></el-input>
        </el-form-item>
        <el-form-item label="分校官网" prop="domainName">
          <el-input v-model="addEditForm.domainName"></el-input>
        </el-form-item>
        <el-form-item label="短信签名" prop="smsSignature">
          <el-input v-model="addEditForm.smsSignature"></el-input>
        </el-form-item>
        <el-form-item label="公司主体" prop="companyName">
          <el-input v-model="addEditForm.companyName" placeholder="请输入公司全称"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="linkTelephone">
          <el-input v-model="addEditForm.linkTelephone"></el-input>
        </el-form-item>
        <el-form-item label="苹果充值协议" prop="agreementUrl">
          <el-input v-model="addEditForm.agreementUrl"></el-input>
        </el-form-item>
        <el-form-item label="独立LOGO">
          <el-upload
            class="avatar-uploader"
            :action="uploadFile"
            :data="uploadData"
            :on-success="function (res,file) {return uploadSuccess(res, file, 1)}"
            :before-upload="verifyUpload"
            :show-file-list="false">
            <img v-if="addEditForm.logo" :src="addEditForm.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上图下文LOGO">
          <el-upload
            class="avatar-uploader"
            :action="uploadFile"
            :data="uploadData"
            :on-success="function (res,file) {return uploadSuccess(res, file, 2)}"
            :before-upload="verifyUpload"
            :show-file-list="false">
            <img v-if="addEditForm.logoNameUp" :src="addEditForm.logoNameUp" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="APP主页LOGO">
          <el-upload
            class="avatar-uploader"
            :action="uploadFile"
            :data="uploadData"
            :on-success="function (res,file) {return uploadSuccess(res, file, 3)}"
            :before-upload="verifyUpload"
            :show-file-list="false">
            <img v-if="addEditForm.logoNameDown" :src="addEditForm.logoNameDown" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="APP直播LOGO">
          <el-upload
            class="avatar-uploader"
            :action="uploadFile"
            :data="uploadData"
            :on-success="function (res,file) {return uploadSuccess(res, file, 4)}"
            :before-upload="verifyUpload"
            :show-file-list="false">
            <img v-if="addEditForm.logoVideo" :src="addEditForm.logoVideo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="左图右文LOGO">
          <el-upload
            class="avatar-uploader"
            :action="uploadFile"
            :data="uploadData"
            :on-success="function (res,file) {return uploadSuccess(res, file, 5)}"
            :before-upload="verifyUpload"
            :show-file-list="false">
            <img v-if="addEditForm.logoNameRight" :src="addEditForm.logoNameRight" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="公共公海" prop="commStatus">
          <el-radio-group v-model="addEditForm.commStatus">
            <el-radio label="使用"></el-radio>
            <el-radio label="不使用"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据分配" prop="clueAllocate">
          <el-radio-group v-model="addEditForm.clueAllocate">
            <el-radio label="钉钉打卡"></el-radio>
            <el-radio label="随时分配"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitSchool">立即创建</el-button>
          <el-button @click="addEditVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-main>
</template>
<script>
import {addBranch, selectAllBranch, uploadFile, selectBranchByUuid, updateBranch, turnOnBranch} from '@/request/api'
export default{
  name: 'createSchool',
  props: ['tableHeight'],
  data(){
    return {  
      loading: false,    
      batchFileList: [],            
      uploadFile: uploadFile,                    
      uploadData: { fileType: 'img'},
      searchForm:{
        name: '',
        active: '',        
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      onOffForm: {
        id: '',
        active: ''
      },
      list: [],
      columnList: [
        { 'prop': 'name', 'label': '分校名称'},
        { 'prop': 'schoolName', 'label': '分校简称'},
        { 'prop': 'linkTelephone', 'label': '联系电话', formatter: this.formatterFiled},
        { 'prop': 'commStatus', 'label': '公共公海', formatter: this.formatterFiled},
        { 'prop': 'clueAllocate', 'label': '数据分配', formatter: this.formatterFiled},
        { 'prop': 'active', 'label': '状态', formatter: this.formatterFiled}
      ],
      addEditType: 1,
      addEditVisible: false,
      addEditTitle: '添加分校',
      addEditForm: {
        name: '',
        logo: '',
        logoNameUp: '',
        logoNameDown: '',
        logoNameRight:'',
        logoVideo: '',
        logoNameDown: '',
        logoNameRight: '',
        id: ''
      },
      addEditRules: {
        name: [
          {
            require: true, trigger: 'blur'
          }
        ]
      }
    }
  },
  created(){
    this.schoolList()
  },
  methods: {      
    handleSizeChange(size){
      this.searchForm.pageSize = size
      this.schoolList()
    },
    handleCurrentChange(curPage){
      this.searchForm.currentPage = curPage
      this.schoolList()
    },
    resetForm(){
      this.addEditForm = {
        name: '',
        logo: '',
        logoNameUp: '',
        logoNameDown: '',
        logoNameRight:'',
        logoVideo: '',
        logoNameDown: '',
        logoNameRight: '',
        id: ''
      }
    },
    formatterFiled(row, column, cellValue){
      if(column.property == 'commStatus'){
        return cellValue ? '使用' : '不使用'
      }else if(column.property == 'clueAllocate'){
        return cellValue ? '钉钉打卡' : '随时分配'
      }else if(column.property == 'active'){
        return cellValue ? '已启用' : '未启用'
      }else if(column.property == 'linkTelephone'){
        return cellValue ? cellValue : '--'
      }        
    },
    schoolList(){
      this.loading = true
      this.$smoke_post(selectAllBranch, this.searchForm).then(res => {
        this.loading = false
        if(res.code == 200 && res.data){
          this.list = res.data.list         
          this.searchForm.total = res.data.total || 0  
          this.$emit('setTableHeight', res.data.total, 1)
        }
      })
    },  
    verifyUpload(file){
      const isJPG = file.type === 'image/jpeg';
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error('请上传jpg格式的图片');
      }
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB');
      }
      return isJPG && isLt1M;
    },
    uploadSuccess(res, file, id){
      if(res.code == 0){
        let imgUrl = `${process.env.VUE_APP_FILE_JHWX}/${res.data.fileUrl}`
        if(id == 1){
          this.addEditForm.logo = imgUrl
        }else if(id == 2){
          this.addEditForm.logoNameUp = imgUrl
        }else if(id == 3){
          this.addEditForm.logoNameDown = imgUrl
        }else if(id == 4){
          this.addEditForm.logoVideo = imgUrl
        }else if(id == 5){
          this.addEditForm.logoNameRight = imgUrl
        }
      }
    },
    addSchool(){    
      this.addEditType = 1 
      this.addEditVisible = true
      this.addEditTitle = '添加分校'
      this.resetForm()
    },
    editSchool(row){
      console.log(row)
      this.addEditType = 2
      this.addEditVisible = true
      this.addEditTitle = '编辑分校'
      this.resetForm()
      this.$smoke_post(selectBranchByUuid, {id: row.id}).then(res => {
        if(res.code == 200 && res.data){
          let params = res.data[0]
          let {name,schoolName, domainName, smsSignature, companyName, linkTelephone, agreementUrl, logo, logoNameUp, logoNameDown, logoVideo, logoNameRight, commStatus, clueAllocate, id} = params
          this.addEditForm = {
            name,
            logo,
            logoNameUp,
            logoNameDown,
            logoNameRight,
            logoVideo,
            logoNameDown,
            logoNameRight,
            id
          }
        }
      })
    },
    onOffSchool(row){
      this.onOffForm = {
        id: row.id,
        active: !row.active
      }
      this.$smoke_post(turnOnBranch, this.onOffForm).then(res => {
        if(res.code == 200){
          this.$message({
            type: 'success',
            message: row.active ? '停用成功' : '启用成功'
          })
          this.schoolList()
        }
      })
    },
    // delSchool(){

    // },
    submitSchool(){
      this.$refs['addEditSchool'].validate(valid => {
        if(valid){
          this.$smoke_post(addBranch, this.addEditForm).then(res => {
            if(res.code == 200 && res.data){
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.addEditVisible = false
            }
          })
        }
      })
    }
  }
}
</script>
<style>
  .grey{
    color: #909399 !important;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .el-icon-plus:before{
    line-height: 180px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>