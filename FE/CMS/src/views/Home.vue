<template>
    <div class="home">
        <h1>Hello,{{ this.$store.state.username }} ,欢迎使用！</h1>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data(){
        return{
            name:''
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/Home.scss";
</style>


