<template>
  <div>
    <h1>Lista de tareas</h1>
      <router-link :to="{name: 'agregar'}" class="btn btn-success btn-block">Agregar</router-link>
    {{carga}}
    <form @submit.prevent="buscador(texto)">
      <input type="text" placeholder="buscar..." class="form-control mt-5" v-model="texto" v-on:keyup="buscador(texto)">
    </form>
    <div class="cargando text-center mt-5" v-if="carga">
      <h3>cargando contenido..</h3>
      <pulse-loader :loading="carga"></pulse-loader>
      <!--el :lading hay que vincularlo con el modelo carga-->
    </div>
  
    <ul class="list-group mt-5" v-if="!carga">
      <li v-for="tarea of arrayFiltrado" :key="tarea.id" class="list-group-item">
        {{tarea.id}} -{{tarea.nombre}}
        <div class="float-right">
          <router-link
            :to="{name: 'editar', params:{ id: tarea.id}}"
            class="btn btn-warning btn-sm mr-2"
          >Editar</router-link>
          <button @click="eliminarTarea(tarea.id)" class="btn btn-danger btn-sm">Eliminar</button>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
export default {
  name: "Inicio",
  data() {
    return {
      texto:''
    }
  },
  computed: {
    ...mapState(["usuario", "tareas", "carga"]),
    ...mapGetters(['arrayFiltrado']),
    //los getters ocurren en las propiedades computadas, se cargan atravez de vuex y estan al tanto de datos relacionadas con el state
    //si es que estan cambiando
    
  },
  methods: {
    ...mapActions(["getTareas", "eliminarTarea", 'buscador']) //aqui tenemos la action getTareas, como metodo listo para usarse, mediante un evento o momento del ciclo de vida de vue (created)
    // eliminarTarea ocurre al click del boton eliminar, se ejecuta la action y consecuentemente la mutacion con el mismo nombre, que sobreescribe el state de tareas
  },
  created() {
    this.getTareas();
    //el getTareas en el store no se ejecuta por si solo, aqui en este vista y en este momento del ciclo de vida del (componente/vista) se ejecuta,  posteriormente a ello ocurre la mutacion que modifica el estado de tareas
  },
  components: {
    PulseLoader
  }
};
</script>
