import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScadamagnifikService {

  API_URL = environment.baseUrl;

  baseURL = this.API_URL + 'scada/';
  baseURL1 = this.API_URL + 'magnific/';
  

  constructor(private _httpClient: HttpClient) { }

  private handleError(errorResponce: HttpErrorResponse) {
    if (errorResponce.error instanceof ErrorEvent) {
      console.log('Client side Error ', errorResponce.error.message);
    } else {
      console.log('Server side Error ', errorResponce);
    }
    return throwError('something went wrong');
  }

  getScadaLayer(data): Observable<any> {
    return this._httpClient.post<any>(this.API_URL+"scada/getScadaVehicleDetails?vehicle="+data.vehicle+"&from_date="+data.from_date+"&to_date=" +data.to_date, data)
      .pipe(catchError(this.handleError));
  }

  // getScadaLayer(params: any): Observable<any> {
  //   // Convert the params object to HttpParams
  //   let httpParams = new HttpParams();
  //   for (const key in params) {
  //     if (params.hasOwnProperty(key)) {
  //       httpParams = httpParams.set(key, params[key]);
  //     }
  //   }
  //   debugger;
  //   return this._httpClient.post<any>(this.baseURL + 'getScadaVehicleDetails', { params: params })
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }
  

  getMagnificLayer(data): Observable<any> {
    return this._httpClient.get<any>( this.API_URL+"magnific/getMagnificVehicleDetails?customer="+data.customer+"&vehicle="+data.vehicle+"&from_date="+data.from_date+"&to_date="+data.to_date
      , data)
      .pipe(catchError(this.handleError));
  }
  
  getScadaKingLayer(data): Observable<any> {
    return this._httpClient.post<any>( this.API_URL+ 'syncfleet/getscadakinglayer' , data)
      .pipe(catchError(this.handleError));
  }

  getAlgotrackLayer(data): Observable<any> {
    return this._httpClient.post<any>( this.API_URL+ 'syncfleet/getalgotracklayer' , data)
      .pipe(catchError(this.handleError));
  }
}
