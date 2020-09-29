<template>
    <el-main class="index-main">
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
          style="width: 100%"         
          :height="tableHeight">
          <af-table-column
            :prop="item.prop"
            :width="item.label == '视频链接' ? '200px' : ''"
            :label="item.label"
            v-for="(item, index) in columnList"
            :key="index"
            >
          </af-table-column>
          <af-table-column prop="active" width="95" fixed="right" label="操作" class-name="table_active">
            <template slot-scope="scope">
                <svg-icon @click="handleCopy(scope.row)" icon-class="copy" icon-title="复制链接" />
                <svg-icon @click="editClick(scope.row)" icon-class="edit" icon-title="编辑" />
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
                  <svg-icon slot="reference" icon-title="删除" icon-class="del" />
                </el-popover>
            </template>
          </af-table-column>
        </el-table>

        <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total='total'
            :page-size='listForm.pageSize'
            :page-sizes="[10, 20, 30, 50, 100]"
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
            <span class="bullets"></span>

            <el-form :model="vedioForm" :rules="rules1" ref="vedioForm" style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">
                
                <el-form-item label="封面图" prop="coverUrl">
                  
                    <el-upload
                        class="avatar-uploader"
                        :data='uploadData'
                        :action="uploadimg"
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
                  <el-input v-model="vedioForm.url" placeholder="请选择视频链接" @blur="videoLength"></el-input>
                </el-form-item>

                <video ref="video" v-show="false" controls='controls' :src="vedioForm.url"></video>

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

                    <el-select v-model="vedioForm.subjectName" @focus="vedioKemuFocus2" placeholder="请选择考试科目" @change="subjectChange" clearable>
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
                  <span>{{vedioForm.lengthText}}</span>
                </el-form-item>

                <el-form-item label="大小" prop="fileSize">
                  <span>{{vedioForm.fileSize}} ( 单位：M )</span>
                </el-form-item>

                <el-form-item label="主关联知识点" prop="chiefKnowList">

                    <el-button style="display: block; margin-bottom: 10px;" type="primary" @click="knopPointsClick('zhu')">关联知识点</el-button>

                    <el-tag
                        :key="index"
                        v-for="(tag,index) in vedioForm.chiefKnowList"
                        :disable-transitions="false"
                        style="margin-right: 10px;"
                        >
                        {{tag.name}}
                    </el-tag>

                </el-form-item>

                <el-drawer
                    title="关联知识点"
                    :append-to-body="true"
                    :before-close="handleClose"
                    :visible.sync="drawer2">
            <span class="bullets"></span>
                    <div style="border: 1px dashed #ccc; padding: .4rem; margin: .2rem;">

                        <div style="margin-bottom: 20px; font-size: 16px;"><span>当前科目：</span> {{vedioForm.subjectName}}</div>

                        <el-tree
                            :data="treeData"
                            show-checkbox
                            node-key="uuid"
                            :default-checked-keys="checkKeys"
                            default-expand-all
                            check-strictly
                            ref="tree"
                            :props="defaultProps">
                        </el-tree>

                        <el-button type="primary" style="margin-top: 20px;" @click="treeYes">确定</el-button>

                    </div>
                </el-drawer>

                <el-form-item label="辅关联知识点" prop="describe">

                    <el-button style="display: block; margin-bottom: 10px;" type="primary" @click="knopPointsClick">关联知识点</el-button>

                    <el-tag
                        :key="index"
                        v-for="(tag,index) in vedioForm.auxiliaryKnowList"
                        :disable-transitions="false"
                        style="margin-right: 10px;"
                        >
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
    getFileSize,
    getCatalogueKnowBasicBySubjectUuid,
    uploadimg
} from '../../request/api';
import { timestampToTime, formatSeconds, vedioTypeText } from '../../assets/js/common';
import { vedioTypeArr } from '../../assets/js/data';
export default {
    name: 'subject',
    props: ['tableHeight'],
    data() {
        return {
            vedioList: [],
            columnList: [
                { 'prop': 'number', 'label': '视频ID' },
                { 'prop': 'name', 'label': '视频标题' },
                { 'prop': 'speaker', 'label': '主讲人' },
                { 'prop': 'length', 'label': '视频时长' },
                { 'prop': 'type', 'label': '视频类型' },
                { 'prop': 'fileSize', 'label': '视频大小' },
                { 'prop': 'url', 'label': '视频链接' },
            ],
            drawerTitle1: '添加视频资源',
            drawer1: false,
            drawer2: false,
            direction: 'rtl',
            rules1: {},
            listForm: {
                currentPage: 1, //当前页数
                examDirectionUuid: '', //考试项目的uuid
                pageSize: 20, //每页显示条目个数
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
            vedioTypeArr: vedioTypeArr,
            treeData: [],
            defaultProps: {
                children: 'list',
                label: 'name'
            },
            vedioForm: {
                auxiliaryKnowList: [], //辅关联的知识点集合
                chiefKnowList: [], //主关联的知识点集合
                courseDataList: [], //辅助资料集合
                coverUrl: '', //封面链接
                coverName: '',
                examDirectionUuid: '', //考试项目的uuid
                fileSize: 0, //视频大小（单位：M）
                length: '', //视频长度（单位：秒）
                lengthText: '', //视频长度（单位：秒）
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
            uploadData: {
                name: '' // 上传upload的from的name
            },
            checkKeys: [], //关联知识点选中数组
            treeType: '', //区别关联知识点的主辅
            uploadimg: uploadimg
        }
    },
    created() {
        this.getExamBasic();
        this.getCourseVideoList();
    },
    methods: {
        handleAvatarSuccess(res, file) {
            this.vedioForm.coverUrl = file.response.data;
        },
        beforeAvatarUpload(file) {
            this.uploadData.name = this.vedioForm.coverName;
        //   const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;
        //   if (!isJPG) {
        //      this.$message.error('上传头像图片只能是 JPG 格式!');
        //   }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
        //   return isJPG && isLt2M;
          return isLt2M;
        },
        addVedioClick() {
            this.drawer1 = true;
            this.drawerTitle1 = '添加视频资源';
            this.vedioForm.auxiliaryKnowList = [];
            this.vedioForm.chiefKnowList = [];
            this.vedioForm.coverName = '';
            this.vedioForm.coverUrl = '';
            this.vedioForm.name = '';
            this.vedioForm.url = '';
            this.vedioForm.examDirectionUuid = '';
            this.vedioForm.subjectUuid = '';
            this.vedioForm.subjectName = '';
            this.vedioForm.type = '';
            this.vedioForm.speaker = '';
            this.vedioForm.remarks = '';
            this.vedioForm.uuid = '';
            this.vedioForm.updateTime = '';
            this.vedioForm.updateUserName = '';
            this.vedioForm.number = '';
            this.vedioForm.fileSize = '';
            this.vedioForm.length = '';
            this.vedioForm.lengthText = '';
        },
        vedioTypeChange1(value) {
            this.listForm.type = value;
            this.getCourseVideoList();
        },
        vedioExamChange(value) {
            this.listForm.examDirectionUuid = value;
            this.getCourseVideoList();
        },
        examDirectionChange(value) {
            this.vedioForm.examDirectionUuid = value;
        },
        vedioSubjectChange(value) {
            this.vedioForm.subjectUuidList = value;
            this.getCourseVideoList();
        },
        subjectChange(value) {
            let obj = {};
            obj = this.kemuOptions2.find((item)=>{
               return item.uuid === value;
            });
            let getName = ''
            getName = obj.name;

            this.vedioForm.subjectUuid = value;
            this.vedioForm.subjectName = getName;
            this.checkKeys = [];
            this.vedioForm.chiefKnowList = [];
            this.vedioForm.auxiliaryKnowList = [];
        },
        vedioTypeChange2(value) {
            this.vedioForm.type = value;
        },
        getExamBasic() {
            this.$smoke_get(getExamBasic, {}).then(res => {
                this.vedioOption = res.data;
            })
        },
        addCourseVideo() {
            this.$smoke_post(addCourseVideo, this.vedioForm).then(res => {
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
            this.$smoke_post(updateCourseVideo, this.vedioForm).then(res => {
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
                    if(this.drawerTitle1 == '添加视频资源'){
                        this.addCourseVideo();
                    }else{
                        this.updateCourseVideo();
                    }
                } else {
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
                res.data.list.map(sll => {
                    sll.length = formatSeconds(sll.length);
                    sll.type = vedioTypeText(sll.type);
                })
                this.vedioList = res.data.list;
                this.total = res.data.total;
                this.$emit('setTableHeight', this.total, 3)
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
            this.drawer1 = true;
            this.drawerTitle1 = '编辑视频资源';
            this.getCourseVideoByUuid(scope);
        },
        getCourseVideoByUuid(scope) {
            this.$smoke_post(getCourseVideoByUuid, {
                uuid: scope.uuid
            }).then(res => {
                this.vedioForm.auxiliaryKnowList = res.data.auxiliaryKnowList;
                this.vedioForm.chiefKnowList = res.data.chiefKnowList;
                this.vedioForm.coverUrl = res.data.coverUrl;
                this.vedioForm.coverName = res.data.coverName;
                this.vedioForm.name = res.data.name;
                this.vedioForm.url = res.data.url;
                this.vedioForm.examDirectionUuid = res.data.examDirectionUuid;
                this.vedioForm.subjectUuid = res.data.subjectUuid;
                this.vedioForm.subjectName = res.data.subjectName;
                this.vedioForm.type = res.data.type;
                this.vedioForm.speaker = res.data.speaker;
                this.vedioForm.remarks = res.data.remarks;
                this.vedioForm.uuid = res.data.uuid;
                this.vedioForm.updateTime = timestampToTime(Number(res.data.updateTime));
                this.vedioForm.updateUserName = res.data.updateUserName;
                this.vedioForm.number = res.data.number;
                this.vedioForm.fileSize = res.data.fileSize;
                this.vedioForm.length = res.data.length;
                this.vedioForm.lengthText = formatSeconds(res.data.length);
            })
        },
        deleteClick(scope) {
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
        knopPointsClick(type) {
            this.drawer2 = true;
            this.$smoke_post(getCatalogueKnowBasicBySubjectUuid, {
                uuid: this.vedioForm.subjectUuid
            }).then(res => {
                if(res.code == 200) {
                    res.data.map(sll => {
                        sll.disabled = true;
                        if(sll.list.length != 0){
                            sll.list.map(oop => {
                                oop.disabled = true;
                                oop.list = oop.knowList;
                            })
                        }
                    })
                    this.treeData = res.data;
                }
            })
            this.treeType = type;
            let arr = [];
            if(type == 'zhu') {
                this.vedioForm.chiefKnowList.map(jian => {
                    arr.push(jian.uuid)
                })
            }else{
                this.vedioForm.auxiliaryKnowList.map(jian => {
                    arr.push(jian.uuid)
                })
            }
            this.checkKeys = arr;
        },
        treeYes() {
            if(this.treeType == 'zhu') {
                this.vedioForm.chiefKnowList = this.$refs.tree.getCheckedNodes();
                this.drawer2 = false;
            }else{
                this.vedioForm.auxiliaryKnowList = this.$refs.tree.getCheckedNodes();
                this.drawer2 = false;
            }
        },
        vedioKemuFocus1() {
            if(this.listForm.examDirectionUuid){
                this.$smoke_post(getSubjectBasicByExamUuid, {
                    uuid: this.listForm.examDirectionUuid
                }).then(res => {
                    this.kemuOptions1 = res.data;
                })
            }
        },
        vedioKemuFocus2() {
            if(this.vedioForm.examDirectionUuid){
                this.$smoke_post(getSubjectBasicByExamUuid, {
                    uuid: this.vedioForm.examDirectionUuid
                }).then(res => {
                    this.kemuOptions2 = res.data;
                })
            }
        },
        videoLength() {
            if(!isNaN(this.$refs.video.duration)){
                setTimeout(() => {
                    this.vedioForm.length = this.$refs.video.duration;
                    this.vedioForm.lengthText = formatSeconds(this.$refs.video.duration);
                }, 500)
            }else{
                this.$message({
                    type: 'error',
                    message: '您输入的视频地址有误，请重新输入'
                })
                this.vedioForm.url = '';
            }

            this.getFileSize(this.vedioForm.url);
        },
        handleCopy(row) {
            this.$copyText(row.url).then(
		        res => {
		            this.$message({
                        type: 'success',
                        message: '复制成功',
                    })
		        },
		        err => {
		            this.$message({
                        type: 'error',
                        message: '复制失败',
                    })
		        }
		    )
        },
        getFileSize(url) {
            this.$smoke_post(getFileSize, {
                fileUrl: url
            }).then(res => {
                if(res.code == 200) {
                    this.vedioForm.fileSize = ( res.data / 1000 / 1000 ).toFixed(2);
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
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
        height: auto;
        margin-top: 15px;
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
        }
    }
</style>