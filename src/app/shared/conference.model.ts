export interface Conference {
  title: string,
  /** Date format: 2016-12-30 */
  dateRange: {
    start: string,
    end: string
  };
  days?: {
    date: string,
    timeSlots: TimeSlot[]
  }[],
  rooms?: string[]
}

export interface TimeSlot {
  start: string,
  end: string;
}