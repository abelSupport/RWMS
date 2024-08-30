import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}

  DateFormatter(date) {
    var dateAsString = date;
    if (dateAsString) {
      dateAsString = dateAsString.substring(0, 10);
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    } else {
      return `-`;
    }
  }

  FormatDateTime(dateString) {
    if (!dateString) return '-';
  
    // Extract date and time parts from the ISO string
    const datePart = dateString.substring(0, 10); // yyyy-mm-dd
    const timePart = dateString.substring(11, 16); // hh:mm
  
    // Split the date part
    const [year, month, day] = datePart.split('-');
  
    // Format and return the new string
    return `${day}-${month}-${year} ${timePart}`;
  }



  DateTimeFormatter(date) {
    return moment(date).format('DD-MM-YYYY HH:MM');
  }

  formatDateForInput(date: Date): string {

    if(date){
      // console.log('dataDate', date);
  
      const isoString = date.toString();
      // console.log('isoString', isoString);
      // console.log('Slice', isoString.slice(0, 16));
      // Convert Date object to ISO string
      return isoString.slice(0, 16); // Truncate milliseconds and timezone
    }else{
      return null
    }

  }
  DateFormatterNew(date) {
    var dateAsString = date;
    if (dateAsString) {
      dateAsString = dateAsString.substring(0, 10);
      var dateParts = dateAsString.split('-');
      return `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
    } else {
      return `-`;
    }
  }

  createdOnDateFormatter(params) {
    var dateAsString = params.data.createdOn;
    if (dateAsString) {
      dateAsString = dateAsString.substring(0, 10);
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    } else {
      return `-`;
    }
  }
  modifiedOnDateFormatter(params) {
    var dateAsString = params.data.modifiedOn;
    dateAsString = dateAsString.substring(0, 10);
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }
  modifiedStartDateFormatter(params) {
    var dateAsString = params.data.startDate;
    if (dateAsString) {
      dateAsString = dateAsString.substring(0, 10);
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    } else {
      return `-`;
    }
  }
  modifiedEndDateFormatter(params) {
    var dateAsString = params.data.endDate;
    if (dateAsString) {
      dateAsString = dateAsString.substring(0, 10);
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    } else {
      return `-`;
    }
  }
  isActiveValueGetter(params) {
    return params.data.isActive === 1 ? 'Yes' : 'No';
  }
  isAutomatedValueGetter(params) {
    return params.data.isAutomated === 1 ? 'Yes' : 'No';
  }
  // DATE COMPARATOR FOR SORTING
  dateComparator(date1, date2) {
    var date1Number = this._monthToNum(date1);
    var date2Number = this._monthToNum(date2);

    if (date1Number === null && date2Number === null) {
      return 0;
    }
    if (date1Number === null) {
      return -1;
    }
    if (date2Number === null) {
      return 1;
    }

    return date1Number - date2Number;
  }

  // HELPER FOR DATE COMPARISON
  _monthToNum(date) {
    if (date === undefined || date === null || date.length !== 10) {
      return null;
    }

    var yearNumber = date.substring(6, 10);
    var monthNumber = date.substring(3, 5);
    var dayNumber = date.substring(0, 2);

    var result = yearNumber * 10000 + monthNumber * 100 + dayNumber;
    // 29/08/2004 => 20040829
    return result;
  }
  SelectRequiredValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    // Remove the hard-coded value and use the input property instead
    return control.value === '-1' ? { defaultSelected: true } : null;
  }
}
