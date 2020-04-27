<template>

    <div>

        <el-button type="primary" size="small" style="margin: 0 20px 20px 0;" @click="btnOk">确定</el-button>

        <el-row>

            <el-col :span="12">

                <el-input
                    placeholder="请输入姓名"
                    size="small"
                    style="margin-bottom: 10px;"
                    @keyup.enter.native="name_search"
                    v-model="name_input">
                    <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer;" @click="name_search" v-if="treeShow"></i>
                    <i slot="suffix" class="el-input__icon el-icon-close" style="cursor: pointer;" @click="name_colse" v-if="!treeShow"></i>
                </el-input>

                <el-tree
                    ref="tree"
                    :data="treeData"
                    v-show="treeShow"
                    show-checkbox
                    style="margin-left: 0px;"
                    node-key="orgUuid"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-checked-keys="defaultCheckedKeys"
                    @check="handleCheckChange"
                    :props="defaultProps">
                </el-tree>

                <el-table
                    border
                    v-show="!treeShow"
                    ref="treeTable"
                    :data="tableTreeData"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        :prop="item.props"
                        :label="item.label"
                        v-for="(item, index) in columnTreeList"
                        :key="index">
                    </el-table-column>
                </el-table>

            </el-col>

            <el-col :span="11" :offset="1">

                <el-table
                    border
                    :data="tableData"
                >

                    <el-table-column
                        :prop="item.props"
                        :label="item.label"
                        v-for="(item, index) in columnList"
                        :key="index">
                    </el-table-column>

                    <el-table-column prop="limitLimit" label="分配上限">
                        <template slot-scope="scope">
                            <el-input-number class="inputNum" v-model="scope.row.limitLimit" :min="0" size="mini" :controls="false"></el-input-number>
                        </template>
                    </el-table-column>

                </el-table>

            </el-col>

        </el-row>

    </div>

</template>

<script>
import { getRuleUserStructureLimit, addRuleUserAndLimit, getRuleUserLimit} from '../../request/api';
import { treeFunc, flagArrAll } from '../../assets/js/common';
export default {
    name: 'tree',
    props: {
        groupId: {
            type: String,
            default: ''
        },
        schoolId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            treeData: [],
            defaultProps: {
              children: 'list',
              label: 'orgName'
            },
            json: null,
            defaultExpandedKeys: [],
            defaultCheckedKeys: [],
            tableData: [],
            columnList: [
                { props: 'userName', label: '已选组员'},
                { props: 'userUin', label: '主JQ账号'},
            ],
            columnTreeList: [
                { props: 'userName', label: '已选组员'},
                { props: 'userUin', label: '主JQ账号'},
                { props: 'limitLimit', label: '分配上限'},
            ],
            uuid: '',
            name_input: '',
            treeShow: true,
            tableTreeData: [],
            toggleRowList: [],
        }
    },
    created() {
        this.getRuleUserStructureLimit();
        console.log(this.groupId);
        this.defaultExpandedKeys = this.defaultCheckedKeys = [];
    },
    methods: {
        getRuleUserStructureLimit() {
            this.$smoke_post(getRuleUserStructureLimit, {
                uuid: this.groupId,
                schoolId: this.schoolId
            }).then(res => {
                if(res.code == 200) {
                    this.json = treeFunc(res.data.list);
                    this.treeData = this.json.arr;
                    this.toggleRowList = this.defaultExpandedKeys = this.defaultCheckedKeys = this.json.flagArr;
                    console.log(this.json.flagArr);
                    this.getCheckedNodes();
                }
            })
        },
        getCheckedNodes() {
            let arr = [];
            this.$nextTick(() => {
                console.log(this.$refs.tree.getCheckedNodes());
                this.$refs.tree.getCheckedNodes().map(sll => {
                    if(sll.hasOwnProperty('userUin')){ // hasOwnProperty 判断对象是否含有某个属性
                        arr.push(sll);
                    }
                })
                this.tableData = arr;
                flagArrAll.length = 0; //将common.js里的flagArrAll数组重新重置为空
            })
        },
        handleCheckChange(data) {
            this.getCheckedNodes();
        },
        btnOk() {
            console.log(this.tableData);
            let treeDataFlag = true;
            this.tableData.map(sll => {
                if(sll.limitLimit == 0){
                    treeDataFlag = false;
                    return;
                }
            })
            if(treeDataFlag){
                this.$smoke_post(addRuleUserAndLimit, {
                    userLimitList: this.tableData,
                    uuid: this.groupId
                }).then(res => {
                    if(res.code == 200) {
                        this.$emit('childFn', false);
                        this.$emit('getDataAllocationRulesList');
                    }
                })
            }else{
                this.$message({
                    type: 'error',
                    message: '亲，分配上限值不能为0哦！'
                })
            }
        },
        name_search() {
            console.log(this.name_input);
            this.$smoke_post(getRuleUserLimit, {
                name: this.name_input,
                uuid: this.groupId
            }).then(res => {
                if(res.code == 200) {
                    this.treeShow = false;
                    this.tableTreeData = res.data;
                    
                    res.data.map(sll => {
                        this.tableData.map(ass => {
                            if(sll.flag || sll.userUuid == ass.userUuid){
                                this.$nextTick(() => {
                                    this.$refs.treeTable.toggleRowSelection(sll, true);
                                })
                            }
                        })
                    })
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg
                    })
                }
            })
        },
        name_colse() {
            this.treeShow = true;
            this.$forceUpdate();
        },
        handleSelectionChange(val) {
            console.log(val);
            // let arr = [];
            // val.map(sll => {
            //     arr.push(sll.userUuid);
            // })
            // this.$nextTick(() => {
            //     this.defaultExpandedKeys = this.defaultCheckedKeys = this.defaultCheckedKeys.concat(arr);
            //     this.getCheckedNodes();
            // })

            if(val.length == 0) {
                this.toggleRowList = [...new Set(this.toggleRowList)];
                console.log(this.toggleRowList);
                this.$nextTick(() => {
                    // this.defaultExpandedKeys = this.toggleRowList; 动态展开有问题
                    this.$refs.tree.setCheckedKeys(this.toggleRowList, true);
                    this.getCheckedNodes();
                })
            }else{
                let arr = [];
                val.map(sll => {
                    arr.push(sll.userUuid);
                })
                this.$nextTick(() => {
                    this.defaultExpandedKeys = this.defaultCheckedKeys = this.defaultCheckedKeys.concat(arr);
                    this.getCheckedNodes();
                })
            }
        }
    },
    mounted() {
        
    }
}
</script>