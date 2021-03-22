import 'source-map-support/register';

//import * as AWS  from 'aws-sdk'
// import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { APIGatewayProxyHandler } from 'aws-lambda'
//import { formatJSONResponse } from '@libs/apiGateway';
// import { createTimetracking } from '@businessLogic/timetrack'
// import { middyfy } from '@libs/lambda'
// import { getUserId } from '@util/userHelper'


const handleOptions: APIGatewayProxyHandler = async (event) => {
  console.log(`opentions handle event ${event}`)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,DELETE,PATCH'
    },
    body: ""
  }
}

export const main = handleOptions;