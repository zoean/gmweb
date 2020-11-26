<template>
  <el-main class="index-main">
    <el-row class="people-screen" :gutter="10" id="searchArea">
      <el-col :span="3">
        <el-input size="small" v-model="searchForm.name" placeholder="请输入分校名称"></el-input>
      </el-col>
      <el-col :span="3">
        <el-select clearable size="small" v-model="searchForm.active" placeholder="请选择状态">
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
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="searchForm.currentPage"
    :page-sizes="[10, 20, 30, 50, 100]"
    :page-size="searchForm.pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="searchForm.total"
    style="text-align: right;">
  </el-pagination>
    <el-dialog class="beautiful-title" :title="addEditTitle" :visible.sync="addEditVisible" @close="addEditVisible = false" width="500px">
      <el-form :model="addEditForm" :rules="addEditRules" ref="addEditSchool">
        <el-form-item label="分校名称" prop="name" ref="name">
          <el-input v-model="addEditForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上级部门" prop="orgFirst">
          <el-cascader
          ref="elcascader"
          placeholder="请选择上级部门"
          :options="orgList"
          :props="{ 
            checkStrictly: true,
            label: 'name',
            value: 'uuid',
            children: 'includeSubsetList'
          }"
          clearable
          v-model="addEditForm.orgFirst"
          @change="selectOrg"></el-cascader>
        </el-form-item>
        <el-form-item v-if="addEditType == 2" label="分校简称" prop="schoolName">
          <el-input disabled v-model="addEditForm.schoolName" placeholder="英文简称"></el-input>
        </el-form-item>
        <el-form-item label="分校官网" prop="domainName" ref="domainName">
          <el-input v-model="addEditForm.domainName"></el-input>
        </el-form-item>
        <el-form-item label="短信签名" prop="smsSignature">
          <el-input v-model="addEditForm.smsSignature"></el-input>
        </el-form-item>
        <el-form-item label="公司主体" prop="companyName" ref="companyName">
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
            :before-upload="function (res,file) {return verifyUpload(res, 500, 500)}"
            :show-file-list="false">
            <img v-if="addEditForm.logo" :src="addEditForm.logo" class="avatar" width="176">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              <p>图片格式：png，100k以内，尺寸500*500</p>
              <p class="del-img" v-if="addEditForm.logo">
                <svg-icon
                  @click="delImg(1)"
                  icon-title="删除logo"
                  icon-class="del"
                />
              </p>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上图下文LOGO">
          <el-upload
            class="avatar-uploader"
            :action="uploadFile"
            :data="uploadData"
            :on-success="function (res,file) {return uploadSuccess(res, file, 2)}"
            :before-upload="function (res,file) {return verifyUpload(res, 312, 312)}"
            :show-file-list="false">
            <img v-if="addEditForm.logoNameUp" :src="addEditForm.logoNameUp" class="avatar" width="176">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              <p>图片形式：上LOGO图，下分校名称<br />图片格式：png，图片100K以内，尺寸312*312</p>
              <p class="del-img" v-if="addEditForm.logoNameUp">
                <svg-icon
                  @click="delImg(2)"
                  icon-title="删除logo"
                  icon-class="del"
                />
              </p>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="APP主页LOGO">
          <el-upload
            class="avatar-uploader"
            :action="uploadFile"
            :data="uploadData"
            :on-success="function (res,file) {return uploadSuccess(res, file, 3)}"
            :before-upload="function (res,file) {return verifyUpload(res, 390, 110)}"
            :show-file-list="false">
            <img v-if="addEditForm.logoNameDown" :src="addEditForm.logoNameDown" class="avatar" width="176">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              <p>图片形式：左LOGO图，右分校名称，白矩形底<br />图片格式：png，图片100K以内，尺寸390*110</p>
              <p class="del-img" v-if="addEditForm.logoNameDown">
                <svg-icon
                  @click="delImg(3)"
                  icon-title="删除logo"
                  icon-class="del"
                />
              </p>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="APP直播LOGO">
          <el-upload
            class="avatar-uploader"
            :action="uploadFile"
            :data="uploadData"
            :on-success="function (res,file) {return uploadSuccess(res, file, 4)}"
            :before-upload="function (res,file) {return verifyUpload(res, 400, 160)}"
            :show-file-list="false">
            <img v-if="addEditForm.logoVideo" :src="addEditForm.logoVideo" class="avatar" width="176">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              <p>图片形式：左LOGO图，右分校名称，乌云虚底<br />图片格式：png，图片100K以内，尺寸400*160</p>
              <p class="del-img" v-if="addEditForm.logoVideo">
                <svg-icon
                  @click="delImg(4)"
                  icon-title="删除logo"
                  icon-class="del"
                />
              </p>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="左图右文LOGO">
          <el-upload
            class="avatar-uploader"
            :action="uploadFile"
            :data="uploadData"
            :on-success="function (res,file) {return uploadSuccess(res, file, 5)}"
            :before-upload="function (res,file) {return verifyUpload(res, 330, 90)}"
            :show-file-list="false">
            <img v-if="addEditForm.logoNameRight" :src="addEditForm.logoNameRight" class="avatar" width="176">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              <p>图片形式：左LOGO图，右分校名称，黑矩形底<br />图片格式：png，图片100K以内，330*90</p>
              <p class="del-img" v-if="addEditForm.logoNameRight">
                <svg-icon
                  @click="delImg(5)"
                  icon-title="删除logo"
                  icon-class="del"
                />
              </p>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="公共公海" prop="commStatus">
          <el-radio-group v-model="addEditForm.commStatus">
            <el-radio :label="1">使用</el-radio>
            <el-radio :label="0">不使用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据分配" prop="clueAllocate">
          <el-radio-group v-model="addEditForm.clueAllocate">
            <el-radio :label="1">钉钉打卡</el-radio>
            <el-radio :label="0">随时分配</el-radio>
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
import {addBranch, selectAllBranch, uploadFile, selectBranchByUuid, updateBranch, turnOnBranch, getOrgSubsetByUuid} from '@/request/api'
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
        orgFirst: '',
        schoolName: '',
        domainName: '',
        smsSignature: '', 
        companyName: '', 
        linkTelephone: '', 
        agreementUrl: '',
        logoNameUp: '',
        logoNameDown: '',
        logoNameRight: '',
        logoVideo: '',
        logoNameDown: '',
        logoNameRight: '',
        commStatus: 0, 
        clueAllocate: 1,
      },
      addEditRules: {
        name: [
          {
            required: true, message: '请输入分校名称', trigger: 'blur'
          }
        ],
        domainName: [
          {required: true, message: '请输入分校官网', trigger: 'blur'}
        ],
        companyName:[
        {required: true, message: '请输入公司主体', trigger: 'blur'}
        ]
      },
      orgList: [],
      hitOrg: [],
      showDelImg: false
    }
  },
  created(){
    this.schoolList()
    this.getOrgList()
  },
  methods: {  
    delImg(id){
      if(id == 1){
        this.addEditForm.logo = ''
      }else if(id == 2){
        this.addEditForm.logoNameUp = ''
      }else if(id == 3){
        this.addEditForm.logoNameDown = ''
      }else if(id == 4){
        this.addEditForm.logoVideo = ''
      }else if(id == 5){
        this.addEditForm.logoNameRight = ''
      }
    }, 
    getOrgList(){
      this.$smoke_post(getOrgSubsetByUuid, {uuid: ''}).then(res => {
        if(res.code == 200 && res.data){
          this.orgList = res.data
        }
      })
    },   
    selectOrg(val){
      if(val){
        this.addEditForm.orgFirst = val[val.length - 1]
        this.$refs.elcascader.dropDownVisible = false;
      }
    },
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
        orgFirst: '',
        logo: '', 
        schoolName: '',
        domainName: '',
        smsSignature: '', 
        companyName: '', 
        linkTelephone: '', 
        agreementUrl: '',
        logoNameUp: '',
        logoNameDown: '',
        logoNameRight: '',
        logoVideo: '',
        logoNameDown: '',
        logoNameRight: '',
        commStatus: 0, 
        clueAllocate: 1,
      }
      this.$nextTick(()=>{
        this.$refs.addEditSchool.resetFields();
        this.$refs.elcascader.$refs.panel.clearCheckedNodes()
        this.$refs.elcascader.$refs.panel.activePath = []
        this.$refs['addEditSchool'].$el.scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        })
      })
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
        }else{
          this.list = []
        }
      })
    },  
    verifyUpload(file, width, height){
      const alowType = file.type === 'image/png';
      const isLt100k = file.size / 1000 / 100 < 1;
      // const isSize = new Promise(function(resolve, reject) {
      //   let width = width,
      //   height = height,
      //   _URL = window.URL || window.webkitURL,
      //   img = new Image()
      //   img.onload = () => {
      //     let valid = img.width <= width && img.height <= height
      //     valid ? resolve() : reject()
      //   }
      //   img.src = _URL.createObjectURL(file)
      // }).then(() => {
      //   return file
      // }, () => {
      //   this.$message.error('图片尺寸需小于500*500')
      //   // return promise.reject()
      // })
      if (!alowType || !isLt100k) {
        this.$message.error('请上传小于100kb的png格式图片');
      }
      return alowType && isLt100k;
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
      this.addEditType = 2
      this.addEditVisible = true
      this.addEditTitle = '编辑分校'
      this.resetForm()
      this.$smoke_post(selectBranchByUuid, {id: row.id}).then(res => {
        if(res.code == 200 && res.data){
          let params = res.data
          let {name, orgFirst, schoolName, domainName, smsSignature, companyName, linkTelephone, agreementUrl, logo, logoNameUp, logoNameDown, logoVideo, logoNameRight, commStatus, clueAllocate, id} = params
          // this.hitOrg = orgFirst
          this.getCascaderObj(orgFirst, this.orgList)
          
          this.addEditForm = {
            name,
            logo: `${process.env.VUE_APP_FILE_JHWX}/${logo}`,
            orgFirst,
            schoolName,
            domainName,
            smsSignature, 
            companyName, 
            linkTelephone, 
            agreementUrl,
            logoNameUp: `${process.env.VUE_APP_FILE_JHWX}/${logoNameUp}`,
            logoVideo: `${process.env.VUE_APP_FILE_JHWX}/${logoVideo}`,
            logoNameDown: `${process.env.VUE_APP_FILE_JHWX}/${logoNameDown}`,
            logoNameRight: `${process.env.VUE_APP_FILE_JHWX}/${logoNameRight}`,
            commStatus, 
            clueAllocate,
            id
          }
        }
      })
    },
    getCascaderObj(key, list){
      this.hitOrg = []
      list.map((item, index, arr)=>{
        if(item.uuid == key){
          this.hitOrg.push(item.uuid)
          if(list[index].uuid){
            this.hitOrg.push(list.uuid)
          }
          return true
        }else{
          if(item.includeSubsetList && item.includeSubsetList.length > 0){
            this.getCascaderObj(key, item.includeSubsetList)
            return true
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
      this.$refs['addEditSchool'].validate((valid, object) => {
        if(valid){
          if(this.addEditType == 1){
            this.$smoke_post(addBranch, this.addEditForm).then(res => {
              if(res.code == 200 && res.data){
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.addEditVisible = false
                this.schoolList()
              }else{
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }else{
            this.$smoke_post(updateBranch, this.addEditForm).then(res => {
              if(res.code == 200 && res.data){
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
                this.addEditVisible = false
                this.schoolList()
              }else{
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }
        }else{
          for(let i in object){
            let dom = this.$refs[i]
            dom.$el.scrollIntoView({
              block: 'start',
              behavior: 'smooth'
            })
            return false
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .grey{
    color: #909399 !important;
  }
  /deep/.el-dialog{
    .el-dialog__body{
      padding: 0 20px;
    }
  }
  
  .del-img{
    .svg-icon{
      width: 20px;
      height: 20px;
    }
  }
  .avatar-uploader{
    display: flex;
    flex-direction: row;
    overflow: hidden;
    /deep/.el-upload {
      width: 178px;
      height:178px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      margin-right: 10px;
    }
    /deep/.el-upload__tip{
      color: #E65454;
      line-height: 24px;
      margin-top: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0 0 20px;
      .del-img{
        display: flex;
        flex-direction: row;
        justify-content: start;
        color: #999;
      }
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      margin-top: 75px;
      text-align: center;
    }
  } 
  .el-cascader{
    width: 332px;
  }
</style>