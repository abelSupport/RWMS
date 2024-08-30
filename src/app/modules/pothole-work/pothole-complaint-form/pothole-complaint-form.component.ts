import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TwitterComplaintService } from 'src/app/core/services/twitter-complaint.service';
import { Observable, ReplaySubject } from 'rxjs';
import { LocationService } from 'src/app/core/services/location.service';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { GeoLocationService } from 'src/app/core/services/geo-location.service';
import { PotholeUserService } from 'src/app/core/services/pothole-user.service';
import { MasticworkService } from 'src/app/core/services/masticwork.service';
import { DbCallingService } from 'src/app/core/services/db-calling.service';

@Component({
  selector: 'app-pothole-complaint-form',
  templateUrl: './pothole-complaint-form.component.html',
  styleUrls: ['./pothole-complaint-form.component.scss'],
})
export class PotholeComplaintFormComponent implements OnInit {
  locId: any;
  form: FormGroup;
  beforeImagePath: string;
  customStylesValidated: boolean = false;
  coordinates: any;
  praghabNo: any;
  userModel: any;
  wardList: any;
  userward: any;
  userZone: any;
  workCode: any;
  contractorName: any;
  userMobileNo: any;
  WARD: any;
  constructor(
    private dialogRef: MatDialogRef<PotholeComplaintFormComponent>,
    private router: Router,
    private dbCallingService: DbCallingService,
    private _fb: FormBuilder,
    private twitterService: TwitterComplaintService,
    private locationService: LocationService,
    private location: Location,
    private geocodingService: GeoLocationService,
    private potholeUserService: PotholeUserService,
    private masticWorkService: MasticworkService
  ) {
    this.locationService.dataEntrySearchParams.subscribe((result) => {
      this.coordinates = result.latLng;

      const latitude = this.coordinates.lat();
      const longitude = this.coordinates.lng();

      this.praghabNo = result.feature.Fg.PRABHAG_NO;
      let COUNCILLOR = result.feature.Fg.COUNCILLOR;
      let FINAL_DATE = result.feature.Fg.FINAL_DATE;
      let JR_ENGG = result.feature.Fg.JR_ENGG;
      let OBJECTID = result.feature.Fg.OBJECTID;
      let POPULATION = result.feature.Fg.POPULATION;
      let REMARK = result.feature.Fg.REMARK;
      let SHAPE_AREA = result.feature.Fg.SHAPE_AREA;
      let SHAPE_LEN = result.feature.Fg.SHAPE_LEN;
      this.WARD = result.feature.Fg.WARD;

      this.getLocationDetails(latitude, longitude);
    });

    this.potholeUserService
      .getPotholeUserByEWard({ electrolWardNo: this.praghabNo })
      .subscribe((result) => {
        if (result) {
          debugger;
          if (result.status === 200) {
            this.userModel = result.data;
            this.userward = this.userModel.wards[0][0].wardName;
            this.userMobileNo = this.userModel.mobileNo;
            this.locationService.getWards().subscribe((result) => {
              if (result?.status === 200) {
                this.wardList = result?.data;
                this.wardList = this.wardList.filter(
                  (f) => String(f.wardName) === String(this.userward)
                );
                this.userZone = this.wardList[0]?.Zone;
              }
            });

            this.masticWorkService.getMasticMasterData().subscribe((result) => {
              if (result?.status === 200) {
                let wardMasterData = result.data.filter(
                  (f) => String(f.Ward) === String(this.userward)
                );
                this.workCode = wardMasterData[0].WorkCode;
                this.contractorName = wardMasterData[0].NameOfAgency;
              }
            });
          }
        }
      });
  }

  address: string;
  getLocationDetails(latitude: number, longitude: number): void {
    this.geocodingService
      .getAddress(latitude, longitude)
      .then((address: string) => {
        this.address = address;
      })
      .catch((error) => {
        console.error('Error getting address: ', error);
      });
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      beforeImage: [''],
      tweetlink:['',Validators.required],
      remarks: ['', Validators.required],
    });
  }

  Back() {
    this.dialogRef.close();
  }

  onReset() {
    this.customStylesValidated = false;
  }

  viewBeforeImage() {
    window.open(this.beforeImagePath, '_blank');
  }

  selectedFile: File = null;
  twitterImageBase64: String = null;
  twitterImageFileName: String = null;

  twitterImageUploadListener(event: any): void {
    this.selectedFile = event.target.files[0];
    this.twitterImageFileName = this.selectedFile.name;
    this.convertFile(this.selectedFile).subscribe((base64) => {
      this.twitterImageBase64 = base64;
    });
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

  onSubmit() {
    debugger;
    this.customStylesValidated = true;
    if (this.form.invalid) {
      return; // Exit the function if the form is invalid
    }
    let obj = {
      _id: '0',
      locationName: this.address,
      wardName: this.wardList[0]?._id,
      zoneName: this.wardList[0]?.Zone,
      workCode: this.workCode,
      description: '',
      contractorName: this.contractorName,
      length: 0,
      width: 0,
      cookerRegistrationNo: '',
      masticQuantity: 0,
      dbmQuantity: 0,
      wmmQuantity: 0,
      cost: 0,
      dataDate: new Date(),
      beforeImage: null,
      afterImage: null,
      twitterImage: this.twitterImageBase64,
      twitterImageFileName: this.twitterImageFileName,
      source: 'Twitter',
      coordinates: this.coordinates,
      remarks: this.form.value.remarks,
      tweetlink: this.form.value.tweetlink,
      status: 'Open',
      subEngineerName: this.userModel._id,
      createdBy: sessionStorage.getItem('FullName'),
    };
    debugger;
    this.masticWorkService.addMasticWork(obj).subscribe((result) => {
      if (result) {
        debugger;
        if (result.status === 201) {
          Swal.fire({
            text: 'Twitter Pothole Complaint Created',
            icon: 'success',
          }).then((result) => {
            if (result.isConfirmed) {
              let obj2 = {
                MobileNo: this.userMobileNo,
              };
              this.dbCallingService.TwitterMsg(obj2).subscribe((res) => {
                if (res.servicesesponse === 1) {
                  Swal.fire({
                    text: 'Message Sent to User',
                    icon: 'success',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.dialogRef.close();
                      this.router.navigate(['potholework/gmap']).then(() => {
                        this.location.go(this.router.url);
                        window.location.reload();
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    });
  }
}
