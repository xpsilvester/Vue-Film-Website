<template>
  <div class="register">
    <div class="box">
        <h1>用户注册</h1>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="name">
                <el-input v-model="ruleForm.name" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="usermail">
                <el-input v-model="ruleForm.usermail" placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="userphone">
                <el-input v-model="ruleForm.userphone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input show-password v-model="ruleForm.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item label="再次输入密码" prop="password2">
                <el-input show-password v-model="ruleForm.password2" placeholder="再次输入密码"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="verify">
                <el-input v-model="ruleForm.verify" placeholder="验证码">
                    <div class="verify-code" @click="refreshCode" slot="suffix">
                        <s-identify :identifyCode="identifyCode"></s-identify>
                    </div>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button style="width:100%;margin-top:20px" type="primary" @click="register(ruleForm.name,ruleForm.password,ruleForm.usermail,ruleForm.userphone)">注册</el-button>
            </el-form-item>
            <el-form-item>
                <el-button style="width:100%;" @click="toLogin">已有账号？登录</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import SIdentify from '@/components/Identify'
import { mapMutations } from 'vuex'

export default {
    name: 'Register',
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
        //验证两次密码是否一致
        const checkPassword = (rule,value,callback) => {
            if(value != this.ruleForm.password){
                callback(new Error('两次输入密码不一致，请重新输入'));
            }else{
                callback();
            }
        }
        return{
            identifyCodes: "234567890qwertyuiopasdfghjkzxcvbnm",
            identifyCode: "",
            ruleForm: {
                name: '',
                usermail: '',
                userphone: '',
                password: '',
                password2:'',
                verify: ''
            },
            //输入规则
            rules: {
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
                ],
                usermail:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' }
                ],
                userphone:[
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { min: 11, max: 11, message: '长度11位手机号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ],
                password2: [
                    { required: true, message: '请再次输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
                    { validator: checkPassword, trigger: 'blur'}
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
        register: function(username,password,usermail,userphone) {
            if(this.ruleForm.verify != this.identifyCode){
                this.toast('验证码不正确','error')
                return
            }
            this.$http.post('/api/users/register',{
                username: username,
                password: password,
                usermail: usermail,
                userphone: userphone
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
                console.log(error)
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
        toLogin: function(){
            this.$router.push({path: '/login'})
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
@import "../scss/Register.scss";
</style>