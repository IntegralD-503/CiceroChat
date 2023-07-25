<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <div class="bg-grey">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />

          <q-toolbar-title> ML Demos </q-toolbar-title>

          <!-- <div>Quasar v{{ $q.version }}</div> -->
        </q-toolbar>
      </div>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Pages </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import EssentialLink from '../components/EssentialLink.vue';

const linksList = [
  {
    title: 'Docs',
    caption: 'Github Repo with Documentation',
    icon: 'school',
    link: 'https://github.com/IntegralD-503/ML_Projects_Docs',
    external: true,
  },
  {
    title: 'Chat Bot',
    caption: 'Ancient Roman Chat Bot',
    icon: 'chat',
    link: '/chat',
    external: false,
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
    external: true,
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
