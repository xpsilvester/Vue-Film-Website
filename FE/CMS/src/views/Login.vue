<template>
  <div class="login">
    <div class="box">
        <h1>用户登录</h1>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="name">
                <el-input v-model="ruleForm.name" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input show-password v-model="ruleForm.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="verify">
                <el-input v-model="ruleForm.verify" placeholder="验证码">
                    <div class="verify-code" @click="refreshCode" slot="suffix">
                        <s-identify :identifyCode="identifyCode"></s-identify>
                    </div>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button style="width:100%;margin-top:20px" type="primary" @click="login(ruleForm.name,ruleForm.password)">登录</el-button>
            </el-form-item>
            <el-form-item>
                <el-button style="width:100%;" @click="toRegister">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import SIdentify from '@/components/Identify'
import { mapMutations } from 'vuex'

export default {
    data(){
        //验证码判断
        const validateCode = (rule, value, callback) => {
            if(value != this.identifyCode){
                this.refreshCode()
                callback(new Error('验证码不正确'));
            }else{
                callback();
            }
        }
        return{
            identifyCodes: "234567890qwertyuiopasdfghjkzxcvbnm",
            identifyCode: "",
            ruleForm: {
                name: '',
                password: '',
                verify: ''
            },
            //输入规则
            rules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ],
                verify: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { min: 4, max: 4, message: '请输入4位验证码', trigger: 'blur' },
                    { validator: validateCode, trigger: 'blur'}
                ]
            }
        }
    },
    components: {
        SIdentify
    },
    mounted() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
    },
    methods:{
        login: function(username,password) {
            if(this.ruleForm.verify != this.identifyCode){
                this.toast('验证码不正确','error')
                return
            }
            this.$http.post('/api/users/login',{
                username: username,
                password: password
            })
            .then((response) => {
                console.log(response.data)
                if(response.data.status == 1){
                    this.toast(response.data.message,'error')
                }else{
                    this.setUsername(response.data.data.username);
                    this.$cookies.set("CMSName", response.data.data.username, 2*60*60);
                    this.$cookies.set("CMSToken", response.data.token, 2*60*60);
                    this.$router.push({path: '/'})
                }
            })
            .catch((error) => {
                //console.log(error)
                this.toast('登录错误，error：'+ error,'error')
            });
        },
        randomNum(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },
        refreshCode() {
            this.identifyCode = "";
            this.makeCode(this.identifyCodes, 4);
        },
        makeCode(o, l) {
            for (let i = 0; i < l; i++) {
                this.identifyCode += this.identifyCodes[
                this.randomNum(0, this.identifyCodes.length)
                ];
            }
            //console.log(this.identifyCode);
        },
        toast(message, toastType = "info") {
            this.$message({
                message: message,
                type: toastType,
                center: true
            });
        },
        ...mapMutations(['setUsername']),
        toRegister: function(){
            this.$router.push({path: '/register'})
        }
    },
    computed:{
        
    },
    created(){
        this.$cookies.set("CMSToken", '', 24*60*60);
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/Login.scss";
</style>