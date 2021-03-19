import { handlerPath } from '@libs/handlerResolver';


export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get', 
        path: "timetrack", 
        cors: true,
        authorizer: {
          name: 'authorizeRequest'
        }
        }
      
    }
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:Scan", "dynamodb:Query"],
      Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TTRACK_TABLE}/*"
    },
    {
      Effect: "Allow",
      Action: [
        "logs:PutLogeEvent",
        "logs:CreateLogStream",
        "logs:CreateLogGroup"],
      Resource: "*"
    }
  ]
}
