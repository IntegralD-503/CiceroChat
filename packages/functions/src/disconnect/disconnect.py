import json
import os
import logging
import boto3
import asyncio

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

dynamodb = boto3.resource('dynamodb')
connections = dynamodb.Table(os.environ['TABLE_NAME'])

async def handler(event, context):
    logger.debug("ondisconnect: %s" % event)

    connection_id = event.get('requestContext',{}).get('connectionId')
    if connection_id is None:
        return { 'statusCode': 400, 
                 'body': 'bad request' }

    result = connections.delete_item(Key={ 'connectionId': connection_id })
    if result.get('ResponseMetadata',{}).get('HTTPStatusCode') != 200:
        logger.debug('delete_item failed: %s' % result)
    return { 'statusCode': 200,
             'body': 'ok' }


def main(event, context):
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(handler(event, context))