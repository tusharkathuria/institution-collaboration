import 'source-map-support/register';

import type { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getAllRecordsForToday } from '@businessLogic/records'
import { createLogger } from '@utils/logger'

const logger = createLogger('getRecords');

const getRecordHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  logger.info(`Processing event: ${event}`)
  
  const records = await getAllRecordsForToday()

  const response =  formatJSONResponse({
    items: records
  })

  logger.info(`Event Response: ${response}`)

  return response
}

export const main = middyfy(getRecordHandler);
