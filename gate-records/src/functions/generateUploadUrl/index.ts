import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'records/{recordId}/attachment',
        cors: true,
        authorizer: "authorize"
      }
    }
  ],
  iamRoleStatements: [{
    Effect: "Allow",
    Action: ["s3:PutObject"],
    Resource: "arn:aws:s3:::${self:provider.environment.ATTACHMENTS_BUCKET}/*"
  }]
}
