import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { createRecord } from '@businessLogic/records'
import { createLogger } from '@utils/logger'
import schema from './schema';
import { CreateRecordRequest } from '@requests/CreateRecordRequest';

const logger = createLogger('createRecord');

const createRecordHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  logger.info(`Processing event: ${event}`)
  const newRecord: CreateRecordRequest = event.body

  if(newRecord.visitor_name.trim() === "") {
    logger.error("Request body has empty name or due date")

    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Request body has empty visitor name" })
    }
  }

  const newItem = await createRecord(newRecord)

  const response =  formatJSONResponse({
    item: newItem
  }, 201);

  logger.info(`Response: ${response}`)

  return response
}

export const main = middyfy(createRecordHandler);
