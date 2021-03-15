export interface Timetrack {
    userId: string
    trackingId: string
    trackFrom: string
    trackTo: string
    shortDescription: string
    longDescription: string
    invoiced: boolean
    attachmentUrl?: string
  }