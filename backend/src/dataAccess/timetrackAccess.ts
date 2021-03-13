import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '@util/logger'
import { Timetrack } from '@models/Timetrack'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoItemAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly timetrackTable = process.env.TTRACK_TABLE,
        private readonly indexName = process.env.SECONDARY_INDEX,
        private readonly LOGGER = createLogger("TIMETRACK_ACCESS")) { }

    async getAllTimetrackItems(userId: String): Promise<Timetrack[]> {
        this.LOGGER.info('Getting all todo items')

        // const result = await this.docClient.scan(
        //     { TableName: this.todoTable }
        // ).promise()

        var result;
        try {
            result = await this.docClient.query(
                {
                    TableName: this.timetrackTable,
                    IndexName: this.indexName,
                    KeyConditionExpression: "userId = :userId",
                    ExpressionAttributeValues: {
                        ":userId": userId
                    }
                }
            ).promise()
        } catch (error) {

            this.LOGGER.error("error during query").error(JSON.stringify(error))

        }

        console.log("Got result from dynamodb: " + JSON.stringify(result))
        const items = result.Items
        return items as Timetrack[]
    }

}

/**
 * helper function to create the document client
 */
function createDynamoDBClient(): DocumentClient {
    return new XAWS.DynamoDB.DocumentClient()
}