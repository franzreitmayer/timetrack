import 'source-map-support/register';

//import * as AWS  from 'aws-sdk'
// import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { APIGatewayProxyHandler } from 'aws-lambda'
// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
//import { formatJSONResponse } from '@libs/apiGateway';
import { updateTimetracking } from '@businessLogic/timetrack'
import { middyfy } from '@libs/lambda'
// import { getUserId } from '@util/userHelper'
// import { Timetrack } from '@models/Timetrack'

const updateTracking: APIGatewayProxyHandler = async (event) => {
  console.log(JSON.stringify(event))
  
  // extract payload
  console.log(`event.body = ${event.body}`);
  const trackingToBeUpdated = JSON.parse(JSON.stringify(event.body)) ;

  // set userid from bearer token
  // const userId = await getUserId(event);
  // trackingToBeUpdated.userId = userId;

  // create the new tracking utilizing the business logic layer
  const updatedTracking = await updateTimetracking(trackingToBeUpdated);

  // return the timetracking created back to client
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(updatedTracking)
  }
}

export const main = middyfy(updateTracking);