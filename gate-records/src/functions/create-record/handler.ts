import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createRecord } from '@businessLogic/records'
import { createLogger } from '@utils/logger'
import schema from './schema';
import { CreateRecordRequest } from '@requests/CreateRecordRequest';
import { getUserId } from '../../auth/utils'

const logger = createLogger('createRecord');

const createRecordHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  logger.info(`Processing event: ${event}`)
  const newRecord: CreateRecordRequest = event.body
  const userId = getUserId(event)

  if(newRecord.visitor_name.trim() === "") {
    logger.error("Request body has empty name or due date")

    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Request body has empty visitor name" })
    }
  }

  const newItem = await createRecord(newRecord, userId)

  const response =  formatJSONResponse({
    item: newItem
  }, 201);

  logger.info(`Response: ${response}`)

  return response
}

export const main = middyfy(createRecordHandler);
