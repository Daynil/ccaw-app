import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateService {

  private userFormat = 'MM/DD/YYYY';
  private dbFormat = 'YYYY-MM-DD';

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