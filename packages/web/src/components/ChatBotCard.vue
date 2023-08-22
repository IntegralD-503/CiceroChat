<!-- Add RouterLink to redirect to individual chat page -->
<template>
  <q-carousel-slide class="column no-wrap flex-center">
    <q-icon name="smart_toy" size="56px" />
    <div class="q-mt-md text-center">
      <q-card v-ripple clickable @click="$router.push('/chat')" bordered class="bg-9 my-card q-hoverable">
        <span class="q-focus-helper"></span>
        <q-card-section>
          <div class="text-h6">{{chatbot.name}}</div>
          <!-- <div class="text-subtitle2">{{ chatbot.description }}</div> -->
        </q-card-section>
  
        <q-separator inset />
  
        <q-card-section>
            {{ chatbot.description }}
        </q-card-section>
      </q-card>
    </div>
  </q-carousel-slide>
</template>


<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChatBotCard',
  props: ['chatbot']
});
</script>

