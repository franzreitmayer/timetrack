/**
 * The timetrack business object
 * (Key: userId/trackingId)
 */
export interface Timetrack {
  // the id of the user (key)  
  userId: string

  // the tracking id (key)
  trackingId: string

  // the datetime from then on the time should be tracked
  trackFrom: string
  
  // the end datetime the time should be tracked
  trackTo: string
  
  // short description text of the tracking 
  shortDescription: string
  
  // a long description text of the tracking
  longDescription: string
  
  // flag to indicate whether the tracking is already invoiced (for future use and not implement at the moment)
  invoiced: boolean
  
  // attachment url (for future use, not implemented at the moment)
  attachmentUrl?: string
  }