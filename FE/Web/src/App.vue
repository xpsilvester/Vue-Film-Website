<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";

export default {
  name: "app",
  components: {
    Header
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #fff;
    &.router-link-exact-active {
      font-weight: bold
    }
  }
}
body,
html,ul,li {
  padding: 0;
  margin: 0;
}
p{
  text-align: left
}
ul,li{
  list-style: none;
}
a{
  text-decoration: none;
}
</style>
