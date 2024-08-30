import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IPotholeUserResponce, PotholeUser } from '../models/IPotholeUser';

@Injectable({
  providedIn: 'root'
})
export class PotholeUserService {
  API_URL = environment.baseUrl;
  baseURL = this.API_URL + "potholeuser/"; 
  constructor(private _httpClient: HttpClient) { }

  jwtToken = sessionStorage.getItem('jwttoken');
  headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.jwtToken}`);
  options = { headers: this.headers };

  private handleError(errorResponce: HttpErrorResponse) {
    if (errorResponce.error instanceof ErrorEvent) {
      console.log("Client side Error ", errorResponce.error.message)
    }
    else {
      console.log("Server side Error ", errorResponce)
    }
    return throwError("something went wrong");
  }

  getPotholeUsers(): Observable<any> {
    return this._httpClient.get<any>(this.baseURL)
      .pipe(catchError(this.handleError));
  }

  addPotholeUser(user: any): Observable<any> {
    return this._httpClient.post<any>(this.baseURL, JSON.stringify(user), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(catchError(this.handleError));
  }

  updatePotholeUser( User: PotholeUser): Observable<any> {
    debugger;
    return this._httpClient.post<any>(this.baseURL + '/updateUser' , JSON.stringify(User), this.options).pipe(
      catchError((error: HttpErrorResponse) => {
        debugger;
        if (error.status === 204 && error.error.message === 'jwt expired') {
          console.log('JWT token expired');
        }
        return throwError(error);
      })
    );
  }

  getUserById(userid: string): Observable<any> {
    return this._httpClient.get<any>(this.baseURL + userid)
      .pipe(catchError(this.handleError));
  }

  getPotholeUserByEWard(obj: any): Observable<any> {
    return this._httpClient.post<any>(this.baseURL+'/getuserbyeward',obj)
      .pipe(catchError(this.handleError));
  }

}
