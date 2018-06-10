<template >
<v-container class="allPage">
  <v-container class="container">

    <v-layout row>
      <v-flex xs12 sm6 offset-sm3 >
        <v-card class="black">
          <v-card-media src="../static/img/HaShomerWhite.png" height="120px"></v-card-media>
          <v-card-title primary-title class="grey--text"></v-card-title>
          <v-card-text>
              <form @submit.prevent="onSignin">

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="email" dark label="Mail" id="email" v-model="email" type="email" required class="grey--text"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-btn block type="submit" :disabled="loading" :loading="loading" outline class="grey grey--text">
                      Sign In
                      <span slot="loader" class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>

              </form>
          </v-card-text>
        </v-card>
        <v-layout row v-if="error">
          <v-flex sx12 sm6 offset-sm3>
            <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
          </v-flex>
        </v-layout>
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
        password: ''
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
    watch: {
      user (value) {
        if (value !== null && value !== undefined) {
          if (this.user.firstName) {
            console.log('[watch user] YES user.uid => user', this.user)
            this.$router.push('/userPage')
          } else {
            this.$router.push('/signUp')
            console.log('[watch user] no user.uid => user', this.user)
          }
        }
      }
    },
    methods: {
      onSignin () {
        console.log('onSignin clicked this.email =>', this.email)
        this.$store.dispatch('signUserIn', {email: this.email})
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
    .container{
      margin-top: 0px;
      padding: 8px;
      background-color: rgba(255, 255, 255, 0);
    }
    .black {
      background-color: rgb(0, 0, 0);
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
