import { RecordItem } from '../models/RecordItem'
// import { TodoUpdate } from '../models/TodoUpdate'
import { RecordAccess } from '../dataLayer/recordAccess'
import { CreateRecordRequest } from '../requests/CreateRecordRequest'
import { UpdateRecordRequest } from '../requests/UpdateRecordRequest'
// const bucketName = process.env.TODOS_S3_BUCKET
import { uuid } from 'uuidv4';
import { RecordUpdate } from '@models/RecordUpdate';

const recordAccess = new RecordAccess()

export async function getAllRecordsForDate(date?: string): Promise<RecordItem[]> {
  const selectedDate = date || new Date().toDateString()
  return recordAccess.getAllRecordsForDate(selectedDate)
}

export async function updateRecord(recordId: String, updateRequestBody: UpdateRecordRequest) {
  const updateBody: RecordUpdate = {
    visitor_name: updateRequestBody.visitor_name || "",
    vehicle_number: updateRequestBody.vehicle_number || "",
    phone_number: updateRequestBody.phone_number || "",
    purpose: updateRequestBody.purpose || "",
    exit_time: updateRequestBody.exit_time || ""
  }

  return await recordAccess.updateRecord(recordId, updateBody)
}

export async function deleteRecord(recordId: String) {
  return await recordAccess.deleteRecord(recordId)
}

export async function createRecord(
  createRecordRequest: CreateRecordRequest,
  userId: string
): Promise<RecordItem> {

  const itemId = uuid()
  const date = new Date()

  return await recordAccess.createRecord({
    recordId: itemId,
    createdAt: date.toISOString(),
    date: date.toDateString(),
    exit_time: "",
    visitor_name: createRecordRequest.visitor_name,
    phone_number: createRecordRequest.phone_number,
    vehicle_number: createRecordRequest.vehicle_number,
    purpose: createRecordRequest.purpose,
    createdBy: userId
  })
}