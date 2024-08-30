import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { LoginModel } from '../models/loginModel';
import { LoadingService, LoadingOverlayRef } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class CookerService {

  apiURL = environment.baseUrl;

  constructor(
    private httpClient: HttpClient,
    // private loadingService: LoadingService
  ) {}

  // public loadingRef: LoadingOverlayRef;
  private content = new BehaviorSubject<any>({});
  public transactParams = this.content.asObservable();

  private handleError(errorResponce: HttpErrorResponse) {
    Promise.resolve(null).then(() => {
      // this.loadingRef;
      // {
      //   this.loadingRef = this.loadingService.open();
      // }
    });
    if (errorResponce.error instanceof ErrorEvent) {
      // if (this.loadingRef) {
      //   this.loadingRef.close();
      // }
      console.log('Client side Error ', errorResponce.error.message);
    } else {
      // if (this.loadingRef) {
      //   this.loadingRef.close();
      // }
      console.log('Server side Error ', errorResponce);
    }
    return throwError('something went wrong');
  }

  getCookerData(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + "cooker")
      .pipe(catchError(this.handleError));
  }

  getAllCookerStatus(): Observable<any> {
    return this.httpClient.get<any>(this.apiURL + "cooker/getallcookerstatus")
      .pipe(catchError(this.handleError));
  }

}
