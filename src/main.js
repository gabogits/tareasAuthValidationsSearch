import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)


import App from './App.vue'
import router from './router'
import store from './store'
// Firebase App is always required and must be first
var firebase = require("firebase/app");


// Add additional services that you want to use
require("firebase/auth");
//require("firebase/database");
require("firebase/firestore");
//require("firebase/messaging");
//require("firebase/functions");

var config = {
    apiKey: "AIzaSyBuUZK4uTV5rFC06QKHxFnxpTSFbwXGyP0",
    authDomain: "crud-udemy-407d7.firebaseapp.com",
    databaseURL: "https://crud-udemy-407d7.firebaseio.com",
    projectId: "crud-udemy-407d7",
    storageBucket: "crud-udemy-407d7.appspot.com",
    messagingSenderId: "685526787453"
};
const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings({ timestampsInSnapshots: true });

export default firebaseApp.firestore();


Vue.config.productionTip = false

firebase.auth().onAuthStateChanged((user) => {
    console.log(user);
    if (user) {
        store.dispatch('detectarUsuario', { email: user.email, uid: user.uid })
    } else {
        store.dispatch('detectarUsuario', null)
    }
    new Vue({ //se metio la creación de la instacia de vio en este metod de firebase onAuthStateChanged, para que no se cree la instacia, si no hasta saber si un usuario esta logueado o no
        router,
        store,
        render: h => h(App)
    }).$mount('#app')
})