// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //  baseUrl: 'https://swm.mcgm.gov.in:8081/api'
  //  Client_ID_FB = 1118445942135621,

  // baseUrl: 'http://localhost:3000/api/',
  // imageUrl: 'http://localhost:3000/',
  // smsUrl: 'http://localhost:1027/service.svc',
  
  baseUrl: 'https://roads.mcgm.gov.in:3000/api/',
  imageUrl: 'https://roads.mcgm.gov.in:3000/',
  smsUrl: 'https://roads.mcgm.gov.in/rwmssms/service.svc',
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production modze because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
