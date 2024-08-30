import { Component, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import * as moment from 'moment';
import { IMasticWorkResponse, MasticWorkModel} from 'src/app/core/models/IMasticWork';
import { wardModel } from 'src/app/core/models/IWard';
import { MasticworkService } from 'src/app/core/services/masticwork.service';
import { ModuleService } from 'src/app/core/services/module.service';
import { UnitModulesService } from 'src/app/core/services/unit-modules.service';
import { LocationService } from 'src/app/core/services/location.service';
import { PandmattributeService } from 'src/app/core/services/pandmattribute.service';
import { PandmattributegroupService } from 'src/app/core/services/pandmattributegroup.service';
import Swal from 'sweetalert2';
import {} from '@angular/common';
import { environment } from 'src/environments/environment';
import { Observable, ReplaySubject } from 'rxjs';
import { LocationModel } from 'src/app/core/models/ILocation';

import * as XLSX from 'xlsx';
type AOA = any[][];

@Component({
  selector: 'app-mastic-work-data-entry',
  templateUrl: './mastic-work-data-entry.component.html',
  styleUrls: ['./mastic-work-data-entry.component.scss'],
})
export class MasticWorkDataEntryComponent {
  form: FormGroup;
  locId: string;
  wardList: wardModel[];
  locationList: LocationModel[];
  masticRoadsList: any[];
  userRole: String = sessionStorage.getItem('UserRole');
  customStylesValidated: boolean = false;
  objMasticWork: MasticWorkModel;
  selectedFile: File = null;
  showRoadNameInput: boolean = false;
  pageTitle = 'Create bad Patch Work';
  constructor(
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private _fb: FormBuilder,
    private locationService: LocationService,
    private masticworkService: MasticworkService,
    private moduleService: ModuleService,
    private pAndmAttributeService: PandmattributeService,
    private pandmattributegroupService: PandmattributegroupService
  ) {
    this.locationService.getWards().subscribe(
      (result) => {
        if (result.status === 200) {
          this.wardList = result.data;
        }
      },
      (err) => {
        console.log(err);
      }
    );

    this.masticworkService.getMasticRoads().subscribe((result) => {
      if (result.status === 200) {
        this.masticRoadsList = result.data;
        if (
          this.userRole === 'Sub Engineer' ||
          this.userRole === 'Assistant Engineer' ||
          this.userRole === 'Mastic Work'
        ) {
          let ward = sessionStorage.getItem('UserWard');
          this.masticRoadsList = this.masticRoadsList.filter(
            (f) => f.wardName.wardName === ward
          );
        }
      }
    });

    this.locationService.getLocations().subscribe(
      (result) => {
        if (result.status === 200) {
          this.locationList = result.data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  coordinates: any;
  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          let lat = position.coords.latitude;
          let lng = position.coords.longitude;
          this.coordinates = {
            lat,
            lng,
          };
          console.log(this.coordinates);
        }
      });
    } else {
      console.log('No support for geolocation');
    }
  }

  getCurrentLocation1(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position) {
              let lat = position.coords.latitude;
              let lng = position.coords.longitude;
              const location = {
                lat,
                lng,
              };
              resolve(location);
            }
          },
          (error) => {
            reject(error.message);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  beforeImagePath: string;
  afterImagePath: string;

  ngOnInit(): void {
    this.form = this._fb.group({
      userSelectionRadio: ['two'],
      workCode: ['', Validators.required],
      wardName: ['', Validators.required],
      zoneName: ['', Validators.required],
      locationName: [''],
      location: [''],
      description: [''],
      contractorName: ['', Validators.required],
      length: ['', Validators.required],
      width: [''],
      // dataDate: ['', [this.yesterdayValidator()]],
      dataDate: ['', Validators.required],
      cookerRegistrationNo: [''],
      masticQuantity: [''],
      dbmQuantity: [''],
      wmmQuantity: [''],
      cost: [''],
      // coordinates: [''],
      remarks: [''],
    });

    this.route.paramMap.subscribe((param) => {
      let id = param.get('id');
      this.locId = id;
      if (id) {
        this.pageTitle = 'Edit Bad Patch Work';
        this.masticworkService.getLocationById(id).subscribe(
          (result) => {
            if (result != null) {
              if (result.status === 200) {
                console.log(result.data[0]);
                this.objMasticWork = result.data[0];
                console.log(
                  moment(result.data[0].dataDate).format('DD-MM-YYYY')
                );

                // this.model = {
                //   locationName: result.data[0].locationName,
                //   wardName: result.data[0].zoneName,
                //   zoneName: result.data[0].zoneName,
                // };

                this.beforeImagePath =
                  environment.imageUrl + result.data[0].beforeImagePath;
                this.afterImagePath =
                  environment.imageUrl + result.data[0].afterImagePath;

                this.form.patchValue({
                  workCode: result.data[0].workCode,
                  locationName: result.data[0].locationName,
                  zoneName: result.data[0].zoneName,
                  description: result.data[0].description,
                  contractorName: result.data[0].contractorName,
                  length: result.data[0].length,
                  width: result.data[0].width,
                  wardName: result.data[0].wardName._id,
                  coordinates: result.data[0].coordinates,
                  remarks: result.data[0].remarks,
                  dataDate: this.formatDateForInput(result.data[0].dataDate), // Format the date here if needed

                  cost: result.data[0].cost,
                  cookerRegistrationNo: result.data[0].cookerRegistrationNo,
                  masticQuantity: result.data[0].masticQuantity,
                  dbmQuantity: result.data[0].dbmQuantity,
                  wmmQuantity: result.data[0].wmmQuantity,

                  // dataDate:'2023-08-04T12:15:00'
                });
              }
            } else {
              Swal.fire({
                title: 'Seesion Expired',
                text: 'Login Again to Continue',
                icon: 'warning',
                confirmButtonText: 'Ok',
              }).then((result) => {
                if (result.value) {
                  this.logOut();
                }
              });
            }
          },
          (err) => {}
        );
      }
    });

    this.form.get('userSelectionRadio').valueChanges.subscribe((value) => {
      if (value === 'one') {
        this.showRoadNameInput = true;
        this.form.get('location').setValidators(Validators.required);
        this.form.get('locationName').clearValidators();
      } else {
        this.showRoadNameInput = false;
        this.form.get('locationName').setValidators(Validators.required);
        this.form.get('location').clearValidators();
      }
      this.form.updateValueAndValidity(); // Update form validity based on changes
    });

    this.getLocation();
  }

  formatDateForInput(date: Date): string {
    console.log('dataDate', date);

    const isoString = date.toString();
    console.log('isoString', isoString);
    console.log('Slice', isoString.slice(0, 16));
    // Convert Date object to ISO string
    return isoString.slice(0, 16); // Truncate milliseconds and timezone
  }

  logOut() {
    this.router.navigate(['/login/']);
    sessionStorage.clear();
    window.location.reload();
  }

  viewBeforeImage() {
    window.open(this.beforeImagePath, '_blank');
  }

  viewAfterImage() {
    window.open(this.afterImagePath, '_blank');
  }

  onSubmit() {
    this.customStylesValidated = true;
    if (this.form.invalid) {
      return; // Exit the function if the form is invalid
    }
    if (this.locId) {
      const current: Date = new Date();
      let modifiedOn = this.formatDate(current);
      // let objMasticWork = {
      //   _id: '0',
      //   workCode: this.form.value.workCode,
      //   locationName:
      //     this.form.value.userSelectionRadio == 'two'
      //       ? this.form.value.locationName
      //       : this.masticRoadsList.filter(
      //           (f) => f._id == this.form.value.location
      //         )[0].locationName,
      //   wardName: this.form.value.wardName,
      //   zoneName: this.form.value.zoneName,
      //   description: this.form.value.description,
      //   contractorName: this.form.value.contractorName,
      //   length: this.form.value.length,
      //   width: this.form.value.width,
      //   dataDate: this.form.value.dataDate,
      //   cost: this.form.value.cost,
      //   cookerRegistrationNo: this.form.value.cookerRegistrationNo,
      //   masticQuantity: this.form.value.masticQuantity,
      //   dbmQuantity: this.form.value.dbmQuantity,
      //   wmmQuantity: this.form.value.wmmQuantity,
      //   coordinates: this.coordinates,
      //   remarks: this.form.value.remarks,
      //   subEngineerName: sessionStorage.getItem('UserId'),
      //   beforeImage: this.beforeImageBase64,
      //   beforeImageFileName: this.beforeImageFileName,
      //   afterImage: this.afterImageBase64,
      //   afterImageFileName: this.afterImageFileName,
      //   modifiedBy: sessionStorage.getItem('FullName'),
      // };
      let objMasticWork = {
        _id: '0',
        workCode: this.form.value.workCode,
        locationName:
          this.form.value.userSelectionRadio == 'two'
            ? this.form.value.locationName
            : this.masticRoadsList.filter(
                (f) => f._id == this.form.value.location
              )[0].locationName,
        wardName: this.form.value.wardName,
        zoneName: this.form.value.zoneName,
        description: this.form.value.description,
        contractorName: this.form.value.contractorName,
        length: this.form.value.length,
        width: this.form.value.width,
        dataDate: this.form.value.dataDate,
        cost: this.form.value.cost,
        cookerRegistrationNo: this.form.value.cookerRegistrationNo,
        masticQuantity: this.form.value.masticQuantity,
        dbmQuantity: this.form.value.dbmQuantity,
        wmmQuantity: this.form.value.wmmQuantity,
        coordinates: this.coordinates,
        remarks: this.form.value.remarks,
        subEngineerName: sessionStorage.getItem('UserId'),
        beforeImage: this.beforeImageBase64,
        beforeImageFileName: this.beforeImageFileName,
        afterImage: this.afterImageBase64,
        afterImageFileName: this.afterImageFileName,
        modifiedBy: sessionStorage.getItem('FullName'),
      };
      debugger;
      this.masticworkService
        .updateLocation(this.locId, objMasticWork)
        .subscribe(
          (result) => {
            if (result != null) {
              if (result.status === 201) {
                Swal.fire({
                  text: 'Mastic Work Updated',
                  icon: 'success',
                });
                this.router.navigate(['location/masticworklist']);
              } else {
                Swal.fire({
                  text: 'Error Saving Data',
                  icon: 'error',
                });
              }
            } else {
              Swal.fire({
                title: 'Seesion Expired',
                text: 'Login Again to Continue',
                icon: 'warning',
                confirmButtonText: 'Ok',
              }).then((result) => {
                if (result.value) {
                  this.logOut();
                }
              });
            }
          },
          (err) => {}
        );
    } else {
      {
        let objMasticWork = {
          _id: '0',
          workCode: this.form.value.workCode,
          locationName:
            this.form.value.userSelectionRadio == 'two'
              ? this.form.value.locationName
              : this.masticRoadsList.filter(
                  (f) => f._id == this.form.value.location
                )[0].locationName,
          wardName: this.form.value.wardName,
          zoneName: this.form.value.zoneName,
          description: this.form.value.description,
          contractorName: this.form.value.contractorName,
          length: this.form.value.length,
          width: this.form.value.width,
          dataDate: this.form.value.dataDate,
          cost: this.form.value.cost,
          cookerRegistrationNo: this.form.value.cookerRegistrationNo,
          masticQuantity: this.form.value.masticQuantity,
          dbmQuantity: this.form.value.dbmQuantity,
          wmmQuantity: this.form.value.wmmQuantity,
          coordinates: this.coordinates,
          remarks: this.form.value.remarks,
          subEngineerName: sessionStorage.getItem('UserId'),
          beforeImage: this.beforeImageBase64,
          beforeImageFileName: this.beforeImageFileName,
          afterImage: this.afterImageBase64,
          afterImageFileName: this.afterImageFileName,
          createdBy: sessionStorage.getItem('FullName'),
          modifiedBy: sessionStorage.getItem('FullName'),
          modifiedOn:new Date()

        };
        console.log(objMasticWork);
        debugger;
        this.masticworkService
          .addMasticWork(objMasticWork)
          .subscribe((result) => {
            if (result) {
              if (result.status == 201) {
                Swal.fire({
                  text: 'Mastic Work Created',
                  icon: 'success',
                });
                this.router.navigate(['location/masticworklist']);
              } else {
                Swal.fire({
                  text: 'Mastic Work Record Not Saved',
                  icon: 'error',
                });
              }
            }
          });
      }
    }
  }

  onlocationChange(event: Event) {
    const location = this.masticRoadsList.filter(
      (m) => m._id === (event.target as HTMLInputElement).value
    );

    this.form.patchValue({
      wardName: location[0].wardName._id,
      length: location[0].length,
      width: location[0].width,
    });

    const ward = this.wardList.filter(
      (m) => m._id === location[0].wardName._id
    );

    let zoneName = ward[0].Zone;
    this.form.patchValue({
      zoneName: zoneName,
    });
  }

  onWardChange(event: Event) {
    const ward = this.wardList.filter(
      (m) => m._id === (event.target as HTMLInputElement).value
    );

    let zoneName = ward[0].Zone;
    this.form.patchValue({
      zoneName: zoneName,
    });
  }

  Back() {
    this.router.navigate(['masticwork/list']);
  }
  onReset() {
    this.customStylesValidated = false;
  }
  beforeImageBase64: String = null;
  beforeImageFileName: String = null;
  beforeUploadListener(event: any): void {
    this.selectedFile = event.target.files[0];
    this.beforeImageFileName = this.selectedFile.name;
    this.convertFile(this.selectedFile).subscribe((base64) => {
      this.beforeImageBase64 = base64;
      console.log(this.beforeImageBase64);
    });
  }

  afterImageBase64: string = null;
  afterImageFileName: string = null;

  afterUploadListener(event: any): void {
    this.selectedFile = event.target.files[0];
    this.afterImageFileName = this.selectedFile.name;
    this.convertFile(this.selectedFile).subscribe((base64) => {
      this.afterImageBase64 = base64;
      console.log(this.afterImageBase64);
    });
  }


  data: AOA = [
    [1, 2],
    [3, 4],
  ];
  upload = false;
  // uploadListener(event: any): void {
    
  //   const target: DataTransfer = <DataTransfer>event.target;
  //   if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  //   const reader: FileReader = new FileReader();

  //   reader.onload = (e: any) => {
  //     /* read workbook */
  //     const bstr: string = e.target.result;
  //     const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

  //     /* grab first sheet */
  //     const wsname: string = wb.SheetNames[0];
  //     const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  //     debugger;
  //     /* save data */
  //     this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  //     debugger;
  //     console.log('Excel Data' + this.data);
  //     if(this.data) {
  //       debugger;
  //       this.upload = true;
  //     }
  //   };
  //   reader.readAsBinaryString(target.files[0]);
  // }


  uploadListener(event: any): void {
    debugger;
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    debugger;
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      debugger;
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      debugger;
      console.log('Excel Data' + this.data);
      if (this.data) {
        this.upload = true;
      }
    };
    reader.readAsBinaryString(target.files[0]);
    //this.UploadClick();
  }



  UploadClick() {
    this.getDataRecordsArray();
  }

  dataEntryModelUpload: any;
  startDate_info: Date;
  endDate_info: Date;
  dataDate;
  modifiedOn;
  async getDataRecordsArray() {
    debugger;
    for (let i = 1; i < this.data.length; i = i + 1) {
      let j = i + 1;
      if (this.data[i].length) {
        if (this.data[i][1] != '') {
          var ward: any = this.wardList.filter(
            (w) => w.wardName === this.data[i][1]
          );
          if (this.data[i][12] === '') {
            this.dataDate = null;
          } else {
            var startutc_days = Math.floor(this.data[i][12] - 25569);
            var startutc_value = startutc_days * 86400;
            this.startDate_info = new Date(startutc_value * 1000);
            var startdate1 = new Date(
              this.startDate_info.getFullYear(),
              this.startDate_info.getMonth(),
              this.startDate_info.getDate()
            );
            this.dataDate = moment(startdate1).format('YYYY-MM-DD');
          }

          if (this.data[i][15] === '') {
            this.modifiedOn = null;
          } else {
            var endutc_days = Math.floor(this.data[i][15] - 25569);
            var endutc_value = endutc_days * 86400;
            this.endDate_info = new Date(endutc_value * 1000);
            var enddate1 = new Date(
              this.endDate_info.getFullYear(),
              this.endDate_info.getMonth(),
              this.endDate_info.getDate()
            );
            this.modifiedOn = moment(enddate1).format('YYYY-MM-DD');
          }
          debugger;
          let attr1 = {
            locationName: this.data[i][0],
            wardName: ward[0]._id,
            zoneName: ward[0].zoneName,
            workCode: this.data[i][3],
            description: this.data[i][14],
            contractorName: this.data[i][4],
            length: this.data[i][5],
            width: this.data[i][6],
            cookerRegistrationNo: this.data[i][7],
            masticQuantity: this.data[i][8],
            dbmQuantity: this.data[i][9],
            wmmQuantity: this.data[i][10],
            cost: this.data[i][11],
            dataDate: this.dataDate,
            beforeImage: null,
            beforeImageFileName: null,
            afterImage: null,
            afterImageFileName: null,
            coordinates: null,
            remarks: this.data[i][13],
            subEngineerName: sessionStorage.getItem('UserId'),
            createdBy: sessionStorage.getItem('FullName'),
          };

          this.dataEntryModelUpload = { attributeValues: [attr1] };
          debugger;
          this.addPotholeWork(this.dataEntryModelUpload.attributeValues[0]);
        }
      }
    }
  }

  objLocation: MasticWorkModel;
  addPotholeWork(objLocation) {
    this.objLocation = objLocation;
    debugger;
    this.masticworkService.addMasticWork(this.objLocation).subscribe(
      (result) => {
        debugger;
        if (result != null) {
          if (result.status === 201) {
            debugger;
            (err) => {
              // this.notificationService.warn(':: ' + err);
            };
            this.upload = false;
            Swal.fire({
              text: 'Road Created',
              icon: 'success',
            });
            this.router.navigate(['potholework/list']);
          }
          if (result.status === 202) {
          }
        } else {
          Swal.fire({
            title: 'Seesion Expired',
            text: 'Login Again to Continue',
            icon: 'warning',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.value) {
              this.logOut();
            }
          });
        }
      },
      (err) => {}
    );
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      result.next(reader.result.toString());
      result.complete();
    };
    return result;
  }
  isDataEntry = sessionStorage.getItem('isDataEntry');

  minDate(): string {
    if (this.userRole === 'Data Owner' || this.isDataEntry == 'Yes') {
      return '';
    } else {
      const today: Date = new Date();
      today.setHours(12);
      today.setMinutes(0);
      const current: Date = new Date();
      if (current > today) {
        return this.formatDate(new Date());
        // const yesterday: Date = new Date(today);
        // yesterday.setDate(today.getDate() - 1);
        // return this.formatDate(yesterday);
      } else if (current < today) {
        const yesterday: Date = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return this.formatDate(yesterday);
      }
    }
  }

  maxDate(): string {
    const today: Date = new Date();
    return this.formatDate(today);
  }

  formatDate(date: Date): string {
    const year: string = date.getFullYear().toString();
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const day: string = date.getDate().toString().padStart(2, '0');
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
