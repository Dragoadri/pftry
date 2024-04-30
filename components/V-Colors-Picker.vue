<script setup lang="ts">
import { ref } from 'vue';

var colors= ref(['#FF0000', '#00FF00', '#0000FF']);


</script>

<template>
  <div class="v-colors-picker">
    <!-- circulo que su background son los 3 colores de la variable  -->
    <div
      v-for="(color, index) in colors"
      :key="index"
      :style="{ backgroundColor: color }"
      class="v-colors-picker__color"
    ></div>

  </div>
</template>

<style scoped lang="scss">
.v-colors-picker {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;

  display: flex;
  gap: 10px;
}



</style>