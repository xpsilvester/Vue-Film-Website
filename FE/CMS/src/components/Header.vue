<template>
  <div class="header">
    <router-link class="logo-content" to="/">
        <p>Vue</p>
        <p>|</p>
        <p>后台系统</p>
    </router-link>
    <div class="header-right">
      <div class="message">
        <span class="name">消息</span>
        <span class="num">{{messageNum}}</span>
      </div>
      <div class="user">Hi,{{userName}}</div>
      <div class="login" @click="login">{{userName == "" ? "登录" : "退出"}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      name: ''
    }
  },
  props: {
    messageNum: Number,
    userName: String
  },
  computed: {

  },
  methods: {
    login:function() {
      this.$router.push({path:'/login'})
    }
  },
  mounted() {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../scss/Header.scss";
</style>
