<template>
    <nav>
      <router-link :class="this.$route.name == 'home' ? 'active' : ''" to="/"><i class="home"></i></router-link>
      <router-link :class="this.$route.name == 'onlineVideo' ? 'active' : ''" to="/onlineVideo"><i class="video"></i></router-link>
      <router-link :class="this.$route.name == 'about' ? 'active' : ''" to="/about"><i class="about"></i></router-link>
    </nav>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../scss/NavBar.scss";
</style>
