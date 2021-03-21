import * as uuid from 'uuid'

import { Timetrack } from '@models/Timetrack'
import { TimetrackAccess } from '@dataAccess/timetrackAccess'

const timetrackAccess = new TimetrackAccess()

/**
 * business logic to create 
 */
 export async function getAllTimetrackings(userId: String): Promise<Timetrack[]> {
    return timetrackAccess.getAllTimetrackings(userId)
}

export async function createTimetracking(timetrack: Timetrack): Promise<Timetrack> {
    const newTimetrackId = uuid.v4();

    timetrack.trackingId = newTimetrackId;

    return timetrackAccess.createTimetrack(timetrack);
}

export async function updateTimetracking(timetrack: Timetrack): Promise<Timetrack> {
    return await timetrackAccess.updateTimetrack(timetrack)
}

export async function deleteTimetrack(trackingId: string, userId: string): Promise<Boolean>{
    return await timetrackAccess.deleteTimetrack(trackingId, userId);
}