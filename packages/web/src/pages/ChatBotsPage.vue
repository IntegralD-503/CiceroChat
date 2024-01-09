<template>
  <p v-if="loading">Loading chatbots...</p>
  <p v-if="error">{{ error.message }}</p>
  <div v-if="chatbots" class="q-pa-md">
    <q-option-group v-model="controlType" :options="controlTypeOptions" color="blue" inline class="q-mb-md" />

    <q-carousel v-model="slide" swipeable animated :control-type="controlType" control-color="blue" navigation padding
      arrows height="300px" class="text-blue rounded-borders">

      <ChatBotCard v-for="chatbot in chatbots" :name="chatbot.name" :chatbot="chatbot">
      </ChatBotCard>

    </q-carousel>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import ChatBotCard from '../components/ChatBotCard.vue'

export default defineComponent({
  name: 'ChatMessagePage',
  components: {
    ChatBotCard
  },
  data() {
    return {
      loading: false,
      error: null,
      chatbots: [
        {
          name: "Cicero",
          description: "Ancient Roman Philospher and Statesmen. Your guide to everything to do with Ancient Rome. Click here to start a chat session.."

        },
        {
          name: "Galileo",
          description: "Under Development"

        },
        {
          name: "Newton",
          description: "Under Development"

        }
      ],
      controlType: 'flat',
      controlTypeOptions: [
        // { value: 'regular', label: 'regular' },
        // { value: 'unelevated', label: 'unelevated' },
        // { value: 'flat', label: 'flat (default)' },
        // { value: 'outline', label: 'outline' },
        // { value: 'push', label: 'push' }
      ],
      slide: "Cicero",
      }
  }
});
</script>