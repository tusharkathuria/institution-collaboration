import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'records',
        cors: true,
        authorizer: "authorize",
        request: {
          schema: {
            'application/json': schema
          }
        }
      }
    }
  ],
  iamRoleStatements: [{
    Effect: "Allow",
    Action: ["dynamodb:PutItem"],
    Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.RECORDS_TABLE}"
  }]
}
