<template>

    <div>

        <el-button type="primary" size="small" style="margin: 0 20px 20px 0;" @click="btnOk">确定</el-button>

        <el-row>

            <el-col :span="12">

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
                    node-key="orgUuid"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-checked-keys="defaultCheckedKeys"
                    :filter-node-method="filterNode"
                    @check="handleCheckChange"
                    :props="defaultProps">
                    <span class="span-ellipsis" slot-scope="{ node, data }">
		                <span :title="node.label">{{ node.label }}</span>
	                </span>
                </el-tree>

            </el-col>

            <el-col :span="12" style="padding-left: 10px;">

                <el-table
                    :data="tableData"
                >

                    <el-table-column
                        :prop="item.props"
                        :label="item.label"
                        v-for="(item, index) in columnList"
                        :key="index">
                    </el-table-column>

                    <el-table-column prop="limitLimit" label="本组上限" width="100">
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
                // { props: 'userUin', label: '主JQ账号'},
                { props: 'toDayTotal', label: '今日已分'},
                { props: 'limitLimitTotal', label: '他组上限'},
            ],
            uuid: '',
            treeShow: true,
            toggleRowList: [],
            filterText: '',
        }
    },
    created() {
        this.getRuleUserStructureLimit();
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
                    this.getCheckedNodes();
                }
            })
        },
        getCheckedNodes() {
            let arr = [];
            this.$nextTick(() => {
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
            let treeDataFlag = true;
            this.tableData.map(sll => {
                if(sll.limitLimit < 0){
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
                    message: '亲，分配上限值不能小于0哦！'
                })
            }
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.orgName.indexOf(value) !== -1;
        },
    },
    mounted() {
        
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
}
</script>

<style lang="less" scoped>
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}
</style>