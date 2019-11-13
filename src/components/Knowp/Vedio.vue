<template>
    <div style="">
        <el-container class="index-main">

            <el-main>

                <div class="people-title">视频资源管理</div> 

                <el-button type="primary" @click="addVedioClick" style="margin-bottom: .2rem;">添加视频资源</el-button>
         
                <el-row style="margin-bottom: 20px;">

                    <el-col :span="4">
                        <el-select v-model="listForm.type" @change="vedioTypeChange1" clearable placeholder="请选择类型" style="width: 90%">
                            <el-option
                              v-for="item in vedioTypeArr"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>

                    <el-col :span="4">
                        <el-select v-model="listForm.examDirectionUuid" @change="vedioExamChange" clearable placeholder="请选择考试项目" style="width: 90%">
                            <el-option
                              v-for="item in vedioOption"
                              :key="item.uuid"
                              :label="item.name"
                              :value="item.uuid">
                            </el-option>
                        </el-select>
                    </el-col>

                    <el-col :span="4">
                        <el-select v-model="listForm.subjectUuidList" @focus="vedioKemuFocus1" @change="vedioSubjectChange" clearable placeholder="请选择科目" style="width: 90%">
                            <el-option
                              v-for="item in kemuOptions1"
                              :key="item.uuid"
                              :label="item.name"
                              :value="item.uuid">
                            </el-option>
                        </el-select>
                    </el-col>

                    <el-col :span="6">
                        <el-input v-model="listForm.likeName" placeholder="请输入编号、标题、链接" style="width: 90%"></el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" @click="subjectSearch" style="width: 90%">搜索</el-button>
                    </el-col>

                </el-row>

                <el-table
                  :data="vedioList"
                  row-key="uuid"
                  default-expand-all
                  style="width: calc( 100vw - 3.65rem)">
                  <af-table-column
                    :prop="item.prop"
                    :label="item.label"
                    v-for="(item, index) in columnList"
                    :key="index"
                    >
                  </af-table-column>
                  <af-table-column prop="active" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
                        <el-popover
                          placement="top"
                          width="200"
                          trigger="click"
                          :ref="`popover-${scope.$index}`"
                          >
                          <p style="margin-bottom: .2rem;">确定要删除吗？</p>
                          <div style="text-align: right; margin: 0">
                            <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                            <el-button type="primary" size="mini" @click="deleteClick(scope)">确定</el-button>
                          </div>
                          <el-button slot="reference" type="text" size="small" style="margin-left: .2rem;">删除</el-button>
                        </el-popover>
                    </template>
                  </af-table-column>
                </el-table>

                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total='total'
                    :page-size='listForm.pageSize'
                    :page-sizes="[8, 10, 20, 30]"
                    :hide-on-single-page="totalFlag"
                    @current-change="handleCurrentChange"
                    @size-change="handleSizeChange"
                >
                </el-pagination>

                <el-drawer
                    :title="drawerTitle1"
                    :visible.sync="drawer1"
                    :direction="direction"
                    size="50%"
                    :before-close="handleClose">

                    <el-form :model="vedioForm" :rules="rules1" ref="vedioForm" style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">
                        
                        <el-form-item label="封面图" prop="coverUrl">
                          
                            <el-upload
                                class="avatar-uploader"
                                :data='uploadData'
                                action="https://testgm.jhwx.com/api/knowledgeSystem/courseVideo/uploadimg"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="vedioForm.coverUrl" :src="vedioForm.coverUrl" style="width: 1.6rem;">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>

                        </el-form-item>

                        <el-form-item label="视频标题" prop="name">
                          <el-input v-model="vedioForm.name" placeholder="请选择视频标题"></el-input>
                        </el-form-item>

                        <el-form-item label="视频链接" prop="url">
                          <el-input v-model="vedioForm.url" placeholder="请选择视频链接"></el-input>
                        </el-form-item>

                        <el-form-item label="考试项目" prop="examDirectionUuid">

                            <el-select v-model="vedioForm.examDirectionUuid" placeholder="请选择考试项目" @change='examDirectionChange' clearable>
                                <el-option
                                    v-for="item in vedioOption"
                                    :key="item.uuid"
                                    :label="item.name"
                                    :value="item.uuid">
                                </el-option>
                            </el-select>

                        </el-form-item>

                        <el-form-item label="考试科目" prop="subjectUuid">

                            <el-select v-model="vedioForm.subjectUuid" @focus="vedioKemuFocus2" placeholder="请选择考试科目" @change='subjectChange' clearable>
                                <el-option
                                  v-for="item in kemuOptions2"
                                  :key="item.uuid"
                                  :label="item.name"
                                  :value="item.uuid">
                                </el-option>
                            </el-select>

                        </el-form-item>

                        <el-form-item label="视频类型" prop="type">

                            <el-select v-model="vedioForm.type" placeholder="请选择视频类型" @change='vedioTypeChange2' clearable>
                                <el-option
                                  v-for="item in vedioTypeArr"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                            </el-select>

                        </el-form-item>

                        <el-form-item label="主讲人" prop="speaker">
                          <el-input v-model="vedioForm.speaker" placeholder="请输入主讲人"></el-input>
                        </el-form-item>

                        <el-form-item label="备注" prop="remarks">
                          <el-input v-model="vedioForm.remarks" placeholder="请输入备注"></el-input>
                        </el-form-item>

                        <el-form-item label="时长" prop="length">
                          <span>{{vedioForm.length}}</span>
                        </el-form-item>

                        <el-form-item label="大小" prop="fileSize">
                          <span>{{vedioForm.fileSize}}M</span>
                        </el-form-item>

                        <el-form-item label="主关联知识点" prop="chiefKnowList">

                            <el-button style="display: block; margin-bottom: 10px;" type="primary" @click="knopPointsClick">关联知识点</el-button>

                            <el-tag
                                :key="index"
                                v-for="(tag,index) in vedioForm.chiefKnowList"
                                closable
                                :disable-transitions="false"
                                style="margin-right: 10px;"
                                @close="handleTagClose(tag)">
                                {{tag.name}}
                            </el-tag>

                        </el-form-item>

                        <el-drawer
                            title="关联知识点"
                            :append-to-body="true"
                            :before-close="handleClose"
                            :visible.sync="drawer2">
                            <div style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">

                                <el-tree
                                    :data="treeData"
                                    show-checkbox
                                    node-key="id"
                                    :default-expanded-keys="[2, 3]"
                                    :default-checked-keys="[5]"
                                    :props="defaultProps">
                                </el-tree>

                            </div>
                        </el-drawer>

                        <el-form-item label="辅关联知识点" prop="describe">

                            <el-button style="display: block; margin-bottom: 10px;" type="primary" @click="knopPointsClick">关联知识点</el-button>

                            <el-tag
                                :key="index"
                                v-for="(tag,index) in vedioForm.auxiliaryKnowList"
                                closable
                                :disable-transitions="false"
                                style="margin-right: 10px;"
                                @close="handleTagClose(tag)">
                                {{tag.name}}
                            </el-tag>

                        </el-form-item>

                        <el-form-item label="视频编号" prop="fileSize" v-show="drawerTitle1 != '添加视频资源'">
                          <span>{{vedioForm.number}}</span>
                        </el-form-item>

                        <el-form-item label="最后修改人" prop="fileSize" v-show="drawerTitle1 != '添加视频资源'">
                          <span>{{vedioForm.updateUserName}}</span>
                        </el-form-item>

                        <el-form-item label="最后修改时间" prop="fileSize" v-show="drawerTitle1 != '添加视频资源'">
                          <span>{{vedioForm.updateTime}}</span>
                        </el-form-item>

                        <el-form-item>
                          <el-button type="primary" @click="submitForm('vedioForm')">确定</el-button>
                          <el-button @click="quxiao">取消</el-button>
                        </el-form-item>

                    </el-form>

                </el-drawer>

            </el-main>

        </el-container>
    </div>
    
