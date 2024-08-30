import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { IwardResponce } from '../models/IWard';
import { PotholeWorkModel, IPotholeWorkResponse } from '../models/IPotholeWork';

@Injectable({
  providedIn: 'root',
})
export class PotholeWorkService {
  API_URL = environment.baseUrl;
  baseURL = this.API_URL + 'potholework/';
  constructor(private _httpClient: HttpClient) {}
  private content = new BehaviorSubject<any>({});
  public dataEntrySearchParams = this.content.asObservable();

  private handleError(errorResponce: HttpErrorResponse) {
    if (errorResponce.error instanceof ErrorEvent) {
      console.log('Client side Error ', errorResponce.error.message);
    } else {
      console.log('Server side Error ', errorResponce);
    }
    return throwError('something went wrong');
  }

  getPotholeWork(): Observable<IPotholeWorkResponse> {
    return this._httpClient
      .get<IPotholeWorkResponse>(this.baseURL)
      .pipe(catchError(this.handleError));
  }

  
  addPotholeWork(obj: any): Observable<IPotholeWorkResponse> {
    debugger;
    return this._httpClient.post<IPotholeWorkResponse>(this.API_URL + 'location/savemasticwork',  JSON.stringify(obj),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  
  updatePotholeWork(locationid: any, data: any): Observable<IPotholeWorkResponse> {
    debugger;
    return this._httpClient.patch<IPotholeWorkResponse>( this.baseURL + locationid, data).pipe(
        catchError((error: HttpErrorResponse) => {
          debugger;
          if (error.status === 204 && error.error.message === 'jwt expired') {
            // Handle JWT token expiration here, for example, you might want to redirect to the login page
            console.log('JWT token expired');
            // Perform actions such as showing a notification or redirecting to the login page
          }
          return throwError(error);
        })
      );
  }

  getLocationById(locationid: any): Observable<IPotholeWorkResponse> {
    return this._httpClient.get<IPotholeWorkResponse>(this.baseURL + locationid)
      .pipe(catchError(this.handleError));
  }
  
}
