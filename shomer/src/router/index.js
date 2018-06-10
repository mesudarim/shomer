import Vue from 'vue'
import Router from 'vue-router'
import signin from '@/components/signin'
import admin from '@/components/admin'
import user from '@/components/user'
import userPage from '@/components/userPage'
import signUp from '@/components/signUp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: admin
    },
    {
      path: '/',
      name: 'signin',
      component: signin
    },
    {
      path: '/userPage',
      name: 'userPage',
      component: userPage
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: signUp
    },
    {
      path: '/user:id',
      name: 'user',
      component: user
    }
  ]
})
