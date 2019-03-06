<template>
  <header>
    <nav>
      <router-link :class="this.$route.name == 'home' ? 'active' : ''" to="/">首页</router-link> |
      <router-link :class="this.$route.name == 'onlineVideo' ? 'active' : ''" to="/onlineVideo">在线视频</router-link> |
      <router-link :class="this.$route.name == 'about' ? 'active' : ''" to="/about">关于</router-link>
    </nav>
    <div class="user">
      <p>登录</p>
    </div>
  </header>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../scss/Header.scss";
</style>
