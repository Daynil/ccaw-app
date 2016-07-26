import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateService {

  userFormat = 'MM/DD/YYYY';
  
  dbFormat = 'YYYY-MM-DD';
  timeDate = 'YYYY-MM-DD kk:mm'

  constructor() { }

  /** Format date string to the format the database uses
   * @param userDate MM/DD/YYYY
   * @returns YYYY-MM-DD
   */
  formatDateForDatabase(userDate: string): string {
    return moment(userDate, this.userFormat).format(this.userFormat);
  }

  /** Format date string to human readable
   * @param dbDate YYYY-MM-DD
   * @returns MM/DD/YYYY
   */
  formatDateForUser(dbDate: string): string {
    return moment(dbDate, this.dbFormat).format(this.userFormat);
  }

}