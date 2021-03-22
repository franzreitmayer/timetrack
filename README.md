# timetrack

## Description od the applicationj
Timetrack is a simple web application to track working time. 

## Backend technology overview
The backend services are based on aws. The application logic is implemented in typescript via lambda functions. For persistence aws dynamodb is used. Application observability is handled by logging facilities and AWS X-Ray.

## Client technology overview
The application client is written in java script with openUI5 (https://openui5.org/). This static client is hosted via AWS S3 as static files.

## Description of backend component development environment
For building at the backend side the serverless framework is used (https://www.serverless.com/) with an aws-nodejs typescript template, hence the serverless configuration is written in typescript, which allows to split is up and the lambda method configurations are done in index.ts files at /backend/src/functions/* directories along with the according functions. The aws resource configurations are indepent from stage and aws region via environment variables.

## Description of client component development environment
For the client the build tool used is ui5 tooling (https://sap.github.io/ui5-tooling/). The client configuration is at /client/uimodule/ui5.yaml.

## Description of the backend deployment and testing process
To deploy the backend components you need to run 'sls deploy' at /backend/. To test the backend services you can use the postment collection at /postman 

## Description of the client test enviroment
To test the client you need to run 'npm install' at /client , run 'npm install -g @ui5/cli' and then 'ui5 --config ./uimodule/ui5.yaml serve -o index.html'

## Folder structure
```
+---backend                             <-- all backend related stuff
|   \---src                             <-- source files
|       +---authorization               <-- everything related to authorization apart from aws lambda specific implementation
|       +---businessLogic               <-- the business logic
|       +---businessModel               <-- business model, which is used when possible
|       +---dataAccess                  <-- implementation of data access to aws dynamodb
|       +---functions                   <-- implementation of lambda functions
|       |   +---authorization           <-- authorizer implementation
|       |   |   \---authorizeRequest
|       |   +---hello                   <-- not used at project, generate as template by sls and used for reference at moment
|       |   \---http                    <-- implementation of http services
|       |       +---createTracking      <-- create request
|       |       +---deleteTracking      <-- delete request
|       |       +---getAllTrackings     <-- retrieval request
|       |       +---optionsTracking     <-- options in order to support preflight requests
|       |       \---updateTracking      <-- update request
|       +---libs                        <-- some libraries
|       \---util                        <-- general utilities
+---client                              <-- client implementations
|   \---uimodule                        <-- the ui code
|       \---webapp                      <-- webapplication root
|           +---controller              <-- controller implementaitons
|           +---css                     <-- CSS
|           +---i18n                    <-- i18n translations, not used at the moment
|           +---model                   <-- models
|           +---resources               <-- resources
|           |   \---img
|           +---script                  <-- own and 3rd party scripts
|           \---view                    <-- view file, here ui5 xml files
\---postman                             <-- postman collections
```