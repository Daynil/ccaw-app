import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateService {

  userFormat = 'MM/DD/YYYY';
  
  dbFormat = 'YYYY-MM-DD';
  timeDate = 'YYYY-MM-DD HH:mm'

  constructor() { }

  /** Format date string to the format the database uses
   * @param userDate MM/DD/YYYY
   * @returns YYYY-MM-DD
   */
  formatDateForDatabase(userDate: string): string {
    return moment(userDate, this.userFormat, true).format(this.dbFormat);
  }

  /** Format date string to human readable
   * @param dbDate YYYY-MM-DD
   * @returns MM/DD/YYYY
   */
  formatDateForUser(dbDate: string): string {
    return moment(dbDate, this.dbFormat, true).format(this.userFormat);
  }

}