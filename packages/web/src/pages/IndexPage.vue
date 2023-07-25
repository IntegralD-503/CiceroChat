<template>
  <q-page class="row items-center justify-evenly">
    <home-page></home-page>
  </q-page>
</template>

<script lang="ts">
import HomePage from '../components/HomePage.vue';
import { defineComponent } from 'vue';
// import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: { HomePage },
  setup() {
    return;
  },
});
</script>
