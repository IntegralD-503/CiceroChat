import json
import os
import logging
import asyncio
import boto3
import uuid
from rejson import Path
from redisDB.config import Redis
from schema.chat import Chat

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

redis = Redis()
dynamodb = boto3.resource('dynamodb')
connections = dynamodb.Table(os.environ['TABLE_NAME'])

async def handler(event, context):
    logger.debug("onconnect: %s" % event)

    connection_id = event.get('requestContext',{}).get('connectionId')
    if connection_id is None:
        return { 'statusCode': 400, 
                 'body': 'bad request' }

    token = str(uuid.uuid4())

    # Create new chat session
    json_client = redis.create_rejson_connection()

    chat_session = Chat(
        token=token,
        messages=[],
    )

    # Store chat session in redis JSON with the token as key
    json_client.jsonset(str(token), Path.rootPath(), chat_session.dict())

    # Set a timeout for redis data
    print('Connecting to redis client')
    redis_client = await redis.create_connection()
    await redis_client.expire(str(token), 7200)
    print('Connected to redis client')

    result = connections.put_item(Item={ 'connectionId': connection_id, 'token': token })
    if result.get('ResponseMetadata',{}).get('HTTPStatusCode') != 200:
        return { 'statusCode': 500,
                 'body': 'something went wrong' }
    return { 'statusCode': 200,
             'body': 'ok' }


def main(event, context):
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(handler(event, context))