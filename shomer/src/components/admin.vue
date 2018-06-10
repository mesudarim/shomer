<template >
  <v-container class="allPage">
    <v-container class="container">

      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-card class="tranparency">
            <v-card-title primary-title>
              <h2>Create new user</h2>
            </v-card-title>
            <v-card-text>
              <create-new-user v-if="createNewUser">
              </create-new-user>
            </v-card-text>
            <v-btn dark v-if="!createNewUser" @click="createNewUser = true">Create new user</v-btn>
            <v-btn dark v-if="createNewUser" @click="createNewUser = false">Cancel</v-btn>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        email: '',
        firstName: '',
        lastName: '',
        createNewUser: false
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          console.log('dans watch du signup avant le push')
          this.$router.push('/welcome')
        }
      }
    },
    methods: {
      // onSignup () {
      //   // Vuex
      //   // this.$store.dispatch('signUserUp', {firstName: this.firstName, email: this.email, password: this.password, image: this.image})
      //   this.$store.dispatch('signUserUp', {firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password})
      // }
    }
  }
</script>

<style scoped>
    .container{
      margin-top: 0px;
      background-color: rgba(255, 255, 255, 0);
    }
</style>
