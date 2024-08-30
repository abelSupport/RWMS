import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TwitterComplaintService {
  API_URL = environment.baseUrl;
  baseURL = this.API_URL + 'twitter/';
  constructor(private _httpClient: HttpClient) {}
  private handleError(errorResponce: HttpErrorResponse) {
    if (errorResponce.error instanceof ErrorEvent) {
      return throwError('Client side Error ' + errorResponce.message);
    } else {
      return throwError('Server side Error :' + errorResponce.message);
    }
    return throwError('something went wrong');
  }

  getTwitterComplaints(): Observable<any> {
    return this._httpClient
      .get<any>(this.baseURL)
      .pipe(catchError(this.handleError));
  }

  saveTwitterComplaints(obj:any): Observable<any> {
    return this._httpClient
      .post<any>(this.baseURL,obj)
      .pipe(catchError(this.handleError));
  }
}
