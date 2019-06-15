import Vue from 'vue'
import Router from 'vue-router'
var firebase = require("firebase/app");

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/ingreso',
            name: 'ingreso',
            component: () =>
                import ( /* webpackChunkName: "Ingreso" */ './views/Ingreso.vue')
        },
        {
            path: '/registro',
            name: 'registro',
            component: () =>
                import ( /* webpackChunkName: "Registro" */ './views/Registro.vue'),

        },
        {
            path: '/',
            name: 'inicio',
            component: () =>
                import ( /* webpackChunkName: "Inicio" */ './views/Inicio.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/editar/:id',
            name: 'editar',
            component: () =>
                import ( /* webpackChunkName: "editar" */ './views/Editar.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/agregar',
            name: 'agregar',
            component: () =>
                import ( /* webpackChunkName: "agregar" */ './views/Agregar.vue'),
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const rutaProtegida = to.matched.some(record => record.meta.requiresAuth)
        //si  nuestra ruta detecta que requiere un autenticacion esto va devolver un true o un false;


    const user = firebase.auth().currentUser;
    //aqui se pregunta si hay un usuario autenticado, del cual se va obtener el perfil de usuario, en caso contrario  va  regresar un null

    if (rutaProtegida === true && user === null) {
        next({ name: 'ingreso' }) //me va redirigir a ingreso si no estoy registrado, no me va dejar llegar a inicio si no estoy registrado
    } else {
        next() //si esta utenticado o si la ruta no esta protegida, dejalo pasar
    }
});

export default router;