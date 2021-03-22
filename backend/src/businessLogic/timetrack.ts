import * as uuid from 'uuid'

import { Timetrack } from '@models/Timetrack'
import { TimetrackAccess } from '@dataAccess/timetrackAccess'

const timetrackAccess = new TimetrackAccess()

/**
 * business to retriev timetrack items for a given user
 * @param userId the user which timetrack items should be returned
 * @returns the timetrack items of the user given
 */
export async function getAllTimetrackings(userId: String): Promise<Timetrack[]> {
    return timetrackAccess.getAllTimetrackings(userId)
}

/**
 * Business logic to create timetrack item
 * @param timetrack the timetrack business object
 * @returns the created timetrack business object
 */
export async function createTimetracking(timetrack: Timetrack): Promise<Timetrack> {
    const newTimetrackId = uuid.v4();

    timetrack.trackingId = newTimetrackId;

    return timetrackAccess.createTimetrack(timetrack);
}

/**
 * Updates the timetrack item
 * @param timetrack the timetrack business object to be updated
 * @returns the updated timetrack item
 */
export async function updateTimetracking(timetrack: Timetrack): Promise<Timetrack> {
    return await timetrackAccess.updateTimetrack(timetrack)
}

/**
 * deletes the timetrack object identified by the given compound key
 * @param trackingId the tracking id
 * @param userId the user id
 * @returns true if successful otherwise false
 */
export async function deleteTimetrack(trackingId: string, userId: string): Promise<Boolean>{
    return await timetrackAccess.deleteTimetrack(trackingId, userId);
}