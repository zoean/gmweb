<template>
    
    <div>

        

    </div>

</template>

<script>
import { 
    
} from '../../request/api';
import pcaa from 'area-data/pcaa';
import { 

} from '../../assets/js/common';
import { 

} from '../../assets/js/data';
export default {
    name: 'customerNotes',
    props: {
        followFlag: {
            type: Boolean,
            default: false
        },
        drawer: {
            type: Boolean,
            default: false
        },
        userUuid: {
            type: String,
            default: ''
        },
        clueDataSUuid: {
            type: String,
            default: ''
        },
        callLogUuid: {
            type: String,
            default: ''
        },
        comMode: {
            type: String,
            default: ''
        },
        schoolId: {
            type: String,
            default: ''
        },
        examItem: {
            type: String,
            default: ''
        },
        userCDARUuid: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            
        }
    },
    created() {
        
    },
    methods: {
        
    },
    mounted() {
        
    },
    computed: {
        drawer_:{
            get(){
                return this.drawer
            },
            set(val){
                this.$emit("changeDrawer",val)
            }
        }
    },
}
</script>
<style lang="less">
.el-autocomplete-suggestion{
    width: auto !important;
}
</style>
<style lang="less" scoped>
.el-pagination{
    text-align: right;
    margin-top: .4rem;
    margin-right: .4rem;
}
/deep/ .el-autocomplete{
    width: 200px;
}
</style>