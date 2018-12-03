<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.$http.get('/api/get').then((data) => {
      console.log(data.body)
    })
    this.$http.post('/api/post', {
      test: 1
    }, {
      emulateJSON: true
    }).then((data) => {
      console.log(data.body)
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
