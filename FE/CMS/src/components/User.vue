<template>
  <div class="user">
    <p>Hello {{ $route.params.id }}</p>
  </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    return {
      tableData: Array(20).fill(item),
      show: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../scss/User.scss";
</style>
