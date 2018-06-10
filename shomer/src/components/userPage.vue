<template >
  <v-container dark>
    <p class="userName" right>{{ user.firstName }} שלום</p>
    <!-- <v-card dark style="height: 150px" class="mb-2"> -->
      <!-- <p v-text="timeNow"></p> -->
      <p :timeNow="timeNow" class="time mb-5 pb-3">{{ time }}</p>
    <!-- </v-card> -->
    <v-btn dark class="green" block v-if="loggedOut && !shiftEnded" @click="checkIn">תחילת משמרת</v-btn>
    <v-btn dark class="orange" block v-if="!loggedOut && shiftStarted" @click="checkOut">סיום משמרת</v-btn>
    <v-btn dark class="red" block v-if="shiftEnded" @click="reset">Reset</v-btn></v-btn>
    <v-card dark style="height: 88px" v-if="shiftStarted" class="mb-2">
      <p dark class="hebrewText">תחילת משמרת</p>
      <p class="startTime">{{ startTime }}</p>
    </v-card>
    <v-card dark style="height: 88px" v-if="shiftEnded">
      <p dark class="hebrewText">סיום משמרת</p>
      <p class="startTime">{{ endTime }}</p>
    </v-card>
    <v-layout row>
        <v-flex xs12 class="text-xs-center">
          <v-progress-circular indeterminate color="yellow" :width="1" :size="80" v-if="loading" class="mt-5"></v-progress-circular>
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
  export default {
    data () {
      return {
        loggedOut: true,
        time: '',
        date: 'date',
        startTime: '',
        endTime: '',
        shiftStarted: false,
        shiftEnded: false,
        searchingForLocation: false,
        fetchedLocation: {lat: 0, lng: 0},
        loading: false
      }
    },
    computed: {
      user () {
        console.log('[computed user] => user', this.$store.getters.user)
        return this.$store.getters.user
      },
      // loading () {
      //   return this.$store.getters.loading
      // },
      timeNow () {
        return setInterval(_ => {
          let d = new Date()
          this.time = d.toLocaleTimeString('he')
        }, 1000)
      }
    },
    methods: {
      checkIn () {
        console.log('[computed user] => user', this.$store.getters.user)
        this.loggedOut = false
        let d = new Date()
        this.startTime = d.toLocaleTimeString('he')
        this.loading = true
        // ///////////////// GET LOCATION ////////////////////////////////

        console.log('getLocation')
        if (!navigator.geolocation) {
          console.log('no geolocation in browser')
          return
        }
        // console.log('after if navigator');
        let sawAlert = false
        // We hide the button and show the spinner
        this.searchingForLocation = true
        // console.log('just before navigator.geolocation.getCurrentPosition');
        setTimeout(_ => {
          this.searchingForLocation = false
          if (sawAlert === false && this.fetchedLocation === {lat: 0, lng: 0}) {
            console.log('should show the alert')
            alert('Couldn\'t load location, please try again')
            sawAlert = true
            console.log('[getLocation] this.fetchedLocation in the setTimeout', this.fetchedLocation)
            this.loading = false
          } else {
            console.log('[getLocation] this.fetchedLocation in the setTimeout ELSE!!!', this.fetchedLocation)
            this.$store.dispatch('addStartShift', {readibleStartTime: this.startTime, location: this.fetchedLocation})
            this.shiftStarted = true
            this.loading = false
          }
        }, 5000)
        navigator.geolocation.getCurrentPosition(position => {
          console.log('in navigator.geolocation.getCurrentPosition')
          this.fetchedLocation = {lat: position.coords.latitude, lng: position.coords.longitude}
          console.log('[getLocation] this.fetchedLocation', this.fetchedLocation)
          this.lat = position.coords.latitude
          this.lon = position.coords.longitude
          var geocoder = new google.maps.Geocoder()
          let myPlace = new google.maps.LatLng(this.lat, this.lon)
          let geopos = `${this.lat},${this.lon}`
          let latlngStr = geopos.split(',', 2)
          var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])}
          console.log('latlng =>', latlng)
          geocoder.geocode({'location': latlng}, (results, status) => {
            console.log('results ', results)
            // this.address = {
            //   administrative_area_level_1: results[4].address_components["0"].long_name,
            //   country: results[4].address_components[1].long_name,
            //   latitude: this.lat,
            //   longitude: this.lon,
            //   locality: results["0"].address_components[1].long_name,
            //   route: results["0"].address_components["0"].long_name,
            //   street_number: results["0"].address_components["0"].long_name
            // }
            this.address = {
              latitude: this.lat,
              longitude: this.lon
            }
            console.log('[this address nvo object]', this.address)
          })
          this.searchingForLocation = false
        })
      },
      checkOut () {
        this.loading = true

        let d = new Date()
        this.endTime = d.toLocaleTimeString('he')

        // ///////////////// GET LOCATION ////////////////////////////////

        console.log('getLocation')
        if (!navigator.geolocation) {
          console.log('no geolocation in browser')
          return
        }
        // console.log('after if navigator');
        let sawAlert = false
        // We hide the button and show the spinner
        this.searchingForLocation = true
        // console.log('just before navigator.geolocation.getCurrentPosition');
        setTimeout(_ => {
          this.searchingForLocation = false
          if (sawAlert === false && this.fetchedLocation === {lat: 0, lng: 0}) {
            console.log('should show the alert')
            alert('Couldn\'t load location, please try again')
            sawAlert = true
            console.log('[getLocation] this.fetchedLocation in the setTimeout', this.fetchedLocation)
            this.loading = false
          } else {
            console.log('[getLocation] this.fetchedLocation in the setTimeout ELSE!!!', this.fetchedLocation)
            this.$store.dispatch('endShift', {readibleEndTime: this.endTime, location: this.fetchedLocation})
            this.loading = false
            this.loggedOut = true
            this.shiftEnded = true
          }
        }, 5000)
        navigator.geolocation.getCurrentPosition(position => {
          console.log('in navigator.geolocation.getCurrentPosition')
          this.fetchedLocation = {lat: position.coords.latitude, lng: position.coords.longitude}
          console.log('[getLocation] this.fetchedLocation', this.fetchedLocation)
          this.lat = position.coords.latitude
          this.lon = position.coords.longitude
          var geocoder = new google.maps.Geocoder()
          let myPlace = new google.maps.LatLng(this.lat, this.lon)
          let geopos = `${this.lat},${this.lon}`
          let latlngStr = geopos.split(',', 2)
          var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])}
          console.log('latlng =>', latlng)
          geocoder.geocode({'location': latlng}, (results, status) => {
            console.log('results ', results)
            // this.address = {
            //   administrative_area_level_1: results[4].address_components["0"].long_name,
            //   country: results[4].address_components[1].long_name,
            //   latitude: this.lat,
            //   longitude: this.lon,
            //   locality: results["0"].address_components[1].long_name,
            //   route: results["0"].address_components["0"].long_name,
            //   street_number: results["0"].address_components["0"].long_name
            // }
            this.address = {
              latitude: this.lat,
              longitude: this.lon
            }
            console.log('[this address nvo object]', this.address)
          })
          this.searchingForLocation = false
        })

      },
      reset () {
        this.shiftEnded = false
        this.shiftStarted = false
      }
    }
  }
</script>

<style scoped>
.userName{
  font-size: 25px;
  text-align: right;
  color: #daf6ff;
  text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0);
}
.time {
    letter-spacing: 0.05em;
    font-size: 50px;
    padding: 5px 0;
    font-family: 'Inconsolata', monospace;
    color: #ffffff;
    text-align: center;
    position: relative;
    left: 50%;
    margin-top: 50px;
    top: 80px;
    transform: translate(-50%, -50%);
    color: #daf6ff;
    text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0);
  }
  .startTime {
    letter-spacing: 0.05em;
    font-size: 40px;
    padding: 5px 0;
    font-family: 'Inconsolata', monospace;
    color: #ffffff;
    text-align: center;
    position: relative;
    left: 50%;
    margin-top: 50px;
    top: -24px;
    transform: translate(-50%, -50%);
    color: #daf6ff;
    text-shadow: 0 0 20px rgba(10, 175, 230, 1),  0 0 20px rgba(10, 175, 230, 0);
  }
  .hebrewText{
    text-align: right;
    font-size: 15px;
    padding-right: 5px;
    color: #daf6ff;
  }

</style>
