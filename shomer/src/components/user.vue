<template >
  <v-container class="allPage">
    <v-container class="container">

      <v-layout row v-if="error">
        <v-flex sx12 sm6 offset-sm3>
          <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-card class="tranparency">
            <v-card-title primary-title>
              <h2>USER.VUE</h2>
            </v-card-title>
            <v-card-text>
                <!-- <form @submit.prevent="onSignup">

                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="firstName" label="First name" id="firstName" v-model="firstName" type="text" required>
                      </v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="lastName" label="Last name" id="lastName" v-model="lastName" type="text" required>
                      </v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="email" label="Mail" id="email" v-model="email" type="email" required>
                      </v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="password" label="Password" id="password" v-model="password" type="password" required>
                      </v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12>
                      <v-text-field name="confirmPassword" label="Confirm password" id="confirmPassword" v-model="confirmPassword" type="password" :rules="[comparePasswords]">
                      </v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12>
                      <v-btn type="submit" :disabled="loading" :loading="loading" class="orange white--text">
                        Sign up
                        <span slot="loader" class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                      </v-btn>
                    </v-flex>
                  </v-layout>

                </form> -->
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-layout justify-center>
      <h2 class="white--text mt-4" justify-center>Keep your events alive.</h2>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        email: '',
        password: '',
        confirmPassword: '',
        imageUrl: '',
        image: '',
        firstName: '',
        lastName: ''
      }
    },
    computed: {
      comparePasswords () {
        return this.password !== this.confirmPassword ? 'Password do not match' : ''
      },
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
    // watch: {
    //   user (value) {
    //     if (value !== null && value !== undefined) {
    //       console.log('dans watch du signup avant le push')
    //       this.$router.push('/userPage')
    //     }
    //   }
    // },
    methods: {
      onSignup () {
        // Vuex
        // this.$store.dispatch('signUserUp', {firstName: this.firstName, email: this.email, password: this.password, image: this.image})
        this.$store.dispatch('signUserUp', {firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password})
      },
      onDismissed () {
        this.$store.dispatch('clearError')
      }
    }
  }
</script>

<style scoped>
    .allPage{
      /* background: url('../../images/welcomeImage1.jpg') no-repeat; */
      background-size: auto 100%;
      -webkit-animation: slide 30s linear infinite;
      height: 100vh;
      width: 100vw;
    }
    @-webkit-keyframes slide {
      from { background-position: 0 0; }
      to { background-position: -650px 0; }
    }
    .container{
      margin-top: 0px;
      background-color: rgba(255, 255, 255, 0);
    }
    .tranparency {
      background-color: rgba(255, 255, 255, 0.7);
    }
    /*.container{
      margin-top: 0;
      padding: 16px;
    }*/
    .profilePic{
      border-radius: 100px;
      height: 150px;
      width: 150px;
    }

    /*This is the code to make the spinner spin*/
          .custom-loader {
            animation: loader 1s infinite;
            display: flex;
          }
          @-moz-keyframes loader {
            from {
              transform: rotate(0);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @-webkit-keyframes loader {
            from {
              transform: rotate(0);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @-o-keyframes loader {
            from {
              transform: rotate(0);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes loader {
            from {
              transform: rotate(0);
            }
            to {
              transform: rotate(360deg);
            }
          }

</style>
