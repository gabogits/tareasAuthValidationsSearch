<template>
  <div>
    <h1>Editar</h1>
    {{id}} - {{tarea}}
    <form @submit.prevent="editarTarea(tarea)" class="form-inline">
      <!--al dar click en el boton se ejecuta editarTarea(tarea), que lleva en si el objeto de la tarea a editar-->
      <div class="input-group mb-2 mr-sm-2">
        <div class="input-group-prepend">
          <div class="input-group-text">Nombre</div>
        </div>
        <input
          type="text"
          v-model="$v.tarea.nombre.$model"
          class="form-control"
          placeholder="Username"
        >

        <!--cuando estemos trabajando con propiedades computadas que vengan del store, tenemos que mapear la propiedad$v.tarea.nombre.$modeld, a diferencia de las propiedades del data que solo se maneja asi $v.nombre.$model -->
        <!--estamos trabajando con un objeto en este caso, por eso se trabaja así-->
      </div>
      <button type="submit" class="btn btn-primary" :disabled="$v.tarea.$invalid">Editar</button>
      <!--cuando estemos trabajando con propiedades computadas que vengan del store, tenemos que mapear la propiedad$v.tarea.$invalid, a diferencia de las propiedades del data que solo se maneja asi $v.$invalid -->
      <!--estamos trabajando con un objeto en este caso, por eso se trabaja así-->
    </form>
    <small class="text-danger d-block" v-if="!$v.tarea.nombre.required">Minimo 5 caracteres</small>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  name: "Editar",
  data() {
    return {
      id: this.$route.params.id //obtenemos el id de la barra de direcciones, que el boton editar seteo en
    };
  },
  methods: {
    ...mapActions(["getTarea", "editarTarea"])
  },
  created() {
    this.getTarea(this.id);
  },
  computed: {
    ...mapState(["tarea"])
  },
  validations: {
    tarea: {
      nombre: { required } //como trabajamos un objeto, la validacion la hacemos asi, mapeando la propiedad nombre dentro del objeto tarea en el que se encuentra
      //ya mapaeandolo incluimos las validaciones que requerimos de esa propiedad
    }
  }
};
</script>
