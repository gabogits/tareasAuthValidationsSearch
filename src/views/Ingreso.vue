<template>
  <div>
    <h2>ingreso usuarios</h2>
    <form @submit.prevent="ingresoUsuario({email:$v.email.$model, pass: $v.pass.$model})">
      <input
        type="email"
        v-model="$v.email.$model"
        class="form-control my-2"
        placeholder="Ingresa un emal"
      >
      <small class="text-danger d-block" v-if="!$v.email.required">Campo requerido</small>
      <small class="text-danger d-block" v-if="!$v.email.email">Email no valido</small>
      <input type="password" v-model="$v.pass.$model" class="form-control my-2">
      <!--se ha modificado los modelos v-model de los inputs agregando la validacion, asi como en el submit en form  "ingresoUsuario({email:$v.email.$model, pass: $v.pass.$model})", para
      que la informacion que viaje, se consulte haya pasado ya por las validaciones de vuelidate"-->
      <small class="text-danger d-block" v-if="!$v.pass.required">Campo requerido</small>
      
      <small class="text-danger d-block" v-if="!$v.pass.minLength">Minimo 6 carácteres</small>
      
      <button type="submit" class="btn btn-info" :disabled="$v.$invalid">Acceder</button>
    </form>
    <p>{{error}}</p>
    {{$v.email}}
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import { required, minLength, email } from "vuelidate/lib/validators";

export default {
  name: "ingreso",
  data() {
    return {
      email: "",
      pass: ""
    };
  },
  methods: {
    ...mapActions(["ingresoUsuario"])
  },
  computed: {
    ...mapState(["error"])
  },
  validations: {
    email: {
      required,
      email
    },
    pass: {
      required,
      minLength: minLength(6)
    }
  }
};
</script>
