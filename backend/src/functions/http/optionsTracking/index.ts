import { handlerPath } from '@libs/handlerResolver';


export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'options', 
        path: "timetrack", 
        cors: true
        }
      
    }
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: [ 
        "dynamodb:Query", 
        "dynamodb:PutItem"],
      Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TTRACK_TABLE}"
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
