import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { RecordItem } from '../models/RecordItem'
import { RecordUpdate } from '../models/RecordUpdate'
// import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger';

const logger = createLogger('recordsDataAccess');
const bucketName = process.env.ATTACHMENTS_BUCKET

const XAWS = AWSXRay.captureAWS(AWS)
export class RecordAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly recordsTable = process.env.RECORDS_TABLE,
    private readonly dateIndex = process.env.DATE_INDEX
    ) {
  }

  async getAllRecordsForDate(date: String): Promise<RecordItem[]> {
    logger.info(`Querying records for date: ${date}`)

    const result = await this.docClient.query({
      TableName: this.recordsTable,
      IndexName: this.dateIndex,
      KeyConditionExpression: "#D = :date",
      ExpressionAttributeNames: {
        "#D": "date"
      },
      ExpressionAttributeValues: {
        ":date": date
      },
      ScanIndexForward: false
    }).promise()

    const items = result.Items

    logger.info(`Records query result for date ${date}: ${items}`)

    return items as RecordItem[]
  }

  async createRecord(recordItem: RecordItem): Promise<RecordItem> {
    logger.info(`Creating record for data ${recordItem}`)

    await this.docClient.put({
      TableName: this.recordsTable,
      Item: recordItem
    }).promise()

    logger.info(`Created record ${recordItem}`)

    return recordItem
  }

  async updateRecord(recordId: String, updateBody: RecordUpdate) {

    const attachmentUrl = updateBody.attachmentId ? `http://${bucketName}.s3.amazonaws.com/${updateBody.attachmentId}` : ""

    logger.info(`Updating record for recordId ${recordId}`)

    var params = {
        TableName: this.recordsTable,
        Key: { recordId },
        UpdateExpression: `set visitor_name = :visitor_name, phone_number = :phone_number, vehicle_number = :vehicle_number, purpose = :purpose, exit_time = :exit_time, attachmentUrl = :attachmentUrl`,
        ExpressionAttributeValues: {
            ':visitor_name' : updateBody.visitor_name,
            ':phone_number': updateBody.phone_number,
            ':vehicle_number': updateBody.vehicle_number,
            ':purpose': updateBody.purpose,
            ':exit_time': updateBody.exit_time,
            ':attachmentUrl': attachmentUrl
        },
        ReturnValues: "ALL_NEW"
    };

    const updatedItem =  await this.docClient.update(params).promise()

    logger.info(`Updated record for recordId ${recordId}. New item: ${JSON.stringify(updatedItem)}`)

    return updatedItem
  }

  async deleteRecord(recordId: String) {
    logger.info(`Deleting record with recordId ${recordId}`)

    var params = {
        TableName: this.recordsTable,
        Key: {recordId}
    }

    const result = await this.docClient.delete(params).promise()

    logger.info(`Deleted record with recordId ${recordId}`)

    return result
  }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
		console.log('Creating a local DynamoDB instance')
		return new XAWS.DynamoDB.DocumentClient({
			region: 'localhost',
			endpoint: 'http://localhost:8000'
		})
    }

    return new XAWS.DynamoDB.DocumentClient()
}