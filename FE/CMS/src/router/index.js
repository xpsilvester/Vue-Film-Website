import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import User from '@/components/User'
import Vip from '@/components/Vip'
import Home from '@/views/Home'
import Login from '@/views/Login'
import Register from '@/views/Register'
import cookie from 'vue-cookies'
import store from '@/store/index.js'
import VueResource from 'vue-resource'

Vue.use(VueResource)
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
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
})
router.beforeEach((to, from, next) => {
  //console.log(to);
  //console.log(from);
  
  if(to.fullPath == "/login" || to.fullPath == "/register"){
    next()
  }else if(cookie.get("CMSToken") == null){
    next('/login')
  }else if(store.state.username == ""){
    Vue.http.get('/api/users/check').then((response) => {
      if(response.data.status != 1){
        console.log(response.data)
        store.commit('setUsername',cookie.get("CMSName"))
        cookie.set("CMSToken", response.data.newToken, 2*60*60);
        next()
      }else{
        next('/login')
      }
    }).catch((error) => {
      console.log(error)
      next('/login')
    });
    next()
  }else{
    next()
  }
})
export default router
