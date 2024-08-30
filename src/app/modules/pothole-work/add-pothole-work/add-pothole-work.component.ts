import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationModel } from 'src/app/core/models/ILocation';
import { MasticWorkModel } from 'src/app/core/models/IMasticWork';
import { wardModel } from 'src/app/core/models/IWard';
import { LocationService } from 'src/app/core/services/location.service';
import { PotholeWorkService } from 'src/app/core/services/pothole-work.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-pothole-work',
  templateUrl: './add-pothole-work.component.html',
  styleUrls: ['./add-pothole-work.component.scss']
})
export class AddPotholeWorkComponent implements OnInit {


locId: string;
  form: FormGroup;
  customStylesValidated: boolean = false;
  masticRoadsList : any[];
  wardList: wardModel[];
  locationList: LocationModel[];
  objMasticWork: MasticWorkModel;
  showRoadNameInput: boolean = false;
  pageTitle = 'Create pothole Work';

  

  constructor(
   private router: Router,
   private route: ActivatedRoute,
   private _fb: FormBuilder,
    private locationService: LocationService,
    private pothholeworkService: PotholeWorkService

  ){
    this.locationService.getWards().subscribe(
      (result) => {
        debugger;
        if (result.status === 200) {
          this.wardList = result.data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ID :any = 0;
  ngOnInit(): void {
    debugger;
    //initailize the form
  this.form = this._fb.group({
    locationName: ['', Validators.required],
    wardName: ['',Validators.required],
    zoneName: ['', Validators.required],
    length:['',Validators.required],
    width:['',Validators.required],
    masticQuantity: [''],
    reporteddate: [''],
    attendeddate:[''],
    remarks:['']
  });

  this.route.paramMap.subscribe((param) => {
    debugger;
    let id = param.get('id');
    this.ID = id;
    this.locId = id;
    if (id) {
      this.pageTitle = 'Edit pothole Work';
      this.pothholeworkService.getLocationById(id).subscribe(
        
        (result) => {
          debugger;
          if (result != null) {
            if (result.status === 200) {
              console.log(result.data[0]);
              this.objMasticWork = result.data[0];
             

              this.form.patchValue({
                
                locationName: this.objMasticWork.locationName,
                zoneName: result.data[0].zoneName,
                
                length: result.data[0].length,
                width: result.data[0].width,
                // wardName: result.data[0].wardName._id,
          
                remarks: result.data[0].remarks,
                

                
                masticQuantity: result.data[0].masticQuantity,
               

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

    
  }

  onlocationChange(event: Event){
    debugger;
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

  onWardChange(event: Event){
    debugger;
    const ward = this.wardList.filter(
      (m) => m._id === (event.target as HTMLInputElement).value
    );

    let zoneName = ward[0].Zone;
    this.form.patchValue({
      zoneName: zoneName,
    });
  }

  onSubmit(){
    this.customStylesValidated = true;
  
  if (this.form.valid) {
    let objMasticWork = {
      locationName: this.form.value.locationName,
      wardName: this.form.value.wardName,
      zoneName: this.form.value.zoneName,
      length: this.form.value.length,
      width: this.form.value.width,
      masticQuantity: this.form.value.masticQuantity,
      remarks: this.form.value.remarks,
      dbmQuantity: null,
      wmmQuantity: null,
      cost: null,
      workCode: null,
      description: null,
      contractorName: null,
      cookerRegistrationNo: null,
      beforeImage: null,
      afterImage: null,
      coordinates: null,
      dataDate: null,
      subEngineerName: null,
      createdOn: null,
      createdBy: sessionStorage.getItem('UserName'),
      modifiedOn: null,
      modifiedBy: null
    };

    if (this.ID == 0) {
      this.pothholeworkService.addPotholeWork(objMasticWork).subscribe((result) => {
        if (result && result.status == 201) {
          debugger;
          Swal.fire({
            text: 'Pothole Work Created',
            icon: 'success',
          });
          this.router.navigate(['potholework/newlist']);
        } else {
          Swal.fire({
            text: 'Pothole Work Record Not Saved',
            icon: 'error',
          });
        }
      });
    } else {
      this.pothholeworkService.updatePotholeWork(this.ID, objMasticWork).subscribe((result) => {
        debugger;
        if (result && result.status == 201) {
          debugger;
          Swal.fire({
            text: 'Pothole Work Updated',
            icon: 'success',
          });
          this.router.navigate(['potholework/newlist']);
        } else {
          Swal.fire({
            text: 'Pothole Work Record Not Updated',
            icon: 'error',
          });
        }
      });
    }
  }
  }

  onReset(){
    this.customStylesValidated = false;
    this.form.reset();
  }

  Back(){
    this.router.navigate(['potholework/newlist'])
  }

  logOut() {
    this.router.navigate(['/login/']);
    sessionStorage.clear();
    window.location.reload();
  }
}
