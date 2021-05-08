import 'source-map-support/register';

import type { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getAllRecordsForDate } from '@businessLogic/records'
import { createLogger } from '@utils/logger'

const logger = createLogger('getRecords');

const getRecordHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  logger.info(`Processing event: ${event}`)
  logger.info(`QueryStringParameters: ${event.queryStringParameters}`)
  
  const dateString = (event.queryStringParameters && event.queryStringParameters.date) || new Date().toDateString()
  logger.info("Date:", dateString)
  const records = await getAllRecordsForDate(dateString)

  const response =  formatJSONResponse({
    items: records
  })

  logger.info(`Event Response: ${response}`)

  return response
}

export const main = middyfy(getRecordHandler);
