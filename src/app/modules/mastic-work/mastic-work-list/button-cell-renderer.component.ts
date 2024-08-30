import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/core/services/location.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'btn-cell-renderer',
  template: `
     <button
      class="me-1"
      color="light"
      cButton
      (click)="btnClickedEditHandler()"
      *ngIf="edit"
    >
      <svg cIcon name="cilNoteAdd"></svg>
      Edit
    </button> 
    <button
    class="me-1"
      color="light"
      cButton
      (click)="viewBeforeImage()"
    >
    Before Image
    </button>
      <button
      class="me-1"
      color="light"
      cButton
      (click)="viewAfterImage()"
    >
    After Image
    </button>
  `,
})
export class BtnCellRenderer implements ICellRendererAngularComp {
  private params: any;
  edit: boolean = false;
  isDataEntry:boolean=false
  userRole = sessionStorage.getItem('UserRole');
  dataEntry = sessionStorage.getItem('isDataEntry');
  
  beforeImagePath: string;
  afterImagePath: string;
  constructor(
    private router: Router,
    private locationService: LocationService
  ) {}
  agInit(params: any): void {
    this.params = params;

    if(this.dataEntry==='Yes'){
      // this.isDataEntry=true
    }

    if (this.userRole === 'Data Owner') {
      this.edit = true;
    } else {
      const today: Date = new Date();
      const current: Date = new Date();

      const yesterday: Date = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const tommorrow: Date = new Date(today);
      tommorrow.setDate(today.getDate() + 1);

      today.setHours(12); // Set hours to 12 PM
      today.setMinutes(0); // Set minutes to 0

      yesterday.setHours(12); // Set hours to 12 PM
      yesterday.setMinutes(0); // Set minutes to 0

      tommorrow.setHours(12); // Set hours to 12 PM
      tommorrow.setMinutes(0); // Set minutes to 0

      var dateUTC = new Date(this.params.data.createdOn);
      var createdOn = new Date(dateUTC.getTime());
      //date shifting for IST timezone (+5 hours and 30 minutes)
      createdOn.setHours(createdOn.getHours() - 5);
      createdOn.setMinutes(createdOn.getMinutes() - 30);

      // Format the date as required by datetime-local input (YYYY-MM-DDTHH:mm)
      // console.log('cretedOn', createdOn);
      // console.log('Current', this.formatDate(current));
      // console.log('today', this.formatDate(today));
      // console.log('Yesterday', this.formatDate(yesterday));
      // console.log('tommorrow', this.formatDate(tommorrow));

      if (current < today) {
        console.log('current<today');

        if (createdOn > yesterday && createdOn < today) {
          // console.log('createdOn < today & > yesterday');
          // this.edit = true;
        }
      } else if (current > today) {
        // console.log('current>today');
        debugger;
        if (createdOn > today && createdOn < tommorrow) {
          debugger;
          // console.log('createdOn > today & < tommorrow');
          debugger;
          // this.edit = true;
        }
      }
    }
  }

  formatDate(date: Date): string {
    // Format the date as required by datetime-local input (YYYY-MM-DDTHH:mm)
    const year: string = date.getFullYear().toString();
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const day: string = date.getDate().toString().padStart(2, '0');
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  btnClickedEditHandler() {
    this.router.navigate(['masticwork/create/' + this.params.data._id]);
  }
  viewBeforeImage() {
    this.beforeImagePath =
                  environment.imageUrl + this.params.data.beforeImagePath;
    window.open(this.beforeImagePath, '_blank');
  }
  viewAfterImage() {
    this.afterImagePath =
                  environment.imageUrl + this.params.data.afterImagePath;
    window.open(this.afterImagePath, '_blank');
  }



  btnClickedSave() {
    console.log(this.params.data);

    let obj = {
      _id: this.params.data._id,
      status: this.params.data.status,
      remarks: this.params.data.remarks,
      modifiedBy: sessionStorage.getItem('FullName'),
      modifiedOn: new Date(),
    };

    Swal.fire({
      title: '',
      text: 'Do you want to update the Status Changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        this.locationService.saveRoadStatus(obj).subscribe(
          (result) => {
            if (result) {
              if (result.status === 200) {
                Swal.fire({
                  text: result.message.toString(),
                  icon: 'success',
                }).then(() => {
                  window.location.reload();
                });
              }
            }
          },
          (err) => {
            Swal.fire({
              text: err,
              icon: 'error',
            });
          }
        );
      }
    });
  }

  btnClickedAddModuleDetailHandler() {
    this.router.navigate(['location/addmoduledetails/' + this.params.data._id]);
  }

  btnClickedDigitizeHandler() {
    this.router.navigate(['ol/digitize/' + this.params.data._id]);
  }

  btnClickedAttachModuleHandler() {
    this.router.navigate(['location/attachmodule/' + this.params.data._id]);
  }
  refresh(): boolean {
    return false;
  }
}
