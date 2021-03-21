import 'source-map-support/register';

//import * as AWS  from 'aws-sdk'
// import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { APIGatewayProxyHandler } from 'aws-lambda'
//import { formatJSONResponse } from '@libs/apiGateway';
import { createTimetracking } from '@businessLogic/timetrack'
import { middyfy } from '@libs/lambda'
import { getUserId } from '@util/userHelper'


const createTracking: APIGatewayProxyHandler = async (event) => {
  console.log(JSON.stringify(event))
  
  // extract user id from request
  const newTimetracking = JSON.parse(event.body);

  // set userid from bearer token
  const userId = await getUserId(event);
  newTimetracking.userId = userId;

  // create the new tracking utilizing the business logic layer
  const createdTracking = await createTimetracking(newTimetracking);

  // return the timetracking created back to client
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(createdTracking)
  }
}

export const main = middyfy(createTracking);