# Gate Records Web Client

Simple client to play with backend application [GateRecords](../gate-records). Starter code for this web app is taken from [repo](https://github.com/udacity/cloud-developer/tree/master/course-04/project/c4-final-project-starter-code/client) used in a course

## Setup

Run the following commands to run the client application

```
npm i
npm run start
```

This will start development server with react app that will interact with [GateRecords](../gate-records) serverless app

## Functionality

User has to login before interacting with app

### Creating a record

This functionality is intended to be used when a visitor enters the campus through gate. To create the record, fill the visitor information fields and click on `New Record` button. This will create new record and list will be refreshed

### Browse records

Change the date of date picker to the date for which you want to browse the gate records

### Update record

In case wrong data is entered, record can be updated. To update a record, click on edit button on any row containing record. This will open new screen. Fill/Update all fields in the screen and click update button. Come back to home screen to verify the change

### Exit visitor

When visitor exits the campus, this functionality can be used to automatically update exit time of the visitor. To exit a visitor, click on Exit Visitor button in row containing the record

### Delete record

Record can also be deleted. To delete, click on delete button in the row containing record

## Upcoming features/enhancements

- Rework the UI to a table instead of simple text
- Add various filters
- Add search functionality
- Enable sort by each column of table
- Show user name instead of user id in `createdBy` field of record
- Add dorm validation