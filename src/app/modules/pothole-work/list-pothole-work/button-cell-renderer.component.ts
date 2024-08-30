import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/core/services/location.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeletePotholeWorkComponent } from '../delete-pothole-work/delete-pothole-work.component';
import { MasticworkService } from 'src/app/core/services/masticwork.service';

@Component({
  selector: 'btn-cell-renderer',
  template: `
    <button
      class="me-1"
      color="light"
      cButton
      (click)="updateLengthWidthMasticWork()"
      *ngIf="edit"
    >
      <svg cIcon name="cilNoteAdd"></svg>
      Update
    </button>
    <button
      class="me-1"
      color="danger"
      variant="outline"
      cButton
      *ngIf="isDelete"
      (click)="btnClickedDeleteHandler()"
    >
      <svg cIcon name="cilTrash"></svg>
      Delete
    </button>
  `,
})
export class BtnCellRenderer implements ICellRendererAngularComp {
  private params: any;
  edit: boolean = false;
  isDataEntry: boolean = false;
  userRole = sessionStorage.getItem('UserRole');
  dataEntry = sessionStorage.getItem('isDataEntry');
  isDelete: boolean = false;
  wardList = [];
  beforeImagePath: string;
  afterImagePath: string;
  constructor(
    public matDialog: MatDialog,
    private masticService: MasticworkService,
    private router: Router,
    private locationService: LocationService
  ) {}
  agInit(params: any): void {
    this.locationService.getWards().subscribe((result) => {
      if (result) {
        this.wardList = result.data;
      }
    });

    this.params = params;
    if (
      String(sessionStorage.getItem('UserRole')) === 'Data Owner' &&
      String(this.params.data?.source) === 'MobileApp'
    ) {
      this.isDelete = true;
    }

    if (this.dataEntry === 'Yes') {
      this.isDataEntry = true;
    }

    if ( this.userRole === 'Data Owner' || this.userRole === 'Assistant Engineer' ) {
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

  btnClickedDeleteHandler() {
    this.openNewComponent(this.params.data);
  }

  openNewComponent(feature) {
    const dialogConfig2 = new MatDialogConfig();
    dialogConfig2.disableClose = false;
    dialogConfig2.id = 'twitter';
    dialogConfig2.height = '500';
    dialogConfig2.width = '780px';
    dialogConfig2.position = {
      top: '150px',
    };

    this.locationService.getDataEntrySearchParams(feature);
    dialogConfig2.panelClass = 'rounded-dialog';
    this.matDialog.open(DeletePotholeWorkComponent, dialogConfig2);
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
    this.router.navigate(['potholework/create/' + this.params.data._id]);
  }

  updateLengthWidthMasticWork() {
    debugger;
    if (this.params.data.source != 'BulkUpload') {
      let id = this.params.data._id;
      debugger;
      let wardId = this.wardList.filter((f) => String(f.wardName) === this.params.data.wardName)[0]._id;
      let obj = {
        length: Number(this.params.data.length),
        width: Number(this.params.data.width),
        masticQuantity: Number(
          Number(this.params.data.length) * Number(this.params.data.width)
        ),
        locationName: this.params.data.locationName,
        wardName: wardId,
        zoneName: this.params.data.zoneName,
        workCode: this.params.data.workCode,
        contractorName: this.params.data.contractorName,
        remarks: this.params.data.remarks,
      };
      debugger;
      this.masticService.updateLengthWidthMasticWork(id, obj).subscribe((result) => {});
    } 
    
    else {
      let id = this.params.data._id;
      debugger;
      let wardId = this.wardList.filter((f) => String(f.wardName) === this.params.data.wardName)[0]._id;
      let obj = {
        length: Number(this.params.data.length),
        width: Number(this.params.data.width),
        masticQuantity: Number(
          Number(this.params.data.length) * Number(this.params.data.width)
        ),
        locationName: this.params.data.locationName,
        wardName: wardId,
        zoneName: this.params.data.zoneName,
        workCode: this.params.data.workCode,
        contractorName: this.params.data.contractorName,
        remarks: this.params.data.remarks,
      };
      debugger;
      this.masticService.updateLengthWidthPotholeWork(id, obj).subscribe((result) => {});
    }

    debugger;
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
