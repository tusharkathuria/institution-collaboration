import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { updateRecord } from '@businessLogic/records'
import { createLogger } from '@utils/logger'
import schema from './schema';
import { UpdateRecordRequest } from '@requests/UpdateRecordRequest';
const logger = createLogger('updateRecord');

const updateRecordHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  logger.info(`Processing event: ${event}`)
  const newRecord: UpdateRecordRequest = event.body
  const recordId = event.pathParameters.recordId

  const newItem = await updateRecord(recordId, newRecord)

  const response = formatJSONResponse({
    item: newItem
  }, 204);

  logger.info(`Response: ${response}`)

  return response
}

export const main = middyfy(updateRecordHandler);
