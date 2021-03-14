//import * as uuid from 'uuid'

import { Timetrack } from '@models/Timetrack'
import { TimetrackAccess } from '@dataAccess/timetrackAccess'

const timetrackAccess = new TimetrackAccess()

/**
 * business logic to create 
 */
 export async function getAllTimetrackings(userId: String): Promise<Timetrack[]> {
    return timetrackAccess.getAllTimetrackings(userId)
}
