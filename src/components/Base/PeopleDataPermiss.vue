<template>
    <el-main class="index-main">

        <div class="people-title"><i class="el-icon-back" title="返回列表页" @click="goback"></i>员工数据权限管理</div>


        <el-row class="tab" v-loading="fullscreenLoading">

            <el-col :span="6" class="tab-left">

                <div class="tab-left-title">成员信息</div>

                <div class="tab-xian"></div>

                <el-image
                    style="width: 1rem; height: 1rem; border-radius: 50%; margin-top: .2rem;"
                    :src="this.avatar ? this.avatar : require('../../assets/images/header_img.png')">
                </el-image>

                <el-table
                    style="margin-top: .2rem;"
                    :data="userList"
                    :cell-style='cellStyle'
                    :show-header="false"
                    >
                    <el-table-column
                        :prop="item.prop"
                        :show-overflow-tooltip='true'
                        :label="item.label"
                        v-for="(item, index) in userColumnList"
                        :key="index"
                        >
                    </el-table-column>
                </el-table>

                <el-image
                    class="tab-left-image"
                    :src="require('../../assets/images/info-back.png')">
                </el-image>

            </el-col>

            <el-col :span="18" class="tab-right">

                <div class="tab-right-title">分校平台</div>

                <div class="tab-xian"></div>

                <el-row style="margin-bottom: 20px;">
                
                    <el-col style="position: relative;">
                    
                        <el-table
                            :data="schoolList"
                            :show-header="false"
                            >
                            <el-table-column
                                :prop="item.prop"
                                :label="item.label"
                                :width="item.prop == 'attr' ? '150' : ''"
                                v-for="(item, index) in userColumnList"
                                :key="index"
                                >
                            </el-table-column>
                        </el-table>

                    </el-col>

                    <el-button plain size="small" @click="editSchoolClick" style="position: absolute; right: 40px; top: -44px; width: 116px;">修改分校</el-button>

                </el-row>

                <div class="tab-right-title">坐席数据</div>

                <div class="tab-xian"></div>

                <el-row style="margin-bottom: 20px;">
                
                    <el-col style="position: relative;">
                    
                        <el-table
                            :data="seatList"
                            :show-header="false"
                            >
                            <el-table-column
                                :prop="item.prop"
                                :label="item.label"
                                :width="item.prop == 'attr' ? '150' : ''"
                                v-for="(item, index) in userColumnList"
                                :key="index"
                                >
                            </el-table-column>
                        </el-table>

                    </el-col>

                    <el-button plain size="small" @click="editPeopleClick" style="position: absolute; right: 40px; top: -44px;">修改部门与人员</el-button>

                </el-row>

                <div class="tab-right-title">回收线索</div>

                <div class="tab-xian"></div>

                <el-row style="margin-bottom: 20px;">
                
                    <el-col style="position: relative;">
                    
                        <el-table
                            :data="backList"
                            :show-header="false"
                            >
                            <el-table-column
                                :prop="item.prop"
                                :label="item.label"
                                :width="item.prop == 'attr' ? '150' : ''"
                                v-for="(item, index) in userColumnList"
                                :key="index"
                                >
                            </el-table-column>
                        </el-table>

                    </el-col>

                    <el-button plain size="small" @click="editBackClick" style="position: absolute; right: 40px; top: -44px; width: 116px;">修改考试项</el-button>

                </el-row>

                <div class="tab-right-title">分配组与溢出</div>

                <div class="tab-xian"></div>

                <el-row style="margin-bottom: 20px;">
                
                    <el-col style="position: relative;">
                    
                        <el-table
                            :data="dataSetList"
                            :show-header="false"
                            >
                            <el-table-column
                                :prop="item.prop"
                                :label="item.label"
                                :width="item.prop == 'attr' ? '150' : ''"
                                v-for="(item, index) in userColumnList"
                                :key="index"
                                >
                            </el-table-column>
                        </el-table>

                    </el-col>

                    <el-button plain size="small" @click="editDataSetClick" style="position: absolute; right: 40px; top: -44px; width: 116px;">修改分配组</el-button>

                </el-row>


                <!-- <div class="tab-right-title">推广线索</div> -->

                <!-- <div class="tab-xian"></div>

                <el-row style="margin-bottom: 20px;">
                
                    <el-col style="position: relative;">
                    
                        <el-table
                            :data="spreadList"
                            :show-header="false"
                            >
                            <el-table-column
                                :prop="item.prop"
                                :label="item.label"
                                :width="item.prop == 'attr' ? '150' : ''"
                                v-for="(item, index) in userColumnList"
                                :key="index"
                                >
                            </el-table-column>
                        </el-table>

                    </el-col>

                    <el-button plain size="small" @click="editSpreadClick" style="position: absolute; right: 40px; top: -44px; width: 116px;">修改推广账号</el-button>

                </el-row> -->


                <div style="text-align: center;">

                    <el-button type="primary" size="small" @click="onSubmit">保存</el-button>
                    <el-button plain size="small" @click="goback">取消</el-button>

                </div>

            </el-col>

        </el-row>

        <el-drawer
            :title="drawerTitle0"
            :visible.sync="drawer0"
            :direction="direction0"
            size="50%"
            :before-close="handleClose">
            <span class="bullets"></span>

            <el-row class="school-radio">
                <el-radio v-model="radioId" v-for="(item, index) in tableDataSchool" :label="item.name" :key="index"></el-radio>


            </el-row>

            <el-button type="primary" style="margin: 0 20px;" @click="addSchool">确定</el-button>
            
        </el-drawer>

        <el-drawer
            :title="drawerTitle1"
            :visible.sync="drawer1"
            :direction="direction1"
            size="50%"
            :before-close="handleClose">
            <span class="bullets"></span>

            <el-row style="border: 1px dashed #ccc; padding: 20px; margin: 20px;">

                <el-col :span="10">

                    <el-input
                        placeholder="输入您想查找的人员"
                        style="margin-bottom: 10px;"
                        v-model="filterText">
                    </el-input>

                    <el-tree
                        ref="tree"
                        :data="treeData"
                        show-checkbox
                        style="margin-left: 0px;"
                        node-key="uuid"
                        :check-strictly="true"
                        :default-expanded-keys="defaultExpandedKeys"
                        :default-checked-keys="defaultCheckedKeys"
                        :filter-node-method="filterNode"
                        @check="handleCheckChange"
                        :props="defaultProps"
                    >
                    </el-tree>

                </el-col>

                <el-col :span="13" :offset="1">
                
                    <el-table
                        border
                        :data="tableData"
                    >

                        <el-table-column
                            :prop="item.props"
                            :label="item.label"
                            v-for="(item, index) in columnList1"
                            :key="index">
                        </el-table-column>

                        <el-table-column prop="limitLimit" label="操作" width="50">
                            <template slot-scope="scope">                            
                                <svg-icon @click="handleDeleteClick(scope.row)" icon-title="移除" icon-class="del" />
                            </template>
                        </el-table-column>

                    </el-table>

                    <el-button type="primary" style="margin: 20px 0;" @click="addPeople">确定</el-button>

                </el-col>

            </el-row>

        </el-drawer>

        <el-drawer
            :title="drawerTitle2"
            :visible.sync="drawer2"
            :direction="direction2"
            size="50%"
            :before-close="handleClose">
            <span class="bullets"></span>

            <el-row style="border: 1px dashed #ccc; padding: 20px; margin: 20px;">

                <el-col :span="10">

                    <el-input
                        placeholder="输入您想查找的考试项"
                        style="margin-bottom: 10px;"
                        v-model="filterTextExam">
                    </el-input>

                    <el-tree
                        ref="treeExam"
                        :data="treeDataExam"
                        show-checkbox
                        style="margin-left: 0px;"
                        node-key="uuid"
                        :check-strictly="true"
                        :default-expanded-keys="defaultExpandedKeysExam"
                        :default-checked-keys="defaultCheckedKeysExam"
                        :filter-node-method="filterNodeExam"
                        @check="handleCheckChangeExam"
                        :props="defaultPropsExam"
                    >
                    </el-tree>

                </el-col>

                <el-col :span="13" :offset="1">
                
                    <el-table
                        border
                        :data="tableDataExam"
                    >

                        <el-table-column
                            :prop="item.props"
                            :label="item.label"
                            v-for="(item, index) in columnList1"
                            :key="index">
                        </el-table-column>

                        <el-table-column prop="limitLimit" label="操作">
                            <template slot-scope="scope">
                                <svg-icon @click="handleDeleteClickExam(scope.row)" icon-title="移除" icon-class="del" />
                            </template>
                        </el-table-column>

                    </el-table>

                    <el-button type="primary" style="margin: 20px 0;" @click="addExam">确定</el-button>

                </el-col>

            </el-row>

        </el-drawer>

        <el-drawer
            :title="drawerTitle3"
            :visible.sync="drawer3"
            :direction="direction3"
            size="50%"
            :before-close="handleClose">
            <span class="bullets"></span>

            <el-row style="border: 1px dashed #ccc; padding: 20px; margin: 20px;">

                <el-col :span="10">

                    <el-input
                        placeholder="输入您想查找的分配组"
                        style="margin-bottom: 10px;"
                        v-model="filterTextSet">
                    </el-input>

                    <el-tree
                        ref="treeSet"
                        :data="treeDataSet"
                        show-checkbox
                        style="margin-left: 0px;"
                        node-key="uuid"
                        :check-strictly="true"
                        :default-expanded-keys="defaultExpandedKeysSet"
                        :default-checked-keys="defaultCheckedKeysSet"
                        :filter-node-method="filterNodeSet"
                        @check="handleCheckChangeSet"
                        :props="defaultPropsSet"
                    >
                    </el-tree>

                </el-col>

                <el-col :span="13" :offset="1">
                
                    <el-table
                        border
                        :data="tableDataSet"
                    >

                        <el-table-column
                            :prop="item.props"
                            :label="item.label"
                            v-for="(item, index) in columnList1"
                            :key="index">
                        </el-table-column>

                        <el-table-column prop="limitLimit" label="操作">
                            <template slot-scope="scope">
                                <svg-icon @click="handleDeleteClickSet(scope.row)" icon-title="移除" icon-class="del" />
                            </template>
                        </el-table-column>

                    </el-table>

                    <el-button type="primary" style="margin: 20px 0;" @click="addSet">确定</el-button>

                </el-col>

            </el-row>

        </el-drawer>

        <el-drawer
            :title="drawerTitle4"
            :visible.sync="drawer4"
            :direction="direction4"
            size="50%"
            :before-close="handleClose">
            <span class="bullets"></span>

            <el-row style="border: 1px dashed #ccc; padding: 20px; margin: 20px;">

                <el-col :span="10">

                    <el-input
                        placeholder="输入您想查找的推广账号"
                        style="margin-bottom: 10px;"
                        v-model="filterTextSpread">
                    </el-input>

                    <el-tree
                        ref="treeSpread"
                        :data="treeDataSpread"
                        show-checkbox
                        style="margin-left: 0px;"
                        node-key="uuid"
                        :check-strictly="true"
                        :default-expanded-keys="defaultExpandedKeysSpread"
                        :default-checked-keys="defaultCheckedKeysSpread"
                        :filter-node-method="filterNodeSpread"
                        @check="handleCheckChangeSpread"
                        :props="defaultPropsSpread"
                    >
                    </el-tree>

                </el-col>

                <el-col :span="13" :offset="1">
                
                    <el-table
                        border
                        :data="tableDataSpread"
                    >

                        <el-table-column
                            :prop="item.props"
                            :label="item.label"
                            v-for="(item, index) in columnList1"
                            :key="index">
                        </el-table-column>

                        <el-table-column prop="limitLimit" label="操作">
                            <template slot-scope="scope">
                                <svg-icon @click="handleDeleteClickSpread(scope.row)" icon-title="移除" icon-class="del" />
                            </template>
                        </el-table-column>

                    </el-table>

                    <el-button type="primary" style="margin: 20px 0;" @click="addSpread">确定</el-button>

                </el-col>

            </el-row>

        </el-drawer>

    </el-main>
