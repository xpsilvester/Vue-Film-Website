<template>
  <header>
    <div class="tag"></div>
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
header {
  width: 100%;
  height: 60px;
  display: flex;
  background: #55a52e;
}
</style>
