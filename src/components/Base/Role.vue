<template>
    <div class="main-area">
        role
    </div>
</template>

<script>
import { getRoleGroupList } from '../../request/api';
export default {
    name: 'role',
    data() {
        return {
           
        }
    },
    created() {
        this.getRoleGroupList();
    },
    methods: {
        getRoleGroupList() {
            this.$smoke_get(getRoleGroupList, {}).then(res => {
                console.log(res);

            })
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .main-area{
        width: calc( 100vw - 3.65rem );
    }
</style>