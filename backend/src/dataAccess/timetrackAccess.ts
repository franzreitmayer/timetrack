import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '@util/logger'
import { Timetrack } from '@models/Timetrack'

// XRay Wrapper for AWS Dyanmo db access
const XAWS = AWSXRay.captureAWS(AWS)

/**
 * Implements the aws dynamo db data acccess for timetrack business
 * object
 */
export class TimetrackAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly timetrackTable = process.env.TTRACK_TABLE,
        private readonly indexName = process.env.SECONDARY_INDEX,
        private readonly LOGGER = createLogger("TIMETRACK_ACCESS")) { }

    /**
     * get all trackings of a certain user
     * @param userId the user id
     * @returns the trackings of the user given
     */
        async getAllTimetrackings(userId: String): Promise<Timetrack[]> {
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

    /**
     * creates the given timetrack object
     * @param timetrack the timetrack to create
     * @returns the timetrack object created
     */
    async createTimetrack(timetrack: Timetrack): Promise<Timetrack> {
        this.LOGGER.info(`Creaing new Timetrack ${JSON.stringify(timetrack)}` );
        
        try {
            await this.docClient.put({
                TableName: this.timetrackTable,
                Item: timetrack
            }).promise();
            this.LOGGER.info(`Timetrack written to db table ${this.timetrackTable}: ${JSON.stringify(timetrack)}`);
        } catch (err)  {
            this.LOGGER.error(`Writing timetrack ${JSON.stringify(timetrack)} to table ${this.timetrackTable} failed`, err);
        }
        return timetrack;
    }

    /**
     * updates the given timetrack
     * @param timetrack timetrack to be updated
     * @returns the updated object
     */
    async updateTimetrack(timetrack: Timetrack): Promise<Timetrack> {
        this.LOGGER.info(`Updating Timetrack: ${timetrack}`);
        console.log(timetrack);
        console.log(`Type of timetrack ${typeof timetrack}`);

        try {
            await this.docClient.update({
                TableName: this.timetrackTable,
                Key: {
                    userId: timetrack.userId,
                    trackingId: timetrack.trackingId
                },
                UpdateExpression: `set  trackTo=:trackTo,
                                        trackFrom=:trackFrom, 
                                        shortDescription=:shortDescription,
                                        longDescription=:longDescription,
                                        invoiced=:invoiced
                                        `,
                ExpressionAttributeValues: {
                    ":trackTo":             timetrack.trackTo,
                    ":trackFrom":           timetrack.trackFrom,
                    ":shortDescription":    timetrack.shortDescription,
                    ":longDescription":     timetrack.longDescription,
                    ":invoiced":            timetrack.invoiced
                }
            }).promise()
            this.LOGGER.info("Successfully updated timetrack", timetrack)
            return timetrack
        } catch (err) {
            this.LOGGER.error("Error updating timetrack", err, timetrack)
            return null
        }
    }

    /**
     * deletes the timetrack identified by the compound key userId/trackingid
     * @param trackingId 
     * @param userId 
     * @returns true if successful 
     */
    async deleteTimetrack(trackingId: string, userId: string): Promise<Boolean> {
        this.LOGGER.info(`deleting timetrack with id: ${trackingId} and userId: ${userId}`)

        try {
            await this.docClient.delete({
                TableName: this.timetrackTable,
                Key: {
                    "userId": userId,
                    "trackingId": trackingId
                }
            }).promise()
            this.LOGGER.info(`Successfully deleted timetrack with id ${trackingId} and user ${userId}`) 
            return true
        } catch (err) {
            this.LOGGER.error(`Error while deleting trackingId: ${trackingId} and userId: ${userId}`, err)
            return false
        }
    }
}

/**
 * helper function to create the document client
 */
function createDynamoDBClient(): DocumentClient {
    return new XAWS.DynamoDB.DocumentClient()
}