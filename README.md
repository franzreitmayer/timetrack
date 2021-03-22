# timetrack
Timetrack is a simple web application to track working time. The backend services are based on aws. The application logic is implemented in typescript via lambda functions. For persistence aws dynamodb is used. Application observability is handled by logging facilities and AWS X-Ray.
The application client is written in java script with openUI5 (https://openui5.org/). This static client is hosted via AWS S3 as static files.
For building at the backend side the serverless framework is used (https://www.serverless.com/) with an aws-nodejs typescript template, hence the serverless configuration is written in typescript, which allows to split is up and the lambda method configurations are done in index.ts files at /backend/src/functions/* directories along with the according functions. The aws resource configurations are indepent from stage and aws region via environment variables.
For the client the build tool used is ui5 tooling (https://sap.github.io/ui5-tooling/). The client configuration is at /client/uimodule/ui5.yaml.
To deploy the backend components you need to run 'sls deploy' at /backend/. To test the client you need to run 'npm install' at /client , run 'npm install -g @ui5/cli' and then 'ui5 --config ./uimodule/ui5.yaml serve -o index.html'

## Folder structure
```
+---backend                             <-- all backend related stuff
|   \---src                             <-- source files
|       +---authorization               <-- everything related to authorization apart from aws lambda specific implementation
|       +---businessLogic               <-- the business logic
|       +---businessModel
|       +---dataAccess
|       +---functions
|       |   +---authorization
|       |   |   \---authorizeRequest
|       |   +---hello
|       |   \---http
|       |       +---createTracking
|       |       +---deleteTracking
|       |       +---getAllTrackings
|       |       +---optionsTracking
|       |       \---updateTracking
|       +---libs
|       \---util
+---client
|   \---uimodule
|       \---webapp
|           +---controller
|           +---css
|           +---i18n
|           +---model
|           +---resources
|           |   \---img
|           +---script
|           \---view
\---postman
```