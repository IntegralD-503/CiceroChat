import { WebSocketApi, WebSocketStage } from '@aws-cdk/aws-apigatewayv2-alpha';
import { WebSocketLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Platform } from 'aws-cdk-lib/aws-ecr-assets';
import { Architecture, DockerImageCode, DockerImageFunction } from 'aws-cdk-lib/aws-lambda';
import {
  StackContext,
  StaticSite,
} from "sst/constructs";
import path from 'path';

export function ChatAppStack({ stack }: StackContext) {
  
  const wsTable = new Table(stack, 'ChatConnections', {
    partitionKey: {
      name: 'connectionId',
      type: AttributeType.STRING,
    },
    removalPolicy: RemovalPolicy.DESTROY,
  });

  const connectWs = new DockerImageFunction(stack, 'ConnectChat', {
    functionName: `connectChat`,
    code: DockerImageCode.fromImageAsset(path.join(path.resolve(), './packages/functions/src/connect'),
    {
      cmd: ["connect.main"],
      entrypoint: ["/lambda-entrypoint.sh"],
      platform: Platform.LINUX_AMD64
    }),
    environment: {
      TABLE_NAME: wsTable.tableName
    },
    architecture: Architecture.X86_64
  })

  const disconnectWs = new DockerImageFunction(stack, 'DisconnectChat', {
    functionName: `disconnectChat`,
    code: DockerImageCode.fromImageAsset(path.join(path.resolve(), './packages/functions/src/disconnect'),
    {
      cmd: ["disconnect.main"],
      entrypoint: ["/lambda-entrypoint.sh"],
      platform: Platform.LINUX_AMD64
    }),
    environment: {
      TABLE_NAME: wsTable.tableName
    },
    architecture: Architecture.X86_64
  })

  const askQuestionWs = new DockerImageFunction(stack, 'AskAgentQuestion', {
    functionName: `askAgentQuestion`,
    code: DockerImageCode.fromImageAsset(path.join(path.resolve(), './packages/functions/src/askQuestion'),
    {
      cmd: ["askQuestion.main"],
      entrypoint: ["/lambda-entrypoint.sh"],
      platform: Platform.LINUX_AMD64
    }),
    environment: {
      TABLE_NAME: wsTable.tableName
    },
    architecture: Architecture.X86_64,
    memorySize: 4096,
    timeout: Duration.seconds(45)
  })

  wsTable.grantReadWriteData(connectWs)
  wsTable.grantFullAccess(disconnectWs)
  wsTable.grantFullAccess(askQuestionWs)

  const websocketApi = new WebSocketApi(stack, 'WebSocketChatApi', {
    connectRouteOptions: {
      integration: new WebSocketLambdaIntegration('connectIntegration', connectWs)
    },
    disconnectRouteOptions: {
      integration: new WebSocketLambdaIntegration('disconnectIntegration', disconnectWs)
    }
  })

  const websocketApiStage = new WebSocketStage(stack, 'WebsocketDevStage', {
    webSocketApi: websocketApi,
    stageName: 'dev',
    autoDeploy: true
  })

  websocketApi.addRoute('askquestion', {
    integration: new WebSocketLambdaIntegration('askQuestionIntegration', askQuestionWs)
  })

  websocketApi.grantManageConnections(askQuestionWs)

  new CfnOutput(stack, 'WebSocketConnectUrl', {
    value: websocketApi.apiEndpoint
  })

  const web = new StaticSite(stack, "PorkchopExpress", {
    path: "packages/web",
    customDomain: "pork-chop.express",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: websocketApiStage.url,
    },
  });
}