# Gate Record Book
Service used for managing gate entry and exit records of vehicles and persons. This is intended to be used by any one who is responsible to manage the gate of an institute or a campus. This makes it easier to create and update gate entry exit records. It also make it easier to browse records by different dates

## Template
Starter code is taken from serverless aws-nodejs-typescript template. Refer template's [README](./README-Template.md) for more details regarding template

## Record Item
The application stores gate records and each record item contains following fields:

- `recordId`: Unique id for gate record
- `visitor_name`: Name of the visitor who entered the gate
- `phone_number`: Phone number of the visitor
- `vehicle_number`: Registration number of the vehicle on which visitor arrived
- `purpose`: Purpose of visitor's visit
- `date`: Date on which the record was created. This is also partition key in one of DynamoDb index
- `createdBy`: Id of the user who created the record. Id is fetched from auth0
- `createdAt`: ISO date string for the time when record was created. This can also be used to show visitor entry time
- `exit_time`: Time at which visitor exits the gate

## Endpoints/Functions

The application serves data through following endpoints. Base url is of the form `https://${apiId}.execute-api.ap-south-1.amazonaws.com/dev`

### Get Records

GET `{{url}}/records?date={datestring}` (datestring exaple: `Sat May 08 2021`)

Response example:
```json
{
    "items": [
        {
            "purpose": "Meeting",
            "date": "Sat May 08 2021",
            "vehicle_number": "434343",
            "phone_number": "3732873287",
            "visitor_name": "Tushar",
            "createdAt": "2021-05-08T07:31:25.570Z",
            "exit_time": "2021-05-08T07:44:31.809Z",
            "recordId": "a21a21d2-d1f1-47c6-99ef-58068ec5537f",
            "createdBy": "auth0|4487y44383yfh43hf4398h"
        },
        {
            "purpose": "",
            "date": "Sat May 08 2021",
            "vehicle_number": "",
            "phone_number": "",
            "visitor_name": "Urvi",
            "createdAt": "2021-05-08T07:00:11.787Z",
            "exit_time": "",
            "recordId": "9140ca99-9332-4747-bb1a-a5a451c6148e",
            "createdBy": "google-oauth2|veoierinveeir3"
        }
    ]
}
```

### Create Record

POST `{{url}}/records`

Request body:
```json
{
    "visitor_name": "Tushar",
    "purpose": "Meeting",
    "vehicle_number": "PB36J1244",
    "phone_number": "32932478343",
}
```

### Update Record

PATCH `{{url}}/records/{recordId}`

Request Body
```json
{
    "visitor_name": "Tushar Kathuria",
    "phone_number": "2398239822",
    "vehicle_number": "PB36J1245",
    "purpose": "Attend meeting",
    "exit_time": "2021-05-08T07:44:31.809Z"
}
```

### Delete record

DELETE `{{url}}/records/{recordId}`

## Postman collection

To test in postman, import the postman [collection](./gate-records.postman_collection.js)
Before testing it, update value of token variable in collection.

## Upcoming features/enhancements

- Implement search functionality using elasticsearch
- Add various filters (May need to add new indexes to dynamodb)