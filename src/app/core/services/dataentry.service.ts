import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IDataEntryModelResponce, IDataEntryGroupModelResponce, DataEntryModel, IDataEntryGroupsModelResponce } from '../models/IDataEntry';
import { AssetinstanceService } from './assetinstance.service';
import { LocationService } from './location.service';
import { ICumulativeReportGroupByModelResponse } from '../models/IReport';



@Injectable({
  providedIn: 'root'
})
export class DataentryService {
  API_URL = environment.baseUrl;
  // baseURL="http://swm.mcgm.gov.in/rurbanapi/userservice.svc/user";  
  baseURL = this.API_URL + "dataentry/";

  jwtToken = sessionStorage.getItem('jwttoken');
  headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.jwtToken}`);
  options = { headers: this.headers };


  constructor(private _httpClient: HttpClient, private assetInstanceService: AssetinstanceService,  private locationService: LocationService,) { }
  private content = new BehaviorSubject<any>({});
  public dataEntrySearchParams = this.content.asObservable();
  private handleError(errorResponce: HttpErrorResponse) {
    if (errorResponce.error instanceof ErrorEvent) {
      console.log("Client side Error ", errorResponce.error.message)
    }
    else {
      console.log("Server side Error ", errorResponce)
    }
    return throwError("something went wrong");
  }
  getDataEntrySearchParams(DataEntryModel) {
    this.content.next(DataEntryModel);
  }

  getDataEntries(): Observable<IDataEntryModelResponce> {
    return this._httpClient.get<IDataEntryModelResponce>(this.baseURL)
      .pipe(catchError(this.handleError));
  }

  getDataEntriesbyLocationID(locationId:any): Observable<IDataEntryModelResponce> {
    return this._httpClient.get<IDataEntryModelResponce>(this.baseURL+'dataentrybylocid/'+locationId)
      .pipe(catchError(this.handleError));
  }
  
  getDataEntryGroup(data:any): Observable<IDataEntryGroupModelResponce> {  
    return this._httpClient.post<IDataEntryGroupModelResponce>(this.baseURL + "dataentrygroup/", JSON.stringify(data), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }
  saveData(data: DataEntryModel): Observable<IDataEntryModelResponce> {
    return this._httpClient.post<IDataEntryModelResponce>(this.baseURL , JSON.stringify(data), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }

  saveConData(data: DataEntryModel): Observable<IDataEntryModelResponce> {
      return this._httpClient.post<IDataEntryModelResponce>(this.baseURL+"savecon/" , JSON.stringify(data), this.options).pipe(
        catchError((error: HttpErrorResponse) => {
          debugger;
          if (error.status === 204 && error.error.message === 'jwt expired') {
            console.log('JWT token expired');
          }
          return throwError(error);
        })
      );
  }
  
  searchExistingData(data: DataEntryModel): Observable<IDataEntryModelResponce> {
    return this._httpClient.post<IDataEntryModelResponce>(this.baseURL + "searchdata/", JSON.stringify(data), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }
  getCumulativeData(data: any): Observable<ICumulativeReportGroupByModelResponse> {
    return this._httpClient.post<ICumulativeReportGroupByModelResponse>(this.API_URL+"report/cumulative/", JSON.stringify(data), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }
  // getData(data: DataEntryModel): Observable<any> {
  //   // return this.getDataEntryGroup(String(data.module));
  //   return forkJoin([this.getDataEntryGroup({module:data.location,typeOfModuleID:"ModuleInLocation"}),
  //   this.locationService.getModulesInLocation(data.location),  
  //   this.searchExistingData(data),
  //   this.getCumulativeData(data)]);
  // }

  getData(data: any): Observable<any> {
    // return this.getDataEntryGroup(String(data.module));
    return forkJoin([this.getDataEntryGroup({module:data.location,typeOfModuleID:"ModuleInLocation"}),
    this.locationService.getModulesInLocation(data.location),  
    this.searchExistingData(data),
    this.getCumulativeData(data)]);
  }

  getDataEntryByUser(data: any): Observable<any> {
    return this._httpClient.post<IDataEntryModelResponce>(this.baseURL + "searchDataByUser/", JSON.stringify(data), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }
}