</template>

<script>
import { 
    addCourseVideo,
    getCourseVideoByUuid,
    getCourseVideoList,
    updateCourseVideo,
    getSubjectBasicByExamUuid,
    deleteCourseVideoByUuid,
    getExamBasic,
} from '../../request/api';
import { getTextByJs, timestampToTime } from '../../assets/js/common';
import { vedioTypeArr } from '../../assets/js/data';
export default {
    name: 'subject',
    data() {
        return {
            vedioList: [],
            columnList: [
                { 'prop': 'number', 'label': '视频ID' },
                { 'prop': 'name', 'label': '视频标题' },
                { 'prop': 'url', 'label': '视频链接' },
                { 'prop': 'speaker', 'label': '主讲人' },
                { 'prop': 'length', 'label': '视频时长' },
                { 'prop': 'type', 'label': '视频类型' },
                { 'prop': 'fileSize', 'label': '视频大小' },
            ],
            drawerTitle1: '添加视频资源',
            drawer1: false,
            drawer2: false,
            direction: 'rtl',
            rules1: {

            },
            listForm: {
                currentPage: 1, //当前页数
                examDirectionUuid: '', //考试方向的uuid
                pageSize: 8, //每页显示条目个数
                likeName: '', //文字搜索（编号、标题、链接）
                sortSet: [], //排序集合
                subjectUuidList: '', //科目的uuid
                type: null, //视频类型(1：录播课时 2：直播回放 3：短视频)
            },
            totalFlag: false,
            vedioOption: [],
            total: null,
            kemuOptions1: [],
            kemuOptions2: [],
            jobStatusText: '',
            vedioTypeArr: vedioTypeArr,
            vedioTypeText: '',
            treeData: [{
              id: 1,
              label: '一级 1',
              children: [{
                id: 4,
                label: '二级 1-1',
                children: [{
                  id: 9,
                  label: '三级 1-1-1'
                }, {
                  id: 10,
                  label: '三级 1-1-2'
                }]
              }]
            }, {
              id: 2,
              label: '一级 2',
              children: [{
                id: 5,
                label: '二级 2-1'
              }, {
                id: 6,
                label: '二级 2-2'
              }]
            }, {
              id: 3,
              label: '一级 3',
              children: [{
                id: 7,
                label: '二级 3-1'
              }, {
                id: 8,
                label: '二级 3-2'
              }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            vedioForm: {
                auxiliaryKnowList: [
                    { name: '标签一', uuid: '111' },
                    { name: '标签二', uuid: '112' },
                    { name: '标签三', uuid: '113' },
                ], //辅关联的知识点集合
                chiefKnowList: [
                    { name: '标签一', uuid: '111' },
                    { name: '标签二', uuid: '112' },
                    { name: '标签三', uuid: '113' },
                ], //主关联的知识点集合
                courseDataList: [], //辅助资料集合
                coverUrl: '', //封面链接
                coverName: '',
                examDirectionUuid: '', //考试方向的uuid
                fileSize: 2, //视频大小（单位：M）
                length: 111, //视频长度（单位：秒）
                name: '', //视频标题
                remarks: '', //备注
                speaker: '', //主讲人
                subjectUuid: '', //科目的uuid
                subjectName: '', //科目的name
                type: null, //视频类型(1：录播课时 2：直播回放 3：短视频)
                url: '', //视频链接
                updateTime: '', //更新时间(10位)
                updateUserName: '', //更新用户姓名
                updateUserUuid: '', //更新用户唯一标识
                number: '', //视频编号
                uuid: '', //视频自身uuid
            },
            uploadData: {}
        }
    },
    created() {
        this.getExamBasic();
        this.getCourseVideoList();
    },
    methods: {
        handleTagClose(tag) {

        },

        handleAvatarSuccess(res, file) {
            console.log(res);
            console.log(file);
            this.vedioForm.url = URL.createObjectURL(file.raw);
        },

        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;
          console.log(this.vedioForm.coverName);
          this.uploadData = { name: this.vedioForm.coverName };
          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },

        addVedioClick() {
            this.drawer1 = true;
            this.drawerTitle1 = '添加视频资源';
            this.vedioForm.coverName = '11';
        },
        vedioTypeChange1(value) {
            this.listForm.type = value;
            this.getCourseVideoList();
        },
        vedioExamChange(value) {
            console.log(value);
            this.listForm.examDirectionUuid = value;
            this.getCourseVideoList();
        },
        examDirectionChange(value) {
            console.log(value);
            this.vedioForm.examDirectionUuid = value;
        },
        vedioSubjectChange(value) {
            console.log(value);
            this.vedioForm.subjectUuidList = value;
        },

        subjectChange(value) {
            this.vedioForm.subjectUuid = value;
        },
        vedioTypeChange2(value) {
            this.vedioForm.type = value;
        },

        getExamBasic() {
            this.$smoke_get(getExamBasic, {}).then(res => {
                console.log(res);
                this.vedioOption = res.data;
            })
        },
        addCourseVideo() {
            this.$smoke_post(addCourseVideo, this.vedioForm).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.drawer1 = false;
                    this.getCourseVideoList();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        updateCourseVideo() {
            this.vedioForm.subjectUuid = this.vedioForm.subjectName;
            this.$smoke_post(updateCourseVideo, this.vedioForm).then(res => {
                console.log(res);
                if(res.code == 200) {
                    this.drawer1 = false;
                    this.getCourseVideoList();
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        handleClose(done) {
            done();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.vedioForm);
                    if(this.drawerTitle1 == '添加视频资源'){
                        this.addCourseVideo();
                    }else{
                        this.updateCourseVideo();
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        quxiao() {
            this.drawer1 = false;
        },
        subjectSearch() {
            this.getCourseVideoList();
        },
        getCourseVideoList() {
            let arr;
            this.$smoke_post(getCourseVideoList, this.listForm).then(res => {
                console.log(res);
                this.vedioList = res.data.list;
                this.total = res.data.total;
            })
        },
        handleCurrentChange(index) {
            this.listForm.currentPage = index;
            this.getCourseVideoList();
        },
        handleSizeChange(index) {
            this.listForm.currentPage = index;
            this.getCourseVideoList();
        },
        editClick(scope) {
            console.log(scope);
            this.drawer1 = true;
            this.drawerTitle1 = '编辑视频资源';
            this.getCourseVideoByUuid(scope);
        },
        getCourseVideoByUuid(scope) {
            this.$smoke_post(getCourseVideoByUuid, {
                uuid: scope.uuid
            }).then(res => {
                // console.log(res);
                this.vedioForm.coverUrl = res.data.coverUrl;
                this.vedioForm.coverName = res.data.coverName;
                this.vedioForm.name = res.data.name;
                this.vedioForm.url = res.data.url;
                this.vedioForm.examDirectionUuid = res.data.examDirectionUuid;
                this.vedioForm.subjectUuid = res.data.subjectName;
                this.vedioForm.subjectName = res.data.subjectUuid;
                this.vedioForm.type = res.data.type;
                this.vedioForm.speaker = res.data.speaker;
                this.vedioForm.remarks = res.data.remarks;
                this.vedioForm.uuid = res.data.uuid;
                this.vedioForm.updateTime = timestampToTime(res.data.updateTime);
                this.vedioForm.updateUserName = res.data.updateUserName;
                this.vedioForm.number = res.data.number;
            })
        },
        deleteClick(scope) {
            console.log(scope);
            this.$smoke_post(deleteCourseVideoByUuid, {
                uuid: scope.row.uuid
            }).then(res => {
                if(res.code == 200) {
                    scope._self.$refs[`popover-${scope.$index}`].doClose();
                    this.$message({
                        type: 'success',
                        message: '删除成功', 
                    });
                    this.getCourseVideoList();
                }
            })
        },
        knopPointsClick() {
            console.log(222);
            this.drawer2 = true;
        },
        vedioKemuFocus1() {
            if(this.listForm.examDirectionUuid){
                this.$smoke_post(getSubjectBasicByExamUuid, {
                    uuid: this.listForm.examDirectionUuid
                }).then(res => {
                    console.log(res);
                    this.kemuOptions1 = res.data;
                })
            }
        },
        vedioKemuFocus2() {
            if(this.vedioForm.examDirectionUuid){
                this.$smoke_post(getSubjectBasicByExamUuid, {
                    uuid: this.vedioForm.examDirectionUuid
                }).then(res => {
                    console.log(res);
                    this.kemuOptions2 = res.data;
                })
            }
        }
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .el-main{
        // background: grey;
    }
    .index-main{
        height: calc( 100vh - 60px);
        .people-title{
            width: 100%;
            height: .6rem;
            line-height: .6rem;
            text-align: center;
            font-size: .2rem;
            background: #aaa;
            margin-bottom: .3rem;
            color: #fff;
        }
        .people-screen{
            margin-bottom: .3rem;
        }
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
</style>

<style>
    .el-drawer__body{
        overflow-y:scroll;
    }
    .el-drawer__body::-webkit-scrollbar {
        width: 1px;
        height: 1px;
    }
    .el-drawer__body::-webkit-scrollbar-thumb {
        background-color: #a1a3a9;
        border-radius: 0px;
    }
</style>