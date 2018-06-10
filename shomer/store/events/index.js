// import * as firebase from 'firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
/* eslint-disable */
// Here we are not eporting anymore a store, it's done in the index.js of the all store, so we export a normal JS object
// export const store = new Vuex.Store({
export default {
  state: {
    events: []
  },
  mutations: {
    addEvent (state, payload) {
      // IL FAUT VOIR POURQUOI IL NE LES VOIS PAS DANS STATE.EVENTS
      if (state.events.findIndex(events => events.key === payload.key) < 0) {
        state.events.push(payload)
      }
      else {
        console.log('[addEvent] event not added as already existing');
      }
    },
    updateEventCounter (state, payload) {
      const eventData = state.events.find(event => {
        return event.key === payload.key
      })
    },
    updateEvent (state, payload) {
      const eventData = state.events.find(event => {
        return event.key === payload.key
      })
      eventData.event = payload.event
      console.log('[updateEvent] eventData', eventData);
      console.log('[updateEvent] mutation payload', payload);
    }
  },
  actions: {
    removeEventFromUser ({commit, getters}, payload) {
      const eventId = payload.key
      const user = getters.user
      commit('setLoading', true)
      // We remove the event from the user's list
      firebase.database().ref('/users/' + user.id + '/userEvents').child(payload.fbKey).remove()
      // We update the store
      commit('removeEventFromUser', eventId)
      commit('setLoading', false)
    },
    addPicture ({commit, getters}, payload) {
      let image = payload.image
      let id = payload.key
      // let id = payload.eventId
      let imageUrl = ''
      let key
      console.log('[addpicture] image', payload)
      console.log('[addpicture] image', image)
      console.log('[addpicture] id', id)
      // Below I send an empty imageUrl in order to get the key from FB
      // and then I stock the image in FB storage and then I update it to the event pictures with the real pic.
      firebase.database().ref('events/' + id + '/pictures/').push(imageUrl)
      .then((data) => {
        key = data.key
        console.log('key of the resoponse from firebase when stocking the imagge', key)
        return key
      }).then(key => {
        // I stock the event's image in FB storage
        const filename = payload.image.name
        // AS I REDRAW THE IMAGE IN CANVAS, IT WILL ALWAYS BE .PNG SO NO NEED OF THE BELOW LINE
        // const ext = filename.slice(filename.lastIndexOf('.'))
        const ext = 'png'
        return firebase.storage().ref('events/' + key + '.' + ext).put(payload.image)
      })
      .then(fileData => {
        imageUrl = fileData.metadata.downloadURLs[0]
        // to reach the specific item witht the key in the events array:
        console.log('[addPicture] imageUrl', imageUrl);
        return firebase.database().ref('events/' + id + '/pictures/' + key).update({imageUrl: imageUrl})
      }).then(() => {
        // here we commit that to my local store
        firebase.database().ref('events/' + id).once('value').then( data => {
          console.log('dans add pic retour de firebase avec le nouvel evenement', data.val())
          const updateddEvent = data.val()
          const updateddEventWithAddedPic = {
            event: updateddEvent,
            key: id
          }
          console.log('newPicture ', updateddEventWithAddedPic);
          commit('updateEvent', updateddEventWithAddedPic)
        })
      })
    },

    listenToNotifications ({commit, getters}) {
      commit('setLoading', true)
      // I listen to any new notifications received by the user.
      firebase.database().ref('users/' + getters.user.id + '/notifications/').orderByChild('dateToRank').limitToFirst(20).on('child_added', data => {
        // In order to find the data.ref_.key, I console.log the data and look into the response
        const key = data.ref_.key
        const notifData = data.val()
        var thisEvent;
        var counter;
        // var eventUserCounter;

        firebase.database().ref('/events/' + key).once('value')
        .then( data => {
          this.thisEvent = data.val()
          // this.eventUserCounter = data.child("users").numChildren()
        })
        .then( _=> {
          firebase.database().ref('users/' + getters.user.id + '/notifications/' + key + '/users/').once('value')
          .then( data => {
            // console.log('[listenToNotifications] users', data.val());
            this.counter = data.numChildren()
            // console.log('[listenToNotifications] counter', this.counter);
          })
        })
        .then( _=> {
          // HERE THE FBKEY AND KEY ARE THE SAME AS IT'S NOT PASSED IN THE NOTIFICATION OBJECT AND WE DONT NEED IT ANYWAY AS WE WONT DELETE NOTIFICATIONS
          const fbKey = data.key
          const userEvents =  getters.user.events
          // const event = data.val()
          const newNotif = {
            event: this.thisEvent,
            key: key,
            clickerName : notifData.clickerName,
            userId: notifData.userId,
            dateToRank : notifData.dateToRank,
            friendsCount : this.counter
          }
          const newEvent = {
            event: this.thisEvent,
            key: key,
            fbKey: fbKey
          }
          // I commit the new event only if it doesn't exist in the userEvents list. Otherwhise, it's done by the fetchEvents and createEvent.
          if (userEvents.findIndex(item => item.key === key) < 0) {
            // console.log('[listenToNotifications] NOT ON THE userEvents', newEvent);
            commit('addEvent', newEvent)
          }else {
            console.log('[listenToNotifications] ALREADY IN THE userEvents else *******************************');
          }
          // console.log('[listenToNotifications] newNotif', newNotif);
          commit('addNotification', newNotif)
          commit('setLoading', false)
        })
      })
    },

    listenToNotificationsChanges ({commit, getters}) {
      commit('setLoading', true)
      // I listen to any new notifications received by the user.
      firebase.database().ref('users/' + getters.user.id + '/notifications/').on('child_changed', data => {
        // In order to find the data.ref_.key, I console.log the data and look into the response
        const key = data.ref_.key
        const notifData = data.val()
        var thisEvent;
        var counter;
        // var eventUserCounter;

        firebase.database().ref('/events/' + key).once('value')
        .then( data => {
          this.thisEvent = data.val()
          // this.eventUserCounter = data.child("users").numChildren()
          console.log('[listenToNotificationsChanges] this.thisEvent', this.thisEvent);
        })
        .then( _=> {
          firebase.database().ref('users/' + getters.user.id + '/notifications/' + key + '/users/').once('value')
          .then( data => {
            this.counter = data.numChildren()
          })
        })
        .then( _ => {
          firebase.database().ref('/events/' + key).once('value')
          .then(data => {
            const fbKey = data.key
            const userEvents =  getters.user.events
            const event = data.val()
            const newNotif = {
              key: key,
              clickerName : notifData.clickerName,
              userId: notifData.userId,
              dateToRank : notifData.dateToRank,
              friendsCount : this.counter
              // eventUserCounter: this.eventUserCounter
            }

            // Here update firebase
            console.log('[listenToNotificationsChanges] newNotif avant de le faire le commit de updateNotification', newNotif);
            commit('updateNotification', newNotif)
            commit('setLoading', false)
          })
        })
      })
    },

    iwtClicked ({commit, getters}, payload) {
      console.log('[iwtClicked] notification - payload', payload);
      const key = payload.notification.key
      const userId = payload.userId
      const clickerName = payload.firstName
      console.log('[iwtClicked] clickerId', userId);
      // I push the new event key in the events array of the clicker user
      firebase.database().ref('users/' + getters.user.id + '/userEvents').push(key)
      .catch((error) => {
        console.log(error);
      })
      // Then I push the userId in the users array of the event
      firebase.database().ref('events/' + key + '/users/').push(getters.user.id)
      .catch((error) => {
        console.log(error);
      })
      // I get the friend's list of the user in order to send them notifications
      firebase.database().ref('/users/' + getters.user.id + '/friends/').once('value')
      .then(data => {
        const dataPairs = data.val()
        for (let item in dataPairs) {
          // const userId = dataPairs[item]
          const friendId = dataPairs[item]
          console.log('[iwtClicked] friendId', friendId);
          // I send notifications to each friend of the user about the clicked event
          firebase.database().ref('/users/' + friendId + '/notifications/' + key + '/users/').push(getters.user.id)
          // firebase.database().ref('/users/' + userId + '/notifications/' + key + '/users/').push(getters.user.id)
          console.log('[iwtClicked] after push userId');
          console.log('[iwtClicked] clickerName', clickerName);
          console.log('[iwtClicked] userId', userId);

          // I update the clickerId and the dateToRank
          // QUAND JE CLIQUE SUR UN USER, C'EST LA PAGE DE CELUI QUI EST LOADER QUI APPARAIT CAR IL EST COMME CA DANS FIREBASE
          firebase.database().ref('/users/' + friendId + '/notifications/' + key).update({
            clickerName: clickerName,
            userId: userId,
            dateToRank: - Date.now()
          });
        }
        commit('setLoading', false)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },

    createEvent ({commit, getters, dispatch}, payload) {
      const eventData = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        duration: payload.duration,
        creatorId: getters.user.id,
        creationDate: Date(),
        dateToRank: - payload.date.getTime()
      }
      console.log('[createEvent] eventData', eventData);
      let imageUrl
      let key
      let userEvents = []
      let users = []
      let fbKey
      //Reach out to firebase and store it
      firebase.database().ref('events/').push(eventData)
      .then((data) => {
        key = data.key
        // Here I'm getting the key of the new event created.
        // Push the new event key in the events array of the creator user
        firebase.database().ref('users/' + getters.user.id + '/userEvents').push(key)
        .then( data => {
          this.fbKey = data.key
        })
        .catch((error) => {
          console.log(error);
        })
        // Push the userId in the users array of the event
        firebase.database().ref('events/' + key + '/users/').push(getters.user.id)
        .then(() => {
          firebase.database().ref('events/' + key + '/users/').once('value')
          .then(data => {
            this.users = data.val()
            // console.log('[createEvent] data.val() de users', this.users);
            })
          })
          return key
        }).then(key => {
          // I stock the event's image in FB storage
          const filename = payload.image.name
          // const ext = filename.slice(filename.lastIndexOf('.'))
          const ext = 'png'
          return firebase.storage().ref('events/' + key + '.' + ext).put(payload.image)
        })
        .then(fileData => {
          imageUrl = fileData.metadata.downloadURLs[0]
          dispatch('addPicture', {image:payload.image, key: key})
          // to reach the specific item with the key in the events array and set the imageUrl stored above:
          // Here we set the picture as the event picture
          return firebase.database().ref('events').child(key).update({imageUrl: imageUrl})
        }).then(() => {
        // here we commit that to my local store
        const newEventData = {
          title: payload.title,
          location: payload.location,
          description: payload.description,
          date: payload.date.toISOString(),
          duration: payload.duration,
          creatorId: getters.user.id,
          creationDate: new Date(),
          imageUrl: imageUrl,
          users: this.users,
          dateToRank: - Date.now()
          // counter: 1
          }

          const newEvent = {
            event: newEventData,
            key: key,
            fbKey: this.fbKey
          }
          // I commit here in the addEvent only the events created here. The one already existing are fetched by the listenToNotifications child_added.
          commit('addEvent', newEvent)
          commit('addEventToMyEvents', newEvent)
          // I get the friend's list of the user in order to send them notifications
          firebase.database().ref('/users/' + getters.user.id + '/friends/').once('value')
          .then(data => {
            const dataPairs = data.val()
            for (let item in dataPairs) {
              const friendId = dataPairs[item]
              // I send notifications to each friend of the user on the newly created event
              firebase.database().ref('/users/' + friendId + '/notifications/' + key + '/users/').push(getters.user.id)
              // I set the clickerId and the dateToRank
              console.log('[createEvent] just b4 .set clickerName etc');
              firebase.database().ref('/users/' + friendId + '/notifications/' + key).update({
                clickerName: getters.user.firstName,
                userId: getters.user.id,
                dateToRank: - Date.now()
              });
            }
            commit('setLoading', false)
          })
        })
        .catch((error) => {
          console.log(error)
          commit('setLoading', false)
        })
      },
    },
  getters: {
    getEventData (state) {
      return (key) => {
        console.log('[getEventData] key', key);
        return state.events.find((event) => {
          // console.log('[getEventData] event', event);
          return event.key === key
        })
      }
    },
    loadedNotifications (state) {
      return state.loadedNotifications.sort((notificationA, notificationB) => {
        console.log('notificationA, notificationB', notificationA, notificationB);
        return notificationA.date < notificationB.date
      })
    }
  }
}
