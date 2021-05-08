import 'source-map-support/register';

import type { Handler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getSignedUrl } from '../../dataLayer/s3Access'
import { middyfy } from '@libs/lambda';
import { createLogger } from '@utils/logger'

const logger = createLogger('getRecords');

const getRecordHandler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {
  logger.info(`Processing event: ${event}`)

  const recordId = event.pathParameters.recordId
  const url = getSignedUrl(recordId)

  const response =  {
    statusCode: 200,
    body: JSON.stringify({ 
      uploadUrl: url
    })
  }

  logger.info(`Event Response: ${response}`)

  return response
}

export const main = middyfy(getRecordHandler);
