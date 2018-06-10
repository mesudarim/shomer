<template >
  <v-container class="allPage">
    <form @submit.prevent="onSignUp" dark>

      <v-layout row>
        <v-flex xs12>
          <v-text-field  dark name="firstName" label="First name" id="firstName" v-model="firstName" type="text" required>
          </v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-text-field dark name="lastName" label="Last name" id="lastName" v-model="lastName" type="text" required>
          </v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-text-field dark name="phoneNumber" label="Phone number" id="phoneNumber" v-model="phoneNumber" required>
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field dark name="dateOfBirth" label="Date of birth" id="dateOfBirth" v-model="dateOfBirth" type="dateOfBirth" required>
          </v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-btn dark outline type="submit" :disabled="loading" :loading="loading" flat block>
            Sign up
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
        phoneNumber: '',
        dateOfBirth: ''
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
      onSignUp () {
        this.$store.dispatch('signUp', {firstName: this.firstName, lastName: this.lastName, phoneNumber: this.phoneNumber, dateOfBirth: this.dateOfBirth})
        this.$router.push('/userPage')
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
