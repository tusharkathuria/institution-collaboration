import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'records',
        cors: true,
      }
    }
  ],
  iamRoleStatements: [{
    Effect: "Allow",
    Action: ["dynamodb:Query"],
    Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.RECORDS_TABLE}/index/${self:provider.environment.DATE_INDEX}"
  }]
}
