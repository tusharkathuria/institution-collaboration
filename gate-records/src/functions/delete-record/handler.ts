import 'source-map-support/register';

import type { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { deleteRecord } from '@businessLogic/records'
import { createLogger } from '@utils/logger'

const logger = createLogger('deleteRecord');

const deleteRecordHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  logger.info(`Processing event: ${event}`)

  const recordId = event.pathParameters.recordId
  
  await deleteRecord(recordId)

  const response =  formatJSONResponse({
    message: "Successfully deleted"
  })

  logger.info(`Event Response: ${response}`)

  return response
}

export const main = middyfy(deleteRecordHandler);
