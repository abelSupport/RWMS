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
    >
      <svg cIcon name="cilNoteAdd"></svg>
      Edit
    </button>
  `,
})
export class BtnCellRenderer implements ICellRendererAngularComp {
  private params: any;
  edit: boolean = false;
  isDataEntry: boolean = false;
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

    if (this.dataEntry === 'Yes') {
      this.isDataEntry = true;
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
      createdOn.setHours(createdOn.getHours() - 5);
      createdOn.setMinutes(createdOn.getMinutes() - 30);

      if (current < today) {
        if (createdOn > yesterday && createdOn < today) {
        }
      } else if (current > today) {
        if (createdOn > today && createdOn < tommorrow) {
        }
      }
    }
  }

  formatDate(date: Date): string {
    const year: string = date.getFullYear().toString();
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const day: string = date.getDate().toString().padStart(2, '0');
    const hours: string = date.getHours().toString().padStart(2, '0');
    const minutes: string = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  btnClickedEditHandler() {
    this.router.navigate(['potholework/add/' + this.params.data._id]);
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
