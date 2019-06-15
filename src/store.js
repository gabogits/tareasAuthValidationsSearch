import Vue from 'vue';
import Vuex from 'vuex';
var firebase = require("firebase/app");
import router from './router';

import db from './main';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        usuario: '',
        error: '',
        tareas: [],
        tarea: { nombre: '', id: '' },
        carga: false,
        texto: '',
    },
    mutations: {
        setUsuario(state, payload) {
            state.usuario = payload
        },
        setError(state, payload) {
            state.error = payload
        },
        setTareas(state, tareas) {
            state.tareas = tareas;
        },
        setTarea(state, tarea) {
            state.tarea = tarea; //hasta qui el state tarea muta y nos sirve para traer a la vista la tarea a editar, ya que en mapstate ya traemos el objeto tarea
        },
        eliminarTarea(state, id) {
            state.tareas = state.tareas.filter(doc => {
                return doc.id != id //todos los documentos que sean diferentes a este id los va a devolver en forma de arreglo y como respuesta va regresar otro arreglo diferente, ya sin el documento eliminado
                    //asi se reemplaza este arreglo por el anterior
            })
        },
        cargarFirebase(state, payload) {
            state.carga = payload;
        },

    },
    actions: {
        buscador({ commit, state }, payload) {
            state.texto = payload.toLowerCase(); //lo que ingrese el usuario al input se va pasar a minusculas
        },
        crearUsuario({ commit }, payload) {
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.pass)
                .then(res => {
                    console.log(res.user.email);
                    console.log(res.user.uid);
                    commit('setUsuario', { email: res.user.email, uid: res.user.uid })



                    //crear una colección, al registrarse un usuario, se crea una collecion para este, cona tarea de prueba
                    db.collection(res.user.email).add({ //el id de la tarea se genera automaticamente
                            nombre: 'Tarea de ejemplo'
                        })
                        .then(() => {
                            router.push({ name: 'inicio' })
                        }) //entonces por cada usuario que se registre vamos a obtener una colección de tareas, 
                        //cuando se logue solo va ver sus propias tareas, agregar, editar o eliminar, las propias



                })
                .catch(err => {
                    console.log(err.message);
                    commit('setError', err.message)
                })


        },
        ingresoUsuario({ commit }, payload) {
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.pass)
                .then(res => {
                    console.log(res)
                    commit('setUsuario', { email: res.user.email, uid: res.user.uid })
                    router.push({ name: 'inicio' })
                })
                .catch(err => {
                    console.log(err)
                    commit('setError', err.message)
                })
        },
        detectarUsuario({ commit }, payload) {
            if (payload != null) {
                commit('setUsuario', { email: payload.email, uid: payload.uid })
            } else {
                commit('setUsuario', null)
            }

        },
        cerrarSesion({ commit }) {
            firebase.auth().signOut()
            commit('setUsuario', null)
            router.push({ name: 'ingreso' })
        },


        //crud de las tareas
        getTareas({ commit }) {
            commit('cargarFirebase', true); //vamos a ejecutar la mutación y pasar el valor de true, para avisar que se esta llevando a cabo un procedimineto que va requerir un loader
            const usuario = firebase.auth().currentUser; //nos va devolverl a info del usuario logueado
            const tareas = []; //vamos a reemplazar nuestro arreglo con los docs traidos de la base con el arreglo del state

            db.collection(usuario.email).get() //ya no vamos a llamar a la coleccion general 'tareas,' si no a la colección perteneciente al usuario logueado
                .then(snapshot => {
                    console.log(snapshot);
                    snapshot.forEach(doc => {
                        //console.log(doc);
                        //console.log(doc.id);
                        //console.log(doc.data());
                        let tarea = doc.data();
                        tarea.id = doc.id;
                        tareas.push(tarea);
                    })

                    commit('cargarFirebase', false); //vamos a ejecutar la mutación y pasar el valor de false, para avisar que se a terminado el procedimineto y que el loader tiene que desactivarse


                })



            commit('setTareas', tareas); //aqui me voy a traer el arreglo de objetos que obtuvimos en el foreach, con las dos propiedades id y nombre, ya que el documento de la base de datos trae mas propiedades y metodos

        },
        getTarea({ commit }, id) {
            const usuario = firebase.auth().currentUser;
            db.collection(usuario.email).doc(id).get() //con doc en lugar de todos los registros de la base de datos, solo estamos solicitando uno
                .then(doc => {
                    //el registro de la base de datos trae mucha info y metodos, pero aqui cuando lo obtenemos, acotamos para crear objetos con dos propiedades id y nombre
                    let tarea = doc.data(); //aqui empiezo a crear un objeto tarea que nos va servir para los procedimiento de la edicion
                    tarea.id = doc.id; //aqui al objeto tarea que estamos creando le asignamos el id que ya trae el documento, esto nos va servir para que ala hora de actualizar el nombre de la tarea el metodo editarTarea sepa de que documento va modificar de la base de datos
                    commit('setTarea', tarea);
                })
        },
        editarTarea({ commit }, tarea) {
            const usuario = firebase.auth().currentUser;
            //el objeto tarea que creamos , que trae el nombre y el id del documento que queremos editar, nos sirve tanto para pintarlo en la vista editar como a la hora de actualizar su modificacion
            db.collection(usuario.email).doc(tarea.id).update({
                nombre: tarea.nombre //el valor que quedo en el  v-model="tarea.nombre"  de la vista editar es el que se va asignar a la propiedad nombre del documento, esta propiedad ya existe en el doc, solo se esta reasignado el valor
            }).then(() => {
                router.push({ name: 'inicio' }) //aqui nos redirige a la vista de inicio al momento de llevarse a cabo la actualizacion 
            })
        },
        agregarTarea({ commit }, nombre) {

            commit('cargarFirebase', true);

            const usuario = firebase.auth().currentUser;
            db.collection(usuario.email).add({
                nombre: nombre, //aqui asigna una propiedad nombre y setea su valor con el valor que obtuvo del vmodel nombre
            }).then(doc => {
                router.push({ name: 'inicio' })
                commit('cargarFirebase', false);
            })
        },
        eliminarTarea({ commit, dispatch }, id) { //aqui se puede eliminar dispatch, pero solo fue para ejemplificar la solucion para actualizar comentada
            const usuario = firebase.auth().currentUser;
            db.collection(usuario.email).doc(id).delete()
                .then(doc => {
                    console.log('Tarea eliminada')
                        // dispatch('getTareas'); este es una forma de actulizar el listado de tareas despues de borrar alguna
                    commit('eliminarTarea', id) //ejecutamos una mutacion con ese id especifico
                })

        }


    },
    getters: { //obtener alguna propiedad del state para obtener una respuesta, un verdadero o falso
        existeUsuario(state) {
            if (state.usuario === null || state.usuario === '' || state.usuario === undefined) {
                //si existe un usuario 
                return false;
            } else {
                return true;
            }
        },
        arrayFiltrado(state) {
            // esto ocurre desde el arranque de la vista del listado de tareas
            // ya que estos getters se invocan en las propiedades computadas
            // y estan al tanto del valor de 
            console.log('funciona');
            console.log(state.nombre)
            let arregloFiltrado = []
            for (let tarea of state.tareas) {
                let nombre = tarea.nombre.toLowerCase(); //el nombre de las tareas ya almacenadas en el state también se pasa a minusculas
                if (nombre.indexOf(state.texto) >= 0) { //aqui no entiendo por que apesar de que texto en el state  en un inicio es '' o undefined, regresa el todas las tareas del state, por que  '' coincide contodas las tareas de las tareas de BD
                    arregloFiltrado.push(tarea);
                }
            }
            return arregloFiltrado; //todo el tiempo regresa un arreglo filtrado de las tareas que coincida con el valor que tiene state.texto
        }
    }

})