import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  iamRoleStatements: [
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





