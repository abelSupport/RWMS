import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  IGroupLocationResponse,
  ILocationResponse,
  LocationModel,
} from '../models/ILocation';
import { environment } from 'src/environments/environment';
import {
  IModulesInLocationResponse,
  ModulesInLocationObjectModel,
  ModulesInLocationObjectModelList,
} from '../models/IModules-In-Location';
import { IwardResponce } from '../models/IWard';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  API_URL = environment.baseUrl;
  baseURL = this.API_URL + 'location/';
  //baseURL="http://swm.mcgm.gov.in/rurbanapi/locationservice.svc";
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

  getDataEntrySearchParams(obj) {
    this.content.next(obj);
  }

  // call(callUrl: string, formData: any): Observable<any> {
  //   return this._httpClient.post(callUrl, formData);
  // }

  call(callUrl: string, formData: any): Observable<any> {
    return this._httpClient.post<any>('https://testpay.easebuzz.in/payment/initiateLink', this.convertToFormData(formData), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
      .pipe(catchError(this.handleError));
  }

  convertToFormData(data: any): string {
    let formData = '';
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]) + '&';
      }
    }
    return formData.slice(0, -1); // Remove the trailing '&'
  }

  //Get All getAllModulInLocation added jwt
  getAllModulInLocation(): Observable<IModulesInLocationResponse> {
    // return this._httpClient.get<IModulesInLocationResponse>(this.baseURL + 'getlocationmodule')
    //   .pipe(catchError(this.handleError));

    return this._httpClient
      .get<IModulesInLocationResponse>(
        this.baseURL + 'getlocationmodule',
        this.options
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 204 && error.error.message === 'jwt expired') {
            console.log('JWT token expired');
          }
          return throwError(error);
        })
      );
  }

  getAllModulInLocationForDashboard(): Observable<IModulesInLocationResponse> {
    // return this._httpClient.get<IModulesInLocationResponse>(this.baseURL + 'getlocationmodule')
    //   .pipe(catchError(this.handleError));

    return this._httpClient
      .get<IModulesInLocationResponse>(
        this.baseURL + 'getallmodulesinlocation',
        this.options
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 204 && error.error.message === 'jwt expired') {
            console.log('JWT token expired');
          }
          return throwError(error);
        })
      );
  }
  //Get All Locations
  getUrls(): Observable<ILocationResponse> {
    return this._httpClient
      .get<ILocationResponse>(this.baseURL)
      .pipe(catchError(this.handleError));
  }

  //Get All Locations added jwt
  getLocations(): Observable<ILocationResponse> {
    // return this._httpClient.get<ILocationResponse>(this.baseURL)
    //   .pipe(catchError(this.handleError));

    return this._httpClient
      .get<ILocationResponse>(this.baseURL, this.options)
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

  getWards(): Observable<IwardResponce> {
    return this._httpClient
      .get<IwardResponce>(this.API_URL + 'ward/')
      .pipe(catchError(this.handleError));
  }

  //Get Location by location id  added jwt
  getLocationById(locationid: any): Observable<ILocationResponse> {
    return this._httpClient
      .get<ILocationResponse>(this.baseURL + locationid, this.options)
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

  //Add Location aaded jwt
  addLocation(data: LocationModel): Observable<ILocationResponse> {
    return this._httpClient
      .post<ILocationResponse>(this.baseURL, JSON.stringify(data), this.options)
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

  //Update Location added jwt
  updateLocation(
    locationid: any,
    data: LocationModel
  ): Observable<ILocationResponse> {
    return this._httpClient
      .patch<ILocationResponse>(
        this.baseURL + locationid,
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

  //Get Location by location id   added jwt
  getModulesInLocation(
    locationid: any
  ): Observable<IModulesInLocationResponse> {
    return this._httpClient
      .get<IModulesInLocationResponse>(
        this.baseURL + locationid + '/modules',
        this.options
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          debugger;
          if (error.status === 204 && error.error.message === 'jwt expired') {
            console.log('JWT token expired');
          }
          return throwError(error);
        })
      );
  }

  //Get Location by location id added jwt
  getModulesInLocationByID(
    moduleinlocationid: any
  ): Observable<IModulesInLocationResponse> {
    return this._httpClient
      .get<IModulesInLocationResponse>(
        this.baseURL + moduleinlocationid + '/getmoduleinlocation',
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

  // addModulesInLocation added jwt
  addModulesInLocation(
    locationid: any,
    data: any
  ): Observable<IModulesInLocationResponse> {
    return this._httpClient
      .patch<IModulesInLocationResponse>(
        this.baseURL + locationid + '/modules',
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

  addModuleDetails(
    moduleid: any,
    data: any
  ): Observable<IModulesInLocationResponse> {
    return this._httpClient
      .patch<IModulesInLocationResponse>(
        this.baseURL + moduleid + '/moduledetails',
        JSON.stringify(data),
        this.options
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          debugger;
          if (error.status === 204 && error.error.message === 'jwt expired') {
            console.log('JWT token expired');
          }
          return throwError(error);
        })
      );
  }

  //Get Location by user id  added jwt
  getLocationByUser(): Observable<ILocationResponse> {
    const uid = sessionStorage.getItem('UserId');
    console.log(uid);

    return this._httpClient
      .get<ILocationResponse>(this.baseURL + uid + '/locations', this.options)
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

  //Get Location by user id added jwt
  getGroupLocationByUser(): Observable<IGroupLocationResponse> {
    const uid = sessionStorage.getItem('userid');
    console.log(uid);

    return this._httpClient
      .get<IGroupLocationResponse>(
        this.baseURL + '/getgrouppumpingstations',
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

  saveRoadStatus(data: any): Observable<ILocationResponse> {
    return this._httpClient
      .post<ILocationResponse>(
        this.baseURL + 'saveroadstatus',
        JSON.stringify(data),
        this.options
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 204 && error.error.message === 'jwt expired') {
            console.log('JWT token expired');
          }
          return throwError(error);
        })
      );
  }

  filteredList: any = [];
  finalList: any = [];
  reportType: any = '';
  // get Ward Wise Report
  getReport(data, type) {
    this.filteredList = data;
    this.reportType = type;

    this.finalList = [];

    if (this.reportType == 'WardWise') {
      const report = {};
      // Group by wardId
      const groupedByWard = data.reduce((acc, obj) => {
        acc[obj.ward] = acc[obj.ward] || [];
        acc[obj.ward].push(obj);
        return acc;
      }, {});

      // Process each ward group
      for (const wardId in groupedByWard) {
        const wardData = groupedByWard[wardId];
        report[wardId] = {};

        // Group by module name within the ward group
        const groupedByModule = wardData.reduce((acc, obj) => {
          const moduleName = obj.taskName;
          acc[moduleName] = acc[moduleName] || [];
          acc[moduleName].push(obj);
          return acc;
        }, {});

        // Calculate totals for each module within the ward group
        for (const moduleName in groupedByModule) {
          const moduleData = groupedByModule[moduleName];

          const totalQuantity = moduleData.reduce(
            (sum, obj) => sum + obj.Quantity,
            0
          );
          const totalCumulativeQuantity = moduleData.reduce(
            (sum, obj) => sum + obj.cumulativeQuantity,
            0
          );

          const percentageProgress = ( ( totalCumulativeQuantity / totalQuantity) *100 ).toFixed(2);

          // report[wardId].wardName  = wardId,
          // report[wardId].taskName = moduleName,
          // report[wardId].totalQuantity = totalQuantity,
          // report[wardId].totalCumulativeQuantity = totalCumulativeQuantity
          // debugger;
          // let obj = Object.values(report);
          // this.finalList.push(obj);
          const moduleObj = {
            wardName: wardId,
            taskName: moduleName,
            totalQuantity: totalQuantity,
            totalCumulativeQuantity: totalCumulativeQuantity,
            percentageProgress: percentageProgress
          };
          this.finalList.push(moduleObj);
        }
      }
    }

    else if(this.reportType == 'ZoneWise'){
      debugger;
      const report = {};
      // Group by zoneId
      const groupedByZone = data.reduce((acc, obj) => {
        acc[obj.zone] = acc[obj.zone] || [];
        acc[obj.zone].push(obj);
        return acc;
      }, {});
      debugger;
      // Process each zone group
      for (const zoneId in groupedByZone) {
        const zoneData = groupedByZone[zoneId];
        report[zoneId] = {};
        debugger;
        // Group by module name within the zone group
        const groupedByModule = zoneData.reduce((acc, obj) => {
          const moduleName = obj.taskName;
          acc[moduleName] = acc[moduleName] || [];
          acc[moduleName].push(obj);
          return acc;
        }, {});
        debugger;
        // Calculate totals for each module within the zone group
        for (const moduleName in groupedByModule) {
          const moduleData = groupedByModule[moduleName];
    
          const totalQuantity = moduleData.reduce(
            (sum, obj) => sum + obj.Quantity,
            0
          );
          const totalCumulativeQuantity = moduleData.reduce(
            (sum, obj) => sum + obj.cumulativeQuantity,
            0
          );
    
          const percentageProgress = ((totalCumulativeQuantity / totalQuantity) * 100).toFixed(2);
    
          const moduleObj = {
            zoneName: zoneId,
            taskName: moduleName,
            totalQuantity: totalQuantity,
            totalCumulativeQuantity: totalCumulativeQuantity,
            percentageProgress: percentageProgress
          };
          this.finalList.push(moduleObj);
        }
      }
    }
    else {
      debugger;
      const report = {};
  // Group by contractorName
  const groupedByContractor = data.reduce((acc, obj) => {
    acc[obj.contractorName] = acc[obj.contractorName] || [];
    acc[obj.contractorName].push(obj);
    return acc;
  }, {});

  // Process each contractor group
  for (const contractorName in groupedByContractor) {
    const contractorData = groupedByContractor[contractorName];
    report[contractorName] = {};

    // Group by module name within the contractor group
    const groupedByModule = contractorData.reduce((acc, obj) => {
      const moduleName = obj.taskName;
      acc[moduleName] = acc[moduleName] || [];
      acc[moduleName].push(obj);
      return acc;
    }, {});

    // Calculate totals for each module within the contractor group
    for (const moduleName in groupedByModule) {
      const moduleData = groupedByModule[moduleName];

      const totalQuantity = moduleData.reduce(
        (sum, obj) => sum + obj.Quantity,
        0
      );
      const totalCumulativeQuantity = moduleData.reduce(
        (sum, obj) => sum + obj.cumulativeQuantity,
        0
      );

      const percentageProgress = ((totalCumulativeQuantity / totalQuantity) * 100).toFixed(2);

      const moduleObj = {
        contractorName: contractorName,
        taskName: moduleName,
        totalQuantity: totalQuantity,
        totalCumulativeQuantity: totalCumulativeQuantity,
        percentageProgress: percentageProgress
      };
      this.finalList.push(moduleObj);
    }
  }
    }

    return this.finalList;
  }

}
