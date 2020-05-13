<template>
<div>
  <el-dialog class="field-manage" :visible.sync="editFieldVisible" title="编辑字段" :close-on-click-modal="false" @close="cancleEditField">
    <p>拖拽表格数据行即可对字段进行排序</p>
    <el-table ref="curFieldTable" :data="curFieldList" class="field-table" @selection-change="handleSelectionChange"  :row-key="getRowKey">
      <el-table-column
        type="selection"
        width="55" :reserve-selection="true" :selectable="checkboxT" disabled>
      </el-table-column>
      <el-table-column v-for="(item,index) in curFieldColumn" :key="index" :prop="item.prop" :label="item.label"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancleEditField">取 消</el-button>
        <el-button type="primary" @click="editFieldSubmit">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { mapState} from 'vuex'
import {updateListField, getListField} from '@/request/api'
import Sortable from 'sortablejs'
export default {
  name: 'PageFieldManage',
  props:{
    setPageNum:{
      type:Function,
      default:null
    },
  },
  data(){
    return {
      curFieldColumn: [
        {
          label: '字段编号',prop: 'num'
        },
        {
          label:'字段名称', prop: 'label',
        }
        // {
        //   label: '字段排序', prop: 'sortNum'
        // }
      ],
      curFieldList: [],
      updateFieldArray: []
    }
  },
  computed: {
    ...mapState([
      'editFieldVisible',
      'pageNum'
    ])
  },
  mounted(){
    let userMenuList = JSON.parse(localStorage.getItem('userMenuList'))
    this.filterPageNum(userMenuList)
  },
  watch: {
    editFieldVisible(val){
      if(val){
        this.getListField()
      }
    }
  },
  methods:{
    filterPageNum(obj){
        if(obj && obj.length > 0){
            obj.map(subObj => {
            if(subObj.url == this.$route.path){
                this.$store.commit('setPageNum', subObj.pageNum)
                this.setPageNum(subObj.pageNum)
            }else if(subObj && subObj.includeSubsetList){
                this.filterPageNum(subObj.includeSubsetList)
            }
            })
        }
    },
    getListField(){
        this.$smoke_post(getListField, {num: this.pageNum}).then( res => {
          if(res.code == 200){
            this.curFieldList = res.data
            if(this.curFieldList && this.curFieldList.length > 0){
              this.curFieldList.forEach((item, index) => {
                if(item && item.flag){
                  this.$nextTick(() => {
                    this.$refs['curFieldTable'].toggleRowSelection(this.curFieldList[index], true)
                  })
                }
              }) 
            }
            this.rowDrop()
          }
        })
      },
    rowDrop(){
      const el = document.querySelectorAll('.field-table>.el-table__body-wrapper > table > tbody')[0]
      Sortable.create(el, {
          disabled: false,
          onEnd: (evt) => {
              const tempItem = this.curFieldList.splice(evt.oldIndex, 1)[0]
              this.curFieldList.splice(evt.newIndex, 0, tempItem)
              var newArray = this.curFieldList.slice(0)
              this.curFieldList = [];
              this.$nextTick(() => {
                  this.curFieldList = newArray;
              });
          }
      })
    },
    getRowKey(row){
      return row.num
    },
    handleSelectionChange(row) {//监听selection选择事件
      this.fieldNum = []
      for(let i in row){//去重以免发生意外的push
        if(!this.fieldNum.includes(row[i].num)){
          this.fieldNum.push(row[i].num)
        }  		
      }
    },
    checkboxT(row){
      if(row.ifDef){
        return false
      }else{
        return true
      }
    },
    cancleEditField(){
      this.$store.commit('setEditFieldVisible', false)
    },
    editFieldSubmit(){
        let selectionRows = this.$refs['curFieldTable'].store.states.selection
        this.updateFieldArray = []
        this.curFieldList.map(item => {
          selectionRows.map(row => {
            if(item.num == row.num){
              this.updateFieldArray.push(item.num)
            }
          })
        })
        this.$smoke_post(updateListField, {num: this.$store.state.pageNum, fieldList: this.updateFieldArray}).then(res => {
          if(res.code == 200){
            this.$message({
                type: 'success',
                message: '字段配置成功'
            })
            this.$store.commit('setEditFieldVisible', false)
            window.location.reload()
            // this.getClueDataAll()
          }
        })
      },
  }
}
</script>
<style lang="less" scoped>           
 
  .field-manage /deep/ div.el-dialog__body{
      height: 50vh;
      overflow: auto;
  }
</style>