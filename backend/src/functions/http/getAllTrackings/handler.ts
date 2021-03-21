import 'source-map-support/register';

//import * as AWS  from 'aws-sdk'
// import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { APIGatewayProxyHandler } from 'aws-lambda'
//import { formatJSONResponse } from '@libs/apiGateway';
import { getAllTimetrackings } from '@businessLogic/timetrack'
import { middyfy } from '@libs/lambda'
import { getUserId } from '@util/userHelper'


const getAllTrackings: APIGatewayProxyHandler = async (event) => {
  console.log(JSON.stringify(event))
  const userId = getUserId(event)
  console.log(userId)
  const items = await getAllTimetrackings(userId);
  return {

    
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: items
    })
  }
}

export const main = middyfy(getAllTrackings);