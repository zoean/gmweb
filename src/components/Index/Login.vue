<template>
    <div>
        <div class="login-bg"></div>
        <div class="login-contain">
            <el-image :src="require('../../assets/images/logo_Name_A.png')" fit="fit"></el-image>
            <div class="contain-model">

                <div class="contain-title">欢迎登录</div>

                <el-input class="user" v-model="accountNumber" size="medium" placeholder="请输入账号" prefix-icon="el-icon-user"></el-input>
                <el-input class="lock" v-model="password" size="medium" placeholder="请输入密码" show-password prefix-icon="el-icon-lock"></el-input>
                <el-button type="primary" class="login-btn" size="medium" @click="login" @keyup.enter="login" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>

                <div class="contain-forget" @click="forget_password">忘记密码</div>

            </div>
        </div>
    </div>
</template>

<script>
import { login, getUserLoginMessage } from '../../request/api';
export default {	
	// metaInfo: {
  //       title: '登录',
  //       meta: [
  //           {
  //               name: 'viewport', content: ''
  //           }
  //       ]
  //   },    
    data() {
        return {
            accountNumber: '',
            password: '',
            fullscreenLoading: false,
            isDisable: true
        }
    },
    created() {
        var _self = this;
        document.onkeydown = function(e){
            if(window.event == undefined){
                var key = e.keyCode;
            }else{
                var key = window.event.keyCode;
            }
            if(key == 13){
                _self.login();
            }
        }
    },
    methods: {
        login() {
            if( !this.accountNumber || !this.password){
                this.$message({
                    type: 'error',
                    message: '亲，账号密码不能为空哦！'
                })
            }else{
                this.fullscreenLoading = true;
                if(this.isDisable) {
                    this.isDisable = false;
                    this.$smoke_post(login, {
                        accountNumber: this.accountNumber,
                        password: this.password
                    }).then(res => {
                        if(res.code == 200){
                            this.$store.dispatch('actionsSetCommonFlag', true);                        
                            localStorage.setItem("jhToken", res.data.token);
                            this.getUserLoginMessage();
                            document.onkeydown = undefined;
                            setTimeout(() => {
                                this.fullscreenLoading = false;
                                this.$router.push({ path: '/'});
                            }, 2500);
    
                        }else{
                            setTimeout(() => {
                                this.fullscreenLoading = false;
                                this.isDisable = true;
                                this.$message({
                                    type: 'error',
                                    message: res.msg
                                })
                            }, 2000);
                        }
                    })
                }
            }
        },
        // 将用户菜单缓存到本地
        getUserLoginMessage() {
            this.$smoke_post(getUserLoginMessage,{}).then(res => {
                if(res.code == 200) {
                    localStorage.setItem("userMenuList", JSON.stringify(res.data.userMenuList));
                    localStorage.setItem("buttonMap", JSON.stringify(res.data.buttonMap));
                    localStorage.setItem("userUuid", res.data.uuid);
                    this.$store.commit('setUserRole', res.data.roleName)
                    this.$store.commit('setUserDepartment', res.data.orgName)
                }
            })
        },
        forget_password() {
            this.$router.push({
                path: '/forget'
            })
        }
    },
    mounted() {
        
    }
}
</script>

<style scoped lang="less">

/* // @media screen and (max-width: 1200px) {
//     .login-contain{
//         width: 10rem !important;
//         height: 10rem !important;
//         left: 50% !important;
//         top: 35% !important;
//         margin-left: -5rem;
//         .login-text{
//             font-size: 1rem !important;
//             margin-bottom: 1.5rem !important;
//         }
//     }
// } */
.login-bg{
    position:fixed;
    top: 0;
    left: 0;
    width:100%;
    height:100%;
    min-width: 1000px;
    z-index:-10;
    zoom: 1;
    background-color: #fff;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background: url("../../assets/images/login_bg.png") no-repeat center;
}
.login-contain{
    background: url("../../assets/images/login_contain.png") no-repeat center;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
    border-radius: 10px;
		position: absolute;
		width: 800px;
		height: 514px;
    /* width: 10rem;
    height: 6.4rem; */
    z-index: 999;
    margin-left: -400px;
    left: 50%;
    top: 50%;
		margin-top: 1.3rem;
		.el-image{
			width: 200px;
			top:100px;
			left: 60px;
		}
    .contain-model{
        width: 250px;
        height: 250px;
        position: absolute;
        top: 170px;
        left: 102px;
        .contain-title{
            font-size: 18px;
            color: #409EFF;
        }
        .login-btn{
            width: 100%;
            letter-spacing: .2rem;
            padding-left: .4rem;
            margin-top: .14rem;
            // position: absolute;
            // bottom: 0;
            // left: 0;
        }
        .el-input{
            font-size: 13px;
        }
        .user{
            margin-top: .5rem;
        }
        .lock{
            margin-top: .14rem;
        }
        .contain-forget{
            float: right;
            color: #999;
            cursor: pointer;
            margin-top: 10px;
        }
    }
}

