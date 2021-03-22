# timetrack
Timetrack is a simple web application to track working time. The backend services are based on aws. The application logic is implemented in typescript via lambda functions. For persistence aws dynamodb is used. Application observability is handled by logging facilities and AWS X-Ray.
The application client is written in java script with openUI5 (https://openui5.org/)

```
+---backend
|   \---src
|       +---authorization
|       +---businessLogic
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