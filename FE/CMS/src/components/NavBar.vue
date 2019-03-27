<template>
  <div class="navbar">
    <el-row class="tac">
      <el-col :span="12">
      <el-menu :default-active="tab" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#e1e1e1" text-color="#000" active-text-color="#409eff">
        <router-link to="/user/xpsilvester">
          <el-menu-item index="1">
            <i class="el-icon-goods"></i>
            <span>用户列表</span>
          </el-menu-item>
        </router-link>
        <router-link to="/application">
          <el-menu-item index="2">
            <i class="el-icon-document"></i>
            <span slot="title">内容列表</span>
          </el-menu-item>
        </router-link>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>设置</span>
          </template>
          <el-menu-item-group>
            <router-link to="/setting/setPosition">
              <el-menu-item index="3-1">用户设置</el-menu-item>
            </router-link>
            <router-link to="/setting/schedule">
            <el-menu-item index="3-2">内容设置</el-menu-item>
            </router-link>
            <router-link to="/setting/group">
            <el-menu-item index="3-3">评价设置</el-menu-item>
            </router-link>
            <router-link to="/setting/user">
            <el-menu-item index="3-4">用户与角色</el-menu-item>
            </router-link>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'NavBar',
  data () {
    return {
      name: '',
      tab: '1'
    }
  },
  props: {
  },
  computed: {

  },
  methods: {
    handleOpen(key, keyPath) {
        console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  mounted: function() {
    
  },
  created: function(){
    let $this = this;
    //console.log(this.$route)
    switch(this.$route.name){
      case 'position':
        $this.tab = '1';
        break;
      case 'application':
        $this.tab = '2';
        break;
      case 'setPosition':
        $this.tab = '3-1';
        break;
      case 'schedule':
        $this.tab = '3-2';
        break;
      case 'group':
        $this.tab = '3-3';
        break;
      case 'user':
        $this.tab = '3-4';
        break;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../scss/NavBar.scss";
</style>
