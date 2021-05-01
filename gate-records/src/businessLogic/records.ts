import { RecordItem } from '../models/RecordItem'
// import { TodoUpdate } from '../models/TodoUpdate'
import { RecordAccess } from '../dataLayer/recordAccess'
import { CreateRecordRequest } from '../requests/CreateRecordRequest'
// const bucketName = process.env.TODOS_S3_BUCKET
import { uuid } from 'uuidv4';

const recordAccess = new RecordAccess()

// export async function getAllTodos(userId: String): Promise<TodoItem[]> {
//   return todoAccess.getAllTodos(userId)
// }

// export async function updateTodo(todoId: String, updateBody: TodoUpdate, userId: String) {
//     return await todoAccess.updateTodo(todoId, updateBody, userId)
// }

// export async function deleteTodo(todoId: String, userId: String) {
//   return await todoAccess.deleteTodo(todoId, userId)
// }

export async function createRecord(
  createRecordRequest: CreateRecordRequest,
  userId?: string
): Promise<RecordItem> {

  const itemId = uuid()
  userId = userId || uuid()

  return await recordAccess.createRecord({
    userId,
    recordId: itemId,
    createdAt: new Date().toISOString(),
    visitor_name: createRecordRequest.visitor_name,
    phone_number: createRecordRequest.phone_number,
    vehicle_number: createRecordRequest.vehicle_number,
    purpose: createRecordRequest.purpose
  })
}