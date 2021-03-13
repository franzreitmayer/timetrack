import 'source-map-support/register';

//import * as AWS  from 'aws-sdk'
// import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { APIGatewayProxyHandler } from 'aws-lambda'
//import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';


const getAllTrackings: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: "Test"
    })
  }
}

export const main = middyfy(getAllTrackings);