<template>
    <div class="main-area">
        <el-upload
            class="avatar-uploader"
            :data='uploadData'
            action="https://gm.jhwx.com/api/knowledgeSystem/knowExcel/readExcelSubject"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus avatar-uploader-icon" style="font-size: 2rem;"></i>
        </el-upload>
    </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {
            uploadData: {
                subjectUuid: 'e66b5d501fc447a6a8ebbfbeb1a12cee',
                subjectName: '技能实训'
            },
        }
    },
    created() {
        
    },
    methods: {
        handleAvatarSuccess(res, file) {
            let str = '';
            if(res.code == 200) {
                if(res.data.length == 0){
                    this.$notify({
                        title: '成功',
                        message: '上传成功',
                        type: 'success'
                    });
                }else{
                    res.data.map(sll => {
                        str = str + sll + '\n';
                    })
                    this.$notify.error({
                        title: '失败',
                        message: str,
                        duration: 0
                    });
                }
            }else{
                this.$notify.error({
                    title: '失败',
                    message: '上传失败',
                });
            }
        },
        beforeAvatarUpload(file) {
            // console.log(file);
        },
    },
    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
    .main-area{
        width: 100vw;
    }
</style>
