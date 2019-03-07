<template>
  <header>
    <nav>
      <h3>MOVIE THEATER</h3>
    </nav>
    <div class="user">
      <p>登录</p>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../scss/Header.scss";
</style>