</template>

<script>
import { getPermission, getPermissionUpdate } from '../../request/api';
import { peopleTreeFunc, peopleArrExp, removeEvery, ExamArrExp, ExamTreeFunc, quchong, SetArrExp, SpreadArrExp, SetTreeFunc, SpreadTreeFunc } from '../../assets/js/common';
export default {
    name: 'peopleDataPermiss',
    data() {
        return {
            parentForm: {},
            userUuid: this.$route.query.uuid,
            avatar: '',
            userList: [
                { attr: '姓名', attrText: '' },
                { attr: '手机号码', attrText: '' },
                { attr: '隶属部门', attrText: '' },
                { attr: '后台角色', attrText: '' },
            ],
            schoolList: [
                { attr: '管理分校', attrData: [], attrText: '' },
            ],
            seatList: [
                { attr: '管理部门与人员', attrData: [], attrText: '' },
            ],
            backList: [
                { attr: '管理考试项', attrData: [], attrText: '' },
            ],
            dataSetList: [
                { attr: '管理分配组', attrData: [], attrText: '' },
            ],
            spreadList: [
                { attr: '管理推广账号', attrData: [], attrText: '' },
            ],
            userColumnList: [
                { 'prop': 'attr', 'label': 'attr' },
                { 'prop': 'attrText', 'label': 'attrText' },
            ],
            drawerTitle1: '配置部门与人员',
            drawer1: false,
            direction1: 'rtl',
            filterText: '',
            treeData: [],
            json: null,
            defaultExpandedKeys: [],
            defaultCheckedKeys: [],
            tableData: [],
            defaultProps: {
              children: 'list',
              label: 'name',
            },
            columnList1: [
                { props: 'name', label: '姓名'},
            ],
            drawerTitle2: '配置考试项目',
            drawer2: false,
            direction2: 'rtl',
            filterTextExam: '',
            treeDataExam: [],
            jsonExam: null,
            defaultExpandedKeysExam: [],
            defaultCheckedKeysExam: [],
            tableDataExam: [],
            defaultPropsExam: {
              children: 'list',
              label: 'name',
            },
            drawerTitle3: '配置分配组',
            drawer3: false,
            direction3: 'rtl',
            filterTextSet: '',
            treeDataSet: [],
            jsonSet: null,
            defaultExpandedKeysSet: [],
            defaultCheckedKeysSet: [],
            tableDataSet: [],
            defaultPropsSet: {
              children: 'list',
              label: 'name',
            },
            drawerTitle4: '设置推广账号',
            drawer4: false,
            direction4: 'rtl',
            filterTextSpread: '',
            treeDataSpread: [],
            jsonSpread: null,
            defaultExpandedKeysSpread: [],
            defaultCheckedKeysSpread: [],
            tableDataSpread: [],
            defaultPropsSpread: {
              children: 'list',
              label: 'name',
            },
            onSubmitList: [],
            drawer0: false,
            drawerTitle0: '选择分校',
            direction0: 'rtl',
            tableDataSchool: [],
            tableDataSchoolFlagArr: {},
            radioId: '',
            cellStyle: {
                'text-align': 'center'
            },
            fullscreenLoading: false,
        }
    },
    created() {
        this.parentForm.accountNumber = this.$route.query.accountNumber
        this.parentForm.jobStatus = this.$route.query.jobStatus
        this.parentForm.name = this.$route.query.name
        this.parentForm.orgUuidList = this.$route.query.orgUuidList
        this.parentForm.roleUuid = this.$route.query.roleUuid
        this.parentForm.sortSet = this.$route.query.sortSet
        this.parentForm.startHiredDate = this.$route.query.startHiredDate
        this.parentForm.endHiredDate = this.$route.query.endHiredDate
        if((this.$route.query.uuid == '') || (this.$route.query.uuid == undefined)){
            this.$router.push({ path: '/' });
        }else{
            this.getPermission();
        }
    },
    methods: {
        goback(){
            this.$router.push({
                name: 'people',
                params: this.parentForm
            });
        },
        getPermission() {
            let keysArr = [];
            let keysArrExam = [];
            let keysArrSet = [];
            let keysArrSpread = [];
            
            peopleArrExp.length = 0;
            ExamArrExp.length = 0;
            SetArrExp.length = 0;
            SpreadArrExp.length = 0;

            this.seatList[0].attrText = '';
            this.backList[0].attrText = '';
            this.dataSetList[0].attrText = '';
            this.schoolList[0].attrText = '';
            this.spreadList[0].attrText = '';
            this.seatList[0].attrData = [];
            this.backList[0].attrData = [];
            this.dataSetList[0].attrData = [];
            this.schoolList[0].attrData = [];
            this.spreadList[0].attrData = [];
            this.fullscreenLoading = true;
            this.$smoke_post(getPermission, {
                userUuid: this.userUuid
            }).then(res => {
                if(res.code == 200) {
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                        this.avatar = res.data.user.avatar;
                        this.userList[0].attrText = res.data.user.name;
                        this.userList[1].attrText = res.data.user.accountNumber;
                        this.userList[2].attrText = res.data.user.orgList.join(' - ');
                        this.userList[3].attrText = res.data.user.roleList.join('，');

                        // seatList
                        this.json = peopleTreeFunc(res.data.orgList);
                        this.treeData = this.json.arr;
                        this.seatList[0].attrData = this.json.flagArr = quchong(this.json.flagArr, 'uuid');

                        if(this.json.flagArr.length > 0) {
                            this.json.flagArr.map(sll => {
                                this.seatList[0].attrText += sll.name + '，'
                                keysArr.push(sll.uuid);
                            })
                        }
                        if (this.seatList[0].attrText.length > 0) {
                            this.seatList[0].attrText = this.seatList[0].attrText.substr(0, this.seatList[0].attrText.length - 1);
                        }
                        this.defaultExpandedKeys = this.defaultCheckedKeys = keysArr;

                        //examItem
                        this.jsonExam = ExamTreeFunc([res.data.examItem]);
                        this.treeDataExam = this.jsonExam.arr;
                        this.backList[0].attrData = this.jsonExam.flagArr = quchong(this.jsonExam.flagArr, 'uuid');
                        
                        if(this.jsonExam.flagArr.length > 0) {
                            this.jsonExam.flagArr.map(sll => {
                                this.backList[0].attrText += sll.name + '，'
                                keysArrExam.push(sll.uuid);
                            })
                        }
                        if (this.backList[0].attrText.length > 0) {
                            this.backList[0].attrText = this.backList[0].attrText.substr(0, this.backList[0].attrText.length - 1);
                        }
                        this.defaultExpandedKeysExam = this.defaultCheckedKeysExam = keysArrExam;

                        //spread
                        this.jsonSpread = SpreadTreeFunc([res.data.accList]);
                        this.treeDataSpread = this.jsonSpread.arr;
                        this.spreadList[0].attrData = this.jsonSpread.flagArr = quchong(this.jsonSpread.flagArr, 'uuid');

                        if(this.jsonSpread.flagArr.length > 0) {
                            this.jsonSpread.flagArr.map(sll => {
                                this.spreadList[0].attrText += sll.name + '，'
                                keysArrSpread.push(sll.uuid);
                            })
                        }
                        if (this.spreadList[0].attrText.length > 0) {
                            this.spreadList[0].attrText = this.spreadList[0].attrText.substr(0, this.spreadList[0].attrText.length - 1);
                        }
                        this.defaultExpandedKeysSpread = this.defaultCheckedKeysSpread = keysArrSpread;

                        //clueDataList
                        this.jsonSet = SetTreeFunc([res.data.clueDataList]);
                        this.treeDataSet = this.jsonSet.arr;
                        this.dataSetList[0].attrData = this.jsonSet.flagArr = quchong(this.jsonSet.flagArr, 'uuid');

                        if(this.jsonSet.flagArr.length > 0) {
                            this.jsonSet.flagArr.map(sll => {
                                this.dataSetList[0].attrText += sll.name + '，'
                                keysArrSet.push(sll.uuid);
                            })
                        }
                        if (this.dataSetList[0].attrText.length > 0) {
                            this.dataSetList[0].attrText = this.dataSetList[0].attrText.substr(0, this.dataSetList[0].attrText.length - 1);
                        }
                        this.defaultExpandedKeysSet = this.defaultCheckedKeysSet = keysArrSet;

                        this.tableDataSchool = res.data.schoolList;
                        res.data.schoolList.map(sll => {
                            if(sll.flag) {
                                this.radioId = sll.name
                                this.schoolList[0].attrText += sll.name + '，';
                                // this.tableDataSchoolFlagArr.push(sll);
                                this.schoolList[0].attrData = this.tableDataSchoolFlagArr;
                            }
                        });
                        this.schoolList[0].attrText = this.schoolList[0].attrText.substr(0, this.schoolList[0].attrText.length - 1);
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
        toggleSelection(rowArr, selected) {
            let that = this;
            that.$nextTick(function() {
                rowArr.map(sll => {
                    that.$refs.multipleTable.toggleRowSelection(sll, selected);
                })
            })
        },
        getCheckedNodes() {
            let arr = [];
            this.$nextTick(() => {
                this.$refs.tree.getCheckedNodes().map(sll => {
                    arr.push(sll);
                })
                this.tableData = arr;
                peopleArrExp.length = 0; //将common.js里的peopleArrExp数组重新重置为空
            })
        },
        getCheckedNodesExam() {
            let arr = [];
            this.$nextTick(() => {
                this.$refs.treeExam.getCheckedNodes().map(sll => {
                    arr.push(sll);
                })
                this.tableDataExam = arr;
                ExamArrExp.length = 0; //将common.js里的ExamArrExp数组重新重置为空
            })
        },
        getCheckedNodesSet() {
            let arr = [];
            this.$nextTick(() => {
                this.$refs.treeSet.getCheckedNodes().map(sll => {
                    arr.push(sll);
                })
                this.tableDataSet = arr;
                SetArrExp.length = 0; //将common.js里的SetArrExp数组重新重置为空
            })
        },
        getCheckedNodesSpread() {
            let arr = [];
            this.$nextTick(() => {
                this.$refs.treeSpread.getCheckedNodes().map(sll => {
                    arr.push(sll);
                })
                this.tableDataSpread = arr;
                SpreadArrExp.length = 0; //将common.js里的SpreadArrExp数组重新重置为空
            })
        },
        onSubmit() {
            this.onSubmitList = this.seatList[0].attrData.concat(this.backList[0].attrData, this.dataSetList[0].attrData, this.tableDataSchoolFlagArr, this.spreadList[0].attrData);
            // this.onSubmitList.push()
            this.$smoke_post(getPermissionUpdate, {
                list: this.onSubmitList,
                userUuid: this.userUuid
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '保存成功', 
                    });
                    setTimeout(() => {
                        this.$router.push({
                            path: '/base/people',
                        })
                    }, 300)
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg, 
                    });
                }
            })
        },
        editSchoolClick() {
            this.drawer0 = true;
            // this.toggleSelection(this.tableDataSchoolFlagArr, true);
        },
        editPeopleClick() {
            this.drawer1 = true;
            this.getCheckedNodes();
        },
        editBackClick() {
            this.drawer2 = true;
            this.getCheckedNodesExam();
        },
        editDataSetClick() {
            this.drawer3 = true;
            this.getCheckedNodesSet();
        },
        editSpreadClick() {
            this.drawer4 = true;
            this.getCheckedNodesSpread();
        },
        handleClose(done) {
            done();
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        filterNodeExam(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        filterNodeSet(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        filterNodeSpread(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        handleCheckChange(data, value) {
            this.getCheckedNodes();
        },
        handleCheckChangeExam(data, value){
            this.getCheckedNodesExam();
        },
        handleCheckChangeSet(data, value) {
            this.getCheckedNodesSet();
        },
        handleCheckChangeSpread(data, value) {
            this.getCheckedNodesSpread();
        },
        addPeople() {
            this.seatList[0].attrText = '';
            this.seatList[0].attrData = this.$refs.tree.getCheckedNodes();
            this.$refs.tree.getCheckedNodes().map(sll => {
                this.seatList[0].attrText += sll.name + '，'
            })
            if (this.seatList[0].attrText.length > 0) {
                this.seatList[0].attrText = this.seatList[0].attrText.substr(0, this.seatList[0].attrText.length - 1);
            }
            this.drawer1 = false;
        },
        addExam() {
            this.backList[0].attrText = '';
            this.backList[0].attrData = this.$refs.treeExam.getCheckedNodes();
            this.$refs.treeExam.getCheckedNodes().map(sll => {
                this.backList[0].attrText += sll.name + '，'
            })
            if (this.backList[0].attrText.length > 0) {
                this.backList[0].attrText = this.backList[0].attrText.substr(0, this.backList[0].attrText.length - 1);
            }
            this.drawer2 = false;
        },
        addSet() {
            this.dataSetList[0].attrText = '';
            this.dataSetList[0].attrData = this.$refs.treeSet.getCheckedNodes();
            this.$refs.treeSet.getCheckedNodes().map(sll => {
                this.dataSetList[0].attrText += sll.name + '，'
            })
            if (this.dataSetList[0].attrText.length > 0) {
                this.dataSetList[0].attrText = this.dataSetList[0].attrText.substr(0, this.dataSetList[0].attrText.length - 1);
            }
            this.drawer3 = false;
        },
        addSpread() {
            this.spreadList[0].attrText = '';
            this.spreadList[0].attrData = this.$refs.treeSpread.getCheckedNodes();
            this.$refs.treeSpread.getCheckedNodes().map(sll => {
                this.spreadList[0].attrText += sll.name + '，'
            })
            if (this.spreadList[0].attrText.length > 0) {
                this.spreadList[0].attrText = this.spreadList[0].attrText.substr(0, this.spreadList[0].attrText.length - 1);
            }
            this.drawer4 = false;
        },
        addSchool() {

            if(this.tableDataSchoolFlagArr.name) {

                this.schoolList[0].attrText = this.tableDataSchoolFlagArr.name;
                this.schoolList[0].attrData = this.tableDataSchoolFlagArr.name;
                // if (this.schoolList[0].attrText.length > 0) {
                //     this.schoolList[0].attrText = this.schoolList[0].attrText.substr(0, this.schoolList[0].attrText.length - 1);
                // }
                this.drawer0 = false;

            }else if(this.tableDataSchoolFlagArr.length == 0){
                
                this.$message({
                    type: 'error',
                    message: '分校权限不能为空', 
                });

            }else{

                this.$message({
                    type: 'error',
                    message: '分校权限是唯一选项', 
                });

            }
        },
        handleDeleteClick(row) {
            let arrKey = []; //当前人员或组织的key的集合
            let arr = []; //当前人员或组织的Nodes的集合
            arr = removeEvery(row, this.$refs.tree.getCheckedNodes());
            arr.map(sll => {
                arrKey.push(sll.uuid);
            })
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(arrKey, true);
                this.tableData = arr;
            })
        },
        handleDeleteClickExam(row) {
            let arrKey = []; //当前考试项的key的集合
            let arr = []; //当前考试项的Nodes的集合
            arr = removeEvery(row, this.$refs.treeExam.getCheckedNodes());
            arr.map(sll => {
                arrKey.push(sll.uuid);
            })
            this.$nextTick(() => {
                this.$refs.treeExam.setCheckedKeys(arrKey, true);
                this.tableDataExam = arr;
            })
        },
        handleDeleteClickSet(row) {
            let arrKey = []; //当前分配组的key的集合
            let arr = []; //当前分配组的Nodes的集合
            arr = removeEvery(row, this.$refs.treeSet.getCheckedNodes());
            arr.map(sll => {
                arrKey.push(sll.uuid);
            })
            this.$nextTick(() => {
                this.$refs.treeSet.setCheckedKeys(arrKey, true);
                this.tableDataSet = arr;
            })
        },
        handleDeleteClickSpread(row) {
            let arrKey = []; //当前分配组的key的集合
            let arr = []; //当前分配组的Nodes的集合
            arr = removeEvery(row, this.$refs.treeSpread.getCheckedNodes());
            arr.map(sll => {
                arrKey.push(sll.uuid);
            })
            this.$nextTick(() => {
                this.$refs.treeSpread.setCheckedKeys(arrKey, true);
                this.tableDataSpread = arr;
            })
        }
    },
    mounted() {
        
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
        filterTextExam(val) {
            this.$refs.treeExam.filter(val);
        },
        filterTextSet(val) {
            this.$refs.treeSet.filter(val);
        },
        filterTextSpread(val) {
            this.$refs.treeSpread.filter(val);
        },
        radioId(val){
            this.tableDataSchoolFlagArr.name = val
            let curSchool = this.tableDataSchool.find(item => {
                return item.name === val
            })
            this.tableDataSchoolFlagArr.uuid = curSchool.uuid
            this.tableDataSchoolFlagArr.type = curSchool.type
            // this.schoolList.attrText = val
            // this.schoolList.attrData = [val]
        }
    },
}
</script>

<style lang="less" scoped>

    // @media screen and (max-width: 1640px) {
    //     .tab-left-image{
    //         height: 2rem !important;
    //     }
    // }
    // @media screen and (min-width: 1920px) {
    //     .tab-left-image{
    //         height: auto !important;
    //     }
    // }

    .index-main{
        height: auto;
        .people-title{
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 15px;
            background: #F1F1F1;
            margin-bottom: .3rem;
            color: #666666;
            position: relative;
            i{
                position: absolute;
                left: 10px;
                top: 13px;
                cursor: pointer;
            }
        }
        .tab{
            height: 90%;
            .tab-xian{
                height: 1px;
                width: 100%;
                background: #E9E9E9;
            }
            .tab-left{
                background: #fff;
                min-height: calc( 100vh - 170px);
                text-align: center;
                position: relative;
                border: 1px solid #E9E9E9;
                .tab-left-title{
                    height: 54px;
                    line-height: 54px;
                    font-size: 15px;
                }
                .tab-left-image{
                    width: 100%;
                    position: absolute;
                    height: 2rem;
                    bottom: 0;
                    left: 0;
                }
            }
            .tab-right{
                background: #fff;
                min-height: calc( 100vh - 170px);
                width: calc( 75% - 20px);
                margin-left: 20px;
                border: 1px solid #E9E9E9;
                .tab-right-title{
                    height: 54px;
                    line-height: 54px;
                    font-size: 15px;
                    padding-left: 10px;
                    color: #333;
                }
            }
        }
        .note{
            height: 40px; 
            line-height: 40px; 
            color: green; 
            font-size: 14px;
        }
        .school-radio{
            border: 1px dashed #ccc;
            padding: 20px;
            margin: 20px;
            line-height: 2em;

        }
    }
    .el-pagination{
        text-align: right;
        margin-top: .4rem;
    }
    
</style>