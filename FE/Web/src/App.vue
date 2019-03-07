<template>
  <div id="app">
    <Header />
    <NavBar />
    <router-view />
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import NavBar from "@/components/NavBar.vue";
export default {
  name: "app",
  components: {
    Header,
    NavBar
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
  border-left: 100px solid #383838;
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
body,html,ul,li,p,h1,h2,h3,h4,h5,h6{
  padding: 0;
  margin: 0;
  text-align: left;
}

ul,li{
  list-style: none;
}
a{
  text-decoration: none;
}
</style>
