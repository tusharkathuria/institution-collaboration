import { apiEndpoint } from '../config'
import { RecordItem } from '../types/Record';
import { CreateRecordRequest } from '../types/CreateRecordRequest';
import Axios from 'axios'
import { UpdateRecordRequest } from '../types/UpdateRecordRequest';

export async function getRecords(idToken: string): Promise<RecordItem[]> {
  console.log('Fetching records')

  const response = await Axios.get(`${apiEndpoint}/records`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Records:', response.data)
  return response.data.items
}

export async function createRecord(
  idToken: string,
  newRecord: CreateRecordRequest
): Promise<RecordItem> {
  const response = await Axios.post(`${apiEndpoint}/records`,  JSON.stringify(newRecord), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchRecord(
  idToken: string,
  recordId: string,
  updatedRecord: UpdateRecordRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/records/${recordId}`, JSON.stringify(updatedRecord), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteRecord(
  idToken: string,
  recordId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/records/${recordId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

// export async function getUploadUrl(
//   idToken: string,
//   todoId: string
// ): Promise<string> {
//   const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${idToken}`
//     }
//   })
//   return response.data.uploadUrl
// }

// export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
//   await Axios.put(uploadUrl, file)
// }
