// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// eslint-disable-next-line
import { store } from '../store'
// import * as firebase from 'firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import AlertCmp from './components/shared/alert.vue'
import CreateNewUser from './components/createNewUser.vue'

import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  VCard,
  VTextField,
  VAlert,
  VProgressCircular
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    VCard,
    VTextField,
    VAlert,
    VProgressCircular
  },
  theme: {
    // primary: '#ee44aa',
    primary: '#ffffff',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    grey: '#D3D3D3'
  }
})
Vue.component('app-alert', AlertCmp)
Vue.component('create-new-user', CreateNewUser)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyCEWFvfxxCgKJWar68SHN_HapmxJiWE4r0',
      authDomain: 'shomer-52bf5.firebaseapp.com',
      databaseURL: 'https://shomer-52bf5.firebaseio.com',
      projectId: 'shomer-52bf5',
      // the below link address is from firebase storage
      storageBucket: 'gs://shomer-52bf5.appspot.com',
      messagingSenderId: '866508655722'
    })
    // console.log('should load it now')
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('[main.js] user', user)
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
    })
  }
})
