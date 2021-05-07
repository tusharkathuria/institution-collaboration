import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'records/{recordId}',
        cors: true,
        authorizer: "authorize"
      }
    }
  ],
  iamRoleStatements: [{
    Effect: "Allow",
    Action: ["dynamodb:DeleteItem"],
    Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.RECORDS_TABLE}"
  }]
}
