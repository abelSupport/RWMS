import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { LoginModel } from '../models/loginModel';
import { LoadingService, LoadingOverlayRef } from './loading.service';
@Injectable({
  providedIn: 'root',
})
export class DbCallingService {
  // apiURL = "https://swm.mcgm.gov.in/mumbaiairapi/service.svc";
  apiURL = environment.smsUrl
  loginModel: LoginModel;

  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) {}

  public loadingRef: LoadingOverlayRef;
  private content = new BehaviorSubject<any>({});
  public transactParams = this.content.asObservable();
  private handleError(errorResponce: HttpErrorResponse) {
    Promise.resolve(null).then(() => {
      this.loadingRef;
      {
        this.loadingRef = this.loadingService.open();
      }
    });
    if (errorResponce.error instanceof ErrorEvent) {
      if (this.loadingRef) {
        this.loadingRef.close();
      }
      console.log('Client side Error ', errorResponce.error.message);
    } else {
      if (this.loadingRef) {
        this.loadingRef.close();
      }
      console.log('Server side Error ', errorResponce);
    }
    return throwError('something went wrong');
  }
  getTransactSearchParams(DataEntryModel) {
    this.content.next(DataEntryModel);
  }

  GenerateOTP(loginModel) {   
    return this.httpClient.post<any>(this.apiURL + '/user/generateotp', loginModel, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    })
      .pipe(catchError(this.handleError));
  }

  TwitterMsg(loginModel) {   
    return this.httpClient.post<any>(this.apiURL + '/user/twittermsg', loginModel, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    })
      .pipe(catchError(this.handleError));
  }


  MobileLogin(loginModel) {  
    return this.httpClient.post<any>(this.apiURL + '/user/authenticate', loginModel, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    })
      .pipe(catchError(this.handleError));
  }

  loginClick(loginModel) {
    return this.httpClient.post<any>(this.apiURL + '/user/webauthenticate', loginModel, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    })
      .pipe(catchError(this.handleError));
  }

  buildTableBody(data, columns) {
    var body = [];
    var dataRow = [];
    columns.forEach((column) => {
      dataRow.push({ text: column, bold: 'true', alignment: 'center' });
    });
    body.push(dataRow);
    data.forEach((row) => {
      var dataRow = [];
      columns.forEach((column) => {
        dataRow.push(String(row[column]));
      });
      body.push(dataRow);
    });

    return body;
  }

  CheckUserZone(loginModel) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/internalreport/checkuserzone',
        loginModel,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getInternalPortalDropDownData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/report/InternalPortal_GetDropdownlistData',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getSearchReports(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/report/InternalPortal_GetSearchReports',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getTransactData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/internalreport/gettransactdata',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getHighwayProgressTables() {
    return this.httpClient
      .get<any>(this.apiURL + '/report.svc/internaldashboard/highwayprogress', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getProgressTables() {
    return this.httpClient
      .get<any>(
        this.apiURL + '/report.svc/internaldashboard/getprogresstables',
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getDailyProgressTables() {
    return this.httpClient
      .get<any>(
        this.apiURL + '/report.svc/internaldashboard/getdailyprogresstables',
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getProgressData() {
    return this.httpClient
      .get<any>(this.apiURL + '/report.svc/internaldashboard/getprogressdata', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getWBWidgetData() {
    return this.httpClient
      .get<any>(this.apiURL + '/report.svc/internaldashboard/wbwidgetdata', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(catchError(this.handleError));
  }

  getSiltQuantityData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/internalreport/getsiltquantitydata',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getMinorSiltQuantityData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/internalreport/getminornallsiltquantitydata',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  GetAllZonewiseDDLDataByUserID(data) {
    return this.httpClient
      .post<any>(
        this.apiURL +
          '/report.svc/internalreport/getallzonewiseddldatabyuserid',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }
  GetMajorZonewiseDDLDataByUserID(data) {
    return this.httpClient
      .post<any>(
        this.apiURL +
          '/report.svc/internalreport/getmajorzonewiseddldatabyuserid',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getMajorNallCumulativeProgressData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL +
          '/report.svc/internalreport/getmajornallcumulativeprogressdata',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }
  getMinorNallCumulativeProgressData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL +
          '/report.svc/internalreport/getminornallcumulativeprogressdata',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }
  getSiteImagesData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/internalreport/getsiteimagedata',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }
  getSiteVideoData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/internalreport/getvideodetails',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }
  getTripwiseSearchData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/internalreport/getTripwiseSearchData',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getBillableSearchData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/internalreport/getBillableSearchData',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getWorkcodewiseSearchData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/internalreport/getWorkcodeWiseSearchData',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getMinorNallPreMonsoonProgressData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/report/getminornallahprogressdata',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getGetLoadingTrips(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/internalreport/getloadingtrips',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }
  
  addNallaCleaningData(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/internalreport/addnallacleaningdata',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  verifyupdateStatus(data) {
    return this.httpClient
      .post<any>(
        this.apiURL + '/report.svc/internalreport/verifyupdatestatus',
        data,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }


}
