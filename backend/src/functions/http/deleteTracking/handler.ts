import 'source-map-support/register';

//import * as AWS  from 'aws-sdk'
// import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { APIGatewayProxyHandler } from 'aws-lambda'
//import { formatJSONResponse } from '@libs/apiGateway';
import { deleteTimetrack } from '@businessLogic/timetrack'
import { middyfy } from '@libs/lambda'
import { getUserId } from '@util/userHelper'


const deleteTracking: APIGatewayProxyHandler = async (event) => {
  console.log(JSON.stringify(event))
  
  // get trackId from patch
  const trackingId = event.pathParameters.trackId

  // get userid from bearer token
  const userId = await getUserId(event);

  // delete the tracking
  const wasSuccessful = await deleteTimetrack(trackingId, userId)

  // return the timetracking created back to client
  if (wasSuccessful) {
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: "Tracking deleted"
  }
} else {
  return {
    statusCode: 400,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: "Tracking could not be deleted"
  }

}
}

export const main = middyfy(deleteTracking);