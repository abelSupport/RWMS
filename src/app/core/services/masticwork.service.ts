import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IMasticWorkResponse,IMasticRoadResponse, MasticWorkModel } from '../models/IMasticWork';
import { environment } from 'src/environments/environment';

import { IwardResponce } from '../models/IWard';
import { MasticRoadModel } from '../models/IMasticRoadModel';

@Injectable({
  providedIn: 'root',
})
export class MasticworkService {
  API_URL = environment.baseUrl;
  baseURL = this.API_URL + 'masticwork/';
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

  jwtToken = sessionStorage.getItem('jwttoken');
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${this.jwtToken}`);
  options = { headers: this.headers };
  getMasticWork(): Observable<IMasticWorkResponse> {
    return this._httpClient
      .get<IMasticWorkResponse>(this.baseURL + 'getmasticwork')
      .pipe(catchError(this.handleError));
  }

  getPotholeWork(): Observable<any> {
    return this._httpClient
      .get<any>(this.API_URL + 'location/potholework')
      .pipe(catchError(this.handleError));
  }

  getTwitterWork(): Observable<any> {
    return this._httpClient
      .get<any>(this.API_URL + 'location/twitterwork')
      .pipe(catchError(this.handleError));
  }

  getMasticMasterData(): Observable<any> {
    return this._httpClient
    .get<any>('https://roads.mcgm.gov.in:3000/api/masticwork/getmasticmasterdata')
    .pipe(catchError(this.handleError));
  }  

  getCookerMasterData(): Observable<any> {
    return this._httpClient
    .get<any>('https://roads.mcgm.gov.in:3000/api/masticwork/getcookermasterdata') ///1. make api service fot cookermaster
    .pipe(catchError(this.handleError));
  }
  
  getMasticRoads(): Observable<IMasticRoadResponse> {
    return this._httpClient
      .get<IMasticRoadResponse>(this.baseURL + 'getmasticroad')
      .pipe(catchError(this.handleError));
  }

  addMasticLocation(data: MasticRoadModel): Observable<any> {
    return this._httpClient.post<any>(this.baseURL + 'savemasticroad', JSON.stringify(data), this.options).pipe(
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

  getMasticWorkById(roleid: string): Observable<IMasticWorkResponse> {
    console.log(roleid);
    return this._httpClient
      .get<IMasticWorkResponse>(this.baseURL + roleid)
      .pipe(catchError(this.handleError));
  }

  addMasticWork(obj: any): Observable<IMasticWorkResponse> {
    return this._httpClient
      .post<IMasticWorkResponse>(
        this.API_URL+'location/' + 'savemasticwork',
        JSON.stringify(obj),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  updateLengthWidthMasticWork(id:any,obj: any): Observable<IMasticWorkResponse> {
    return this._httpClient
      .post<IMasticWorkResponse>(
        this.API_URL+'location/' + 'updatelengthwidth/'+id,
        JSON.stringify(obj),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  updateLengthWidthPotholeWork(id:any,obj: any): Observable<IMasticWorkResponse> {
    return this._httpClient
      .post<IMasticWorkResponse>(
        this.API_URL+'location/' + 'updatelengthwidthpothole/'+id,
        JSON.stringify(obj),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }


  getMasticWorkByUser(obj: any): Observable<IMasticWorkResponse> {
    return this._httpClient
      .post<IMasticWorkResponse>(
        this.baseURL + 'getmasticworkbyuser',
        JSON.stringify(obj),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  getLocationById(locationid: any): Observable<IMasticWorkResponse> {
    return this._httpClient
      .get<IMasticWorkResponse>(this.baseURL + locationid)
      .pipe(catchError(this.handleError));
  }

  updateLocation(
    locationid: any,
    data: any
  ): Observable<IMasticWorkResponse> {
    return this._httpClient
      .patch<IMasticWorkResponse>(
        this.API_URL + 'location/masticwork/'+ locationid,
        JSON.stringify(data),
        this.options
      )
      .pipe(
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

  updateAfterImageMasticWork(locationid: any,
    data: any): Observable<IMasticWorkResponse> {
    return this._httpClient
      .post<IMasticWorkResponse>(
        this.API_URL + 'location/masticworkafterimage/'+ locationid,
        JSON.stringify(data),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  deleteMasticWork(locationid: any,
    data: any): Observable<IMasticWorkResponse> {
    return this._httpClient
      .post<IMasticWorkResponse>(
        this.API_URL + 'location/deletemasticwork/'+ locationid,
        JSON.stringify(data),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  closeTwitterMasticWork(locationid: any): Observable<IMasticWorkResponse> {
    return this._httpClient
      .post<IMasticWorkResponse>(
        this.API_URL + 'location/closetwittermasticwork/'+ locationid,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  updateImages(obj: any): Observable<any> {
    debugger;
    return this._httpClient.post<any>(this.baseURL + 'updateimages',  JSON.stringify(obj),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }
}
