import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import getAllTrackings from '@functions/getAllTrackings';
import authorizeRequest from '@auth/authorizeRequest';
import createTimetrack from '@functions/createTracking';
import updateTimetrack from '@functions/updateTracking';
import deleteTimetrack from '@functions/deleteTracking';

const serverlessConfiguration: AWS = {
  service: 'ttapi',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-iam-roles-per-function' ],
  provider: {
    name: 'aws',
    stage: "${opt:stage, 'dev'}",
    region: 'eu-central-1',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      TTRACK_TABLE: "TTRACK2-${self:provider.stage}",
      SECONDARY_INDEX: "TTRACK-Indx-User-${self:provider.stage}"
    },
    tracing: {
      lambda: true,
      apiGateway: true
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { 
    hello, 
    getAllTrackings, 
    authorizeRequest, 
    createTimetrack, 
    updateTimetrack, 
    deleteTimetrack },
  resources: {
    Resources: {
      
      TimeTrackDynamoTab: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: "userId",
              AttributeType: "S"
            },
            {
              AttributeName: "trackingId",
              AttributeType: "S"
            }
          ],
          KeySchema: [
            {
              AttributeName: "userId", KeyType: "HASH"
            },
            {
              AttributeName: "trackingId", KeyType: "RANGE"
            }
          ],
          LocalSecondaryIndexes: [
            {
              IndexName: "${self:provider.environment.SECONDARY_INDEX}",
              KeySchema: [
                {
                  AttributeName: "userId", KeyType: "HASH"
                },
                {
                  AttributeName: "trackingId", KeyType: "RANGE"
                }
              ],
              Projection: {
                ProjectionType: "ALL"
              }
            }
          ],
          BillingMode: "PAY_PER_REQUEST",
          TableName: "${self:provider.environment.TTRACK_TABLE}"
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
