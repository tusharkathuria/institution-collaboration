import type { AWS } from '@serverless/typescript';
import { authorize, createRecord, updateRecord, getRecords, deleteRecord, generateUploadUrl } from '@functions/index';

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
      DATE_INDEX: "DateIndex",
      ATTACHMENTS_BUCKET: "629226848507-gate-records-${self:provider.stage}",
      SIGNED_URL_EXPIRATION: "300",
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { authorize, createRecord, updateRecord, getRecords, deleteRecord, generateUploadUrl },
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
      },
      AttachmentsBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:provider.environment.ATTACHMENTS_BUCKET}",
          CorsConfiguration: {
            CorsRules: [{
              AllowedOrigins: ["*"],
              AllowedHeaders: ["*"],
              AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
              MaxAge: 3000
            }]
          }
        }
      },
      BucketPolicy: {
        Type: "AWS::S3::BucketPolicy",
        Properties: {
          PolicyDocument: {
            Id: "PublicRead",
            Version: "2012-10-17",
            Statement: [{
              Sid: "PublicReadForGetBucketObjects",
              Effect: "Allow",
              Principal: '*',
              Action: 's3:GetObject',
              Resource: 'arn:aws:s3:::${self:provider.environment.ATTACHMENTS_BUCKET}/*'
            }]
          },
          Bucket: {
            Ref: "AttachmentsBucket"
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
