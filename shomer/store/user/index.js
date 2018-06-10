// import * as firebase from 'firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

/* eslint-disable */
export default {
  state: {
    user: null,
    users: []
  },
  mutations: {
    removeEventFromUser(state, payload) {
      const events = state.user.events
      events.splice(events.findIndex(event => event.key === payload), 1)
      Reflect.deleteProperty(state.user.events, payload)
      // console.log('[removeEventFromUser] mutation payload', payload);
    },
    updateProfile (state, payload) {
      const user = state.users.find(user => {
        return user.id === payload.payload.id
      })
      const indexOfItem = state.users.findIndex(user => {
        return user.id === payload.payload.id
      })
      if (payload.payload.livingIn) {
        state.user.livingIn = payload.payload.livingIn
      }
      if (payload.payload.dateOfBirth) {
        state.user.dateOfBirth = payload.payload.dateOfBirth
      }
    },
    updateUser (state, payload) {
      console.log('[updateUser] check the payload', payload)
      const user = state.users.find(user => {
        return user.id === payload.id
      })
      if (user.userEvents) {
        user.userEvents = payload.userEvents
      }
      if (payload.livingIn) {
        user.livingIn = payload.livingIn
      }
      if (payload.dateOfBirth) {
        user.dateOfBirth = payload.dateOfBirth
      }
      if (payload.gender) {
        user.gender = payload.gender
      }
      if (payload.image) {
        user.image = payload.image
      }
      console.log('[updateuser] user', user);
    },
    addEventToMyEvents (state, payload) {
      // console.log('[addEventToMyEvents] mutation => payload', payload);
      state.user.events.push(payload)
      state.user.events.sort((eventA, eventB) => {
        // console.log('eventA.event.dateToRank, eventB.event.dateToRank', eventA.event.dateToRank, eventB.event.dateToRank);
        return eventA.event.dateToRank > eventB.event.dateToRank
      })
    },
    setLoadedUsers (state, payload) {
      state.users = payload
    },
    addUser (state, payload) {
      // console.log('[addUser] payload', payload);
      if (state.users.findIndex(user => user.id === payload.id) < 0) {
        state.users.push(payload)
      }
    },
    createUser (state, payload) {
      state.users.push(payload)
      console.log('in mutation create user ', payload);
    },
    setUser (state, payload) {
      state.user = payload
      console.log('payload of the state.user in the setUser', payload);
    }
  },
  actions: {

    // ***************SINGIN********************

  createUser ({commit, getters}, payload) {
    console.log('let s create a user');
    var actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: 'http://localhost:8080/',
      handleCodeInApp: true,
    }
    firebase.auth().sendSignInLinkToEmail(payload.email, actionCodeSettings)
    .then( _=> {
      console.log('The link was successfully sent');
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', payload.email);
      console.log('Save the email locally => payload.email', payload.email);

    })
    .catch( error => {
      console.log('ERROR', error);
      // Some error occurred, you can inspect the code: error.code
      console.log('[Create new user] => error', error);
    });
  },

  signUserIn ({commit}, payload) {
    console.log('[signUserIn] b4 firebase check');
    commit('setLoading', true)
    // Confirm the link is a sign-in with email link.
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      console.log('checking isSignInWithEmailLink => OK!');
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      var email = window.localStorage.getItem('emailForSignIn');
      console.log('There is an email =>', email);
      if (!email) {
        console.log('No email, we ask again from prompt');
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        // email = window.prompt('Please provide your email for confirmation');
        email = payload.email;
      }
      // The client SDK will parse the code from the link for you.
      firebase.auth().signInWithEmailLink(email, window.location.href)
        .then(function(result) {
          // Clear email from storage.
          console.log('Clear email from storage');
          window.localStorage.removeItem('emailForSignIn');
          console.log('new user via result.user', result.user);
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          console.log('result.additionalUserInfo.isNewUser', result.additionalUserInfo.isNewUser);
          // result.additionalUserInfo.isNewUser
          // commit('setUser', newUser)
          commit('setLoading', false)
        })
        .catch(function(error) {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error);
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        })
      } else {
        console.log('firebase.auth().isSignInWithEmailLink(window.location.href) NOT WORKING');
        firebase.auth().signInWithEmailLink(payload.email, window.location.href)
          .then(function(result) {
            // Clear email from storage.
            console.log('Clear email from storage');
            window.localStorage.removeItem('emailForSignIn');
            console.log('new user via result.user', result.user);
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            console.log('result.additionalUserInfo.isNewUser', result.additionalUserInfo.isNewUser);
            // result.additionalUserInfo.isNewUser
            // commit('setUser', newUser)
            commit('setLoading', false)
          })
          .catch(function(error) {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error);
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.
          })
      }
    },

    signUp ({commit, getters}, payload) {
      const db = firebase.database()
      //As we are doing a request to the web, we change the status of loading to true.
      console.log('[signUp] => payload', payload);
      console.log('[signUp] => getters.user', getters.user);
      const newUser = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNumber: payload.phoneNumber,
        email: getters.user.email,
        id: getters.user.id,
        dateOfBirth: payload.dateOfBirth
      }
      console.log('[signUp] b4 setting FB and setUser with newUser dans vuex => newUser', newUser);
      let id = getters.user.id
      db.ref('users/' + id).set(newUser)
      commit('setUser', newUser)
    },

    autoSignIn ({commit}, payload) {
      console.log('[autoSignIn] b4 setuser => payload', payload);
      commit('setUser', {
        id: payload.uid,
        email: payload.email
       })
    },

    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },



    // ***********FETCHUSERDATA************************

    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      let firstName = ''
      let email = ''
      let lastName = ''
      let dateOfBirth = ''
      let phoneNumber = ''
      // Here below we use promise to get the info one after the other and send everything to the local storage once everything has been received
      // Fetch the firstName and userImage
      firebase.database().ref('/users/' + getters.user.id).once('value')
      .then(data => {
        const userData = data.val()
        this.firstName = userData.firstName
        this.lastName = userData.lastName
        this.email = userData.email
        this.dateOfBirth = userData.dateOfBirth
        this.phoneNumber = userData.phoneNumber
      })
      .then( _=> {
        const updatedUser = {
          id: getters.user.id,
          firstName: this.firstName,
          email: this.email,
          dateOfBirth: this.dateOfBirth,
          lastName: this.lastName,
          phoneNumber: this.phoneNumber,
        }
        console.log('[fetchUserData] updatedUser b4 commit(setUser, updatedUser)', updatedUser);
        commit('setUser', updatedUser)
        commit('setLoading', false)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },

    // ****************LOADUSERS****************

    loadUsers ({commit}) {
      commit('setLoading', true)
      const db = firebase.database()
      db.ref('users').on('child_added', data => {
        // const users = []
        const userData = data.val()
        const fbKey = data.key
        const newUser = {
          id: userData.id,
          imageUrl: userData.imageUrl,
          firstName: userData.firstName,
          lastName: userData.lastName,
          fbKey: fbKey,
          userEvents: userData.userEvents
        }
        // users.push(newFriend)
        commit('addUser', newUser)
        commit('setLoading', false)
        })
    },

    // ****************Start - end shift and location ****************

    addStartShift ({commit, getters}, payload) {
      const db = firebase.database()
      let startTime = Date.now()
      let readibleStartTime = payload.readibleStartTime
      let startLocation = payload.location
      console.log('payload', payload);
      const newUserOnShift = {
        userName: getters.user.firstName,
        id: getters.user.id,
        readibleStartTime: readibleStartTime,
        startLocation: startLocation,
        startTime: startTime
      }
      console.log('newUserOnShift', newUserOnShift)
      db.ref('onShift/' + getters.user.id).set(newUserOnShift)
    },
    endShift ({commit, getters}, payload) {
      const db = firebase.database()
      let endTime = Date.now()
      let readibleEndTime = payload.readibleEndTime
      let endLocation = payload.location
      console.log('payload', payload);
      db.ref('onShift/' + getters.user.id).once('value')
        .then( data => {
          let startShiftData = data.val()
          console.log('[endShift] data =>', startShiftData)
          const newClosedShift = {
            userName: getters.user.firstName,
            id: getters.user.id,
            readibleEndTime: readibleEndTime,
            endLocation: endLocation,
            endTime: endTime,
            startTime: startShiftData.startTime,
            startLocation: startShiftData.startLocation,
            readibleStartTime: startShiftData.readibleStartTime,
          }
          db.ref('onShift/' + getters.user.id).remove()
          console.log('newUserOnShift', newClosedShift)
          db.ref('users/' + getters.user.id + '/closedShifts/').push(newClosedShift)
        })
    },
  },
  getters: {
    user (state) {
      return state.user
    },
    users (state) {
      return state.users
    },
    getUser (state) {
      return (userId) => {
        return state.users.find((user) => {
          return user.id === userId
        })
      }
    }
  }
}
