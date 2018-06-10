<template >
  <v-container class="allPage">
    <form @submit.prevent="onCreateUser">

      <v-layout row>
        <v-flex xs12>
          <v-text-field name="email" label="Mail" id="email" v-model="email" type="email" required>
          </v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-btn type="submit" :disabled="loading" :loading="loading" class="orange white--text">
            Send invitation to new user
            <span slot="loader" class="custom-loader">
              <v-icon light>cached</v-icon>
            </span>
          </v-btn>
        </v-flex>
      </v-layout>
    </form>
  </v-container>
</template>


<script>
  export default {
    data () {
      return {
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
      }
    },
    computed: {
      user () {
        return this.$store.getters.user
      },
      error () {
        return this.$store.getters.error
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onCreateUser () {
        // Vuex
        // this.$store.dispatch('signUserUp', {firstName: this.firstName, email: this.email, password: this.password, image: this.image})
        this.$store.dispatch('createUser', {firstName: this.firstName, lastName: this.lastName, email: this.email, phoneNumber: this.phoneNumber})
      }
    }
  }
</script>

<style scoped>
    .container{
      margin-top: 0px;
      background-color: rgba(255, 255, 255, 0);
    }

</style>
