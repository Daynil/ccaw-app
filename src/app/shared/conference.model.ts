export interface Conference {
  title: string,
  /** Date format: 2016-12-30 */
  dateRange: {
    start: string,
    end: string
  };
  timeSlots?: TimeSlot[]
}

export interface TimeSlot {
  /** Date format: 2016-12-30 */
  date: String;
  /** Time format:  */
  timeRange: {
    start: string,
    end: string
  };
  /** _id of presentation */
  presentation?: string;
}