@media screen and (max-width: 1440px){
	.login-contain{
		width: 800px;
		height: 514px;
		.el-image{
			width: 200px;
			top: 100px;
			left: 60px;
		}
		.contain-model{
			width: 250px;
			height: 250px;
			left: 102px;
			top: 170px;
		}
	}
}
@media screen and (max-width: 1280px){
	.login-contain{
		width: 720px;
		height: 463px;
		margin-left: -360px;
		.el-image{
			width: 200px;
			top: 100px;
			left: 38px;
		}
		.contain-model{
			width: 230px;
			height: 230px;
			left: 86px;
			top: 160px;
		}		
	}

}
@media screen and (max-width: 1024px){
	.login-contain{
		width: 640px;
		height: 411px;
		margin-left: -320px;
		.el-image{
			width: 180px;
			top: 80px;
			left: 36px;
		}
		.contain-model{
			width: 200px;
			height: 200px;
			left: 76px;
			top: 140px;
		}		
	}

}
@media (max-width: 991px){
	.login-contain{
		width: 640px;
		height: 411px;
		margin-left: -320px;
		margin-top: 120px;
		.el-image{
			width: 180px;
			top: 80px;
			left: 36px;
		}
		.contain-model{
			width: 200px;
			height: 200px;
			left: 76px;
			top: 140px;
		}		
	}
}
@media (max-width: 800px){
	.login-contain{
		width: 640px;
		height: 411px;
		margin-left: -320px;
		margin-top: 110px;
		.el-image{
			width: 180px;
			top: 80px;
			left: 36px;
		}
		.contain-model{
			width: 200px;
			height: 200px;
			left: 76px;
			top: 140px;
		}		
	}

}
@media (max-width: 768px){
	.login-contain{
		width: 640px;
		height: 411px;
		margin-left: -320px;
		margin-top: 120px;
		.el-image{
			width: 180px;
			top: 80px;
			left: 36px;
		}
		.contain-model{
			width: 200px;
			height: 200px;
			left: 76px;
			top: 140px;
		}		
	}

}
@media (max-width: 568px){
	.login-contain{
		width: 500px;
		height: 321px;
		margin-left: -250px;
		margin-top: 160px;
		.el-image{
			width: 140px;
			top: 60px;
			left: 30px;
		}
		.contain-model{
			width: 160px;
			height: 160px;
			left: 56px;
			top: 100px;
			.contain-title{
				font-size: 14px;
			}
			.el-input--medium .el-input__inner{
				height: 22px;
				line-height: 22px;
				color: #000;
			}
		}		
	}
}
@media (max-width: 480px){
	.login-contain{
		width: 400px;
		height: 257px;
		margin-left: -200px;
		margin-top: 160px;
		.el-image{
			width: 110px;
			top: 40px;
			left: 20px;
		}
		.contain-model{
			width: 130px;
			height: 130px;
			left: 40px;
			top: 66px;
			.contain-title{
				font-size: 12px;
			}
			.el-input{
				/deep/.el-input--medium .el-input__inner,.el-input--medium .el-input__icon{
					height: 20px;
					line-height: 20px;
				}
			}
			
		}		
	}
}
@media (max-device-width: 414px){
	.login-bg{
		background: url(../../assets/images/login_bg_mobile.png) center;
	}
	.login-contain{
		width: 900px;
		height: 579px;
		margin-left: -450px;
		margin-top: 400px;
		.el-image{
			width: 220px;
			top: 80px;
			left: 60px;
		}
		.contain-model{
			width: 260px;
			height: 260px;
			left: 80px;
			top: 160px;
			.contain-title{
				font-size: 18px;
			}
			.el-input{
				margin-bottom: 10px;
				/deep/.el-input--medium .el-input__inner,.el-input--medium .el-input__icon{
					height: 36px;
					line-height: 36px;
				}
			}
			
		}		
	}
}
</style>