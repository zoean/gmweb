<template>
    <div class="callpop">
        <el-dialog 
            width="400px" 
            title="通话弹框" 
            :visible.sync="callpopFlag_" 
            :before-close="handleClose" 
            v-dialogDrag
            :modal='false'
            :close-on-click-modal="false"
        >
             
        </el-dialog>
    </div>
</template>

<script>
import { 
    
} from '../../request/api';
import { 
    timestampToTime
} from '../../assets/js/common';
import { 
    
} from '../../assets/js/data';
export default {
    name: 'callpop',
    props: {
        callpopFlag: {
          type: Boolean,
          default: false
        },
    },
    data() {
        return {
            
        }
    },
    created() {
        
    },
    methods: {
        handleClose() {
            this.$emit("changecallpopFlag", false)
        }
    },
    mounted() {
        
    },
    computed: {
        callpopFlag_:{
            get(){
                return this.callpopFlag
            },
            set(val){
                this.$emit("changecallpopFlag",val)
            }
        }
    },
}
</script>

<style lang="less" scoped>
    .callpop /deep/ div.el-dialog__header{
        border-bottom: 1px solid #cccccc;
    }
    .callpop /deep/ div.el-dialog__body{
        height: 300px;
        overflow: auto;
        padding: 10px 20px;
    }
</style>