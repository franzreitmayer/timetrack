import 'source-map-support/register';

//import * as AWS  from 'aws-sdk'
// import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { APIGatewayProxyHandler } from 'aws-lambda'
//import { formatJSONResponse } from '@libs/apiGateway';
import { getAllTimetrackings } from '@businessLogic/timetrack'
import { middyfy } from '@libs/lambda';


const getAllTrackings: APIGatewayProxyHandler = async () => {
  const items = await getAllTimetrackings("DUMMY");
  return {

    
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(JSON.stringify({
      items: items
    }))
  }
}

export const main = middyfy(getAllTrackings);