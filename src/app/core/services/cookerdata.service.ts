import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CookerdataService {
  API_URL = environment.baseUrl;
  baseURL = this.API_URL + "potholeuser/";

  constructor(private _httpClient: HttpClient) { }

  private handleError(errorResponce: HttpErrorResponse) {
    if (errorResponce.error instanceof ErrorEvent) {
      console.log("Client side Error ", errorResponce.error.message)
    }
    else {
      console.log("Server side Error ", errorResponce)
    }
    return throwError("something went wrong");
  }

  getCookerData():Observable<any> {
    debugger;
    return this._httpClient.get<any>(this.API_URL + "cooker")
    .pipe(catchError(this.handleError));
  }
}
