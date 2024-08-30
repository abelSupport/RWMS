import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError ,BehaviorSubject} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GeoLocationModel,IGeoLocationResponse } from '../models/IGeoLocation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {

  API_URL = environment.baseUrl;
  baseURL = this.API_URL + 'geo/';

  geocoder: google.maps.Geocoder;


  constructor(private _httpClient: HttpClient) {
    this.geocoder = new google.maps.Geocoder();
  }

  getAddress(latitude: number, longitude: number): Promise<string> {
    const latlng = { lat: latitude, lng: longitude };
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(status);
        }
      });
    });
  }

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

  getVTSData(): Observable<any> {
    return this._httpClient.get<any>(this.API_URL+'vts/getplantexvtslayer')
      .pipe(catchError(this.handleError));
  }

  addGeoLocation(data: GeoLocationModel): Observable<IGeoLocationResponse> {
    return this._httpClient
      .post<IGeoLocationResponse>(this.baseURL+'save', JSON.stringify(data), this.options)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 204 && error.error.message === 'jwt expired') {
            // Handle JWT token expiration here, for example, you might want to redirect to the login page
            console.log('JWT token expired');
            // Perform actions such as showing a notification or redirecting to the login page
          }
          return throwError(error);
        })
      );
  }


}
