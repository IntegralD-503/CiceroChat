<template>
  <div class="my-background">
  <!-- <q-page class="page-chat flex column"> -->
    <q-page-container>
  <q-page padding class="flex justify-center">
    <!-- <base-card> -->
    <div class="bg-grey-1 shadow-2 q-pa-lg" style="width: 80%">
      <div class="row">
      <div v-for="message in chatMessages" :key="message.name">
        <q-chat-message
          :avatar="message.avatar"
          :name="message.name"
          :text="[message.text]"
          :sent="message.sent"
          :size="message.size"
          :bg-color="message.bgColor"
          :text-color="message.textColor"
        >
        </q-chat-message>
      </div>
    </div>
    
    <!-- </div> -->
  </div>
  <div class="q-pa-lg" style="width: 80%">
    <!-- <div style="position: fixed; bottom: 0;"> -->
        <q-input bottom-slots bg-color="white" square outlined v-model="question" @keyup.enter="askAQuestion" label="Enter Text" :disable="isDisabled">
          <template v-slot:before>
            <q-avatar>
              <img src="https://imagedelivery.net/t2BKT7SfDmah3iqN0NqHjA/07841b7b-a8ee-4e8b-01aa-53a0d662df00/public">
            </q-avatar>
          </template>
        </q-input>
      </div>
    <!-- <button @click="askAQuestion">Send</button> -->
  <!-- </base-card> -->
  </q-page>
  </q-page-container>
</div>
</template>

<script>
import { defineComponent, ref } from 'vue';
export default defineComponent({
  // name: 'PageName'
  data() {
    return {
      isDisabled: false,
      question: '',
      answer: '',
      connection: null,
      chatMessages: [
        {
          sent: false,
          name: 'Cicero',
          avatar:
            'https://imagedelivery.net/t2BKT7SfDmah3iqN0NqHjA/852baa9a-b5a3-4f76-3914-799b4c188e00/public',
          bgColor: 'grey-9',
          textColor: 'white',
          size: '6',
          text: 'Hello, I am Cicero. What may I help you with today?',
        },
      ],
      ciceroChatHistory: [
        'Hello, I am Cicero. What may I help you with today?',
      ],
      userChatHistory: [],
    };
  },
  mounted() {
    console.log('Starting connection to WebSocket Server');
    console.log(`Connecting to ${import.meta.env.VITE_APP_API_URL}`);
    this.connection = new WebSocket(
      import.meta.env.VITE_APP_API_URL
    );

    this.connection.onmessage = this.postAnswer;

    this.connection.onopen = function (event) {
      console.log(event);
      console.log('Successfully connected to the chat websocket server...');
    };
  },
  methods: {
    askAQuestion() {
      if (this.question.trim() !== '') {
        this.isDisabled = true;
        console.log(this.connection);

        this.createNewMessage(true, this.question);
        this.connection.send(JSON.stringify({ "action" : "askquestion", "data": this.question}));

        this.question = '';
      }
    },
    isValidAnswer(event) {
      return !event['data'].startsWith('{"message": "Internal server error"') 
      && !event['data'].startsWith('{"message": "Forbidden"')
      && !event['data'].startsWith('{"message": "Endpoint request timed out"')
    },
    postAnswer(event) {
      // console.log(typeof event['data']);
      console.log(event);

      if (this.isValidAnswer(event)) {
        const data = event['data']
        // print(data) // lol this was causing the print page to pop up everytime
        this.answer = data;
        console.log(this.answer);
        this.createNewMessage(false, this.answer);
      } 
      this.isDisabled = false;
    },
    createNewMessage(isQuestion, text) {
      if (isQuestion) {
        this.chatMessages.push({
          sent: true,
          name: 'Harold',
          avatar:
            'https://imagedelivery.net/t2BKT7SfDmah3iqN0NqHjA/07841b7b-a8ee-4e8b-01aa-53a0d662df00/public',
          text: text,
          bgColor: 'white',
          textColor: 'black',
          size: '6',
        });
      } else {
        this.chatMessages.push({
          sent: false,
          name: 'Cicero',
          avatar:
            'https://imagedelivery.net/t2BKT7SfDmah3iqN0NqHjA/852baa9a-b5a3-4f76-3914-799b4c188e00/public',
          text: text,
          bgColor: 'grey-9',
          textColor: 'white',
          size: '6',
        });
      }
    },
  },
});
</script>

<style scoped lang="scss">
.chat-input {
  position: absolute;
  bottom: 20px;
  margin: 0.5rem 0;
}

.my-background {
  background: url('https://imagedelivery.net/t2BKT7SfDmah3iqN0NqHjA/d0e08fc4-4f5f-4cdd-be62-5238bcbec800/public')
    no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

input#classic
{
    width: 100%;
    padding: 5px;
    margin: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
    box-sizing: border-box;        
}
</style>

<!-- .chat-input {
  margin: 0.5rem 0;
} -->