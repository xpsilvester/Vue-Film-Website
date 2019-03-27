import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import User from '@/components/User'
import Vip from '@/components/Vip'
import Home from '@/views/Home'
import Login from '@/views/Login'
import cookie from 'vue-cookies'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/user/:id',
      name: 'User',
      component: User,
      children: [
        {
          path: 'vip',
          name: Vip,
          component: Vip
        }
      ]
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
router.beforeEach((to, from, next) => {
  //console.log(to);
  //console.log(from);
  
  if(to.fullPath == "/login"){
    next()
  }else if(cookie.get("CMSToken") == null){
    next('/login')
  }else{
    next()
  }
})
export default router
