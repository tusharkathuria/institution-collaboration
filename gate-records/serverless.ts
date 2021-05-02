import type { AWS } from '@serverless/typescript';
import { createRecord, updateRecord, getRecords, deleteRecord } from '@functions/index';

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
      RECORDS_TABLE: "GateRecords-${self:provider.stage}",
      DATE_INDEX: "DateIndex"
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { createRecord, updateRecord, getRecords, deleteRecord },
  resources: {
    Resources: {
      RecordsDynamoDBTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          AttributeDefinitions: [{
            AttributeName: "recordId",
            AttributeType: "S"
          }, {
            AttributeName: "createdAt",
            AttributeType: "S"
          }, {
            AttributeName: "date",
            AttributeType: "S"
          }],
          KeySchema: [{
            AttributeName: "recordId",
            KeyType: "HASH"
          }],
          BillingMode: "PAY_PER_REQUEST",
          TableName: "${self:provider.environment.RECORDS_TABLE}",
          GlobalSecondaryIndexes: [{
            IndexName: "${self:provider.environment.DATE_INDEX}",
            KeySchema: [{
              AttributeName: "date",
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
