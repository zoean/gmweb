<template>
    <div class="main-area">
        
    </div>
</template>

<script>
import { urlText } from '../../assets/js/common'
export default {
    name: 'url',
    data() {
        return {
           
        }
    },
    created() {
      // console.log(this.$route.params.id);
      let href = urlText(Number(this.$route.params.id));
      window.open(href, '_blank');
    },
    methods: {
      
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .main-area{
      width: 100vw;
      text-align: center;
    }
</style>