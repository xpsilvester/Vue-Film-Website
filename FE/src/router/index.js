import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import User from '@/components/User'
import Vip from '@/components/Vip'

Vue.use(Router)

export default new Router({
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
    }
  ]
})
