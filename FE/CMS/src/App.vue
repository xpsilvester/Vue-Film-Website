<template>
  <div id="app">
    <Header :messageNum="messageNum" :userName="username" />
    <NavBar v-show="$route.name != 'login'"/>
    <router-link :to="'/user/xpsilvester'">User</router-link>
    <router-link :to="'/HelloWorld'">HelloWorld</router-link>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import NavBar from "@/components/NavBar"
import {mapSate, mapState} from "vuex"
export default {
  name: 'App',
  components:{
    Header,
    NavBar
  },
  data () {
    return {
      messageNum: 11
    }
  },
  computed:{
    ...mapState(['username'])
  },
  created () {
    // this.$http.get('/api/get').then((data) => {
    //   console.log(data.body)
    // })
    // this.$http.post('/api/post', {
    //   test: 1
    // }, {
    //   emulateJSON: true
    // }).then((data) => {
    //   console.log(data.body)
    // })
  }
}
</script>

<style lang="scss">
@import "@/scss/Common.scss";
</style>
