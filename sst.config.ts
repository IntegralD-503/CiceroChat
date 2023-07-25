import { SSTConfig } from "sst";
import { ChatAppStack } from "./stacks/ChatAppStack";

export default {
  config(_input) {
    return {
      name: "ml-chat",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(ChatAppStack);
  }
} satisfies SSTConfig;
