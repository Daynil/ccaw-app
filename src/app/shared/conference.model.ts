export interface Conference {
  title: string,
  /** Date format: 2016-12-30 */
  dateRange: {
    start: string,
    end: string
  };
  days?: {
    date: string,
    timeSlots: {
      start: string,
      end: string
    }[]
  }[],
  rooms?: string[]
}