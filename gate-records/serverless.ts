import type { AWS } from '@serverless/typescript';
import { createRecord } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'gate-records',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-iam-roles-per-function'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: "${opt:stage, 'dev'}",
    region: "ap-south-1",
    tracing: {
      lambda: true,
      apiGateway: true
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      RECORDS_TABLE: "Records-${self:provider.stage}",
      USER_ID_INDEX: "UserIdIndex"
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { createRecord },
  resources: {
    Resources: {
      RecordsDynamoDBTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          AttributeDefinitions: [{
            AttributeName: "recordId",
            AttributeType: "S"
          }, {
            AttributeName: "userId",
            AttributeType: "S"
          }, {
            AttributeName: "createdAt",
            AttributeType: "S"
          }],
          KeySchema: [{
            AttributeName: "recordId",
            KeyType: "HASH"
          }, {
            AttributeName: "createdAt",
            KeyType: "RANGE"
          }],
          BillingMode: "PAY_PER_REQUEST",
          TableName: "${self:provider.environment.RECORDS_TABLE}",
          GlobalSecondaryIndexes: [{
            IndexName: "${self:provider.environment.USER_ID_INDEX}",
            KeySchema: [{
              AttributeName: "userId",
              KeyType: "HASH"
            }, {
              AttributeName: "createdAt",
              KeyType: "RANGE"
            }],
            Projection: {
              ProjectionType: "ALL"
            }
          }]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
