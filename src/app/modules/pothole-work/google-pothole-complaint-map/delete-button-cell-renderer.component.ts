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
      color="danger"
      variant="outline"
      cButton
      *ngIf="isDelete"
      (click)="btnClickedDeleteHandler()"
    >
      <svg cIcon name="cilTrash"></svg>
      Delete
    </button>
    <button
      class="me-1"
      color="success"
      variant="outline"
      cButton
      *ngIf="isCloseButton && isDelete"
      (click)="btnCloseHandler()"
    >
      <svg cIcon name="cilCheck"></svg>
      Close Complaint
    </button>
  `,
})
export class DeleteBtnCellRenderer implements ICellRendererAngularComp {
  private params: any;
  isCloseButton: boolean = false;
  isDelete:boolean=false;
  constructor(
    public matDialog: MatDialog,
    private router: Router,
    private locationService: LocationService,
    private masticWorkService: MasticworkService
  ) {}
  agInit(params: any): void {
    this.params = params;
    if (String(this.params?.data?.status) === 'Closed') {
      this.isCloseButton = true;
    }
    if (
      String(sessionStorage.getItem('UserName')) === 'proz1' ||
      String(sessionStorage.getItem('UserName')) === 'proz2' ||
      String(sessionStorage.getItem('UserName')) === 'proz3' ||
      String(sessionStorage.getItem('UserName')) === 'proz4' ||
      String(sessionStorage.getItem('UserName')) === 'proz5' ||
      String(sessionStorage.getItem('UserName')) === 'proz6' ||
      String(sessionStorage.getItem('UserName')) === 'proz7' 
    ) {
      this.isDelete = true;
    }

  }

  btnClickedDeleteHandler() {
    this.openNewComponent(this.params.data);
  }
  btnCloseHandler() {
    Swal.fire({
      title: '',
      text: 'Do you want to close this twitter complaint?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        this.masticWorkService
          .closeTwitterMasticWork(this.params.data._id)
          .subscribe((result) => {
            if (result)
              Swal.fire({
                text: 'Twitter Complaint is Closed !',
                icon: 'success',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['potholework/gmap']).then(() => {
                    window.location.reload();
                  });
                }
              });
          });
      }
    });
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
  refresh(): boolean {
    return false;
  }
}
